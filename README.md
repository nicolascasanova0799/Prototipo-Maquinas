# Prototipo — Plataforma de Gestión de Equipos Refrigerados

Este documento describe **el prototipo navegable** (maqueta no funcional, sin backend real) construido en esta carpeta. Su objetivo es que cualquier persona —técnica o administrativa— entienda qué vistas existen, para qué sirven, y cómo se conectan entre sí, sin necesidad de conocer el proyecto de antemano.

> **Fuentes usadas:** este README se construyó revisando el código HTML de las 39 pantallas del prototipo (`index.html`, `mandante/*.html`, `distribuidor/*.html`) y la documentación funcional en `../md/` (`PROPOSAL.md`, `prd_features.md`, `maestros.md`, `business_rules_and_open_questions.md`, `system_diagrams.md`, `stitch_prompts.md`). **Cuando hubo diferencias entre lo documentado y lo realmente implementado, se priorizó el prototipo** y la diferencia se deja registrada en la sección 7.

---

## 1. Qué es este prototipo

Es una maqueta web **no funcional** (HTML + Bootstrap 5, sin backend, sin base de datos real) que simula una plataforma para que un **Mandante** (dueño de freezers y conservadoras, ej. Savory) controle el ciclo de vida completo de esos equipos que entrega en comodato a **Distribuidores/Gestores** (ej. IceFree), quienes a su vez los instalan en **Clientes finales** (puntos de venta como minimarkets).

Hoy ese control se hace con planillas Excel. El prototipo demuestra cómo se vería una plataforma web que reemplace ese proceso manual, cubriendo: carga de equipos, asignación al distribuidor, recepción e inspección, asignación a clientes finales, solicitudes de movimiento/baja, gestión de inventario, guías de despacho, trazabilidad e informes.

Todos los datos que se ven (nombres, RUT, cifras) son **ficticios**. No hay lógica de negocio real: los botones simulan comportamiento con JavaScript en el navegador (por ejemplo, cambiar el color de un badge o mostrar un modal), pero no persisten información en un servidor.

## 2. Cómo navegar el prototipo

### 2.1 Login (`index.html`)

- **Objetivo:** punto de entrada único a la plataforma.
- **Funcionalidad:** formulario con RUT (con validación de formato chileno), contraseña (con botón para mostrar/ocultar) y un selector de **rol** mediante dos tarjetas: **Mandante** o **Distribuidor**.
- **Flujo de usuario:**
  - *Antes:* el usuario no tiene sesión iniciada.
  - *Durante:* ingresa RUT/contraseña (cualquier valor funciona, es una maqueta) y elige manualmente su rol.
  - *Después:* es redirigido a `mandante/dashboard.html` o `distribuidor/dashboard.html` según el rol elegido.
- **Relación con otras vistas:** es la única puerta de entrada; todas las demás vistas tienen un botón "Cerrar sesión" en el pie del sidebar que devuelve aquí.

### 2.2 Estructura de navegación (sidebar)

Ambos paneles comparten el mismo patrón visual: un **sidebar** fijo a la izquierda agrupado en 5 secciones — **Principal**, **Operación**, **Análisis**, **Maestros** y **Configuración** — y una barra superior (**navbar**) con accesos rápidos, notificaciones y datos del usuario conectado. Este README sigue ese mismo agrupamiento para presentar las vistas de cada panel.

### 2.3 Modelo de estados (aplica a casi todas las vistas)

Antes de entrar al detalle de cada vista, es útil saber que el prototipo distingue **5 "ejes" de estado independientes** (documentados en `../md/business_rules_and_open_questions.md` §0), porque varias vistas muestran badges de "Pendiente", "Rechazado", etc. con significados distintos según el contexto:

| Eje | Dónde se ve | Valores |
|---|---|---|
| 1. Estado del **equipo** | Maestro de Equipos, Trazabilidad, etc. | Activo → Asignado al Distribuidor → Asignado a Cliente → En SSTT → Pendiente de Revisión / Rechazado / Baja |
| 2. Estado del **lote de recepción** | `recepciones.html` | En Tránsito → Pendiente de Inspección → En Inspección → Recibido / Rechazado |
| 3. Estado del **registro de asignación** (Mandante→Distribuidor) | `asignaciones.html` | Borrador → Enviada → Completada |
| 4. Estado de la **solicitud/autorización** | `autorizacion-movimientos.html`, `solicitudes-movimiento.html` | Pendiente de Aprobación → Aprobada / Rechazada |
| 5. Estado de **asignación a cliente final** | `asignaciones-realizadas.html` | Activo / En SSTT / Baja (es un filtro del Eje 1, no un catálogo propio) |

---

## 3. Panel del Mandante

Usuario tipo: administrador de activos de Savory. Su rol es controlar el maestro de equipos, decidir a qué distribuidor se asigna cada lote, aprobar o rechazar solicitudes del distribuidor, y consultar informes/trazabilidad.

### 3.1 Sección Principal

