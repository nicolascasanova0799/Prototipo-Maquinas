# Reporte de Verificación del Prototipo — Loop Engineering 1:1

> Verificación exhaustiva del prototipo en `Prototipo Maquinas/` contra la documentación en `md/`.
> Fecha: 2025-07-06
> Checklist fuente: `skills/prototype-verification/assets/verification_checklist.md`
>
> **Addendum 06/07/2026**: se corrigieron 4 hallazgos de este reporte que resultaron ser falsos positivos contra la versión vigente de `DESIGN.md` y `stitch_prompts.md` (ambos ya alineados con el prototipo): el campo RUT y la selección manual de rol en el Login (S-01), los valores/etiquetas de los KPIs del Dashboard Gestor (S-10), y la ubicación de "Asignación de Equipos"/"Informes" en el sidebar Mandante (§5.1). También se actualizó §4.4 tras documentar Marcas, Modelos y Tipos de Incidencias en `maestros.md`. Los conteos de la tabla "Resumen" no fueron renumerados retroactivamente para no introducir un recuento no verificado línea por línea; ver el detalle corregido en cada sección.
>
> **Addendum 10/07/2026**: este reporte queda como evidencia histórica previa a la minuta de revisión de maqueta (`obs1.md`). No usar sus hallazgos como fuente vigente para: marca Savory/Sabori, término Gestor en UI visible, creación unitaria de equipos, submenús Grupo/Familia/Marcas/Modelos, clientes/vendedores editables, Guía de Despacho manual Mandante→Gestor ni KPIs anteriores. La fuente vigente son `docs/`, `stitch_prompts.md`, `DESIGN.md` y `data_model.md` actualizados el 10/07/2026.
>
> **Addendum 06/07/2026 (post-verificación)**: se implementó `distribuidor/recepcion-equipos.html` (S-11) y se alineó el dropdown de **Motivo** al reportar problema con el maestro **Tipos de Incidencias** del Mandante (`maestros.md` §1 ítem 12, `stitch_prompts.md` §3.2). El catálogo se consume a través de un array de `tiposIncidencias` en el prototipo; en producción vendrá del backend.

---

## Resumen

| Métrica | Cantidad |
|---|---|
| Total de ítems verificados | 97 |
| ✅ Correctos | 56 |
| ❌ Incorrectos | 7 |
| 🔲 Faltantes | 17 |
| ⚠️ Observaciones (no bloqueantes) | 17 |

**Cobertura por panel:**
- **Mandante**: 19/19 pantallas existen, 18 con contenido correcto, 1 con discrepancia menor.
- **Gestor**: 1/8 pantallas existen (solo dashboard). 7 pantallas críticas faltantes.

---

## §1. Pantallas (Screens)

| ID | Pantalla | Archivo prototipo | Estado | Observación |
|---|---|---|---|---|
| S-01 | Login | `Prototipo Maquinas/index.html` | ❌ | Ver nota abajo |
| S-02 | Dashboard Mandante | `Prototipo Maquinas/mandante/dashboard.html` | ✅ | 4 KPIs, mapa con pines, gráfico dona, tabla solicitudes pendientes. KPI "Equipos en SSTT" usa label "SSTT" en vez de "Servicio Técnico" — menor. |
| S-03 | Maestro de Equipos | `Prototipo Maquinas/mandante/maestro-equipos.html` | ✅ | Buscador, filtros (Estado, Gestor), botones carga manual y "Nuevo equipo" (modal alta individual), tabla con paginación, 7 estados badge, modal detalle equipo, botón editar por fila con modal editable. |
| S-04 | Gestores | `Prototipo Maquinas/mandante/gestores.html` | ⚠️ | Tabla con RUT/dirección/estado/N° equipos. "Tipo ERP" no es columna propia; aparece como subtítulo bajo el nombre. Modal CRUD presente. |
| S-05 | Asignación de Equipos | `Prototipo Maquinas/mandante/asignacion-equipos.html` | ✅ | Selector gestor, tabla equipos con checkbox, panel resumen sticky, modal Guía Despacho con PDF adjunto (RN-16). Soporta modos new/edit/view. |
| S-06 | Autorización de Movimientos | `Prototipo Maquinas/mandante/autorizacion-movimientos.html` | ✅ | Filtro estado, tabla con Equipo/Gestor/Tipo/Motivo/Fecha/Estado/Acciones, modal detalle con timeline y evidencia. |
| S-07 | Trazabilidad | `Prototipo Maquinas/mandante/trazabilidad.html` | ✅ | Buscador N° serie, card info equipo, timeline vertical cronológico con transiciones de estado. |
| S-08 | Informes | `Prototipo Maquinas/mandante/informes.html` | ✅ | 4 tabs: Geolocalización (mapa con pines), Piramidal Ventas (chart), Rendimiento (chart + tabla), Servicio Técnico (tabla con SLA). Filtros tipo máquina/gestor/fechas. Nota RN-14 visible. |
| S-09 | Consulta de Inventario | `Prototipo Maquinas/mandante/consulta-inventario.html` | ✅ | Filtros gestor/estado/fechas, tabla con vendedores/comuna, expandable de discrepancias con diff positivo/negativo/cero. |
| S-10 | Dashboard Gestor | `Prototipo Maquinas/distribuidor/dashboard.html` | ❌ | Ver nota abajo |
| S-10b | Recepción de Equipos (Listado de Lotes) | `Prototipo Maquinas/distribuidor/recepciones.html` | ✅ | KPIs (En Tránsito, Pendientes, Recibidos, Con Problema, Rechazados), filtros, tabla de lotes con acciones por estado, modal detalle con resumen de inspección, paginación. Botón "Registrar llegada" en lotes "En Tránsito" que transiciona a "Pendiente de Inspección" vía JS. *(Añadido 06/07/2026)* |
| S-11 | Recepción de Equipos (Inspección) | `Prototipo Maquinas/distribuidor/recepcion-equipos.html` | ✅ | Tabla de inspección, aceptar/reportar, formulario inline, resumen con progreso, confirmación. Dropdown de Motivo alineado con maestro Tipos de Incidencias. |
| S-12 | Asignación a Clientes | `Prototipo Maquinas/distribuidor/asignaciones-realizadas.html` + `asignacion-clientes.html` | ✅ | Vista de listado (§3.3a) con KPIs, filtros, tabla, modal detalle, paginación. Pantalla de creación (§3.3b) con two-column layout, selección equipo/cliente, modal confirmación con variantes ERP RN-16. Botón "Nueva asignación" en navbar. |
| S-13 | Solicitud de Movimiento | — | 🔲 | No existe `distribuidor/solicitud-movimiento.html` |
| S-14 | Gestión de Inventario | — | 🔲 | No existe `distribuidor/inventario.html` |
| S-15 | Reportes de Ventas y Rendimiento | — | 🔲 | No existe `distribuidor/reportes.html` |
| S-16 | Sincronización de Clientes vía API | — | 🔲 | No existe `distribuidor/sincronizacion-clientes.html` |
| S-17 | Notificación de Ventas vía API | — | 🔲 | No existe `distribuidor/notificacion-ventas.html` |

