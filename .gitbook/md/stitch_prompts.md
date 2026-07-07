# Prompts para Google Stitch — Maqueta Navegable

> **Cómo usar este documento junto a `DESIGN.md`:**
> - `DESIGN.md` define el sistema de diseño: colores, tipografía, componentes (Button, Card, Badge, Input, Table, Sidebar, Navbar, Modal, KPICard), layouts (MainLayout, KPIRow, TwoColumnLayout, FormLayout), estados e interacciones.
> - Este documento define **solo contenido y funcionalidad**: qué información va en cada pantalla, qué datos de ejemplo usar, qué flujo sigue el usuario.
> - Los prompts **no repiten** instrucciones de estilo (colores, Bootstrap, spacing) — eso ya vive en DESIGN.md.
>
> **Actualizado 03/07/2026 (ronda 1)** con las respuestas de la reunión de validación de negocio: se agregó la generación de Guía de Despacho, se ajustó el flujo de rechazo de lote y se renombró la pantalla de importación de clientes para reflejar que la sincronización es automática vía API.
>
> **Actualizado 03/07/2026 (ronda 2, superado por rondas 5 y 7)** con aporte directo del usuario (ver `reglas-de-negocio.md` RN-13 a RN-16): se documentó la Guía de Despacho condicional por integración. La ronda 5 eliminó las pantallas de API como vistas del prototipo, y la ronda 7 reemplazó el tramo Mandante→Gestor por emisión vía API de facturación del Mandante.
>
> **Actualizado 04/07/2026 (ronda 3)** con la reorganización de la navegación aplicada al prototipo (sesión "Refactor Gestores Page"): los sidebars de ambos roles se agrupan en secciones **Principal / Operación / Análisis / Maestros / Configuración**, las opciones de maestros no llevan el prefijo "Maestro de", y se agregaron nuevos maestros (algunos como stubs). Ver detalle y conexiones en `maestros.md`.
>
> **Actualizado 04/07/2026 (ronda 4)** con la clarificación del alcance del **proceso de Inventario**: se documentó la pantalla 2.8 "Consulta de Inventario" (solo lectura) para el Mandante — implementada en `consulta-inventario.html` — y se aclaró en 3.5 que la toma física en terreno (QR, GPS, fotos) queda para la futura app móvil (GEN-5), no para esta fase web. Ver `maestros-del-sistema.md` §3.3 y `requerimientos-de-producto.md` (MAN-7, DIS-5 a DIS-7).
>
> **Actualizado 07/07/2026 (ronda 5)** con la eliminación de los prompts 3.7 "Sincronización de Clientes vía API" y 3.8 "Notificación de Ventas vía API" (su funcionalidad se documenta como definiciones técnicas de API en `reglas-de-negocio.md` §4, no como pantallas del prototipo), y la incorporación de dos nuevos prompts para el Gestor: **3.6 Guía de Despacho** (gestión centralizada de guías, consolida los flujos 2.4 y 3.3) y **3.7 Reportes** (reemplaza y expande el anterior 3.6 "Reportes de Ventas y Rendimiento" con pestañas de análisis múltiple).
>
> **Actualizado 07/07/2026 (ronda 6)** con la alineación documentación ↔ prototipo: se corrigió §2.2 (tabla sin columna "Condición", modal sin campo "Coordenadas GPS" — el prototipo no los implementa), se agregó el prompt **2.9 Guías de Despacho** para el panel Mandante (`guias-despacho.html` ya existía en el prototipo pero no tenía prompt), se agregó el prompt **3.4b Nueva Solicitud de Movimiento** (`nueva-solicitud.html`, sub-vista de creación de §3.4), y se actualizó el sidebar para incluir "Guías de Despacho" (Mandante, Operación) y "Vendedores" (Gestor, Maestros).
>
> **Actualizado 10/07/2026 (ronda 7)** con la minuta de revisión de maqueta: marca de referencia **Carozzi**, terminología visible **Gestor**, Dashboard con cifras consistentes, Maestro de Equipos solo con **Carga masiva**, eliminación de submenús Grupo/Familia/Marcas/Modelos, Gestores con múltiples direcciones, Ubicaciones/Bodegas con RUT obligatorio, Clientes/Vendedores de Gestor como solo lectura ERP, Motivos de Movimiento con roles aprobadores y voto vinculante, buscador predictivo en Trazabilidad y GD Mandante→Gestor vía API de facturación.

## 0. Instrucción base para Google Stitch

```
Usa DESIGN.md como sistema de diseño de referencia (componentes, colores, layouts, tipografía).
Cada prompt de este documento describe el contenido y la funcionalidad de una pantalla específica; 
aplica los componentes y estilos definidos en DESIGN.md para construirla.
```

---

## 1. Pantalla — Login ✅

```
Pantalla de login de la plataforma Isstec.

Contenido:
- Logo de Isstec
- Título: "Plataforma de Gestión de Equipos Refrigerados"
- Formulario:
  * RUT (input con icono de usuario, placeholder "12.345.678-9", validación de formato RUT chileno)
  * Contraseña (input con icono de candado, botón toggle de visibilidad con icono ojo)
  * Selector de rol: dos tarjetas radio — Mandante (icono building) / Gestor (icono truck)
- Botón: "Ingresar" (ancho completo, deshabilitado si hay errores de validación)
- Footer: "© 2025 Isstec — Integración de Sistemas y Servicios Tecnológicos"

Nota: el usuario selecciona manualmente su rol (Mandante o Gestor) mediante el selector de tarjetas. El sistema redirige al dashboard correspondiente según el rol seleccionado.

Componentes: Input, Button, RoleToggle (ver DESIGN.md)
```

---

## 2. Panel del Mandante

### 2.1 Dashboard Mandante ✅