#### `mandante/dashboard.html` — Dashboard Mandante
- **Objetivo:** dar una vista panorámica del estado de la flota de equipos al entrar al sistema.
- **Motivo:** el Mandante hoy no tiene visibilidad centralizada; esta pantalla resuelve el problema de "no sé cuántos equipos tengo ni en qué estado están" sin tener que abrir varias planillas.
- **Funcionalidad principal:** 4 KPI (Total de equipos, Activos, En Servicio Técnico, Solicitudes Pendientes), mapa de distribución geográfica, gráfico de dona con estado de equipos, y tabla de solicitudes pendientes con acciones rápidas de Aprobar/Rechazar.
- **Flujo:** *antes* — el usuario recién inició sesión; *durante* — revisa KPIs y detecta solicitudes pendientes; *después* — puede hacer clic en una solicitud y ser dirigido a `autorizacion-movimientos.html`, o navegar a cualquier otra sección del sidebar.
- **Relación:** es el punto de partida hacia todas las demás vistas del panel Mandante.

#### `mandante/asignaciones.html` — Asignación de Equipos (listado)
- **Objetivo:** mostrar el historial de lotes de equipos ya asignados (o en proceso de asignar) a distribuidores.
- **Motivo:** sin esta vista no habría forma de auditar qué se envió a quién y cuándo; formaliza el envío de planillas informales por Excel.
- **Funcionalidad principal:** tabla de registros de asignación con su estado de proceso (Borrador/Enviada/Completada) y desglose de cuántos equipos del lote quedaron en cada estado (Eje 3 del modelo de estados).
- **Flujo:** *antes* — el Mandante decide enviar equipos a un distribuidor; *durante* — consulta el historial o inicia una nueva asignación con el botón "Nueva asignación" del navbar; *después* — si crea una nueva, es dirigido a `asignacion-equipos.html`.
- **Relación:** el sidebar "Asignación de Equipos" apunta a este listado; el botón "Nueva asignación" (presente en el navbar de casi todas las vistas del Mandante) lleva a la pantalla de creación.

#### `mandante/asignacion-equipos.html` — Asignación de Equipos (creación)
- **Objetivo:** ejecutar el envío de un lote de equipos a un distribuidor específico.
- **Motivo:** es el corazón del flujo Mandante→Distribuidor descrito en `PROPOSAL.md`; reemplaza el envío manual de planillas.
- **Funcionalidad principal:** selector de "Distribuidor destino", tabla de equipos disponibles (sin asignar) con checkboxes, panel resumen con conteo de seleccionados, botón "Confirmar asignación". Al confirmar, se abre un modal para **adjuntar el PDF de la Guía de Despacho** (el Mandante siempre sube el PDF manualmente; la generación automática solo aplica a distribuidores con sistema Isstec en el flujo inverso).
- **Flujo:** *antes* — hay equipos en estado "Activo" sin distribuidor asignado; *durante* — se elige distribuidor y equipos, se confirma y se adjunta la guía; *después* — los equipos pasan a "Asignado al Distribuidor" y aparece una notificación simulada hacia el distribuidor.
- **Relación:** alimenta directamente `distribuidor/recepciones.html` (el lote enviado aparecerá ahí como "En Tránsito"); se accede desde `asignaciones.html` o desde el botón del navbar.

### 3.2 Sección Operación

#### `mandante/autorizacion-movimientos.html` — Autorización de Movimientos
- **Objetivo:** que el Mandante apruebe o rechace las solicitudes de baja, cambio o envío a SSTT que genera el Distribuidor.
- **Motivo:** regla de negocio central del proyecto (RN-1): el Distribuidor **nunca** puede dar de baja un equipo por su cuenta; siempre requiere aprobación del Mandante. Sin esta vista, esa regla no tendría dónde ejecutarse.
- **Funcionalidad principal:** filtro por estado (Pendiente/Aprobada/Rechazada), tabla de solicitudes con acciones Aprobar/Rechazar/Detalles, y un modal de detalle con historial (timeline) y evidencia adjunta (fotos/documentos).
- **Flujo:** *antes* — el Distribuidor generó una solicitud desde `distribuidor/nueva-solicitud.html`; *durante* — el Mandante revisa la evidencia y decide; *después* — el estado del equipo se actualiza (ej. a "En SSTT" o "Baja") y queda registrado en `trazabilidad.html`.
- **Relación:** recibe solicitudes de `distribuidor/solicitudes-movimiento.html`; sus decisiones se reflejan en `maestro-equipos.html` y `trazabilidad.html`.

#### `mandante/consulta-inventario.html` — Consulta de Inventario
- **Objetivo:** dar visibilidad al Mandante de los inventarios físicos que cada Distribuidor gestiona, **en modo solo lectura**.
- **Motivo:** el Mandante necesita saber si hay discrepancias entre lo que el sistema dice tener y lo que el Distribuidor cuenta físicamente, pero no es su responsabilidad generar o ajustar esos inventarios (eso es exclusivo del Distribuidor).
- **Funcionalidad principal:** filtros por Distribuidor/Estado/fechas, tabla de inventarios con expansión de detalle (Equipo | Inventario Sistema | Inventario Físico | Diferencia).
- **Flujo:** *antes* — un Distribuidor generó y cerró un inventario; *durante* — el Mandante lo consulta para auditar discrepancias; *después* — no hay acción posterior desde esta vista (es informativa).
- **Relación:** es el espejo de solo lectura de todo el flujo de inventario del Distribuidor (`inventario.html` → `solicitud-inventario.html` → `registro-conteo.html` → `ajuste-inventario.html`).