### Detalle S-01 (Login)

**Documento fuente**: `DESIGN.md` § Screen Login, `stitch_prompts.md` §1
**Archivo**: `Prototipo Maquinas/index.html`

- **Logo**: ✅ Presente (`assets/img/logo_white.png`)
- **Título**: ✅ "Plataforma de Gestión de Equipos Refrigerados"
- **Campo RUT**: ✅ (corregido 06/07/2026) `DESIGN.md` § Screen Login especifica `rut-input` con `label: "RUT"` y `placeholder: "12.345.678-9"`, idéntico al prototipo. El hallazgo original citaba un placeholder "Correo electrónico" que no existe en la versión vigente de `DESIGN.md`.
- **Password**: ✅ Presente con toggle de visibilidad
- **Botón Ingresar**: ✅ Presente
- **"Recuérdame"**: ✅ Ausente (correcto según decisión de UI)
- **"¿Olvidaste tu contraseña?"**: ✅ Ausente (correcto según decisión de UI)
- **Selección manual de rol**: ✅ (corregido 06/07/2026) `DESIGN.md` § Screen Login define expresamente el bloque `role-toggle` con las opciones Mandante/Gestor, igual que el prototipo. El hallazgo original atribuía a `DESIGN.md` una regla de reconocimiento automático de rol que no está presente en el documento vigente.

### Detalle S-10 (Dashboard Gestor)

**Documento fuente**: `stitch_prompts.md` §3.1
**Archivo**: `Prototipo Maquinas/distribuidor/dashboard.html`

- **4 KPIs**: ✅ (corregido 06/07/2026) `stitch_prompts.md` §3.1 especifica "Pendientes de inspección" (50), "Asignados a clientes" (386), "Pendientes de asignar" (23) y "Solicitudes en curso" (7) — coinciden exactamente con el prototipo. El hallazgo original citaba valores/etiquetas de una versión anterior del documento (45/892/"Con Problema"/"Movimientos en Curso").
- **Notificaciones recientes**: ✅ Presente con 5 items, iconos y badges
- **Gráfico doughnut adicional**: ✅ (corregido 06/07/2026) `stitch_prompts.md` §3.1 ya documenta el gráfico "Distribución de equipos" como parte oficial del contenido de la pantalla.

---

## §2. Funcionalidades (Features)

### 2.1 Transversal / Autenticación

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| AUTH-1 | Login diferenciado Mandante/Gestor | Must | ✅ | (corregido 06/07/2026) El login usa toggle manual de rol, tal como especifica `DESIGN.md` § Screen Login (`role-toggle`) |
| AUTH-2 | Gestión de roles y permisos | Should | ✅ | Sidebar sección Configuración: Usuarios y Roles (stubs `#`) en ambos paneles |