```
Dashboard principal del Mandante.

Contenido:
- KPIs (4 tarjetas con cifras consistentes): Total de Equipos (1.248) | Equipos Activos (1.118, +2.4%) | En Servicio Técnico (118, -0.5%) | Pendientes de Revisión (12)
- Distribución geográfica: mapa con pines de ubicación de equipos
- Estado de equipos: gráfica de dona — Operativos 82,9% | En SSTT 9,5% | Inactivos 7,6%
- Tabla "Solicitudes pendientes": Equipo | Gestor | Tipo | Motivo | Fecha | Acciones (Aprobar / Rechazar)

Componentes: KPICard, Map, PieChart, Table (ver DESIGN.md)
Layout: MainLayout
```

### 2.2 Maestro de Equipos ✅

```
Pantalla de gestión del maestro de equipos (propiedad exclusiva del Mandante — no existen equipos propios de gestores en esta fase).

Contenido:
- Controles: buscador por N° de serie, filtro por Estado, filtro por Gestor
- Botones: "Carga masiva" (planilla Excel/API de datos maestros). No mostrar botón "Nuevo equipo" ni modal de alta individual.
- Tabla: N° Serie | Marca | Modelo | Tipo | Estado (badge) | Gestor | Cliente / Ubicación | Última actualización | Acciones (Ver detalle | Editar)
- Acciones por fila: botón "Ver detalle" (modal de información) | botón "Editar" (modal con formulario editable)
- Modal "Carga masiva": zona de carga Excel, botón "Descargar plantilla", resumen de validación (registros válidos / con error) y confirmación de importación. La planilla incluye N° de serie, marca, modelo, grupo/familia/tipo, estado inicial y observación.
- Modal "Editar equipo": solo campos permitidos para corrección administrativa; no debe reemplazar el flujo de carga masiva ni permitir alta unitaria.
- Estados posibles (10/07/2026, ver `reglas-de-negocio.md` §0): Activo, Asignado al Gestor, Asignado a Cliente, En SSTT, Pendiente de Revisión, Rechazado, Baja
- Paginación

Componentes: Input, Table, Badge, Button, Modal (ver DESIGN.md)
Layout: MainLayout
```

### 2.3 Gestores ✅

```
Pantalla de administración de gestores.

Contenido:
- Botón: "Agregar gestor"
- Tabla: Nombre (con el Tipo de integración ERP — Isstec / SAP / Odoo / Otro — mostrado como subtítulo bajo el nombre, no como columna independiente) | RUT | Direcciones/Sucursales | Estado (Activo/Inactivo) | N° equipos asignados
- Acciones por fila: Editar | Eliminar
- Modal "Agregar gestor": Nombre, RUT, Estado, Tipo de integración ERP y sección repetible de Direcciones/Sucursales (dirección, comuna, tipo, principal/no principal)

Nota de UI (alineada al prototipo 06/07/2026): el Tipo de integración ERP se muestra como subtítulo bajo el nombre del Gestor en la tabla, no como columna propia. El modal de alta/edición sí lo mantiene como campo independiente.

Componentes: Button, Table, Badge, Modal (ver DESIGN.md)
Layout: MainLayout
```

### 2.4 Asignación de Equipos ✅

```
Pantalla de asignación de lotes de equipos a un gestor.

Contenido:
- Selector: "Gestor destino" (dropdown)
- Tabla de equipos disponibles (sin asignar): checkbox | N° Serie | Marca | Modelo | Estado
- Panel resumen: "Equipos seleccionados: X" | Gestor destino | Botón "Confirmar asignación" (deshabilitado hasta seleccionar al menos 1 equipo) | Botón "Limpiar selección"
- Al confirmar: modal "Emitir Guía de Despacho" que consume la API de facturación del Mandante. Flujo de 3 pasos: confirmación con resumen → spinner "Solicitando GD al sistema de facturación" → éxito con N° de GD y PDF adjunto automáticamente.
- Tras confirmar: los equipos pasan a estado visible "Asignado al Gestor"

Nota de negocio (RN-16): la Guía de Despacho Mandante→Gestor se emite vía API de facturación del Mandante y el PDF de respuesta queda adjunto automáticamente. Pendiente validar contrato técnico y manejo de errores de la API.

Componentes: Input, Table, Card, Button, Checkbox, FileUpload, Modal (ver DESIGN.md)
Layout: TwoColumnLayout
```

### 2.5 Autorización de Movimientos ✅

```
Pantalla de aprobación/rechazo de solicitudes de movimiento (baja, cambio, envío a SSTT) hechas por gestores.

Contenido:
- Filtro: Estado (Todos / Pendiente / Aprobada / Rechazada)
- Tabla: Equipo | Gestor | Tipo solicitud | Motivo | Fecha | Estado | Acciones (Aprobar / Rechazar / Detalles)
- Modal "Detalles" (al hacer clic): historial del equipo (timeline), evidencia adjunta (fotos/documentos)

Nota de negocio: el Gestor nunca puede aprobar sus propias solicitudes; toda aprobación/rechazo la realiza el Mandante desde esta pantalla según roles aprobadores y voto vinculante.

Componentes: Input, Table, Badge, Button, Modal (ver DESIGN.md)
Layout: MainLayout
```

### 2.6 Trazabilidad de Equipo ✅

```
Pantalla de historial de un equipo específico.

Contenido:
- Buscador predictivo: "Buscar por N° de serie, modelo, marca o tipo de máquina", con sugerencias desplegables para seleccionar el equipo.
- Card de información del equipo: N° Serie | Marca | Modelo | Estado actual | Gestor | Cliente
- Timeline vertical con historial cronológico: Fecha | Evento | Estado anterior → Estado nuevo | Actor | Comentario
  Ejemplos de eventos: "Registrado en Maestro", "Asignado a Gestor (Guía N° X)", "Recibido y aceptado", "Asignado a Cliente Final (Guía N° Y)", "Enviado a SSTT", "Baja aprobada"

Componentes: Input, Card, Timeline (ver DESIGN.md)
Layout: MainLayout
```

### 2.7 Informes (Geolocalización, Ventas, SSTT) ✅