#### `mandante/trazabilidad.html` — Trazabilidad de Equipo
- **Objetivo:** consultar el historial completo de un equipo específico.
- **Motivo:** resuelve la frustración explícita del Mandante de "no tener trazabilidad histórica de por dónde ha pasado una máquina" (ver `../md/user_personas.md`).
- **Funcionalidad principal:** buscador por N° de serie, card con datos actuales del equipo, y una línea de tiempo (timeline) vertical con cada evento (registro, asignación, recepción, asignación a cliente, envío a SSTT, baja) con fecha, actor y comentario.
- **Flujo:** *antes* — el usuario necesita investigar un equipo puntual (ej. por una disputa o auditoría); *durante* — busca por serie y revisa el historial; *después* — puede usar la información para decidir en `autorizacion-movimientos.html`.
- **Relación:** se accede también desde `maestro-equipos.html` (botón "Ver detalle" de un equipo); consolida eventos generados por casi todas las demás vistas.

#### `mandante/guias-despacho.html` — Guías de Despacho (Mandante)
- **Objetivo:** listado centralizado de todas las Guías de Despacho (GD) del flujo: las que el Mandante adjunta al asignar equipos, y las que cada Distribuidor genera o adjunta al despachar a un cliente final.
- **Motivo:** el requisito de negocio RN-8 exige generar/controlar guías de despacho para el traslado físico de las máquinas; esta vista da visibilidad consolidada al Mandante sobre el cumplimiento de ese requisito en toda la red de distribuidores.
- **Funcionalidad principal:** 4 KPI (Total GD, PDF adjuntos, Generadas por distribuidores, Pendientes), filtros (tipo, distribuidor, estado, fechas), tabla con acciones "Ver" y "Descargar PDF".
- **Flujo:** *antes* — se ejecutó una asignación (`asignacion-equipos.html`) o una asignación a cliente (`distribuidor/asignaciones-realizadas.html`); *durante* — el Mandante audita que las guías existan y estén correctas; *después* — no aplica acción transaccional, es de consulta.
- **Relación:** consolida datos generados en `asignacion-equipos.html` (Mandante→Distribuidor) y en `distribuidor/asignaciones-realizadas.html` (Distribuidor→Cliente).

### 3.3 Sección Análisis

#### `mandante/informes.html` — Informes
- **Objetivo:** entregar indicadores de negocio y geolocalización de los activos.
- **Motivo:** cubre la necesidad de "visualizar la distribución geográfica de los activos y su rendimiento comercial" (persona Marcela, `user_personas.md`).
- **Funcionalidad principal:** 4 pestañas — Geolocalización (mapa con pines, filtros por tipo de máquina/distribuidor), Piramidal de Ventas (barras), Rendimiento por Equipo (ventas vs. equipos asignados), Servicio Técnico (tabla de equipos en SSTT con SLA y días en reparación).
- **Flujo:** *antes* — existen datos de ventas notificados por los ERP de los distribuidores (vía API, fuera del alcance visual del prototipo) y equipos con ubicación; *durante* — el usuario filtra por fecha/tipo/distribuidor; *después* — no hay transacción, es de consulta.
- **Relación:** consume datos de `maestro-equipos.html` (ubicación/tipo), `gestores.html` (filtro por distribuidor) y `servicio-tecnico.html` (SLA).

### 3.4 Sección Maestros

Los "maestros" son catálogos administrables por el Mandante. Todos siguen un patrón común de CRUD: tabla con buscador/filtros, botón para agregar (modal), acciones de editar y activar/desactivar por fila. A continuación el detalle de cada uno (objetivo y a qué otras vistas alimenta), según `../md/maestros.md` §1 y §3.1, verificado contra el prototipo:

| Vista | Objetivo / qué resuelve | Alimenta a |
|---|---|---|
| `maestro-equipos.html` — **Equipos** | Registro central de todos los activos fríos (N° de serie, marca, modelo, estado, distribuidor). Es la entidad núcleo del sistema: casi todo proceso referencia un equipo por su serie. | Asignación, Recepción, Asignación a Clientes, Solicitudes, Trazabilidad, Inventario, Informes, Guías de Despacho |
| `gestores.html` — **Gestores (Distribuidores)** | Alta y administración de distribuidores autorizados (RUT, dirección, estado, tipo de integración ERP: Isstec/SAP/Odoo/Otro). El tipo de ERP decide si la GD se genera automática o vía PDF adjunto (RN-16). | Asignación de Equipos, Autorización, Informes, Guías de Despacho |
| `servicio-tecnico.html` — **Servicio Técnico** | Catálogo de proveedores de SSTT autorizados, con su SLA en días para medir atrasos en reparación. | Solicitud de Movimiento, Informes (tab SSTT) |
| `grupo-maquinas.html` — **Grupo de Máquinas** | Clasificación por tamaño (Grande, Mediana, Pequeña, Barquilleras), heredada del ERP Isstec. | Maestro de Equipos, Informes, matching de ventas |
| `familia-maquinas.html` — **Familia de Máquinas** | Clasificación por tipo de mueble (Vitrina, Vertical, Barquillera, Congelados, etc.). Es clave para el "matching" de ventas contra tipo de máquina (RN-14) cuando el ERP no identifica el N° de serie exacto. | Maestro de Equipos, Informes |
| `ubicaciones-bodegas.html` — **Ubicaciones / Bodegas** | Lugares físicos (bodegas del Mandante o del Distribuidor, puntos de retiro) donde puede estar un equipo. Da un origen/destino normalizado a cada movimiento en vez de texto libre. | Recepción, Trazabilidad, Informes, Inventario |
| `motivos-movimiento.html` — **Motivos de Movimiento** | Catálogo administrable de razones por las que se mueve un equipo (asignación, baja, cambio, reparación, devolución). Normaliza el reporting (ej. cuántas bajas por robo vs. daño). | Solicitud de Movimiento, Autorización, Trazabilidad |
| `tipos-solicitud.html` — **Tipos de Solicitud** | Catálogo estandarizado **por el Mandante** de todos los tipos de solicitud de la plataforma (Baja definitiva, Envío a SSTT, Cambio de equipo, Retorno al Mandante, Solicitud de Inventario), indicando cuáles requieren aprobación. | Solicitud de Movimiento, Autorización, Gestión de Inventario |
| `plantillas-inspeccion.html` — **Plantillas de Inspección** | Listas de verificación configurables para la inspección visual de equipos en la recepción del Distribuidor. Da respaldo objetivo ante disputas. | Recepción de Equipos (checklist) |
| `marcas.html` — **Marcas** | Catálogo de marcas de equipos (Savory, Coldex, etc.), normalizando un campo que antes era texto libre. | Maestro de Equipos, Modelos, Informes |
| `modelos.html` — **Modelos** | Catálogo de modelos vinculados a una Marca, con Familia, Grupo y Capacidad. Requiere una Marca existente para poder crearse. | Maestro de Equipos, Asignación, Recepción, Informes |
| `tipos-incidencias.html` — **Tipos de Incidencias / Catálogo de Fallas** | Catálogo de fallas/siniestros que puede sufrir un equipo, indicando si requiere derivación a SSTT. Alimenta el dropdown de "Motivo" al reportar un problema en la recepción. | Recepción de Equipos (motivo de rechazo), Solicitud de Movimiento |

### 3.5 Sección Configuración

#### `mandante/usuarios.html` — Usuarios
- **Objetivo:** administrar las cuentas de personas que operan el panel Mandante.
- **Motivo:** control de acceso — define quién puede operar como Mandante.
- **Funcionalidad principal:** tabla con nombre, RUT, email, rol (Administrador/Supervisor/Operador/Solo Lectura), estado y último acceso; filtros por RUT/nombre/rol/estado; modal para agregar/editar usuario.
- **Flujo:** *antes* — se necesita dar acceso a un nuevo colaborador; *durante* — se completa el modal con sus datos y rol; *después* — el usuario queda disponible para iniciar sesión (simulado).
- **Relación:** el rol asignado aquí determina qué permisos se configuran en `roles.html`.

#### `mandante/roles.html` — Roles
- **Objetivo:** definir qué puede hacer cada perfil de usuario dentro del panel.
- **Motivo:** cubre AUTH-2 (gestión de roles y permisos) — sin esto, todos los usuarios tendrían el mismo nivel de acceso.
- **Funcionalidad principal:** tabla de roles y, al agregar/editar uno, un acordeón de permisos agrupados por sección (Principal, Operación, etc.) con checkboxes por funcionalidad (ej. "Asignación de Equipos", "Autorización de Movimientos").
- **Flujo:** *antes* — se definieron los usuarios; *durante* — se ajustan permisos por rol; *después* — los permisos condicionan (conceptualmente) qué ve cada usuario al iniciar sesión.
- **Relación:** trabaja en conjunto con `usuarios.html`.

---

## 4. Panel del Distribuidor

Usuario tipo: operador logístico del distribuidor (ej. IceFree). Su rol es recibir e inspeccionar los equipos que le asigna el Mandante, entregarlos a sus clientes finales, gestionar su propio inventario físico y solicitar movimientos/bajas cuando corresponda.

### 4.1 Sección Principal

#### `distribuidor/dashboard.html` — Dashboard Distribuidor
- **Objetivo:** panorama operativo diario del Distribuidor.
- **Motivo:** Rodrigo (persona del Distribuidor) necesita saber rápidamente cuántos equipos tiene pendientes de inspeccionar o asignar sin revisar planillas.
- **Funcionalidad principal:** 4 KPI (Pendientes de inspección, Asignados a clientes, Pendientes de asignar, Solicitudes en curso), lista de notificaciones recientes, gráfico de dona de distribución de equipos.
- **Flujo:** *antes* — inicia sesión; *durante* — revisa KPIs y notificaciones (ej. "nuevo lote recibido"); *después* — navega a `recepciones.html` si hay un lote nuevo, o a cualquier otra vista.
- **Relación:** punto de partida hacia todo el panel Distribuidor.