### 2.2 Panel Mandante — Administración de Equipos

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| MAN-1 | Maestro de Equipos | Must | ✅ | `mandante/maestro-equipos.html` completo |
| MAN-2 | Tipos de Estados | Must | ✅ | 7 estados badge definidos en `styles.css` y usados en tablas |
| MAN-3 | Maestro de SSTT y SLA | Should | ✅ | `mandante/servicio-tecnico.html` con tabla, SLA, modal CRUD |
| MAN-4 | Maestro de Gestores | Must | ✅ | `mandante/gestores.html` con tabla, modal CRUD |
| MAN-13 | Maestro de Grupo de Máquinas | Should | ✅ | `mandante/grupo-maquinas.html` con tabla, modal CRUD |
| MAN-14 | Maestro de Familia de Máquinas | Should | ✅ | `mandante/familia-maquinas.html` con tabla, modal CRUD |
| MAN-15 | Maestro de Ubicaciones / Bodegas | Should | ✅ | `mandante/ubicaciones-bodegas.html` con tabla (incluye RUT), modal CRUD. Campo RUT obligatorio *(aplicado 12/07/2026)* |
| MAN-16 | Maestro de Motivos de Movimiento | Should | ✅ | `mandante/motivos-movimiento.html` con tabla, modal CRUD, campo aprobación |
| MAN-18 | Maestro de Tipos de Solicitud | Should | ✅ | `mandante/tipos-solicitud.html` con tabla, modal CRUD, motivo asociado |
| MAN-17 | Maestro de Plantillas de Inspección | Could | ✅ | `mandante/plantillas-inspeccion.html` con tabla, modal CRUD, ítems de plantilla |

### 2.3 Panel Mandante — Gestión de Equipos

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| MAN-5 | Asignación de equipos a Gestor | Must | ✅ | `mandante/asignacion-equipos.html` + `asignaciones.html` (vista lista) |
| MAN-5b | Guía de Despacho (Mandante → Gestor) | Must | ✅ | Modal con carga PDF obligatoria, N° documento opcional |
| MAN-6 | Autorización de Movimientos | Must | ✅ | `mandante/autorizacion-movimientos.html` con aprobación/rechazo |
| MAN-7 | Control de Inventario (solo lectura) | Should | ✅ | `mandante/consulta-inventario.html` con filtros y discrepancias |
| MAN-8 | Trazabilidad de equipo | Should | ✅ | `mandante/trazabilidad.html` con timeline cronológico |

### 2.4 Panel Mandante — Informes

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| MAN-9 | Geolocalización de equipos | Should | ✅ | Tab en `informes.html` con mapa, pines, leyenda |
| MAN-10 | Informe Piramidal de Ventas | Could | ✅ | Tab con filtros, chart, nota RN-14 |
| MAN-11 | Rendimiento por Equipo | Could | ✅ | Tab con chart + tabla detalle |
| MAN-12 | Reporte de Servicio Técnico | Should | ✅ | Tab con filtros proveedor SSTT, SLA, tabla equipos |

### 2.5 Panel Gestor — Maestros

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| DIS-13 | Maestro de Clientes | Must | 🔲 | No existe `distribuidor/clientes.html` |
| DIS-14 | Maestro de Ubicaciones / Bodegas | Should | ✅ | `distribuidor/ubicaciones-bodegas.html` con tabla (incluye RUT), modal CRUD. Campo RUT obligatorio *(aplicado 12/07/2026)* |

### 2.6 Panel Gestor — Recepción y asignación

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| DIS-1 | Recepción de Equipos | Must | ✅ | `distribuidor/recepciones.html` (listado de lotes §3.2a) + `distribuidor/recepcion-equipos.html` (inspección §3.2b). Listado incluye botón "Registrar llegada" para transición En Tránsito → Pendiente de Inspección. *(Actualizado 06/07/2026)* |
| DIS-2 | Inspección visual / Aceptar-Rechazar | Must | ✅ | Aceptar individual, reportar problema, acciones en lote, resumen con progreso, confirmación |
| DIS-3 | Asignación de Equipos a Clientes | Must | ✅ | `distribuidor/asignaciones-realizadas.html` (listado §3.3a) + `asignacion-clientes.html` (creación §3.3b). Two-column layout, modal confirmación con variantes ERP RN-16, botón "Nueva asignación" en navbar. |
| DIS-4 | Solicitud de Movimiento | Must | 🔲 | Pantalla faltante |

### 2.7 Panel Gestor — Inventario

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| DIS-5 | Solicitud de Inventario | Should | 🔲 | Pantalla faltante |
| DIS-6 | Consulta de Inventarios | Should | 🔲 | Pantalla faltante |
| DIS-7 | Ajustes de Inventario | Could | 🔲 | Pantalla faltante |

### 2.8 Panel Gestor — Reportes e integración

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| DIS-8 | Piramidal de Ventas | Could | 🔲 | Pantalla faltante |
| DIS-9 | Rendimiento por Equipo | Could | 🔲 | Pantalla faltante |
| DIS-10 | Sincronización de Clientes vía API | Must | 🔲 | Pantalla faltante |
| DIS-11 | Reporte Cliente–Máquina | Should | 🔲 | Pantalla faltante |
| DIS-12 | Notificación de Ventas vía API | Must | 🔲 | Pantalla faltante |

