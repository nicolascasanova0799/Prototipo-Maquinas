# Modelo de Datos — Plataforma de Gestión de Equipos Refrigerados

> Este documento es la fuente de verdad del modelo de datos físico. `arquitectura-de-alto-nivel.md` y `diagramas-del-sistema.md` mantienen versiones resumidas/visuales alineadas con él.
>
> **Resincronizado el 10/07/2026** con la minuta de revisión de maqueta (`obs1.md`): carga masiva exclusiva de equipos, gestores con múltiples direcciones, clientes/vendedores de solo lectura desde ERP, RUT obligatorio en ubicaciones/bodegas, aprobación configurable por roles/voto vinculante y Guía de Despacho Mandante→Gestor vía API de facturación.

## 1. Análisis del modelo actual del ERP (Isstec)

Se analizaron las tablas `maquina`, `maquina_familia`, `maquina_movimiento`, `maquina_inventario`, `estado_maquina`, `grupo_maquina` y la tabla de terceros `cliente_proveedor` en la base de datos productiva del ERP.

**Hallazgos clave:**

| # | Hallazgo | Detalle |
|---|---|---|
| 1 | **Modelo mono-actor** | `maquina` se identifica por `(empresa_rut, numero_placa)` y se asigna directamente a un `cliente_proveedor_rut`. No existe un concepto de **Mandante** (dueño) separado de **Gestor** (gestor): la empresa que opera el ERP es dueña y asigna directamente a terceros (clientes o proveedores indistintamente). Esto confirma que el modelo fue diseñado para que **un único gestor administre su propia flota**, tal como se indica en el contexto del proyecto. |
| 2 | **`estado_maquina` mezcla condición física con estado operativo** | Los únicos valores son `BUENA`, `REPARADA`, `MALA`, `INACTIVA`. Esto es una **condición física**, no un estado de ciclo de vida/ubicación (no existe "En Tránsito", "En Gestor", "En SSTT", "Pendiente de Asignar" como los que el nuevo proyecto necesita). |
| 3 | **`maquina_movimiento` mezcla evento de movimiento con datos comerciales** | La tabla incluye en la misma fila el destino (`cliente_proveedor_rut`, `direccion_codigo`) y datos de contrato/garantía (`numero_contrato`, `fecha_vigencia_contrato`, `tipo_garantia_codigo`, etc.), acoplando trazabilidad de movimiento con gestión comercial de contratos. |
| 4 | **Evidencia fotográfica en columnas fijas** | `maquina_movimiento` y `maquina_inventario` tienen columnas `imagen1`..`imagen4` fijas, en vez de una estructura normalizada que permita 0..N evidencias. |
| 5 | **Redundancia entre `maquina_movimiento` y `maquina_inventario`** | Ambas tablas repiten los mismos campos de contrato (`numero_contrato`, `fecha_vigencia_contrato`, `fecha_garantia`, etc.), es decir, se denormalizó dos veces la misma información comercial. |
| 6 | **Sin flujo de aprobación formal** | No existe una tabla de "solicitud" separada de "movimiento": todo movimiento se ejecuta directo. No hay forma de modelar la regla de negocio "el Gestor solicita, el Mandante aprueba" (RN-1/RN-6 de `reglas-de-negocio.md`). |
| 7 | **Catálogos de clasificación válidos y no redundantes** | `maquina_familia` (VITRINA, VERTICAL, BARQUILLERA, CONGELADOS, BATIDORA, EXHIBIDOR, IMPULSIVO — tipo de mueble) y `grupo_maquina` (GRANDE, MEDIANA, PEQUEÑA, BARQUILLERAS — tamaño) son dos ejes de clasificación distintos y complementarios, no se solapan. Se conservan conceptualmente. |
| 8 | **`cliente_proveedor` es una tabla de "tercero" genérica** | Une clientes y proveedores con flags booleanos (`es_cliente`, `es_proveedor`). Útil como patrón, pero en el nuevo proyecto los actores (Mandante, Gestor, Cliente Final, Servicio Técnico) tienen atributos y reglas de negocio distintas entre sí, por lo que **no conviene** replicar una tabla única de "tercero genérico". |

**Conclusión:** el modelo actual es adecuado para un gestor único que administra su propia flota y clientes, pero no representa la jerarquía Mandante → Gestor → Cliente Final, no separa condición física de estado operativo, no tiene flujo de aprobación, y denormaliza/hardcodea datos comerciales y evidencias. Sirve como referencia de **campos relevantes** (fechas, motivo, evidencia, contrato) pero no como estructura a copiar.

---

## 2. Modelo de datos propuesto