#### `distribuidor/recepciones.html` — Recepción de Equipos (listado de lotes)
- **Objetivo:** listar los lotes enviados por el Mandante y su estado de proceso.
- **Motivo:** formaliza el paso "el Distribuidor recibe notificación de que debe cargar máquinas" del flujo de negocio original (PDF de flujo de carga).
- **Funcionalidad principal:** KPIs por estado de lote (En Tránsito, Pendiente de Inspección, Recibidos, Con Problema, Rechazados), tabla con acciones según estado — **"Registrar llegada"** (transiciona el lote de "En Tránsito" a "Pendiente de Inspección" vía un modal, sin recargar la página) e **"Inspeccionar"/"Continuar"** (lleva a la inspección detallada).
- **Flujo:** *antes* — el Mandante confirmó una asignación en `mandante/asignacion-equipos.html`; *durante* — el Distribuidor registra la llegada física del lote; *después* — pasa a `recepcion-equipos.html` para la inspección uno a uno.
- **Relación:** recibe lotes generados en `mandante/asignacion-equipos.html`; enlaza a `recepcion-equipos.html`.

#### `distribuidor/recepcion-equipos.html` — Recepción de Equipos (inspección)
- **Objetivo:** inspeccionar visualmente cada equipo de un lote y decidir si se acepta o se reporta con problema.
- **Motivo:** resuelve directamente la pregunta de negocio "¿qué pasa si el Distribuidor acepta por error una máquina en mal estado?" — obliga a una inspección explícita antes de aceptar (RN visible en `business_rules_and_open_questions.md`).
- **Funcionalidad principal:** tabla de equipos del lote con acciones "Aceptar"/"Reportar Problema" por fila, botones masivos "Aceptar Todo"/"Reportar Todo" (con modal de confirmación porque omiten la inspección individual), formulario inline de Motivo (alimentado desde el maestro **Tipos de Incidencias** del Mandante) al reportar un problema, barra de progreso y botón "Confirmar recepción".
- **Flujo:** *antes* — el lote está en "Pendiente de Inspección" o "En Inspección"; *durante* — se revisa equipo por equipo; *después* — los equipos aceptados quedan disponibles para asignar a clientes; los con problema quedan "Pendiente de Revisión"; si **todo** el lote se reporta con problema, el lote completo queda "Rechazado" a la espera de que el Mandante lo retire (mismo mecanismo que un rechazo individual, RN-9).
- **Relación:** equipos aceptados aquí alimentan `asignacion-clientes.html`; equipos con problema generan la notificación que verá el Mandante en `mandante/autorizacion-movimientos.html`/`trazabilidad.html`.

#### `distribuidor/asignaciones-realizadas.html` — Asignación a Clientes (listado)
- **Objetivo:** listar las asignaciones de equipos ya entregados a clientes finales (puntos de venta).
- **Motivo:** da trazabilidad de qué equipo quedó en qué punto de venta, y centraliza la gestión de la Guía de Despacho de ese tramo del proceso (Distribuidor→Cliente).
- **Funcionalidad principal:** KPIs (Asignados a clientes, En SSTT, Retirados/Devueltos, Clientes activos), tabla con estado de Guía de Despacho por fila y acciones **"Generar GD"** (simula generación automática vía ERP Isstec, con modal de 3 pasos: confirmación → spinner → éxito) y **"Subir PDF"** (para distribuidores sin sistema Isstec, con zona de drag & drop).
- **Flujo:** *antes* — hay equipos aceptados sin cliente asignado; *durante* — se revisa el listado o se crea una nueva asignación; *después* — se gestiona la Guía de Despacho de esa asignación desde esta misma tabla.
- **Relación:** el sidebar "Asignación a Clientes" dirige aquí; el botón "Nueva asignación" del navbar lleva a `asignacion-clientes.html`. Las guías generadas aquí también aparecen consolidadas en `guias-despacho.html` (Distribuidor) y en `mandante/guias-despacho.html`.

#### `distribuidor/asignacion-clientes.html` — Asignación a Clientes Finales (creación)
- **Objetivo:** vincular un equipo aceptado con un cliente final concreto.
- **Motivo:** es el paso que materializa la entrega física del equipo al punto de venta.
- **Funcionalidad principal:** dos columnas — equipos disponibles para asignar (izquierda) y puntos de venta disponibles (derecha), ambas con buscador; se selecciona un equipo y un cliente y se confirma con el botón "Asignar". El modal de confirmación aclara que la Guía de Despacho **no** se gestiona en este paso, sino después desde `asignaciones-realizadas.html`.
- **Flujo:** *antes* — el equipo está aceptado y sin cliente; *durante* — se elige el cliente destino; *después* — el equipo pasa a "Asignado a Cliente" y aparece en el listado de `asignaciones-realizadas.html`.
- **Relación:** se accede desde el botón "Nueva asignación" del navbar o desde `asignaciones-realizadas.html`; depende de `clientes.html` para tener puntos de venta disponibles.

### 4.2 Sección Operación

#### `distribuidor/solicitudes-movimiento.html` — Solicitudes de Movimiento (listado)
- **Objetivo:** listar las solicitudes de baja, cambio, envío a SSTT o retorno que el Distribuidor ha enviado al Mandante.
- **Motivo:** da seguimiento a solicitudes que, por regla de negocio (RN-1), el Distribuidor no puede resolver unilateralmente.
- **Funcionalidad principal:** tabla con Equipo, Tipo, Fecha, Estado (Pendiente/Aprobada/Rechazada) y Resultado.
- **Flujo:** *antes* — un equipo presenta un problema (robo, falla, fin de contrato); *durante* — se revisa el estado de solicitudes ya enviadas o se crea una nueva; *después* — si la solicitud es aprobada por el Mandante, el estado del equipo se actualiza.
- **Relación:** el sidebar dirige aquí; el botón "Nueva solicitud" lleva a `nueva-solicitud.html`; las solicitudes se resuelven en `mandante/autorizacion-movimientos.html`.