### 2.9 Transversales

| ID | Funcionalidad | Prioridad | Estado | Observación |
|---|---|---|---|---|
| GEN-1 | Carga de archivos (Excel) — solo maestros | Should | ✅ | Modal en `maestro-equipos.html` con input `type="file"` acepta `.xlsx, .xls, .csv`, enlace "Descargar plantilla". No se puede verificar carga en Maestro de Clientes (pantalla faltante). |
| GEN-2 | Guías de Despacho | Must | ✅ | Modal en asignación Mandante con PDF. No se puede verificar lado Gestor (pantalla faltante). |
| GEN-2b | Notificación de Venta vía API | Must | 🔲 | Pantalla faltante |
| GEN-3 | Módulo de Siniestros e Incidencias | Should | ✅ | `mandante/tipos-incidencias.html` con catálogo de fallas, severidad, categoría, requiere SSTT |
| GEN-4 | Notificaciones automáticas | Must | ✅ | Indicador campana con badge en navbar de ambos dashboards. Lista de notificaciones en dashboard distribuidor. |
| GEN-5 | Auditoría Georreferenciada | Won't | — | Fuera de alcance — no verificar |
| GEN-6 | Mapa de Calor y Rentabilidad | Could | ⚠️ | No hay tab o sección explícita de mapa de calor. El tab de Geolocalización en informes se aproxima pero no es equivalente. |

---

## §3. Reglas de Negocio

| ID | Regla | Estado | Observación |
|---|---|---|---|
| RN-1 | Gestor no puede dar baja unilateral | 🔲 | No verificable: Solicitud de Movimiento (DIS-4) faltante. En Autorización (MAN-6) se ve que el Mandante aprueba/rechaza, pero no se puede verificar el flujo completo del lado Gestor. |
| RN-2 | Equipo asignable solo si fue recibido y aceptado | ✅ | Verificable: `asignacion-clientes.html` lista equipos aceptados sin cliente en columna "Equipos para asignar" |
| RN-3 | Estado cambia a "Asignado al Gestor" al asignar (fusión de los antiguos "En Tránsito"/"En Gestor", ver `business_rules_and_open_questions.md` §0) | ✅ | Verificable: `asignacion-equipos.html` muestra alerta "Asignación confirmada. Los equipos han pasado a estado 'Asignado al Gestor'" y `recepcion-equipos.html` mantiene el mismo estado tras la confirmación de recepción. *(Actualizado 06/07/2026)* |
| RN-4 | Auditorías con GPS y fotos | — | Fuera de alcance (app móvil) |
| RN-5 | Equipo con problema → "Pendiente de Revisión" (renombrado 06/07/2026, antes "Pendiente de Asignar") | ✅ | Verificable: `recepcion-equipos.html` permite reportar problema y el modal de confirmación indica explícitamente que esos equipos pasan a "Pendiente de Revisión". |
| RN-6 | Equipo en reparo se excluye de asignación | ✅ | Verificable: `asignacion-clientes.html` solo muestra equipos aceptados; los rechazados quedan en estado "Rechazado" y no aparecen en la lista de asignación |
| RN-7 | Lógica fuera de ERP | — | Arquitectura — no aplicable a prototipo visual |
| RN-8 | Sistema genera Guías de Despacho | ✅ | Modal de Guía en asignación Mandante con PDF adjunto |
| RN-9 | Rechazo de lote completo = mismo mecanismo que individual | ✅ | Verificable: `recepcion-equipos.html` muestra alerta RN-9 y habilita confirmación cuando todos tienen problema; se implementa como N filas de movimiento según `data_model.md` §2.5. |
| RN-10 | No gestión de máquinas propias del Gestor | ✅ | Maestro de Equipos muestra equipos del Mandante; no hay gestión de equipos propios en sidebar gestor |
| RN-11 | Integración 100% vía API | 🔲 | No verificable: Sincronización de Clientes faltante |
| RN-12 | Sincronización automática | 🔲 | No verificable: Sincronización de Clientes faltante |
| RN-13 | Ventas por evento, no por lote | 🔲 | No verificable: Notificación de Ventas faltante |
| RN-14 | Matching venta↔máquina por línea de producto | ✅ | Nota RN-14 visible en tabs Piramidal y Rendimiento de `informes.html`. Tabla muestra "Agrupado por tipo (sin serie)" cuando no hay N° serie exacto. |
| RN-15 | Carga manual solo maestros, nunca ventas | ✅ | No existe importador de ventas por archivo. Botón de carga manual solo en maestros. |
| RN-16 | Guía auto solo sistema Isstec; resto adjunta PDF | ✅ | Modal en `asignacion-equipos.html` requiere PDF obligatorio (Mandante siempre adjunta). Nota RN-16 comentada en HTML. |

---

## §4. Datos Maestros

### 4.1 Mandante

