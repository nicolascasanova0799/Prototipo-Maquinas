# Prototipo Maquinas — Documentación Funcional

> Documentación funcional del prototipo navegable (no funcional) de la **Plataforma de Gestión de Equipos Refrigerados** de Isstec. Cubre exclusivamente **qué hace cada vista, para quién y por qué existe** — no describe estilos visuales ni código (ver `css/styles.css` y `md/DESIGN.md` para el sistema de diseño).
>
> **Fuentes correlacionadas para esta documentación**: el HTML real de cada pantalla en este directorio (`index.html`, `mandante/*.html`, `distribuidor/*.html`) y la documentación funcional en `../md/` (`PROPOSAL.md`, `prd_features.md`, `maestros.md`, `stitch_prompts.md`, `business_rules_and_open_questions.md`, `verification_report.md`). Donde el prototipo y la documentación difieren, se documenta lo que **realmente existe en el prototipo** y se anota la discrepancia en la sección de [Inconsistencias e información faltante](#inconsistencias-e-información-faltante).

## 1. Contexto del proyecto

La plataforma resuelve la pérdida de visibilidad y control que sufre un **Mandante** (dueño de equipos de frío, ej. Savory) sobre los activos que entrega en comodato a **Distribuidores/Gestores** (ej. IceFree, Dimer) para instalarlos en puntos de venta de **Clientes finales**. Hoy ese control se lleva en planillas Excel, lo que genera pérdidas, uso indebido de los equipos y falta de trazabilidad. La plataforma reemplaza ese control manual con dos paneles web (Mandante y Distribuidor) que administran el ciclo de vida completo del equipo: carga, asignación, recepción, asignación a cliente final, inventario, movimientos/bajas e informes. Ver `../md/README.md` §1-§7 para el detalle completo del problema y la solución de negocio.

**Alcance de este prototipo**: es una maqueta HTML estática (Bootstrap 5), sin backend ni lógica real, pensada para validar el flujo de usuario y presentar la solución comercialmente.

## 2. Roles y acceso

| Rol | Descripción | Paneles disponibles en el prototipo |
|---|---|---|
| **Mandante** | Dueño de los equipos (ej. Savory). Administra maestros, asigna equipos, autoriza movimientos, consulta inventario e informes. | Completo (21 vistas) |
| **Distribuidor / Gestor** | Recibe equipos en comodato, los asigna a clientes finales, solicita movimientos y reporta inventario/ventas. | Parcial (solo Dashboard, Usuarios y Roles — ver [Inconsistencias](#inconsistencias-e-información-faltante)) |
| **Cliente final** | Punto de venta donde se instala el equipo. No es usuario del sistema en esta fase; aparece solo como dato referenciado en otras vistas. | Sin acceso |

## 3. Estructura de navegación

Ambos paneles usan un sidebar fijo agrupado en secciones **Principal · Operación · Análisis · Maestros · Configuración**, definido en `mandante/dashboard.html` y `distribuidor/dashboard.html`.

**Sidebar Mandante** (todos los enlaces resuelven a un archivo real):
`Principal`: Dashboard, Asignación de Equipos · `Operación`: Autorización de Movimientos, Consulta de Inventario, Trazabilidad · `Análisis`: Informes · `Maestros`: Equipos, Gestores, Servicio Técnico, Grupo de Máquinas, Familia de Máquinas, Ubicaciones/Bodegas, Motivos de Movimiento, Tipos de Solicitud, Plantillas de Inspección, Marcas, Modelos, Tipos de Incidencias · `Configuración`: Usuarios, Roles.

**Sidebar Distribuidor** (la mayoría de los enlaces **no** resuelven a un archivo existente — ver sección de inconsistencias):
`Principal`: Dashboard ✅, Recepción de Equipos ❌, Asignación a Clientes ❌ · `Operación`: Solicitudes de Movimiento ❌, Inventario ❌, Guías de Despacho ❌ · `Análisis`: Reportes ❌ · `Maestros`: Clientes ❌, Ubicaciones/Bodegas (enlace `#`) · `Configuración`: Usuarios ✅, Roles ✅.

---

## 4. Vista transversal — Login

### Login
- **Nombre de la vista**: Login (`index.html`)
- **Objetivo / problema que resuelve**: punto de entrada único a la plataforma; controla el acceso diferenciado por perfil (Mandante / Distribuidor).
- **Motivo por el que fue creada**: sin autenticación no existe forma de separar lo que ve y puede hacer cada actor del negocio (AUTH-1 en `prd_features.md`).
- **Funcionalidad principal**: formulario con RUT (validación de formato chileno), contraseña (con toggle mostrar/ocultar) y selector visual de rol (tarjetas radio "Mandante" / "Distribuidor"). Botón "Ingresar" con validación de campos obligatorios.
- **Flujo de usuario**: el usuario llega directamente (es la home del sitio) → ingresa RUT y contraseña → selecciona su rol manualmente → hace clic en "Ingresar" → si los datos son válidos, es redirigido a `mandante/dashboard.html` o `distribuidor/dashboard.html` según el rol elegido.
- **Relación con otras vistas**: es el punto de entrada a todas las demás vistas del prototipo; el botón "Cerrar sesión" del pie del sidebar (en cualquier vista de ambos paneles) regresa aquí.

---

## 5. Panel del Mandante

### 5.1 Dashboard Mandante
- **Nombre de la vista**: Dashboard Mandante (`mandante/dashboard.html`)
- **Objetivo / problema que resuelve**: dar al Mandante una visión general e inmediata del estado de su flota de equipos y de las solicitudes que requieren su atención, sin tener que revisar planillas.
- **Motivo por el que fue creada**: es la pantalla de aterrizaje tras el login; resume en un vistazo los indicadores clave del negocio (objetivo 1 de `md/README.md`).
- **Funcionalidad principal**: 4 KPIs (Total de Equipos, Activos, En Servicio Técnico, Solicitudes Pendientes), mapa con pines de ubicación de equipos, gráfico de dona con distribución de estados (Operativos/En SSTT/Inactivos) y tabla de "Solicitudes Pendientes" con acciones rápidas Aprobar/Rechazar.
- **Flujo de usuario**: el Mandante llega aquí tras el login → visualiza KPIs y mapa → revisa la tabla de solicitudes pendientes → puede aprobar/rechazar directamente o hacer clic en "Ver todas" para ir al detalle completo.
- **Relación con otras vistas**: enlaza a `autorizacion-movimientos.html` ("Ver todas" solicitudes); es el punto de partida de la navegación hacia todo el sidebar Mandante.

### 5.2 Asignaciones de Equipos (listado)
- **Nombre de la vista**: Asignaciones de Equipos (`mandante/asignaciones.html`)
- **Objetivo / problema que resuelve**: dar visibilidad de todas las asignaciones de lotes de equipos realizadas o en curso hacia los distribuidores, evitando perder el registro en Excel.
- **Motivo por el que fue creada**: complemento natural de la pantalla de creación/edición de asignación (`asignacion-equipos.html`); permite listar, filtrar, editar borradores y ver el detalle histórico de cada asignación (documentado como decisión de UI en `md/verification_report.md` §8).
- **Funcionalidad principal**: tabla de asignaciones con N° de asignación, distribuidor, cantidad de equipos, fecha y estado del registro (Borrador / Enviada / Completada — ver modelo unificado de estados en `md/business_rules_and_open_questions.md` §0), con acciones "Editar" (si es borrador), "Ver detalle" (si ya fue confirmada) y "Eliminar".
- **Flujo de usuario**: se accede desde el ítem "Asignación de Equipos" del sidebar (sección Principal) → el usuario revisa la lista → hace clic en "Nueva asignación" para crear una, en "Editar" para continuar un borrador, o en "Ver detalle" para revisar una ya confirmada.
- **Relación con otras vistas**: enlaza a `asignacion-equipos.html` en sus tres modos (`?mode=new`, `?mode=edit&id=...`, `?mode=view&id=...`); consume el maestro de Gestores y el Maestro de Equipos.

### 5.3 Asignación de Equipos (creación / edición / detalle)
- **Nombre de la vista**: Asignación de Equipos (`mandante/asignacion-equipos.html`)
- **Objetivo / problema que resuelve**: formalizar el traspaso de un lote de equipos del Mandante a un Distribuidor, dejando registro de la Guía de Despacho.
- **Motivo por el que fue creada**: es el flujo operativo central de la plataforma — sin asignación formal no hay forma de saber qué equipos están en poder de qué distribuidor (MAN-5 y MAN-5b en `prd_features.md`).
- **Funcionalidad principal**: selector de distribuidor destino, tabla de equipos disponibles con checkbox de selección, panel resumen sticky con el conteo de equipos seleccionados, botones "Confirmar asignación" / "Limpiar selección", y modal "Adjuntar Guía de Despacho" (carga de PDF obligatoria + N° de documento opcional). Al confirmar, el estado del equipo cambia a "Asignado al Distribuidor". Soporta 3 modos vía query string: `new` (crear), `edit` (continuar borrador) y `view` (solo lectura).
- **Flujo de usuario**: llega desde `asignaciones.html` (botón "Nueva asignación" o "Editar"/"Ver detalle") → selecciona distribuidor → marca los equipos a asignar → confirma → adjunta la Guía de Despacho en PDF → el sistema simula el cambio de estado a "Asignado al Distribuidor" y vuelve al listado.
- **Relación con otras vistas**: depende del Maestro de Equipos (`maestro-equipos.html`) y de Gestores (`gestores.html`); su resultado es consumido conceptualmente por la Trazabilidad (`trazabilidad.html`) y por la (inexistente) Recepción del Distribuidor.
- **Nota de negocio (RN-16)**: la Guía de Despacho **siempre se adjunta como PDF manual** en este flujo — el Mandante nunca la genera automáticamente.

### 5.4 Autorización de Movimientos
- **Nombre de la vista**: Autorización de Movimientos (`mandante/autorizacion-movimientos.html`)
- **Objetivo / problema que resuelve**: centralizar la aprobación/rechazo de solicitudes de baja, cambio o envío a SSTT que hace el Distribuidor, garantizando que ningún equipo se dé de baja sin el visto bueno del Mandante.
- **Motivo por el que fue creada**: formaliza la regla de negocio RN-1 ("el Distribuidor nunca puede aprobar sus propias solicitudes") y responde a MAN-6 en `prd_features.md`.
- **Funcionalidad principal**: filtro por estado (Todos/Pendiente de Aprobación/Aprobada/Rechazada), tabla con Equipo, Distribuidor, Tipo de solicitud, Motivo, Fecha, Estado y acciones (Aprobar/Rechazar/Detalles), y un modal de detalle con timeline del equipo y evidencia adjunta (fotos/documentos).
- **Flujo de usuario**: se llega desde el sidebar (Operación) o desde el Dashboard ("Ver todas") → el Mandante filtra por pendientes → abre el detalle de una solicitud para revisar evidencia → aprueba o rechaza.
- **Relación con otras vistas**: recibe solicitudes que en el flujo de negocio completo se originarían en la (inexistente) pantalla de Solicitud de Movimiento del Distribuidor; su resultado se refleja en la Trazabilidad del equipo.

### 5.5 Trazabilidad de Equipo
- **Nombre de la vista**: Trazabilidad de Equipo (`mandante/trazabilidad.html`)
- **Objetivo / problema que resuelve**: dar auditoría completa del historial de un equipo específico, respondiendo "¿dónde ha estado y qué le ha pasado a este equipo?".
- **Motivo por el que fue creada**: cubre MAN-8, una necesidad explícita del negocio para poder disputar/verificar el estado de un activo ante reclamos o pérdidas.
- **Funcionalidad principal**: buscador por N° de serie, card con la información actual del equipo (marca, modelo, estado, distribuidor, cliente) y un timeline vertical cronológico con cada evento (registro, asignación, recepción, asignación a cliente, envío a SSTT, baja) mostrando estado anterior → nuevo, actor y comentario.
- **Flujo de usuario**: se accede desde el sidebar (Operación) o desde el botón "Atrás" en el Maestro de Equipos → el usuario busca un N° de serie → revisa el card resumen y el timeline completo.
- **Relación con otras vistas**: se alcanza también desde `maestro-equipos.html` (por equipo); consolida información generada por Asignación de Equipos, Autorización de Movimientos y (conceptualmente) Recepción/Asignación a Clientes del Distribuidor.

### 5.6 Informes
- **Nombre de la vista**: Informes (`mandante/informes.html`)
- **Objetivo / problema que resuelve**: dar visibilidad analítica (geográfica, comercial y de servicio técnico) sobre la flota de equipos, más allá del seguimiento operativo puntual.
- **Motivo por el que fue creada**: agrupa cuatro funcionalidades relacionadas de análisis (MAN-9 a MAN-12) en una sola pantalla con pestañas, evitando fragmentar la navegación.
- **Funcionalidad principal**: 4 tabs — **Geolocalización** (mapa con pines, filtros por tipo de máquina/distribuidor), **Piramidal de Ventas** (gráfico de barras de ventas por equipo), **Rendimiento por Equipo** (gráfico + tabla comparando ventas vs. equipos asignados) y **Servicio Técnico** (tabla de equipos en SSTT con proveedor, SLA y días en reparación). Filtro común de rango de fechas.
- **Flujo de usuario**: se accede desde el sidebar (Análisis) → el usuario navega entre tabs según el análisis que necesite → aplica filtros → revisa gráficos/tablas resultantes.
- **Relación con otras vistas**: consume datos del Maestro de Equipos, Gestores, Servicio Técnico y Grupo/Familia de Máquinas. La nota de negocio RN-14 (matching venta↔máquina por línea de producto) es visible en los tabs de ventas/rendimiento.

### 5.7 Consulta de Inventario
- **Nombre de la vista**: Consulta de Inventario (`mandante/consulta-inventario.html`)
- **Objetivo / problema que resuelve**: permitir al Mandante ver, en modo solo lectura, el resultado de los inventarios físicos que gestiona cada Distribuidor, sin poder generarlos ni ajustarlos (esa operación es exclusiva del Distribuidor).
- **Motivo por el que fue creada**: cubre MAN-7, aclarado explícitamente en `md/maestros.md` §3.3 como una necesidad de control cruzado sin duplicar responsabilidades operativas.
- **Funcionalidad principal**: filtros por Distribuidor, Estado (En curso/Finalizado) y rango de fechas; tabla con Distribuidor, Fecha, Vendedor(es)/Comuna, Estado, N° de equipos inventariados y discrepancias detectadas; al expandir una fila se muestra el detalle (Equipo | Inventario Sistema | Inventario Físico | Diferencia), con codificación visual de diferencias positivas/negativas/cero.
- **Flujo de usuario**: se accede desde el sidebar (Operación) → el Mandante filtra por distribuidor/estado/fecha → expande una fila para revisar discrepancias puntuales.
- **Relación con otras vistas**: es la contraparte de solo lectura de la (inexistente) pantalla "Inventario" del Distribuidor, que sería quien realmente solicita, consulta y ajusta el inventario.

---

## 6. Panel del Mandante — Maestros

> Todos los maestros comparten un mismo patrón de interacción: tabla con buscador/filtros y paginación, botón "Nuevo" que abre un modal de alta, acción "Editar" por fila que abre el mismo modal precargado, y activar/desactivar como baja lógica (salvo excepciones indicadas).

### 6.1 Maestro de Equipos
- **Nombre de la vista**: Maestro de Equipos (`mandante/maestro-equipos.html`)
- **Objetivo / problema que resuelve**: es el registro central de todos los activos fríos del Mandante — sin él no hay forma de saber cuántos equipos existen ni en qué estado están.
- **Motivo por el que fue creada**: núcleo del sistema (MAN-1); todas las demás operaciones (asignación, recepción, movimientos, inventario, informes) referencian un equipo de este maestro.
- **Funcionalidad principal**: buscador por N° de serie, filtros por Estado y Distribuidor, botones "Cargar equipos manualmente" (carga Excel/CSV de respaldo) y "Nuevo equipo" (modal de alta individual); tabla con N° Serie, Marca, Modelo, Tipo, Estado (badge), Distribuidor, Cliente/Ubicación, Condición y Última actualización; acciones "Ver detalle" y "Editar" por fila; paginación.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario busca/filtra equipos → puede dar de alta uno nuevo, editarlo o revisar su detalle → desde el detalle puede navegar a la Trazabilidad del equipo.
- **Relación con otras vistas**: alimenta Asignación de Equipos, Autorización de Movimientos, Trazabilidad, Consulta de Inventario e Informes; depende de los maestros Marcas, Modelos, Grupo y Familia de Máquinas y Gestores.

### 6.2 Gestores (Distribuidores)
- **Nombre de la vista**: Gestores (`mandante/gestores.html`)
- **Objetivo / problema que resuelve**: administrar el alta y estado de los distribuidores autorizados a recibir equipos en comodato.
- **Motivo por el que fue creada**: cubre MAN-4; sin un maestro de distribuidores no se podría filtrar ni restringir a quién se le asignan equipos.
- **Funcionalidad principal**: tabla con Nombre, RUT, Dirección, Estado (Activo/Inactivo), N° de equipos asignados y tipo de integración ERP (Isstec/SAP/Odoo/Otro, mostrado como subtítulo bajo el nombre); botón "Agregar distribuidor" y modal CRUD.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario da de alta o edita un distribuidor → define su tipo de integración ERP (dato clave para decidir si la Guía de Despacho se genera automática o se adjunta manualmente, RN-16).
- **Relación con otras vistas**: es dropdown obligatorio en Asignación de Equipos y filtro en Maestro de Equipos, Autorización de Movimientos e Informes. Solo distribuidores en estado Activo pueden recibir asignaciones.

### 6.3 Servicio Técnico
- **Nombre de la vista**: Servicio Técnico (`mandante/servicio-tecnico.html`)
- **Objetivo / problema que resuelve**: registrar los proveedores de SSTT autorizados y su SLA comprometido, para poder medir atrasos en reparación.
- **Motivo por el que fue creada**: cubre MAN-3; necesario para que Autorización de Movimientos e Informes puedan referenciar a quién se envía un equipo a reparar y en cuánto tiempo debería volver.
- **Funcionalidad principal**: tabla con Nombre, RUT, Dirección, SLA (días) y Estado; modal CRUD de alta/edición.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario administra el catálogo de proveedores SSTT.
- **Relación con otras vistas**: consumido por el tab "Servicio Técnico" de Informes (SLA y días en reparación) y conceptualmente por la Solicitud de Movimiento del Distribuidor (envío a SSTT).

### 6.4 Grupo de Máquinas
- **Nombre de la vista**: Grupo de Máquinas (`mandante/grupo-maquinas.html`)
- **Objetivo / problema que resuelve**: clasificar los equipos por tamaño físico (Grande, Mediana, Pequeña, Barquilleras), heredado del catálogo `grupo_maquina` del ERP Isstec.
- **Motivo por el que fue creada**: cubre MAN-13; normaliza un dato que antes era texto libre, mejorando filtros y reportes.
- **Funcionalidad principal**: tabla con código, nombre, descripción, N° de equipos y estado; modal CRUD.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración simple de catálogo.
- **Relación con otras vistas**: usado como clasificación en Modelos y en el Maestro de Equipos; filtra en Informes.

### 6.5 Familia de Máquinas
- **Nombre de la vista**: Familia de Máquinas (`mandante/familia-maquinas.html`)
- **Objetivo / problema que resuelve**: clasificar los equipos por tipo de mueble (Vitrina, Vertical, Barquillera, Congelados, Batidora, Exhibidor, Impulsivo).
- **Motivo por el que fue creada**: cubre MAN-14; es la clasificación clave para el **matching venta↔máquina** (RN-14) cuando el ERP del distribuidor no identifica el N° de serie exacto de la venta.
- **Funcionalidad principal**: tabla con código, nombre, descripción, N° de equipos y estado; modal CRUD.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración simple de catálogo.
- **Relación con otras vistas**: usado en Modelos y Maestro de Equipos; clave para agrupar ventas en Informes cuando falta el N° de serie exacto.

### 6.6 Ubicaciones / Bodegas
- **Nombre de la vista**: Ubicaciones / Bodegas (`mandante/ubicaciones-bodegas.html`)
- **Objetivo / problema que resuelve**: dar un origen/destino físico normalizado a cada movimiento de equipo (bodegas del Mandante, del Distribuidor, puntos de retiro), en vez de usar texto libre.
- **Motivo por el que fue creada**: base para la trazabilidad y la geolocalización de equipos.
- **Funcionalidad principal**: tabla con nombre, dirección, tipo, responsable y estado; modal CRUD.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración simple de catálogo.
- **Relación con otras vistas**: usada conceptualmente por la (inexistente) Recepción de Equipos del Distribuidor, por Trazabilidad e Informes/Geolocalización.

### 6.7 Motivos de Movimiento
- **Nombre de la vista**: Motivos de Movimiento (`mandante/motivos-movimiento.html`)
- **Objetivo / problema que resuelve**: estandarizar las razones por las que se mueve un equipo (asignación, baja, cambio, reparación, devolución), para poder reportarlas de forma consistente.
- **Motivo por el que fue creada**: cubre MAN-16; antes era un enum fijo del ERP, aquí se vuelve administrable por el Mandante.
- **Funcionalidad principal**: tabla con código, nombre, descripción, si requiere aprobación y estado; modal CRUD.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración del catálogo de motivos.
- **Relación con otras vistas**: es dropdown en la (inexistente) Solicitud de Movimiento del Distribuidor y criterio de decisión en Autorización de Movimientos; también aparece en Trazabilidad.

### 6.8 Tipos de Solicitud
- **Nombre de la vista**: Tipos de Solicitud (`mandante/tipos-solicitud.html`)
- **Objetivo / problema que resuelve**: evitar que cada distribuidor invente sus propias categorías de solicitud, estandarizando qué tipos existen en toda la plataforma y cuáles requieren aprobación del Mandante.
- **Motivo por el que fue creada**: cubre MAN-18; se separó de Motivos de Movimiento (04/07/2026) porque los motivos catalogan *por qué* se mueve un equipo y los tipos de solicitud catalogan *qué tipos de trámite existen* (algunos con motivo asociado, otros sin él, ej. "Solicitud de Inventario").
- **Funcionalidad principal**: tabla con código, nombre, descripción, motivo de movimiento asociado (opcional), si requiere aprobación y estado; modal CRUD.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → el Mandante administra el catálogo; el Distribuidor solo selecciona de los tipos disponibles (en pantallas que en este prototipo aún no existen para el Distribuidor).
- **Relación con otras vistas**: dropdown en la (inexistente) Solicitud de Movimiento; columna "Tipo solicitud" en Autorización de Movimientos y Trazabilidad.

### 6.9 Plantillas de Inspección
- **Nombre de la vista**: Plantillas de Inspección (`mandante/plantillas-inspeccion.html`)
- **Objetivo / problema que resuelve**: estandarizar qué se revisa al inspeccionar un equipo recibido, dando respaldo objetivo ante disputas Mandante↔Distribuidor sobre el estado de un equipo.
- **Motivo por el que fue creada**: cubre MAN-17 (prioridad Could); checklist configurable en lugar de criterios informales.
- **Funcionalidad principal**: tabla con nombre, descripción, ítems de la plantilla, a qué aplica y estado; modal CRUD principal + modal secundario para administrar los ítems de cada plantilla.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → el Mandante define o edita una plantilla y sus ítems de verificación.
- **Relación con otras vistas**: se usaría como checklist en la (inexistente) pantalla de Recepción de Equipos del Distribuidor.

### 6.10 Marcas
- **Nombre de la vista**: Marcas (`mandante/marcas.html`)
- **Objetivo / problema que resuelve**: normalizar la marca del equipo (Savory, Coldex, Indura, etc.) como catálogo en vez de texto libre.
- **Motivo por el que fue creada**: mejora la calidad de datos y la consistencia de filtros en Maestro de Equipos e Informes.
- **Funcionalidad principal**: tabla con código, nombre, descripción, N° de modelos asociados y estado; modal CRUD completo (listar, agregar, editar, activar/desactivar) con paginación.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración del catálogo de marcas.
- **Relación con otras vistas**: es FK obligatoria al crear un registro en Modelos; dropdown en Maestro de Equipos; filtro en Informes.

### 6.11 Modelos
- **Nombre de la vista**: Modelos (`mandante/modelos.html`)
- **Objetivo / problema que resuelve**: normalizar el modelo del equipo y vincularlo a su clasificación completa (Marca, Familia, Grupo, Capacidad).
- **Motivo por el que fue creada**: complementa a Marcas para mejorar la calidad de datos en la carga manual y la consistencia de los filtros de todo el sistema.
- **Funcionalidad principal**: tabla con código, nombre, marca, familia, grupo, capacidad y estado; buscador, filtro por marca, modal CRUD completo con paginación.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario filtra por marca → agrega o edita un modelo, seleccionando su marca, familia y grupo.
- **Relación con otras vistas**: dropdown en Maestro de Equipos; columna en Asignación de Equipos; filtro en Informes. Depende de Marcas, Familia de Máquinas y Grupo de Máquinas.

### 6.12 Tipos de Incidencias / Catálogo de Fallas
- **Nombre de la vista**: Tipos de Incidencias (`mandante/tipos-incidencias.html`)
- **Objetivo / problema que resuelve**: catalogar los tipos de fallas o siniestros (pérdida, robo, destrucción, daño) que puede sufrir un equipo, con su severidad y categoría.
- **Motivo por el que fue creada**: corresponde al Módulo de Siniestros e Incidencias (GEN-3 en `prd_features.md`).
- **Funcionalidad principal**: tabla con código, categoría, severidad y si requiere derivación a SSTT; modal CRUD.
- **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración del catálogo de fallas.
- **Relación con otras vistas**: se referenciaría al reportar un problema en la (inexistente) Recepción de Equipos del Distribuidor y en Solicitud de Movimiento.

---

## 7. Configuración (ambos paneles)

### 7.1 Usuarios
- **Nombre de la vista**: Usuarios (`mandante/usuarios.html` y `distribuidor/usuarios.html`)
- **Objetivo / problema que resuelve**: administrar las cuentas de las personas que operan la plataforma dentro de cada organización (Mandante o Distribuidor).
- **Motivo por el que fue creada**: soporta el control de acceso diferenciado exigido por AUTH-2.
- **Funcionalidad principal**: tabla de usuarios con acciones de alta/edición (estructura equivalente en ambos paneles, con contenido propio para cada rol).
- **Flujo de usuario**: se accede desde el sidebar (Configuración) → el administrador da de alta un usuario y le asigna un rol del catálogo de Roles.
- **Relación con otras vistas**: depende del maestro de Roles; define quién puede operar como Mandante o Distribuidor.

### 7.2 Roles
- **Nombre de la vista**: Roles (`mandante/roles.html` y `distribuidor/roles.html`)
- **Objetivo / problema que resuelve**: definir perfiles de acceso con distintos niveles de permiso dentro de cada panel.
- **Motivo por el que fue creada**: cubre AUTH-2 (Should); necesario para no dar acceso total a todos los usuarios de una organización.
- **Funcionalidad principal**: tabla de roles con acción "Agregar rol", que abre un modal con un acordeón de permisos agrupado por sección del sidebar (Principal, Operación, etc.), permitiendo marcar qué módulos puede ver/editar cada rol.
- **Flujo de usuario**: se accede desde el sidebar (Configuración) → el administrador crea o edita un rol → marca los permisos por sección/pantalla en el acordeón → guarda.
- **Relación con otras vistas**: es prerrequisito de Usuarios; sus permisos referencian, uno a uno, las pantallas del sidebar de cada panel.

---

## 8. Panel del Distribuidor

> **Advertencia de cobertura**: de las 8 vistas funcionales que la documentación de negocio define para el Distribuidor, en este prototipo **solo existe el Dashboard**. Usuarios y Roles también existen pero son de Configuración, no de operación de negocio. Ver detalle completo en [Inconsistencias](#inconsistencias-e-información-faltante).

### 8.1 Dashboard Distribuidor
- **Nombre de la vista**: Dashboard Distribuidor (`distribuidor/dashboard.html`)
- **Objetivo / problema que resuelve**: dar al Distribuidor una vista general del estado de sus equipos y de las notificaciones relevantes del día a día (lotes recibidos, rechazos, inventarios, aprobaciones, sincronizaciones).
- **Motivo por el que fue creada**: pantalla de aterrizaje tras el login como Distribuidor, equivalente en propósito al Dashboard Mandante.
- **Funcionalidad principal**: 4 KPIs (Pendientes de inspección, Asignados a clientes, Pendientes de asignar, Solicitudes en curso), lista de notificaciones recientes con badges de estado (Nuevo/Alerta/Revisión/Aprobada/Sincronizado) y un gráfico de dona con la distribución de equipos entre esos 4 estados.
- **Flujo de usuario**: el Distribuidor llega aquí tras el login → revisa KPIs y notificaciones → en un prototipo completo navegaría desde aquí a Recepción, Asignación a Clientes, etc. (pantallas no implementadas en este build).
- **Relación con otras vistas**: en el sidebar enlaza a Recepción de Equipos, Asignación a Clientes, Solicitudes de Movimiento, Inventario, Guías de Despacho y Reportes — **ninguno de esos archivos existe** en el prototipo actual; solo los enlaces a Usuarios y Roles (Configuración) funcionan.

### 8.2 Usuarios (Distribuidor)
Ver [§7.1 Usuarios](#71-usuarios) — misma vista/patrón, con alcance limitado a los usuarios de la organización Distribuidor.

### 8.3 Roles (Distribuidor)
Ver [§7.2 Roles](#72-roles) — misma vista/patrón, con alcance limitado a los roles de la organización Distribuidor.

---

## 9. Vistas de negocio documentadas pero **no implementadas** en el prototipo

Estas pantallas están definidas funcionalmente en `../md/stitch_prompts.md` §3 y `../md/prd_features.md` (todas prioridad Must o Should), tienen enlace en el sidebar de `distribuidor/dashboard.html`, pero **el archivo HTML no existe** en `distribuidor/`. Se documenta su objetivo de negocio para que quien continúe el prototipo tenga el contexto, pero no se puede describir su flujo real porque no hay pantalla que verificar.

| Vista prevista | Objetivo de negocio (según documentación) | Enlace roto en el sidebar |
|---|---|---|
| Recepción de Equipos (Inspección) | Recibir e inspeccionar visualmente un lote de equipos enviado por el Mandante, aceptando o reportando problema por equipo individual | `recepcion-equipos.html` |
| Asignación a Clientes Finales | Vincular un equipo aceptado a un cliente final (punto de venta), generando o adjuntando la Guía de Despacho según el ERP del distribuidor | `asignacion-clientes.html` |
| Solicitud de Movimiento | Formulario para solicitar baja, cambio o envío a SSTT de un equipo, a la espera de aprobación del Mandante | `solicitudes-movimiento.html` |
| Gestión de Inventario | Solicitar, consultar y ajustar inventarios físicos (por vendedor/comuna/fecha) | `inventario.html` |
| Guías de Despacho | Listado de guías de despacho generadas/adjuntadas por el distribuidor | `guias-despacho.html` (pantalla no documentada con prompt propio, ver nota en `stitch_prompts.md` §4) |
| Reportes de Ventas y Rendimiento | Ventas vs. equipos asignados por punto de venta, rentabilidad por equipo | `reportes.html` |
| Maestro de Clientes | Puntos de venta del distribuidor, sincronizados vía API o cargados manualmente como respaldo | `clientes.html` |
| Ubicaciones / Bodegas (Distribuidor) | Bodegas y puntos de retiro propios del distribuidor | enlace `#` (ni siquiera apunta a un nombre de archivo) |
| Sincronización de Clientes vía API | Estado de la integración automática de clientes desde el ERP del distribuidor | **no aparece en el sidebar** |
| Notificación de Ventas vía API | Estado de la API de notificación de ventas por evento, con matching de línea de producto | **no aparece en el sidebar** |

---

## 10. Inconsistencias e información faltante

Detectadas al correlacionar el prototipo real (`Prototipo Maquinas/`) con la documentación (`../md/`). No se completó ni se infirió información de negocio no confirmada; se listan explícitamente para su resolución.

1. **Panel Distribuidor 87.5% sin implementar**: de 8 pantallas operativas Must/Should definidas en la documentación, solo el Dashboard existe. Esto impide validar de punta a punta los flujos de negocio más críticos (recepción, asignación a cliente, solicitud de movimiento, sincronización e inventario). Ver §9. *(Pendiente de resolución — requiere construir pantallas, no solo documentación.)*
2. **"Guías de Despacho" en el sidebar del Distribuidor sin especificación funcional propia**: el enlace existe (`guias-despacho.html`) pero ni el archivo ni un prompt de contenido específico existen en `stitch_prompts.md` — se desconoce qué debería mostrar esta pantalla más allá de lo ya cubierto dentro de los flujos de Asignación (2.4/3.3) — **información faltante**.
3. **"Sincronización de Clientes vía API" y "Notificación de Ventas vía API"**: están completamente especificadas en `md/stitch_prompts.md` §3.7/3.8 (ambas prioridad Must) pero no tienen ni archivo ni entrada en el sidebar del Distribuidor — **pantallas pendientes de construir**, no solo de documentar.
4. **Estructura de sidebar del Distribuidor**: "Recepción" y "Asignación a Clientes" están en "Principal" y "Reportes" en "Análisis", sin una decisión documentada de si deberían ir en "Operación" — pendiente de definición de negocio (no aplica al Mandante, ya resuelto, ver nota abajo).

> **Actualización 06/07/2026**: se corrigieron en `md/` los puntos que eran discrepancias reales entre la documentación y el prototipo (no del prototipo en sí):
> - **Login (RUT y selección manual de rol)**: `md/DESIGN.md` § Screen Login ya especificaba `RUT` y el `role-toggle` manual — el hallazgo original citaba una versión desactualizada del documento. No hubo que modificar nada, ya estaba alineado.
> - **`md/maestros.md` desactualizado**: se actualizó el estado de **Servicio Técnico, Grupo de Máquinas, Familia de Máquinas, Ubicaciones/Bodegas y Plantillas de Inspección** de "pendiente/stub" a "✅ Pantalla funcional", reflejando lo que realmente existe en `mandante/`.
> - **Maestros no documentados**: se agregó **Tipos de Incidencias / Catálogo de Fallas** a `md/maestros.md` §1 (ítem 12) y a la matriz de conexiones §3.1 (Marcas y Modelos ya estaban documentados).
> - **KPIs del Dashboard Distribuidor**: `md/stitch_prompts.md` §3.1 ya coincidía con los valores del prototipo (50/386/23/7); se agregó una nota explícita para evitar confusión con versiones anteriores del documento.
> - **Ubicación de "Asignación de Equipos" e "Informes" en el sidebar Mandante**: `md/system_diagrams.md` y `md/stitch_prompts.md` §4 ya reflejaban correctamente "Principal" y "Análisis" — la expectativa de "Operación" provenía únicamente del checklist de verificación (`skills/prototype-verification/assets/verification_checklist.md`, fuera de `md/` y fuera del alcance de esta corrección). Se corrigió `md/verification_report.md` §5.1 en consecuencia.
> - **Tipo de integración ERP en Gestores**: `md/stitch_prompts.md` §2.3 ahora documenta explícitamente que el dato se muestra como subtítulo bajo el nombre del distribuidor (no como columna), igual que en `mandante/gestores.html`.
>
> Detalle completo de estas correcciones en `md/verification_report.md` (addendum al inicio del documento).

**No se detectaron inconsistencias adicionales** en las 21 vistas del panel Mandante ni en Usuarios/Roles de ambos paneles más allá de lo listado arriba; su documentación en este README se considera completa con la información disponible en el repositorio.

---

## 11. Referencias

| Documento | Uso en esta documentación |
|---|---|
| `../md/README.md` | Contexto de negocio, problema y objetivos generales |
| `../md/prd_features.md` | IDs de funcionalidades (MAN-x, DIS-x, GEN-x, AUTH-x) citados por vista |
| `../md/maestros.md` | Propósito y conexiones de cada maestro del Mandante y Distribuidor |
| `../md/stitch_prompts.md` | Especificación funcional original de contenido por pantalla |
| `../md/verification_report.md` | Verificación 1:1 prototipo vs. documentación (base de la sección de inconsistencias) |
| `../md/business_rules_and_open_questions.md` | Reglas de negocio (RN-x) referenciadas en los flujos |