```
Pantalla de informes con 4 pestañas.

Contenido:
- Tab "Geolocalización" (activa por defecto): filtros (Tipo de máquina, Gestor) + mapa con pines de equipos
- Tab "Piramidal de Ventas": gráfico de barras de ventas por equipo
- Tab "Rendimiento por Equipo": gráfico comparando ventas vs. equipos asignados
- Tab "Servicio Técnico": tabla de equipos en SSTT — Fecha ingreso | Proveedor | SLA | Días en reparación

Filtro común: rango de fechas

Nota de negocio (RN-14): las ventas mostradas en "Piramidal de Ventas" y "Rendimiento por Equipo" solo consideran líneas de producto marcadas como provenientes de una máquina (no la factura completa); si el ERP no identificó el N° de serie exacto, el dato se agrupa a nivel de Tipo de Máquina en vez de equipo puntual.

Componentes: Tab, Map, BarChart, Table, Input (ver DESIGN.md)
Layout: MainLayout
```

### 2.8 Consulta de Inventario (solo lectura) ✅

> Implementada en `Prototipo Maquinas/mandante/consulta-inventario.html`. Cubre MAN-7. Ver alcance completo en `maestros.md` §3.3.

```
Pantalla de consulta de inventarios físicos gestionados por los Gestores (el Mandante no crea ni ajusta inventarios, solo consulta).

Contenido:
- Filtros: Gestor, Estado (En curso / Finalizado), rango de fechas
- Tabla: Gestor | Fecha | Vendedor(es)/Comuna | Estado | N° equipos inventariados | Discrepancias detectadas
- Al expandir una fila: detalle de discrepancias — Equipo | Inventario Sistema | Inventario Físico | Diferencia

Nota de negocio (04/07/2026): esta pantalla solo muestra el resultado de los inventarios que gestiona el Gestor (DIS-5 a DIS-7). La toma física en terreno (lectura QR, GPS, evidencia fotográfica) corresponde a la app móvil de terreno, fuera de alcance de esta fase (GEN-5).

Componentes: Input, Table, Badge (ver DESIGN.md)
Layout: MainLayout
```

### 2.9 Guías de Despacho ✅

> Implementada en `Prototipo Maquinas/mandante/guias-despacho.html`. El sidebar del Mandante incluye esta opción en la sección **Operación**.

```
Pantalla de gestión centralizada de Guías de Despacho del Mandante. Consolida todas las guías del flujo: las de recepción (Mandante → Gestor, emitidas vía API de facturación del Mandante en §2.4) y las de despacho (Gestor → Cliente Final, generadas o adjuntadas por cada gestor desde §3.3a).

Contenido:
- KPIs (4 tarjetas): Total GD | Emitidas por API Mandante | Generadas por gestores | Pendientes
- Filtros: buscar (N° GD, N° asignación, cliente o gestor) | tipo (Recepción Mandante→Gestor / Despacho Gestor→Cliente) | gestor | estado (Emitida API Mandante / Generada automáticamente / PDF adjunto / Pendiente) | rango de fechas
- Tabla: N° GD | Tipo (Recepción Mandante→Gestor / Despacho Gestor→Cliente) | Gestor | Origen | Destino | Equipos (count) | Fecha | Estado (badge) | Acciones
- Acciones por fila:
  * **Ver** — modal de detalle con datos de la guía, equipos amparados (N° Serie, Marca, Modelo, Familia) y documento (PDF o enlace)
  * **Descargar PDF** — si la GD ya tiene documento adjunto o fue generada
- Paginación

Nota de negocio (RN-16): como Mandante, Carozzi emite la Guía de Despacho mediante API de facturación al asignar equipos a un gestor (§2.4). La generación automática por ERP Isstec solo aplica a gestores con sistema Isstec para los despachos a cliente final. Esta pantalla consolida ambas vías en un solo listado de visibilidad para el Mandante.

Nota de navegación (10/07/2026): el sidebar "Guías de Despacho" dirige a esta vista de listado (`guias-despacho.html`). Es un acceso directo al consolidado de todas las guías del flujo, tanto de recepción (Mandante→Gestor) como de despacho (Gestor→Cliente). El Gestor tiene su propia pantalla equivalente en §3.6.

Componentes: KPICard, Card, Table, Badge, Button, Modal, Pagination (ver DESIGN.md)
Layout: MainLayout
```

---

## 3. Panel del Gestor

### 3.1 Dashboard Gestor ✅

```
Dashboard principal del Gestor.

Contenido:
- KPIs (4 tarjetas): Pendientes de inspección (50, naranja) | Asignados a clientes (386) | Pendientes de asignar (23, naranja) | Solicitudes en curso (7)
- Notificaciones recientes (5 items con icono y badge de estado):
  * "Nuevo lote recibido de Carozzi — 50 máquinas" (badge: Nuevo)
  * "Equipo FR-1023 rechazado por cliente" (badge: Alerta)
  * "Inventario finalizado con discrepancias" (badge: Revisión)
  * "Solicitud de movimiento aprobada — CZ-0845" (badge: Aprobada)
  * "Sincronización ERP completada — 124 clientes" (badge: Sincronizado)
- Gráfico de distribución de equipos (doughnut chart): Asignados a clientes (386) | Pendientes de inspección (50) | Pendientes de asignar (23) | Solicitudes en curso (7) — con leyenda de badges y totales debajo del gráfico

Nota (alineada al prototipo 06/07/2026): los 4 KPIs y el doughnut chart usan los mismos nombres y valores ("Pendientes de inspección", "Asignados a clientes", "Pendientes de asignar", "Solicitudes en curso") — reemplaza cualquier versión previa con etiquetas como "Con Problema" o "Movimientos en Curso". El doughnut chart de distribución de equipos es parte oficial del contenido de esta pantalla.

Componentes: KPICard, Card, List, DoughnutChart (ver DESIGN.md)
Layout: MainLayout (TwoColumnLayout: notificaciones 8/12 + gráfico 4/12)
```