| # | Maestro | Estado esperado | Archivo | Estado | Observación |
|---|---|---|---|---|---|
| 1 | Equipos | ✅ Implementado | `mandante/maestro-equipos.html` | ✅ | Tabla con filtros, paginación, modal detalle, botones carga manual/API |
| 2 | Gestores | ✅ Implementado | `mandante/gestores.html` | ✅ | Tabla con RUT, dirección, estado, N° equipos, ERP type, modal CRUD |
| 3 | Servicio Técnico | Verificar | `mandante/servicio-tecnico.html` | ✅ | Tabla con nombre, RUT, dirección, SLA, estado, modal CRUD |
| 4 | Grupo de Máquinas | Verificar | `mandante/grupo-maquinas.html` | ✅ | Tabla con código, nombre, descripción, N° equipos, estado, modal CRUD |
| 5 | Familia de Máquinas | Verificar | `mandante/familia-maquinas.html` | ✅ | Tabla con código, nombre, descripción, N° equipos, estado, modal CRUD |
| 6 | Ubicaciones / Bodegas | Verificar | `mandante/ubicaciones-bodegas.html` | ✅ | Tabla con nombre, RUT, dirección, tipo, responsable, estado, modal CRUD. Campo RUT obligatorio *(aplicado 12/07/2026)* |
| 7 | Motivos de Movimiento | ✅ Implementado | `mandante/motivos-movimiento.html` | ✅ | Tabla con código, nombre, descripción, aprobación, estado, modal CRUD |
| 8 | Tipos de Solicitud | ✅ Implementado | `mandante/tipos-solicitud.html` | ✅ | Tabla con código, nombre, descripción, motivo asociado, aprobación, estado, modal CRUD |
| 9 | Plantillas de Inspección | Verificar | `mandante/plantillas-inspeccion.html` | ✅ | Tabla con nombre, descripción, ítems, aplica a, estado. Modal CRUD + modal ítems |

### 4.2 Gestor

| # | Maestro | Estado esperado | Archivo | Estado | Observación |
|---|---|---|---|---|---|
| 1 | Clientes | ✅ Implementado | `distribuidor/clientes.html` | 🔲 | Archivo no existe |
| 2 | Ubicaciones / Bodegas | Verificar | `distribuidor/ubicaciones-bodegas.html` | ✅ | Tabla con nombre, RUT, dirección, tipo, responsable, equipos, estado, modal CRUD. Campo RUT obligatorio *(aplicado 12/07/2026)* |

### 4.3 Configuración (ambos paneles)

| Item | Estado | Observación |
|---|---|---|
| Usuarios (stub) | ✅ | Presente en sidebar de ambos paneles con link `#` |
| Roles (stub) | ✅ | Presente en sidebar de ambos paneles con link `#` |

### 4.4 Maestros no documentados

> **Actualizado 06/07/2026**: los tres maestros de esta sección ya fueron incorporados a `maestros.md` §1 (ítems 10, 11 y 12).

| Archivo | En `maestros.md` | En `data_model.md` | Observación |
|---|---|---|---|
| `mandante/marcas.html` | ✅ Documentado (ítem 10) | Verificar | Tabla con código, nombre, descripción, N° modelos, estado. Modal CRUD completo. |
| `mandante/modelos.html` | ✅ Documentado (ítem 11) | Verificar | Tabla con código, nombre, marca, familia, grupo, capacidad, estado. Modal CRUD completo. |
| `mandante/tipos-incidencias.html` | ✅ Documentado (ítem 12) | Verificar | Catálogo de fallas con código, categoría, severidad, requiere SSTT. |

---

## §5. Navegación / Sidebar

### 5.1 Sidebar Mandante

| Sección esperada | Item esperado | Sección en proto | Estado | Observación |
|---|---|---|---|---|
| Principal | Asignación de Equipos | Principal | ✅ | (corregido 06/07/2026) `stitch_prompts.md` §4 ronda 3 y `system_diagrams.md` §7 ya ubican esta pantalla en "Principal"; la expectativa de "Operación" provenía solo del checklist de verificación, no de la documentación funcional vigente |
| Operación | Autorización de Movimientos | Operación | ✅ | |
| Operación | Trazabilidad | Operación | ✅ | |
| Análisis | Informes | Análisis | ✅ | (corregido 06/07/2026) `stitch_prompts.md` §4 ronda 3 y `system_diagrams.md` §7 ya ubican esta pantalla en "Análisis"; la expectativa de "Operación" provenía solo del checklist de verificación, no de la documentación funcional vigente |
| Operación | Consulta de Inventario | Operación | ✅ | |
| Maestros | Equipos | Maestros | ✅ | |
| Maestros | Gestores | Maestros | ✅ | |
| Maestros | Servicio Técnico | Maestros | ✅ | |
| Maestros | Grupo de Máquinas | Maestros | ✅ | |
| Maestros | Familia de Máquinas | Maestros | ✅ | |
| Maestros | Ubicaciones / Bodegas | Maestros | ✅ | |
| Maestros | Motivos de Movimiento | Maestros | ✅ | |
| Maestros | Plantillas de Inspección | Maestros | ✅ | |
| Maestros | Tipos de Solicitud | Maestros | ✅ | Presente pero no listado en checklist §5.1 (omisión del checklist) |
| Maestros | Marcas | Maestros | ⚠️ | Presente pero no documentado en `maestros.md` ni checklist §5.1 |
| Maestros | Modelos | Maestros | ⚠️ | Presente pero no documentado en `maestros.md` ni checklist §5.1 |
| Maestros | Tipos de Incidencias | Maestros | ⚠️ | Presente, corresponde a GEN-3, pero no listado en checklist §5.1 |
| Configuración | Usuarios | Configuración | ✅ | Stub `#` |
| Configuración | Roles | Configuración | ✅ | Stub `#` |