### 2.1 Principios de diseño

1. **Separar actores por rol** (Mandante, Gestor, Cliente Final, Servicio Técnico) en vez de una tabla de "tercero" genérica, porque cada uno tiene atributos y reglas propias.
2. **Un solo campo de estado por equipo (`estado`)**: a diferencia de la versión anterior de este documento, se adopta el modelo simplificado confirmado en la reunión de validación — un único catálogo `estado` cubre tanto condición física como ciclo de vida/ubicación. **Actualizado 10/07/2026**: el catálogo mantiene el código técnico `ASIGNADO_DISTRIBUIDOR` por compatibilidad, pero la etiqueta visible pasa a **"Asignado al Gestor"**. Valores vigentes: Activo, Asignado al Gestor, Asignado a Cliente, En SSTT, Pendiente de Revisión, **Rechazado** (RN-9), Baja.
3. **Propiedad única del Mandante (RN-10)**: `equipo` no tiene "dueño" variable — todo equipo pertenece siempre al Mandante único de la plataforma en esta fase (no existe `mandante_id` como FK variable por equipo; se asume mono-mandante, ver nota de extensión futura en 2.1.7).
4. **Movimiento y Solicitud unificados en una sola tabla `movimiento`**: se adopta el modelo simplificado del ERD de `diagramas-del-sistema.md`, donde un mismo registro representa tanto la solicitud como su resolución (`estado_aprobacion`), evitando la tabla `solicitud_movimiento` separada de la versión anterior. Simplifica el modelo a costa de no distinguir explícitamente "cuándo se solicitó" vs. "cuándo se ejecutó" como dos filas distintas — si el negocio necesita ese detalle más adelante, se puede volver a separar sin romper compatibilidad (agregando `movimiento_ejecutado_id` de referencia).
5. **Evidencia normalizada y extendida a Guía de Despacho**: una tabla polimórfica de adjuntos (`evidencia_adjunta`) cubre fotos/documentos de movimientos, inventario y el **PDF de la Guía de Despacho**, venga desde la API de facturación del Mandante, ERP Isstec o carga manual (RN-16).
6. **Guía de Despacho como entidad propia, no como campo de texto**: a diferencia de la versión anterior (`maquina_movimiento.guia_despacho` como texto libre), ahora es una entidad `guia_despacho` con su propio ciclo de vida, porque puede originarse desde API de facturación del Mandante, generación ERP Isstec o adjunto PDF manual, y puede referenciar más de un equipo a la vez (un despacho por lote).
7. **Ventas y matching venta↔máquina como dominio nuevo (RN-13, RN-14)**: se agregan `tipo_maquina` (catálogo, ya existía como clasificación de equipo), `venta` y `linea_venta` para registrar lo que notifica el ERP del gestor vía API, permitiendo que una misma venta tenga líneas asociadas a un equipo/tipo de máquina y líneas que no.
8. **Multi-mandante como extensión futura, no como requisito actual**: si en el futuro la plataforma debe soportar más de un Mandante (modelo SaaS), se agrega `equipo.mandante_id` y `gestor_mandante` (N:M), sin romper el resto del modelo.

### 2.2 Catálogos

```
tipo_maquina        (id, codigo, nombre, familia, grupo, marca, modelo) -- atributos importados con el equipo; no son submenús administrables en esta fase
estado              (id, codigo, nombre)               -- ACTIVO, ASIGNADO_DISTRIBUIDOR ("Asignado al Gestor" visible), ASIGNADO_CLIENTE, EN_SSTT, PENDIENTE_REVISION, RECHAZADO, BAJA
tipo_movimiento     (id, nombre, roles_aprobadores JSON, voto_vinculante BOOL) -- ASIGNACION_GESTOR, ASIGNACION_CLIENTE, ENVIO_SSTT, RETORNO_SSTT, RETORNO_MANDANTE, BAJA, CAMBIO
tipo_solicitud      (id, codigo, nombre, descripcion, tipo_movimiento_id FK NULLABLE, requiere_aprobacion BOOL, activo BOOL)  -- catálogo administrable por el Mandante de todos los tipos de solicitud que existen en la plataforma. Incluye solicitudes que requieren aprobación (baja, cambio, envío a SSTT, retorno) y solicitudes internas del gestor cuyo tipo debe estar estandarizado (inventario). tipo_movimiento_id es NULL cuando la solicitud no genera un movimiento (ej. inventario).
```

### 2.3 Actores