### 3.2a Recepción de Equipos (Listado de Lotes) ✅

```
Pantalla de listado de los lotes de recepción de equipos enviados por el Mandante. Es el punto de entrada al flujo de recepción: el sidebar "Recepción de Equipos" dirige a esta vista, y desde aquí se accede a la pantalla de inspección (3.2b) mediante el botón "Inspeccionar" o "Continuar" según el estado del lote.

Contenido:
- KPIs: En Tránsito | Pendientes de Inspección | Recibidos | Con Problema | Rechazados
- Filtros: buscar (N° recepción, N° asignación o guía) | estado | origen (Mandante) | rango de fechas
- Tabla: N° Recepción | N° Asignación | Origen (Mandante) | Equipos (count) | Fecha Llegada | Estado (badge) | Guía de Despacho (Pendiente / PDF adjunto) | Acciones
- Acciones por fila según estado del lote:
  * **En Tránsito** — Ver (modal detalle) · Registrar llegada (modal de confirmación que transiciona el lote a "Pendiente de Inspección")
  * **Pendiente de Inspección** — Ver · Inspeccionar (link a §3.2b)
  * **En Inspección** — Ver · Continuar (link a §3.2b, con barra de progreso mostrando equipos inspeccionados/total)
  * **Recibido** — Ver
  * **Rechazado** — Ver (con motivo de rechazo visible en modal detalle)
- Modal de detalle: datos del lote, resumen de inspección (aceptados / con problema / rechazados / pendientes), tabla de equipos del lote (N° Serie, Marca, Modelo, Estado, Motivo)
- Paginación

Nota de navegación (06/07/2026): el sidebar "Recepción de Equipos" dirige a esta vista de listado (`recepciones.html`). Desde aquí, los botones "Inspeccionar" o "Continuar" enlazan a la pantalla de inspección individual (`recepcion-equipos.html`, §3.2b). El botón "Registrar llegada" simula la transición de estado del lote "En Tránsito → Pendiente de Inspección" vía JavaScript, sin recarga de página, actualizando también los KPIs.

Componentes: KPICard, Card, Table, Badge, Button, Modal, Pagination (ver DESIGN.md)
Layout: MainLayout
```

### 3.2b Recepción de Equipos (Inspección) ✅

```
Pantalla de inspección de un lote específico de equipos enviado por el Mandante. Se accede desde el listado de lotes (3.2a) al hacer clic en "Inspeccionar" o "Continuar".

Contenido:
- Encabezado: "Recepción de Lote - Carozzi" | Guía de Despacho (N° X o enlace "Ver PDF adjunto", emitida vía API de facturación del Mandante — RN-16) | 50 equipos | Llegada: hoy 10:00 AM
- Tabla: N° Serie | Marca | Modelo | Checklist | Acciones ("Aceptar" / "Reportar Problema")
- Botones de acción en lote: "Aceptar Todo" y "Reportar Todo" — al hacer clic muestran un modal de confirmación advirtiendo que se omitirá la inspección individual; el usuario debe confirmar explícitamente
- Al inspeccionar: desplegar checklist según plantilla aplicable al tipo de activo (checkbox, texto o foto obligatoria por ítem). Al reportar problema: formulario inline con Motivo (dropdown alimentado desde el maestro **Tipos de Incidencias** del Mandante) y Descripción
- Resumen: X aceptados | Y con problema | Z pendientes de revisar, con barra de progreso
- Botón "Confirmar recepción" — deshabilitado hasta revisar todos los equipos

Reglas de negocio a respetar en el flujo:
- La inspección individual por equipo/checklist es el flujo base. La aprobación masiva sin observaciones queda pendiente de validación; si se prototipa, debe mostrarse como opción condicionada y claramente marcada como pendiente de confirmar.
- Si TODOS los equipos del lote resultan con problema, el lote completo queda en estado "Rechazado", a la espera de que el Mandante lo retire — mismo mecanismo que un equipo individual rechazado, sin flujo especial adicional

Componentes: Card, Table, Button, Badge, ProgressBar (ver DESIGN.md)
Layout: MainLayout
```

### 3.3a Asignaciones Realizadas a Clientes (vista de listado) ✅

```
Pantalla de listado de las asignaciones de equipos a clientes finales (puntos de venta) ya realizadas por el Gestor. Es el punto de entrada al flujo de asignación: el sidebar "Asignación a Clientes" dirige a esta vista, y desde aquí se accede a la pantalla de creación (3.3b) mediante el botón "Nueva asignación".

Contenido:
- KPIs: Asignados a clientes | En SSTT | Retirados / Devueltos | Clientes activos
- Filtros: buscar (N° asignación, cliente o N° serie) | estado | comuna | rango de fechas
- Tabla: N° Asignación | Cliente / Punto de venta | Comuna | Equipos (count) | Fecha asignación | Estado (badge) | Guía de Despacho (Pendiente / Automática con N° / PDF adjunto, según RN-16) | Acciones (ver detalle, generar GD, subir PDF)
- Acciones por fila:
  * **Ver** — modal de detalle con datos de la asignación + tabla de equipos asignados (N° Serie, Marca, Modelo, Familia)
  * **Generar GD** — modal que simula la generación automática de la Guía de Despacho a través del ERP Isstec (RN-16). Flujo de 3 pasos: confirmación con resumen → spinner de procesamiento → éxito con N° de GD generado. Al confirmar, la celda GD de la fila se actualiza a "Automática"
  * **Subir PDF** — modal con zona de drag & drop para adjuntar el PDF de la Guía de Despacho generada externamente (RN-16, para gestores sin sistema Isstec). Incluye campo opcional de N° de documento. Al guardar, la celda GD de la fila se actualiza a "PDF adjunto"
- Botón "Nueva asignación" (en navbar y en contenido) → lleva a la pantalla de creación (3.3b)
- Paginación

Nota de navegación (10/07/2026): el sidebar "Asignación a Clientes" dirige a esta vista de listado (`asignaciones-realizadas.html`), no a la pantalla de creación. El botón "Nueva asignación" en el navbar pertenece a este módulo y enlaza directamente a la pantalla de creación (3.3b). No debe mostrarse dentro de Autorización de Movimientos.

Componentes: KPICard, Card, Table, Badge, Button, Modal, Pagination (ver DESIGN.md)
Layout: MainLayout
```