### 5.2 Sidebar Gestor

| Sección esperada | Item esperado | Sección en proto | Estado | Observación |
|---|---|---|---|---|
| Operación | Recepción de Equipos | Principal | ⚠️ | Ubicado en "Principal" en vez de "Operación". Archivo `recepcion-equipos.html` ahora existe. |
| Operación | Asignación a Clientes | Principal | ✅ | (corregido 06/07/2026) Sidebar dirige a vista de listado `asignaciones-realizadas.html` (§3.3a). Botón "Nueva asignación" en navbar enlaza a pantalla de creación `asignacion-clientes.html` (§3.3b). Patrón consistente con Mandante. |
| Operación | Solicitudes de Movimiento | Operación | ❌ | Link a `solicitudes-movimiento.html` (archivo no existe) |
| Operación | Inventario | Operación | ❌ | Link a `inventario.html` (archivo no existe) |
| Operación | Sincronización de Clientes | — | 🔲 | **No aparece en el sidebar** |
| Operación | Notificación de Ventas | — | 🔲 | **No aparece en el sidebar** |
| Operación | Reportes | Análisis | ❌ | Ubicado en "Análisis" en vez de "Operación". Link a `reportes.html` (archivo no existe) |
| Maestros | Clientes | Maestros | ❌ | Link a `clientes.html` (archivo no existe) |
| Maestros | Ubicaciones / Bodegas | Maestros | ❌ | Link a `#` (stub, archivo no existe) |
| Configuración | Usuarios | Configuración | ✅ | Stub `#` |
| Configuración | Roles | Configuración | ✅ | Stub `#` |
| — | Guías de Despacho | Operación | ⚠️ | **No definido en checklist §5.2**. Link a `guias-despacho.html` (archivo no existe). Pantalla no documentada. |

### 5.3 Reglas de navegación

| Regla | Estado | Observación |
|---|---|---|
| Opciones de maestros NO llevan prefijo "Maestro de" | ✅ | "Equipos", "Gestores", "Servicio Técnico", etc. |
| "Clientes" NO aparece en sidebar del Mandante | ✅ | Correcto, no presente |
| "Servicio Técnico" (no "Proveedores de Servicio Técnico") | ✅ | Label correcto |
| "Contratos de Comodato" NO es maestro separado | ✅ | No presente |

---

## §6. Sistema de Diseño