```
mandante        (id, nombre, rut)
gestor    (id, rut, nombre, estado[activo|inactivo], tipo_integracion_erp[isstec|sap|odoo|otro])
gestor_direccion (id, gestor_id FK, rut_dueno, direccion, comuna, tipo[bodega|sucursal|retiro], es_principal BOOL, activo BOOL)
cliente_final   (id, gestor_id FK, nombre, rut, direccion, comuna, estado[activo|inactivo])
vendedor        (id, gestor_id FK, rut, nombre, telefono, email, estado[activo|inactivo], sincronizado_desde_erp BOOL)
servicio_tecnico(id, rut, nombre, direccion, sla_dias)
usuario         (id, nombre, email, rol[mandante|gestor], gestor_id FK nullable)
```

### 2.4 Núcleo: Equipo

```
equipo (
  id, numero_serie UNIQUE, marca, modelo, grupo, familia,
  tipo_maquina_id FK,
  fecha_compra, fecha_alta, fecha_baja NULLABLE, activo BOOL,
  estado_id FK estado,                               -- estado ACTUAL (denormalizado)
  gestor_id FK NULLABLE,                        -- gestor asignado actualmente (si aplica)
  cliente_final_id FK NULLABLE,                       -- cliente final asignado actualmente (si aplica)
  coordenadas_gps NULLABLE,
  observacion
)
```

> Nota: `equipo` siempre pertenece al Mandante único de la plataforma (RN-10) — no lleva `mandante_id` variable en esta fase.

### 2.5 Movimiento / Solicitud (historial + aprobación unificados)

```
movimiento (
  id, equipo_id FK,
  tipo_movimiento_id FK,
  origen_tipo ENUM(MANDANTE, GESTOR, CLIENTE, SSTT), origen_id NULLABLE,
  destino_tipo ENUM(MANDANTE, GESTOR, CLIENTE, SSTT), destino_id NULLABLE,
  gestor_direccion_id FK NULLABLE,                   -- sucursal de destino específica del gestor (RN-23), aplica en ASIGNACION_GESTOR
  fecha_movimiento,
  gestor_solicitante_id FK NULLABLE,            -- quien origina la solicitud (si aplica: BAJA, CAMBIO, ENVIO_SSTT)
  estado_aprobacion ENUM(NO_APLICA, PENDIENTE, APROBADA, RECHAZADA), -- NO_APLICA para movimientos automáticos (asignación, recepción)
  roles_aprobadores JSON NULLABLE,                    -- snapshot de roles requeridos al momento de solicitar
  voto_vinculante BOOL DEFAULT false,                 -- si true, todos los roles requeridos deben aprobar
  usuario_resolutor_id FK NULLABLE,                   -- usuario Mandante que aprueba/rechaza
  fecha_resolucion NULLABLE, comentario_resolucion NULLABLE,
  guia_despacho_id FK NULLABLE,                       -- referencia a la guía de despacho del traslado, si aplica

  -- Datos de contrato/garantía: solo aplican y se completan cuando
  -- tipo_movimiento = ASIGNACION_GESTOR o ASIGNACION_CLIENTE
  numero_contrato NULLABLE,
  fecha_inicio_vigencia NULLABLE,
  fecha_termino_vigencia NULLABLE,
  tiene_garantia BOOL DEFAULT false,
  numero_documento_garantia NULLABLE,
  fecha_termino_garantia NULLABLE,

  motivo NULLABLE, observacion
)
```

Cada movimiento aplicado actualiza `equipo.estado_id` y `equipo.gestor_id`/`cliente_final_id`. El historial completo del equipo (pantalla de Trazabilidad) se reconstruye consultando `movimiento` por `equipo_id` ordenado por fecha. Esto materializa **RN-1** ("el Gestor no puede dar de baja unilateralmente" → `estado_aprobacion` debe quedar `APROBADA` por el Mandante antes de reflejarse en `equipo.estado_id`) y **RN-9** (rechazo de un equipo o de todos los equipos de un lote se resuelve con la misma fila de `movimiento` por equipo, sin tabla especial de "lote").

### 2.6 Guía de Despacho (RN-8, RN-16)

```
guia_despacho (
  id,
  tipo ENUM(MANDANTE_A_GESTOR, GESTOR_A_CLIENTE),
  origen_tipo ENUM(MANDANTE, GESTOR), origen_id,
  destino_tipo ENUM(GESTOR, CLIENTE), destino_id,
  fecha_emision, estado ENUM(EMITIDA, CONFIRMADA),
  origen_documento ENUM(API_MANDANTE, GENERADA_ISSTEC, ADJUNTO_MANUAL),
  numero_documento NULLABLE                            -- N° de guía si fue generada por el sistema Isstec
)

guia_despacho_equipo (guia_despacho_id FK, equipo_id FK)   -- N:M, un despacho puede cubrir varios equipos (lote)
```