### 3.3b Asignación a Clientes Finales (pantalla de creación) ✅

```
Pantalla de asignación de equipos aceptados a clientes finales (puntos de venta). Se accede desde el botón "Nueva asignación" del navbar o desde el botón homónimo en la vista de listado (3.3a).

Contenido:
- Columna izquierda: "Equipos para asignar" — lista de equipos aceptados sin cliente (N° Serie | Marca | Modelo), con buscador
- Columna derecha: "Puntos de venta disponibles" — lista de clientes (Nombre | Dirección | Comuna), con buscador
- Interacción: seleccionar equipo + seleccionar cliente + botón "Asignar"
- Confirmación: modal simple con resumen de la asignación (equipos, punto de venta, dirección) y nota informativa indicando que la Guía de Despacho se gestiona desde la tabla de Asignaciones Realizadas (3.3a). No se genera ni carga la GD en este paso.

Nota de negocio (06/07/2026): la generación/carga de la Guía de Despacho fue desacoplada del paso de asignación. Ahora se gestiona exclusivamente desde la tabla de Asignaciones Realizadas (3.3a), donde el usuario puede generarla automáticamente (ERP Isstec) o adjuntar el PDF (ERP externo / Mandante), según RN-16.

Componentes: Card, Table, Input, Button, Modal (ver DESIGN.md)
Layout: TwoColumnLayout
```

### 3.4a Solicitud de Movimiento (vista de listado) ✅

```
Pantalla de listado de las solicitudes de movimiento (baja, cambio, envío a SSTT, retorno) enviadas por el Gestor al Mandante. Es el punto de entrada al flujo: el sidebar "Solicitudes de Movimiento" dirige a esta vista, y desde aquí se accede a la pantalla de creación (3.4b) mediante el botón "Nueva solicitud".

Contenido:
- Tabla "Solicitudes enviadas": Equipo | Tipo | Fecha envío | Estado (Pendiente / Aprobada / Rechazada) | Resultado
- Botón "Nueva solicitud" (en navbar y en contenido) → lleva a la pantalla de creación (3.4b)

Nota de negocio: el Gestor no puede aprobar sus propias solicitudes; la aprobación la realiza el Mandante según roles aprobadores y voto vinculante (ver `reglas-de-negocio.md`, RN-1/RN-21).

Nota de navegación (07/07/2026): el sidebar "Solicitudes de Movimiento" dirige a esta vista de listado (`solicitudes-movimiento.html`). El botón "Nueva solicitud" enlaza a la pantalla de creación (`nueva-solicitud.html`, §3.4b). Esto replica el patrón usado en Recepción de Equipos (3.2a→3.2b), Asignación a Clientes (3.3a→3.3b) e Inventario (3.5a→3.5b), donde el sidebar dirige al listado y los botones de acción enlazan a las sub-vistas.

Componentes: Table, Badge, Button (ver DESIGN.md)
Layout: MainLayout
```

### 3.4b Nueva Solicitud de Movimiento (pantalla de creación) ✅

> Implementada en `Prototipo Maquinas/distribuidor/nueva-solicitud.html`. Se accede desde el botón "Nueva solicitud" del navbar o desde el botón homónimo en la vista de listado (3.4a).

```
Pantalla de creación de una nueva solicitud de movimiento (baja, cambio, envío a SSTT o retorno al Mandante), dirigida al Mandante para aprobación cuando el motivo/tipo lo requiera. Se accede desde el botón "Nueva solicitud" del navbar o desde el botón homónimo en la vista de listado (3.4a).

Contenido:
- Formulario:
  * Equipo (buscador por N° de serie con autocompletado — muestra resultados con N° serie, marca, modelo al escribir)
  * Tipo de solicitud (select: Baja definitiva / Cambio de equipo / Envío a SSTT / Retorno al Mandante / Solicitud de Inventario — obligatorio)
  * Motivo (textarea — obligatorio)
  * Evidencia (zona de drag & drop para adjuntar fotos/documentos, multi-archivo)
- Botón "Enviar solicitud" — al confirmar, muestra modal indicando roles aprobadores requeridos y si el voto es vinculante; luego retorna a la vista de listado (3.4a)
- Botón "Cancelar" — retorna a la vista de listado (3.4a) sin crear
- Botón "Limpiar" — limpia todos los campos del formulario

Nota de negocio: el Gestor no puede aprobar sus propias solicitudes. La aprobación la realiza el Mandante según roles aprobadores y voto vinculante configurados en el motivo de movimiento (RN-1/RN-21).

Componentes: Input, Select, Textarea, FileUpload, Button, Card (ver DESIGN.md)
Layout: FormLayout + Card
```

### 3.5a Gestión de Inventario (vista de listado) ✅