| Componente | Estado | Observación |
|---|---|---|
| Button (primary, secondary, success, danger) | ✅ | `.btn-primary` (#0066CC), `.btn-success` (#28A745), `.btn-warning` (#FF6B35), `.btn-outline-secondary` definidos en `styles.css` |
| Card | ✅ | Border-radius 8px, box-shadow sutil, `.card-title` con color navy |
| Badge (estados) | ✅ | Ver tabla de colores abajo |
| Input / Form Control | ✅ | Border #DEE2E6, radius 6px, labels 13px font-weight 600 |
| Table (con hover, alternating rows) | ✅ | `.table-hover tbody tr:hover` con background #F8F9FA. Header uppercase, gris-claro background |
| Sidebar (navy #001F3F, 240px, secciones agrupadas) | ✅ | `--sidebar-width: 240px`, `background: var(--azul-marino)` (#001F3F), secciones con `.nav-section` |
| Navbar (blanco, 60px, avatar, notificación) | ✅ | `height: 60px`, `background: #FFFFFF`, notification-icon con badge, user-avatar circular |
| Modal / Dialog | ✅ | Usado en asignación, gestores, tipos de solicitud, motivos, plantillas, marcas, modelos, incidencias, SSTT, ubicaciones |
| KPICard (4 tarjetas en dashboards) | ✅ | `.kpi-card` con icono 48px, label uppercase, value 28px bold |
| MainLayout | ✅ | `.app-layout` flex con sidebar fixed + `.app-content` |
| TwoColumnLayout | ✅ | `.two-col-layout` grid 1fr 320px en `asignacion-equipos.html` |
| FormLayout | 🔲 | No verificable: Solicitud de Movimiento faltante |
| Paginación | ✅ | Presente en `maestro-equipos.html`, `asignaciones.html`, `motivos-movimiento.html`, `tipos-solicitud.html`, `marcas.html`, `modelos.html`, `plantillas-inspeccion.html` |

### Colores de estado (badges)

| Estado | Color esperado | Color en `styles.css` | Estado |
|---|---|---|---|
| Activo/Operativo | Verde #28A745 | `.badge-activo { background: var(--verde-exito) }` → #28A745 | ✅ |
| Asignado al Gestor (antes "En Tránsito"/"En Gestor") | #E3F2FD fondo / navy texto | `.badge-gestor { background: #E3F2FD; color: var(--azul-marino) }` | ✅ |
| En SSTT | Naranjo #FF6B35 | `.badge-sstt { background: var(--naranja-coral) }` → #FF6B35 | ✅ |
| Pendiente de Revisión (antes "Pendiente de Asignar") | Gris #6C757D | `.badge-pendiente { background: var(--gris-medio) }` → #6C757D | ✅ |
| Rechazado | Rojo #DC3545 | `.badge-rechazada { background: var(--rojo-error) }` → #DC3545 | ✅ |
| Baja | Gris oscuro #343A40 | `.badge-baja { background: var(--gris-oscuro) }` → #343A40 | ✅ |

**Badges adicionales no en el design system:**
- `.badge-aprobada` (verde, para solicitudes aprobadas) — extensión natural
- `.badge-rechazada` (rojo, para solicitudes rechazadas) — extensión natural
- `.badge-borrador` (amarillo, para borradores) — extensión natural

---

## §7. User Personas

| Persona | Escenario | Estado | Observación |
|---|---|---|---|
| Marcela (Mandante) | Genera asignación → recibe notificación de reparo → autoriza/rechaza | ⚠️ | Flujo de asignación ✅ (`asignacion-equipos.html`), autorización ✅ (`autorizacion-movimientos.html`). Notificación de reparo no verificable (Recepción del Gestor faltante). Flujo parcial. |
| Rodrigo (Gestor) | Recibe lote → inspecciona → acepta/rechaza → asigna a cliente → solicita movimiento | ⚠️ | **Parcialmente verificable**: Recepción ✅ (`recepcion-equipos.html`), asignación a cliente ✅ (`asignacion-clientes.html` + `asignaciones-realizadas.html`). Solicitud de movimiento (DIS-4) faltante. |
| Almacén Don Luis (Cliente Final) | Aparece como dato en asignación a clientes | ✅ | Verificable: aparece como dato en `asignaciones-realizadas.html` (tabla de listado) y en `asignacion-clientes.html` (lista de puntos de venta). También en `maestro-equipos.html` (columna "Cliente / Ubicación"). |
| Katherine (Terreno) | No debe tener pantalla en el prototipo | ✅ | Correcto, no hay pantalla de terreno |

---

## §8. Pantallas adicionales detectadas en el prototipo

| Archivo | Definido en documentación | Cuál? | Observación |
|---|---|---|---|
| `mandante/marcas.html` | ❌ No en `maestros.md` | — | Maestro de Marcas con CRUD completo. Debería documentarse en `maestros.md` y añadirse al checklist. |
| `mandante/modelos.html` | ❌ No en `maestros.md` | — | Maestro de Modelos con CRUD completo. Relaciona marca, familia, grupo, capacidad. Debería documentarse. |
| `mandante/tipos-incidencias.html` | ✅ Parcialmente | `prd_features.md` GEN-3 | Corresponde a "Módulo de Siniestros e Incidencias". Catálogo de fallas con código, categoría, severidad, requiere SSTT. Debería añadirse a `maestros.md` como maestro. |
| `mandante/asignaciones.html` | ✅ Justificado | `stitch_prompts.md` §2.4 | Vista de lista de asignaciones, complemento natural de S-05 (`asignacion-equipos.html` es el detalle/creación). Decisión de UI documentada en memoria de sesión previa. |
| `distribuidor/asignaciones-realizadas.html` | ✅ Justificado | `stitch_prompts.md` §3.3a | Vista de listado de asignaciones a clientes, complemento natural de S-12 (`asignacion-clientes.html` es la pantalla de creación §3.3b). Replica el patrón del Mandante (listado + creación). |
| `distribuidor/guias-despacho.html` (link en sidebar) | ❌ No documentado | — | Link presente en sidebar del gestor pero el archivo no existe. No está en el checklist §5.2. **Pantalla no documentada y no implementada.** |

---

## Hallazgos Críticos

### 🔴 CRÍTICO 1: Panel Gestor incompleto (6 pantallas faltantes)

**Impacto**: 6 de 8 pantallas del Gestor no existen. Esto representa el **75% del panel Gestor** sin implementar.

**Pantallas faltantes**:
- S-13 Solicitud de Movimiento — **Must**
- S-14 Gestión de Inventario — **Should**
- S-15 Reportes — **Could**
- S-16 Sincronización de Clientes vía API — **Must**
- S-17 Notificación de Ventas vía API — **Must**

**Funcionalidades Must faltantes**: DIS-4, DIS-10, DIS-12, GEN-2b

**Reglas de negocio no verificables**: RN-1, RN-11, RN-12, RN-13 (4 de 16 reglas). RN-2, RN-5, RN-6 y RN-9 ahora son verificables gracias a `recepcion-equipos.html` y `asignacion-clientes.html`/`asignaciones-realizadas.html`.

### 🔴 CRÍTICO 2: Maestros del Gestor faltantes

- DIS-13 Maestro de Clientes (**Must**) — archivo no existe
- DIS-14 Maestro de Ubicaciones / Bodegas (**Should**) — link a `#` en sidebar

### ✅ RESUELTO 06/07/2026 — Login con selección manual de rol

`DESIGN.md` § Screen Login ya especifica el `role-toggle` manual (Mandante/Gestor), igual que el prototipo. No existe contradicción: el hallazgo original citaba una regla que no está en la versión vigente del documento.

### ✅ RESUELTO 06/07/2026 — Maestros no documentados (Marcas, Modelos, Tipos de Incidencias)

`marcas.html`, `modelos.html` y `tipos-incidencias.html` ya están documentados en `maestros.md` §1 (ítems 10, 11 y 12). El checklist de navegación §5.1 (fuera de `md/`, en `skills/prototype-verification/assets/`) sigue sin listarlos explícitamente.

### ✅ RESUELTO 06/07/2026 — KPIs del Dashboard Gestor

`stitch_prompts.md` §3.1 ya refleja los valores y etiquetas reales del prototipo (50/386/23/7 con sus nombres actuales). No hay discrepancia vigente.

### 🟡 IMPORTANTE 4: Navegación del sidebar del Gestor con diferencias de estructura

- Gestor: "Recepción" en "Principal" (esperado "Operación"), "Reportes" en "Análisis" (esperado "Operación")
- Gestor: "Asignación a Clientes" en "Principal" — ✅ (corregido 06/07/2026) ahora alineada con `stitch_prompts.md` §3.3a/3.3b y `system_diagrams.md`
- Gestor: "Sincronización de Clientes" y "Notificación de Ventas" **ausentes del sidebar**
- Gestor: "Guías de Despacho" **presente pero no documentada**

> Nota 06/07/2026: la observación equivalente para el Mandante ("Asignación de Equipos"/"Informes") se retiró de este hallazgo — ver §5.1, ya está alineada con `stitch_prompts.md`/`system_diagrams.md`.

---

## Recomendaciones

### Prioridad Inmediata (Bloqueante)

1. **Implementar las 6 pantallas faltantes del panel Gestor**. Estas son críticas para validar los flujos de negocio principales (solicitudes, inventario, sincronización, notificación de ventas). Sin estas pantallas, el 50% del sistema no es navegable.

2. **Implementar `distribuidor/clientes.html`** (Maestro de Clientes, prioridad Must). Es el único maestro Must del gestor y no existe.

3. ~~**Decidir sobre el login**~~ — **Resuelto 06/07/2026**: `DESIGN.md` ya documenta el toggle manual de rol; no requiere cambios.

### Prioridad Alta

4. ~~**Documentar maestros de Marcas y Modelos**~~ — **Resuelto 06/07/2026** en `maestros.md` §1 (ítems 10-11). Pendiente únicamente añadirlos al checklist de navegación §5.1 (fuera de `md/`).

5. ~~**Documentar `tipos-incidencias.html`**~~ — **Resuelto 06/07/2026** en `maestros.md` §1 (ítem 12), vinculado a GEN-3.

6. ~~**Sincronizar KPIs del Dashboard Gestor**~~ — **Resuelto 06/07/2026**: `stitch_prompts.md` §3.1 ya coincide con el prototipo.

7. **Añadir "Sincronización de Clientes" y "Notificación de Ventas" al sidebar del Gestor**. Ambas son funcionalidades Must y no aparecen en la navegación.

### Prioridad Media

8. **Decidir sobre "Guías de Despacho" en sidebar Gestor**: Si es una pantalla válida, documentarla y crear el archivo. Si no, remover el link del sidebar.

9. **Actualizar el checklist §5.1** para incluir "Tipos de Solicitud" en la lista de navegación Mandante (actualmente omitido del checklist pero presente en el prototipo).

10. **Considerar documentar el gráfico doughnut** del Dashboard Gestor en `stitch_prompts.md` o `DESIGN.md`, ya que está implementado pero no especificado.

11. ~~**Actualizar `DESIGN.md` Screen Login**~~ — **Resuelto 06/07/2026**: ya usa RUT, coincidiendo con el prototipo.

### Prioridad Baja

12. **Estandarizar la estructura de secciones del sidebar del Gestor**: Decidir si "Recepción" y "Asignación a Clientes" van en "Principal" o "Operación", y si "Reportes" va en "Análisis" o "Operación" — para el Mandante ya está resuelto (ver §5.1). Actualizar el checklist §5 en `skills/prototype-verification/assets/` en consecuencia.

13. **Tipo ERP en Gestores mostrado como subtítulo**: `stitch_prompts.md` §2.3 ya documenta (06/07/2026) que el dato aparece como subtítulo bajo el nombre y no como columna independiente, alineando la documentación con el prototipo. Sigue siendo una mejora de UX opcional convertirlo en columna propia si el negocio lo requiere.

14. **Evaluar inclusión de GEN-6 (Mapa de Calor y Rentabilidad)**: No hay tab o sección explícita. Si se decide implementar, añadir a `informes.html` como quinto tab.