El PDF final se registra como fila de `evidencia_adjunta` (§2.9) referenciando esta `guia_despacho`, tanto si viene desde la API del Mandante como si fue generado por ERP Isstec o adjuntado manualmente.

### 2.7 Ventas y matching venta↔máquina (RN-13, RN-14)

```
venta (
  id, gestor_id FK, numero_factura, fecha_venta,
  cliente_final_id FK NULLABLE, erp_origen ENUM(ISSTEC, SAP, ODOO, OTRO),
  fecha_recepcion_api                                  -- momento en que la plataforma recibió la notificación (RN-13: por evento, no por lote)
)

linea_venta (
  id, venta_id FK,
  codigo_producto, descripcion, cantidad, precio_unitario,
  proviene_de_maquina BOOL,
  tipo_maquina_id FK NULLABLE,                         -- obligatorio si proviene_de_maquina = true (RN-14)
  equipo_id FK NULLABLE                                -- opcional, solo si el ERP identifica el N° de serie exacto (ver pregunta abierta #3)
)
```

**Regla de matching (RN-14):** una `linea_venta` con `proviene_de_maquina = false` no se asocia a ningún equipo/tipo (ej. producto vendido desde una repisa aparte). Si `proviene_de_maquina = true`, debe traer `tipo_maquina_id`; `equipo_id` es opcional y da mayor precisión (rendimiento por equipo puntual) cuando el ERP puede identificarlo.

### 2.8 Inventario físico

```
inventario          (id, gestor_id FK, usuario_id FK, fecha, estado[en_curso|finalizado])
inventario_detalle  (id, inventario_id FK, equipo_id FK, estado_encontrado_id FK estado, coincide_sistema BOOL, observacion)
```

### 2.8b Ubicaciones / Bodegas

```
ubicacion_bodega (
  id,
  propietario_tipo ENUM(MANDANTE, GESTOR),
  propietario_id,
  rut_dueno,                                      -- obligatorio (RN-20)
  nombre,
  direccion,
  comuna,
  tipo ENUM(BODEGA, SUCURSAL, PUNTO_RETIRO),
  responsable,
  activo BOOL
)
```

### 2.9 Evidencia (fotos/documentos) — ahora también cubre Guía de Despacho

```
evidencia_adjunta (
  id, entidad_tipo ENUM(MOVIMIENTO, INVENTARIO_DETALLE, GUIA_DESPACHO), entidad_id,
  url, orden, fecha_carga
)
```

Reemplaza las columnas fijas `imagen1..4` del ERP actual por una tabla polimórfica de 0..N adjuntos, reutilizable por movimientos, detalles de inventario y — nuevo tras RN-16 — guías de despacho. En el tramo Mandante→Gestor, el PDF proviene de la API de facturación del Mandante; en el tramo Gestor→Cliente puede generarse vía ERP Isstec o adjuntarse manualmente cuando el Gestor no tenga generación integrada.

---

## 3. Trazabilidad de requerimientos → modelo