```
Pantalla de listado de las solicitudes de inventario físico gestionadas por el Gestor. Es el punto de entrada al flujo de inventario: el sidebar "Inventario" dirige a esta vista, y desde aquí se accede a la pantalla de solicitud (3.5b), al registro de conteo físico (3.5d) y al ajuste de discrepancias (3.5c).

Contenido:
- KPIs: En curso | En ajuste | Finalizados | Total solicitudes
- Filtros: buscar (ID, vendedor o comuna) | estado (Todos / En curso / En ajuste / Finalizado) | rango de fechas
- Tabla: ID | Fecha | Vendedor(es) / Comuna | Estado (badge: En curso / En ajuste / Finalizado) | N° equipos inventariados | Discrepancias detectadas | Acciones
- Acciones por fila según estado:
  * **En curso** — Ver (modal detalle) · Registrar conteo (link a §3.5d)
  * **En ajuste** — Ver · Ajustar (link a §3.5c)
  * **Finalizado** — Ver
- Modal de detalle: datos de la solicitud (ID, fecha, vendedor, comuna, estado), resumen (equipos esperados, equipos encontrados, discrepancias), tabla de equipos del inventario (N° Serie, Marca, Modelo, Inventario Sistema, Inventario Físico, Diferencia)
- Botón "Nueva solicitud" (en navbar y en contenido) → lleva a la pantalla de creación (3.5b)
- Paginación

Nota de navegación (07/07/2026): el sidebar "Inventario" dirige a esta vista de listado (`inventario.html`). El botón "Nueva solicitud" enlaza a la pantalla de creación (`solicitud-inventario.html`, §3.5b). El botón "Registrar conteo" en filas "En curso" enlaza a la pantalla de registro de conteo físico (`registro-conteo.html`, §3.5d). El botón "Ajustar" en filas finalizadas con discrepancias enlaza a la pantalla de ajuste (`ajuste-inventario.html`, §3.5c). Esto replica el patrón usado en Recepción de Equipos (3.2a→3.2b) y Asignación a Clientes (3.3a→3.3b), donde el sidebar dirige al listado y los botones de acción enlazan a las sub-vistas.

Componentes: KPICard, Card, Table, Badge, Button, Modal, Pagination (ver DESIGN.md)
Layout: MainLayout
```

### 3.5b Solicitud de Inventario (pantalla de creación) ✅

```
Pantalla de creación de una nueva solicitud de toma de inventario físico. Se accede desde el botón "Nueva solicitud" del navbar o desde el botón homónimo en la vista de listado (3.5a).

Contenido:
- Formulario:
  * Por vendedor (select, opcional — si se omite, aplica a todos los vendedores)
  * Por comuna (select, opcional — si se omite, aplica a todas las comunas)
  * Rango de fechas (fecha inicio y fecha fin, obligatorio)
  * Observación (textarea, opcional)
- Botón "Crear solicitud" — al confirmar, retorna a la vista de listado (3.5a) con la nueva solicitud en estado "En curso", pendiente de registro de conteo físico (3.5d)
- Botón "Cancelar" — retorna a la vista de listado (3.5a) sin crear

Nota de negocio (04/07/2026): esta pantalla cubre la solicitud web del inventario. La toma física en terreno (lectura de código/QR, confirmación de presencia, GPS y evidencia fotográfica) es responsabilidad de la app móvil de terreno, fuera de alcance de esta fase (GEN-5) — ver `maestros.md` §3.3. El conteo físico se ingresa manualmente en el paso de registro (3.5d).

Componentes: Input, Select, Textarea, Button, Card (ver DESIGN.md)
Layout: FormLayout + Card
```

### 3.5d Registro de Conteo Físico ✅

```
Pantalla de registro del conteo físico de equipos para una solicitud de inventario en curso. Se accede desde el botón "Registrar conteo" en una fila "En curso" de la vista de listado (3.5a). Este es el paso intermedio entre la solicitud (3.5b) y el ajuste (3.5c): sin este paso, no existen valores de "Inventario Físico" para comparar ni ajustar.

Contenido:
- Encabezado: "Registro de Conteo - INV-0042" | Fecha | Vendedor(es) / Comuna | N° equipos | Estado (badge: En curso)
- Tabla de equipos: N° Serie | Marca | Modelo | Cliente / Punto de venta | Inventario Sistema (valor esperado) | Inventario Físico (input editable, valor por defecto vacío) | Diferencia (calculada automáticamente al ingresar el valor físico: 0 / positiva / negativa)
- Progreso: "X de Y equipos contabilizados" con barra de progreso
- Botón "Finalizar inventario" — deshabilitado hasta que todos los equipos tengan su conteo físico ingresado; al confirmar, el inventario pasa a estado "Finalizado" (sin discrepancias) o "En ajuste" (con discrepancias), y retorna a la vista de listado (3.5a)
- Botón "Guardar progreso" — guarda los conteos ingresados parcialmente sin finalizar, permite continuar después
- Botón "Volver" — retorna a la vista de listado (3.5a) sin guardar cambios (los conteos ya guardados con "Guardar progreso" se conservan)

Nota de negocio (07/07/2026): este paso resuelve el hueco en el flujo de inventario. En la fase web, el conteo físico se ingresa manualmente por el Gestor (el personal revisa los equipos en terreno e ingresa los valores en la plataforma). Cuando se desarrolle la app móvil (GEN-5), este paso será alimentado automáticamente por la auditoría física georreferenciada (QR, GPS, fotos), pero el flujo web de registro manual se mantiene como respaldo.

Componentes: Card, Table, Input, Badge, Button, ProgressBar (ver DESIGN.md)
Layout: MainLayout
```

### 3.5c Ajuste de Inventario ✅

```
Pantalla de ajuste del inventario del sistema según las discrepancias detectadas en un inventario físico. Se accede desde el botón "Ajustar" en una fila de la vista de listado (3.5a) cuando el inventario está en estado "En ajuste".

Contenido:
- Encabezado: "Ajuste de Inventario - INV-0042" | Fecha | Vendedor(es) / Comuna | N° equipos | Discrepancias detectadas
- Tabla comparativa: Equipo (N° Serie, Marca, Modelo) | Inventario Sistema | Inventario Físico | Diferencia (badge: positivo/negativo/sin diferencia) | Acción
- Acción por fila: botón "Corregir" (abre modal inline o modal con campo editable para actualizar el valor del sistema al valor físico registrado)
- Resumen: X equipos sin diferencia | Y equipos con diferencia positiva | Z equipos con diferencia negativa
- Botón "Confirmar ajustes" — siempre habilitado. Aplica las correcciones realizadas (si las hubiera) y retorna a la vista de listado (3.5a), cambiando el estado del inventario a "Finalizado". El usuario puede corregir discrepancias individualmente con el botón "Corregir" o confirmar directamente sin corregir, aceptando las diferencias detectadas tal cual
- Botón "Volver" — retorna a la vista de listado (3.5a) sin aplicar cambios

Nota de negocio (04/07/2026): el ajuste del inventario corrige el valor del sistema según el resultado del conteo físico registrado en el paso anterior (3.5d). La auditoría física georreferenciada (GPS, fotos, QR) que alimentará automáticamente el conteo corresponde a la app móvil futura (GEN-5) — fuera de alcance de esta fase.

Componentes: Card, Table, Badge, Button, Modal (ver DESIGN.md)
Layout: MainLayout
```