#### `distribuidor/nueva-solicitud.html` — Nueva Solicitud de Movimiento (creación)
- **Objetivo:** crear una solicitud formal dirigida al Mandante.
- **Motivo:** reemplaza la "comunicación informal con el Mandante" que hoy usan los distribuidores (frustración documentada en `user_personas.md`, persona Rodrigo).
- **Funcionalidad principal:** formulario con buscador de equipo (autocompletado por N° de serie), tipo de solicitud (alimentado desde el maestro **Tipos de Solicitud** del Mandante), motivo (texto) y zona de carga de evidencia (fotos/documentos, múltiples archivos).
- **Flujo:** *antes* — se detectó un problema con un equipo; *durante* — se completa el formulario y se adjunta evidencia; *después* — la solicitud queda "Pendiente de Aprobación" y aparece en la bandeja del Mandante.
- **Relación:** se accede desde `solicitudes-movimiento.html` o el botón del navbar; depende del maestro `mandante/tipos-solicitud.html`.

#### `distribuidor/inventario.html` — Gestión de Inventario (listado)
- **Objetivo:** listar las solicitudes de toma de inventario físico gestionadas por el Distribuidor.
- **Motivo:** cubre la "Capa 1" de inventario definida en `PROPOSAL.md` (gestión web de solicitudes/conteo/ajustes), distinta de la auditoría física con GPS/fotos que depende de una futura app móvil (fuera de alcance).
- **Funcionalidad principal:** KPIs (En curso, En ajuste, Finalizados, Total), tabla con acciones según estado — **"Registrar conteo"** (en curso) y **"Ajustar"** (en ajuste).
- **Flujo:** *antes* — se necesita verificar el inventario físico en terreno; *durante* — se revisa el listado o se crea una nueva solicitud; *después* — cada solicitud avanza por el flujo de sub-vistas descrito abajo.
- **Relación:** el sidebar dirige aquí; alimenta a `solicitud-inventario.html`, `registro-conteo.html` y `ajuste-inventario.html`. También es la fuente de datos de `mandante/consulta-inventario.html` (solo lectura).

#### `distribuidor/solicitud-inventario.html` — Nueva Solicitud de Inventario (creación)
- **Objetivo:** iniciar una nueva toma de inventario.
- **Motivo:** define el alcance de la toma (a quién y cuándo aplica) antes del conteo físico.
- **Funcionalidad principal:** formulario con filtros opcionales "por vendedor" y "por comuna", rango de fechas obligatorio y observación.
- **Flujo:** *antes* — no existe solicitud activa para ese alcance; *durante* — se define el alcance y fechas; *después* — la solicitud queda "En curso", pendiente de que se registre el conteo físico.
- **Relación:** primer paso del flujo de inventario; continúa en `registro-conteo.html`.

#### `distribuidor/registro-conteo.html` — Registro de Conteo (físico)
- **Objetivo:** ingresar manualmente el resultado del conteo físico de equipos.
- **Motivo:** cierra un hueco identificado en el flujo original: sin este paso no existían valores de "Inventario Físico" con los que comparar ni ajustar.
- **Funcionalidad principal:** tabla de equipos con Inventario Sistema (valor esperado) vs. Inventario Físico (input editable), diferencia calculada automáticamente, barra de progreso, botones "Guardar progreso" y "Finalizar inventario" (deshabilitado hasta completar todos los equipos).
- **Flujo:** *antes* — existe una solicitud "En curso" (`solicitud-inventario.html`); *durante* — personal en terreno cuenta y se ingresan los valores; *después* — el inventario pasa a "Finalizado" (sin discrepancias) o "En ajuste" (con discrepancias).
- **Relación:** paso intermedio entre `solicitud-inventario.html` y `ajuste-inventario.html`.

#### `distribuidor/ajuste-inventario.html` — Ajuste de Inventario
- **Objetivo:** corregir el valor del sistema según las discrepancias detectadas en el conteo físico.
- **Motivo:** sin ajuste, el sistema seguiría mostrando datos desactualizados respecto a la realidad física.
- **Funcionalidad principal:** tabla comparativa (Sistema vs. Físico vs. Diferencia) con botón "Corregir" por fila y botón "Confirmar ajustes" (siempre habilitado; permite aceptar las diferencias tal cual si no se corrige nada).
- **Flujo:** *antes* — el inventario quedó "En ajuste" tras el conteo; *durante* — se corrigen (o no) las discrepancias; *después* — el inventario pasa a "Finalizado".
- **Relación:** último paso del flujo `inventario.html` → `solicitud-inventario.html` → `registro-conteo.html` → `ajuste-inventario.html`.

#### `distribuidor/guias-despacho.html` — Guías de Despacho (Distribuidor)
- **Objetivo:** listado centralizado de las guías de despacho asociadas al distribuidor (recepción Mandante→Distribuidor y despacho Distribuidor→Cliente).
- **Motivo:** da al Distribuidor una vista única de cumplimiento documental, en vez de buscar la guía en cada asignación individual.
- **Funcionalidad principal:** KPIs (Total GD, Generadas automáticamente, PDF adjuntos, Pendientes), filtros, tabla con acciones Ver/Generar GD/Subir PDF/Descargar PDF.
- **Flujo:** *antes* — existen asignaciones con o sin guía; *durante* — se revisan o gestionan las guías pendientes; *después* — no hay paso posterior, es de consulta/gestión documental.
- **Relación:** las mismas acciones de generar/subir GD también están disponibles directamente en `asignaciones-realizadas.html`; se refleja en `mandante/guias-despacho.html`.