| Requerimiento del nuevo proyecto | Cómo se resuelve |
|---|---|
| Asignación de equipos a gestores | `movimiento` tipo `ASIGNACION_GESTOR` → `equipo.gestor_id` poblado, `equipo.estado_id = ASIGNADO_DISTRIBUIDOR` (etiqueta visible "Asignado al Gestor"; estado operativo del lote de recepción — en camino / pendiente de inspección / recibido — se deriva aparte, no es parte de `equipo.estado_id`) |
| Asignación de equipos a clientes | `movimiento` tipo `ASIGNACION_CLIENTE` → `equipo.cliente_final_id` poblado, `equipo.estado_id = ASIGNADO_CLIENTE` |
| Movimientos hacia servicio técnico | `movimiento` tipo `ENVIO_SSTT` / `RETORNO_SSTT` → `equipo.estado_id = EN_SSTT` / estado previo |
| Movimientos hacia el mandante | `movimiento` tipo `RETORNO_MANDANTE` |
| Estados e historial de movimientos | `equipo.estado_id` (estado actual) + `movimiento` (historial completo con actor, fecha y motivo) |
| Autorización de bajas/movimientos (RN-1) | `movimiento.estado_aprobacion`, resuelta por el Mandante (`usuario_resolutor_id`) antes de reflejarse en `equipo.estado_id` |
| Rechazo de equipo individual o de lote completo (RN-9) | Cada equipo rechazado genera su propia fila de `movimiento` con `equipo.estado_id = RECHAZADO`; el rechazo del lote completo es simplemente N filas idénticas, sin tabla especial de "lote" |
| Guía de Despacho, generada o adjunta (RN-8, RN-16) | Entidad `guia_despacho` con `origen_documento` (`API_MANDANTE`, `GENERADA_ISSTEC`, `ADJUNTO_MANUAL`); el PDF vive en `evidencia_adjunta` referenciando la guía |
| Aprobación configurable por roles (RN-21) | `tipo_movimiento.roles_aprobadores` + `tipo_movimiento.voto_vinculante`, copiados como snapshot en `movimiento` al crear la solicitud |
| Clientes y vendedores solo lectura (RN-19) | `cliente_final` y `vendedor` se alimentan vía API de ERP; no existe flujo de alta manual en el modelo funcional |
| RUT obligatorio de bodegas (RN-20) | `ubicacion_bodega.rut_dueno` obligatorio |
| Notificación de venta por evento y matching venta↔máquina (RN-13, RN-14) | `venta`/`linea_venta`; cada `linea_venta.proviene_de_maquina` determina si se asocia a `tipo_maquina_id` (y opcionalmente `equipo_id`) |
| Carga manual solo de equipos del Mandante, nunca clientes/vendedores ni ventas (RN-15/RN-19) | `equipo` se alimenta por carga masiva Excel/API del Mandante. `cliente_final`, `vendedor`, `venta` y `linea_venta` solo se pueblan vía API de ERP; no existe importador de archivo para esas tablas |
| Contrato de comodato y garantía (si existe) | Campos `numero_contrato`, `fecha_inicio_vigencia`, `fecha_termino_vigencia`, `tiene_garantia`, `numero_documento_garantia` en `movimiento`, poblados solo en movimientos de asignación |

---

## 4. Diferencias clave respecto al ERP original

| Aspecto | ERP original (Isstec) | Nuevo modelo |
|---|---|---|
| Actores | `cliente_proveedor` genérico | `mandante`, `gestor`, `cliente_final`, `servicio_tecnico` explícitos |
| Estado del equipo | Un solo campo (condición física) | Catálogo único `estado` de 7 valores (ciclo de vida/ubicación, incluye `RECHAZADO`; `ASIGNADO_DISTRIBUIDOR` se muestra al usuario como "Asignado al Gestor") |
| Movimiento vs. contrato | Contrato/garantía duplicados en `maquina_movimiento` **y** `maquina_inventario` | Contrato/garantía/guía de despacho viven **una sola vez**, como atributos/referencia del `movimiento` de asignación; no se replican en `inventario_detalle` |
| Evidencia fotográfica | Columnas fijas `imagen1..4` | Tabla polimórfica `evidencia_adjunta`, 0..N adjuntos — extendida para cubrir también PDFs de Guía de Despacho (RN-16) |
| Aprobación de bajas/movimientos | No existe | `movimiento.estado_aprobacion`, unificando solicitud y ejecución en una sola tabla (a diferencia de la primera versión, que las separaba en `maquina_movimiento`/`solicitud_movimiento`) |
| Guía de Despacho | Campo de texto libre dentro de `maquina_movimiento` | Entidad propia `guia_despacho`, con origen API_MANDANTE, GENERADA_ISSTEC o ADJUNTO_MANUAL (RN-16), y soporte de lote (N:M con equipos) |
| Ventas | No existe en este modelo | `venta`/`linea_venta`, alimentadas por evento vía API (RN-13), con matching a `tipo_maquina`/`equipo` por línea (RN-14) |
| Multi-mandante | No aplica (mono-empresa) | Mono-mandante en esta fase (RN-10); extensible agregando `equipo.mandante_id` si se requiere en el futuro |

---

## 5. Fuera de alcance / no incluido a propósito

- **Gestión comercial completa de contratos** (renovaciones, condiciones de pago, facturación) y **documentos tributarios (DTE)** de compra — permanecen en el ERP comercial. La plataforma sí **referencia** el N° de contrato de comodato, la garantía (si existe) y la guía de despacho de cada asignación (ver `movimiento` en §2.5), pero no administra su ciclo de vida contractual ni emite documentos tributarios.
- **Gestión comercial de ventas/facturación** (cálculo de impuestos, DTE de venta, cobranza) — la plataforma solo recibe la notificación ya facturada (`venta`/`linea_venta`) para fines de trazabilidad y reportes de rendimiento; no reemplaza al ERP como sistema de facturación.
- Relación muchos-a-muchos Mandante↔Gestor (un gestor con varios mandantes) — no está en el alcance actual (`README.md` la marca como evolución SaaS futura); se dejó una nota de extensión en el punto 2.1.8.