### 3.6 Guía de Despacho ✅

```
Pantalla de gestión centralizada de Guías de Despacho del Gestor. Consolida todas las guías asociadas a los movimientos de equipos: recepción (Mandante → Gestor, emitidas por API del Mandante en 2.4) y despacho (Gestor → Cliente Final, generadas o adjuntadas desde 3.3a).

Contenido:
- KPIs: Total GD | Generadas automáticamente | PDF adjuntos | Pendientes
- Filtros: buscar (N° GD, N° asignación o cliente) | tipo (Recepción / Despacho a cliente) | estado | rango de fechas
- Tabla: N° GD | Tipo (Recepción Mandante→Gestor / Despacho Gestor→Cliente) | Origen | Destino | Equipos (count) | Fecha | Estado (badge: Emitida API Mandante / Generada automáticamente / PDF adjunto / Pendiente) | Acciones
- Acciones por fila:
  * **Ver** — modal de detalle con datos de la guía, equipos amparados y documento (PDF o enlace)
  * **Generar GD** — (solo para despachos a cliente) modal que simula la generación automática vía ERP Isstec (RN-16). Flujo de 3 pasos: confirmación con resumen → spinner de procesamiento → éxito con N° de GD generado
  * **Subir PDF** — modal con zona de drag & drop para adjuntar PDF generado externamente (RN-16, para gestores sin sistema Isstec)
  * **Descargar PDF** — si la GD ya tiene documento adjunto o fue generada
- Paginación

Nota de negocio (RN-16): la GD Mandante→Gestor se recibe desde la API de facturación del Mandante. Para despachos Gestor→Cliente, la generación automática solo aplica a gestores con sistema Isstec; gestores con ERP externo adjuntan el PDF generado externamente. Esta pantalla consolida ambas vías en un solo listado.

Nota de navegación (10/07/2026): el sidebar "Guías de Despacho" dirige a esta vista de listado (`guias-despacho.html`). Es un acceso directo al consolidado de todas las guías del Gestor, tanto de recepción (Mandante→Gestor) como de despacho (Gestor→Cliente). Las acciones de generar/subir GD también están disponibles en la tabla de Asignaciones Realizadas (3.3a).

Componentes: KPICard, Card, Table, Badge, Button, Modal, Pagination (ver DESIGN.md)
Layout: MainLayout
```

### 3.7 Reportes ✅

```
Pantalla de reportes del Gestor con múltiples pestañas de análisis.

Contenido:
- Tab "Ventas y Rendimiento" (activa por defecto):
  * Filtro: rango de fechas
  * Gráfico de barras: "Ventas vs. Equipos asignados por punto de venta" (dos series: Ventas / Cantidad de equipos)
  * Tabla "Rendimiento por equipo": N° Serie (o Tipo de Máquina si no hay N° de serie identificado) | Punto de venta | Ventas (período) | Equipos asignados | Ingreso por equipo | Rentabilidad
- Tab "Cliente–Máquina":
  * Filtro: cliente, comuna
  * Tabla: Cliente / Punto de venta | Comuna | Equipos asignados | Tipo de Máquina | Ventas (período) | Estado del equipo
- Tab "Geolocalización":
  * Filtros: Tipo de máquina, Cliente / Punto de venta
  * Mapa con pines de equipos asignados a clientes

Filtro común: rango de fechas

Nota de negocio (RN-14): las ventas mostradas solo consideran líneas de producto marcadas como provenientes de una máquina (no la factura completa); si el ERP no identificó el N° de serie exacto, el dato se agrupa a nivel de Tipo de Máquina en vez de equipo puntual.

Componentes: Tab, Input, BarChart, Table, Map (ver DESIGN.md)
Layout: MainLayout
```

---

## 4. Notas para el diseñador del prototipo en Google Stitch

### Sistema de diseño
Todo el estilo visual (colores, tipografía, componentes, layouts, breakpoints) vive en **`DESIGN.md`** — no se repite aquí. Cargar ese documento junto con cada prompt.

### Datos de ejemplo
- Todos los datos mostrados son **ficticios** — el prototipo es una maqueta no funcional
- Ejemplos: "Freezer FR-1023", "Gestor IceFree", "Carozzi", estados como "Operativo (1.118)", "En SSTT (118)"
- No incluir datos reales sensibles

### Orden de prioridad de pantallas
Construir primero las pantallas marcadas como **Must** en `requerimientos-de-producto.md`:
1. Login
2. Dashboard Mandante
3. Dashboard Gestor
4. Recepción de Equipos (inspección)
5. Asignación de Equipos + adjunto de Guía de Despacho (Mandante)
6. Asignación a Clientes — vista de listado (3.3a) + pantalla de creación (3.3b); la Guía de Despacho se genera/adjunta desde el listado según ERP
7. Autorización de Movimientos
8. Maestro de Equipos
9. Guía de Despacho (3.6)
10. Reportes (3.7)

Luego "Should" y finalmente "Could".

### Cambios relevantes tras reunión de validación (03/07/2026, ronda 1)
- Se agregó generación de **Guía de Despacho** en dos puntos del flujo (2.4 y 3.3) — antes no estaba confirmada.
- La sincronización de clientes por ERP quedó documentada como proceso automático vía API, no como pantalla del prototipo ni como carga manual bajo demanda.
- Se eliminó cualquier funcionalidad relacionada con "máquinas propias del Gestor" — no aplica en esta fase.