### 4.3 Sección Análisis

#### `distribuidor/reportes.html` — Reportes
- **Objetivo:** analizar ventas y rendimiento comercial de los equipos asignados a cada cliente.
- **Motivo:** cubre la necesidad de Rodrigo (persona) de "ver el rendimiento de ventas de cada punto de venta versus el equipo asignado".
- **Funcionalidad principal:** 3 pestañas — "Ventas y Rendimiento" (gráfico de barras + tabla de rendimiento por equipo), "Cliente–Máquina" (relación cliente↔equipo↔ventas), "Geolocalización" (mapa de equipos asignados a clientes).
- **Flujo:** *antes* — existen ventas notificadas por el ERP del distribuidor y equipos asignados a clientes; *durante* — se filtra por fecha/cliente/comuna; *después* — es de consulta, sin transacción posterior.
- **Relación:** consume datos de `clientes.html` y de las asignaciones realizadas.

### 4.4 Sección Maestros

#### `distribuidor/clientes.html` — Clientes
- **Objetivo:** administrar los puntos de venta (clientes finales) del distribuidor.
- **Motivo:** sin un cliente sincronizado no se puede asignar ningún equipo a un punto de venta; según la documentación, este dato se sincroniza automáticamente vía API desde el ERP del distribuidor, con carga manual como respaldo.
- **Funcionalidad principal:** tabla de clientes (nombre, dirección, comuna) con buscador y CRUD.
- **Flujo:** *antes* — no hay puntos de venta disponibles para asignar equipos; *durante* — se sincronizan o cargan manualmente; *después* — quedan disponibles en `asignacion-clientes.html`.
- **Relación:** alimenta `asignacion-clientes.html`, `guias-despacho.html`, `reportes.html` e `inventario.html` (filtro por comuna).

#### `distribuidor/vendedores.html` — Vendedores
- **Objetivo:** administrar los vendedores del distribuidor.
- **Motivo:** se usa como filtro operativo para dirigir solicitudes de inventario a un subconjunto de clientes, y para asignar clientes por vendedor.
- **Funcionalidad principal:** CRUD completo con tabla (nombre, RUT, teléfono, email, clientes asignados, estado) y un modal adicional para asignar clientes a cada vendedor.
- **Flujo:** *antes* — se necesita organizar la cartera de clientes por responsable; *durante* — se crea el vendedor y se le asignan clientes; *después* — el vendedor queda disponible como filtro en `solicitud-inventario.html`.
- **Relación:** alimenta `solicitud-inventario.html` (filtro "por vendedor") y `asignacion-clientes.html`.

#### `distribuidor/ubicaciones-bodegas.html` — Ubicaciones / Bodegas
- **Objetivo:** administrar bodegas y puntos de retiro propios del Distribuidor.
- **Motivo:** da un origen/destino físico normalizado a los movimientos de equipos que gestiona el propio distribuidor.
- **Funcionalidad principal:** tabla con CRUD (nombre, dirección, tipo, responsable, estado) — pantalla completamente funcional en el prototipo (ver discrepancia documental en sección 7).
- **Flujo:** *antes* — no hay bodegas registradas; *durante* — se dan de alta; *después* — quedan disponibles como referencia en procesos de recepción/inventario.
- **Relación:** complementa al maestro homónimo del Mandante (`mandante/ubicaciones-bodegas.html`), pero administra las bodegas propias del distribuidor.

### 4.5 Sección Configuración

#### `distribuidor/usuarios.html` — Usuarios
- **Objetivo y funcionalidad:** igual que `mandante/usuarios.html`, pero para las cuentas del panel del Distribuidor (tabla con CRUD de nombre, RUT, email, rol, estado, último acceso).
- **Relación:** trabaja junto con `roles.html`.

#### `distribuidor/roles.html` — Roles
- **Objetivo y funcionalidad:** igual que `mandante/roles.html`, pero define permisos para los perfiles del Distribuidor (acordeón de permisos por sección del sidebar).
- **Relación:** trabaja junto con `usuarios.html`.

---

## 5. Flujos de extremo a extremo (cómo se conectan las vistas entre paneles)

Para entender el prototipo como un todo, estos son los 4 recorridos completos que atraviesan ambos paneles:

1. **Ciclo de vida de un equipo:** `mandante/maestro-equipos.html` (alta) → `mandante/asignacion-equipos.html` (asignación + GD) → `distribuidor/recepciones.html` (llegada del lote) → `distribuidor/recepcion-equipos.html` (inspección: aceptar o reportar problema) → `distribuidor/asignacion-clientes.html` (entrega a punto de venta) → `distribuidor/asignaciones-realizadas.html` (gestión de GD del despacho) → eventualmente `distribuidor/nueva-solicitud.html` (si hay baja/cambio/SSTT) → `mandante/autorizacion-movimientos.html` (aprobación) → todo queda registrado en `mandante/trazabilidad.html`.
2. **Inventario del Distribuidor:** `distribuidor/inventario.html` → `distribuidor/solicitud-inventario.html` → `distribuidor/registro-conteo.html` → `distribuidor/ajuste-inventario.html`, visible en modo solo lectura para el Mandante en `mandante/consulta-inventario.html`.
3. **Guías de Despacho:** generadas/adjuntadas en `mandante/asignacion-equipos.html` (tramo Mandante→Distribuidor) y en `distribuidor/asignaciones-realizadas.html` (tramo Distribuidor→Cliente), consolidadas en `mandante/guias-despacho.html` y `distribuidor/guias-despacho.html`.
4. **Configuración de acceso:** `usuarios.html` + `roles.html` en cada panel, independientes entre Mandante y Distribuidor.

---

## 6. Documentación relacionada

| Documento | Para qué sirve |
|---|---|
| `../md/PROPOSAL.md` | Propuesta de negocio original |
| `../md/user_personas.md` | Perfiles de usuario y escenarios de uso |
| `../md/prd_features.md` | Requisitos funcionales priorizados (MoSCoW) |
| `../md/maestros.md` | Detalle y conexiones de cada maestro con las pantallas/procesos |
| `../md/business_rules_and_open_questions.md` | Reglas de negocio, modelo unificado de estados y preguntas abiertas |
| `../md/system_diagrams.md` | Diagramas de flujo, ERD y navegación |
| `../md/stitch_prompts.md` | Especificación detallada de contenido por pantalla (usada como insumo de construcción del prototipo) |
| `../md/DESIGN.md` | Sistema de diseño (colores, componentes, layouts) |

---

## 7. Diferencias detectadas entre la documentación y el prototipo

> **Actualizado tras revisión posterior:** las dos diferencias originalmente detectadas en esta sección ya fueron corregidas por el equipo en `../md/maestros.md` y `../md/stitch_prompts.md`. Se dejan documentadas igual, a modo de registro histórico de la corrección.

- ~~**Usuarios y Roles no son "stubs".**~~ **Corregido.** `maestros.md` (§1 y §2) describía estas pantallas como de solo referencia ("stubs"); en el prototipo real, tanto `mandante/usuarios.html` / `mandante/roles.html` como sus equivalentes en `distribuidor/` están **completamente implementados** (tablas con filtros, modales de alta/edición y, en Roles, un acordeón funcional de permisos por sección). `maestros.md` y `stitch_prompts.md` ya fueron actualizados para reflejar esto.
- ~~**`distribuidor/ubicaciones-bodegas.html` no es un enlace stub (`#`).**~~ **Corregido.** `maestros.md` §2 lo describía como "🔲 Enlace en sidebar (stub `#`)"; el prototipo tiene esta pantalla **totalmente construida** (tabla, filtros y modal CRUD). `maestros.md` ya fue actualizado.

**Re-verificación de esta revisión:** se confirmó que `../md/system_diagrams.md` (diagrama de navegación, §7) ya no contenía marcadores `*stub*` para estos nodos (Usuarios, Roles, Ubicaciones/Bodegas del Distribuidor), por lo que está alineado sin necesidad de cambios. La única fuente que aún contiene referencias a "stub `#`" para estos ítems es `../md/verification_report.md`, un reporte histórico de QA con fecha anterior a la implementación actual (incluso da como "no existentes" archivos como `clientes.html`, `reportes.html` o `guias-despacho.html`, que sí existen hoy en el prototipo) — no se considera documentación viva del proyecto, por lo que no constituye una discrepancia vigente.

**Conclusión: no quedan discrepancias activas** entre la documentación viva (`maestros.md`, `stitch_prompts.md`, `system_diagrams.md`, `business_rules_and_open_questions.md`) y el prototipo implementado.

---

## 8. Autoverificación

- ✅ **Cobertura de vistas:** se revisaron las 39 pantallas HTML del prototipo (1 login + 21 del panel Mandante + 17 del panel Distribuidor), confirmando su `<title>`, su `<h2 class="page-title">` y su estructura de sidebar/navbar directamente desde el código fuente.
- ✅ **Funcionalidades no omitidas:** se contrastó cada vista contra `prd_features.md` (IDs MAN-x, DIS-x, GEN-x, AUTH-x) y `maestros.md`, confirmando que todas las funcionalidades "Must/Should/Could" con pantalla implementada quedaron documentadas.
- ✅ **Consistencia de flujos:** los flujos descritos (recepción, asignación a clientes, inventario, guías de despacho) se verificaron contra las notas de navegación de `stitch_prompts.md` y contra los `href` reales del sidebar/navbar en el HTML, confirmando que los sub-flujos (listado → creación → sub-pasos) coinciden con lo implementado.
- ✅ **Comprensibilidad para no expertos:** cada vista se documentó con Objetivo, Motivo, Funcionalidad, Flujo (antes/durante/después) y Relación con otras vistas, evitando dar por sentado conocimiento previo del dominio (comodato de equipos de frío, ERP, etc.), explicando estos conceptos la primera vez que aparecen (secciones 1 y 2).
- ✅ **Diferencias documentación↔prototipo:** quedaron registradas explícitamente en la sección 7, sin alterar el resto del contenido que sí coincide entre ambas fuentes.