### Cambios relevantes tras aporte del usuario (03/07/2026, ronda 2 — RN-13 a RN-16; actualizado por ronda 7)
- **Corrección importante actualizada:** la Guía de Despacho Mandante→Gestor se emite vía API de facturación del Mandante. En Gestor→Cliente, la generación automática solo aplica si el gestor opera con sistema Isstec; el resto adjunta PDF.
- La notificación de ventas vía API queda como definición técnica, no como pantalla del prototipo, con matching de líneas de producto contra Tipo de Máquina.
- La carga manual queda acotada a **carga masiva de equipos** del Mandante. Clientes y vendedores del Gestor son solo lectura vía ERP; ventas solo entran por API.
- Los informes de rendimiento (2.7, 3.6) ahora aclaran que el cálculo se hace por línea de producto, no por factura completa.

### Cambios relevantes tras reorganización de navegación (04/07/2026, ronda 3)

Estructura de sidebar que debe respetar toda pantalla generada (alineado al prototipo implementado, 05/07/2026):

**Mandante:**
- *Principal:* Dashboard · Asignación de Equipos
- *Operación:* Autorización de Movimientos · Consulta de Inventario · Trazabilidad · Guías de Despacho
- *Análisis:* Informes
- *Maestros:* Equipos · Gestores · Servicio Técnico · Ubicaciones / Bodegas · Motivos de Movimiento · Tipos de Solicitud · Plantillas de Inspección · Tipos de Incidencias / Catálogo de Fallas
- *Configuración:* Usuarios · Roles

**Gestor:**
- *Principal:* Dashboard · Recepción de Equipos · Asignación a Clientes (→ vista de listado `asignaciones-realizadas.html`)
- *Operación:* Solicitudes de Movimiento · Inventario (→ vista de listado `inventario.html`) · Guías de Despacho
- *Análisis:* Reportes
- *Maestros:* Clientes (solo lectura ERP) · Vendedores (solo lectura ERP) · Ubicaciones / Bodegas
- *Configuración:* Usuarios · Roles

> **Nota de navegación (06/07/2026):** el patrón de navegación de "Asignación a Clientes" replica el del Mandante: el sidebar dirige a la **vista de listado** (`asignaciones-realizadas.html`, §3.3a) y el botón **"Nueva asignación"** en el navbar (presente en Dashboard, Recepción, Usuarios, Roles — ausente en Login, vista de listado y pantalla de creación) enlaza a la **pantalla de creación** (`asignacion-clientes.html`, §3.3b).

> **Nota de navegación (07/07/2026):** el patrón de navegación de "Inventario" replica el mismo modelo: el sidebar dirige a la **vista de listado** (`inventario.html`, §3.5a) y el botón **"Nueva solicitud"** enlaza a la **pantalla de creación** (`solicitud-inventario.html`, §3.5b). El botón **"Registrar conteo"** en filas "En curso" enlaza a la **pantalla de registro de conteo físico** (`registro-conteo.html`, §3.5d). El botón **"Ajustar"** en filas finalizadas con discrepancias enlaza a la **pantalla de ajuste** (`ajuste-inventario.html`, §3.5c). El flujo completo es: 3.5b (solicitud) → 3.5d (registro de conteo) → 3.5c (ajuste de discrepancias).

> **Nota (07/07/2026):** los prompts "Sincronización de Clientes vía API" y "Notificación de Ventas vía API" fueron eliminados de este documento — su funcionalidad se documenta como definiciones técnicas de API en `reglas-de-negocio.md` §4, no como pantallas del prototipo. La sincronización de clientes y la notificación de ventas son procesos automáticos vía API (RN-11 a RN-14) que no requieren una pantalla de gestión en el prototipo navegable. Se agregaron en su lugar los prompts **3.6 Guía de Despacho** y **3.7 Reportes**, alineados al sidebar del prototipo que ya incluye ambas opciones.

### Cambios relevantes tras eliminación de prompts 3.7/3.8 y nuevos prompts (07/07/2026, ronda 5)

- Se eliminaron los prompts **3.7 "Sincronización de Clientes vía API"** y **3.8 "Notificación de Ventas vía API"** — su funcionalidad se documenta como definiciones técnicas de API en `reglas-de-negocio.md` §4, no como pantallas del prototipo. La sincronización de clientes y la notificación de ventas son procesos automáticos vía API (RN-11 a RN-14) que no requieren una pantalla de gestión en el prototipo navegable.
- Se agregó el prompt **3.6 Guía de Despacho** — pantalla de gestión centralizada de guías que consolida los flujos de recepción (Mandante→Gestor, 2.4) y despacho (Gestor→Cliente, 3.3a). Ya estaba presente en el sidebar del prototipo pero sin prompt individual.
- Se reemplazó el prompt **3.6 "Reportes de Ventas y Rendimiento"** por **3.7 "Reportes"** — expandido con pestañas de análisis múltiple (Ventas y Rendimiento, Cliente–Máquina, Geolocalización), alineado al sidebar del prototipo.

Decisiones asociadas (ver `maestros.md` §4):
- La opción "Clientes" se **quitó del rol Mandante** — es una vista de consulta exclusiva del Gestor.
- "Proveedores de Servicio Técnico" y "Servicio Técnico" eran lo mismo; se mantiene solo "Servicio Técnico".
- "Contratos de Comodato" **no** es un maestro separado: sus campos viven en el `movimiento` de asignación.

### Referencias
- `DESIGN.md` — sistema de diseño completo
- `requerimientos-de-producto.md` — priorización MoSCoW actualizada
- `reglas-de-negocio.md` — reglas de negocio confirmadas y preguntas aún abiertas
- `diagramas-del-sistema.md` — diagramas de flujo y navegación actualizados
- `maestros.md` — catálogo de maestros, conexiones con pantallas/procesos y maestros futuros
