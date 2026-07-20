# Changelog de Cambios Aplicados — Prototipo ISSTEC

> **Documento generado para revisión de cambios.**
> **Origen:** Minuta de Revisión de Maqueta (obs1.md)
> **Fecha de cambios:** 12/07/2026 – 13/07/2026
> **Prototipo:** Plataforma de Gestión de Equipos Refrigerados (ISSTEC)

---

## Resumen

Se aplicaron **14 cambios** sobre el prototipo interactivo, derivados de las observaciones levantadas en la sesión de revisión de maqueta. Todos los ítems marcados como resueltos en la minuta se incluyen a continuación con el detalle de qué se modificó y dónde.

---

## Cambios aplicados

### 1. Cambio de marca "Savory" → "Carozzi" ✅
- **Fecha:** 12/07/2026
- **Observación original:** Reemplazar la marca "Savory" por "Carozzi" incluyendo logotipo.
- **Qué se hizo:** Se reemplazaron todos los textos y logos de "Savory Chile" por "Carozzi" en encabezados, login y navegación del prototipo.
- **Prioridad:** Alta

### 2. Corrección de métricas del Dashboard ✅
- **Fecha:** 12/07/2026
- **Observación original:** Los números del panel de control no cuadran (la suma de equipos activos, en servicio técnico y solicitudes pendientes no coincide con el total de equipos).
- **Qué se hizo:** Se recalcularon las cifras del Dashboard para que el desglose de equipos sume con precisión el "Total de equipos" mostrado.
- **Prioridad:** Media

### 3. Cambio de terminología "Distribuidor" → "Gestor" ✅
- **Fecha:** 12/07/2026
- **Observación original:** Reemplazar el término "Distribuidor" por "Gestor" en títulos de asignación de equipos.
- **Qué se hizo:** Se cambiaron todas las menciones de "Distribuidor" por "Gestor" en el prototipo, tanto en modo Mandante como Gestor.
- **Prioridad:** Media

### 4. Eliminación del botón "Nueva asignación" en Autorización de Movimientos ✅
- **Fecha:** 12/07/2026
- **Observación original:** El botón "Nueva asignación" dentro del menú de "Autorización de Movimientos" genera confusión de flujo.
- **Qué se hizo:** Se eliminó el botón "Nueva asignación" de `autorizacion-movimientos.html`.
- **Prioridad:** Media

### 5. Buscador predictivo en Trazabilidad ✅
- **Fecha:** 12/07/2026
- **Observación original:** El buscador exige ingresar el número de serie exacto. Se requiere un buscador predictivo e integral.
- **Qué se hizo:** Se implementó un buscador predictivo/asistido que permite buscar por modelo, marca o tipo de máquina, desplegando opciones sugeridas.
- **Prioridad:** Alta

### 6. Eliminación del botón "Nuevo equipo" en maestro de Equipos ✅
- **Fecha:** 12/07/2026
- **Observación original:** El Mandante no creará equipos uno por uno. Eliminar creación manual.
- **Qué se hizo:** Se eliminó el botón "Nuevo equipo". Se mantiene exclusivamente la opción de "Carga masiva" mediante planilla Excel.
- **Prioridad:** Alta

### 7. Eliminación de submenús redundantes en Maestros ✅
- **Fecha:** 12/07/2026
- **Observación original:** Los menús "Grupo de Máquinas", "Familia de Máquinas", "Marcas" y "Modelos" deben eliminarse, ya que estas categorías vienen en la planilla de carga masiva.
- **Qué se hizo:** Se ocultaron/eliminaron del menú lateral los submenús: Grupo de Máquinas, Familia de Máquinas, Marcas y Modelos.
- **Prioridad:** Alta

### 8. Múltiples direcciones en Gestores ✅
- **Fecha:** 12/07/2026 (mejorado 13/07/2026)
- **Observación original:** Un gestor puede tener múltiples sucursales o bodegas de destino. El formulario debe permitir asociar más de una dirección.
- **Qué se hizo:** Se agregó el botón "Agregar dirección" en el formulario de creación/edición de gestores, permitiendo registrar múltiples direcciones con campos RUT, Dirección, Comuna y Región. Además, se agregó un selector de sucursal de destino obligatorio en el flujo de asignación de equipos, poblado dinámicamente según el gestor seleccionado.
- **Prioridad:** Alta

### 9. Campo RUT obligatorio en Ubicaciones y Bodegas ✅
- **Fecha:** 12/07/2026 (mejorado 13/07/2026)
- **Observación original:** Cada bodega o ubicación debe contar con un campo obligatorio de "RUT" para identificar al dueño.
- **Qué se hizo:** Se agregó el campo RUT obligatorio en el formulario de creación/edición de bodegas/ubicaciones, con validación de formato chileno (XX.XXX.XXX-X).
- **Prioridad:** Alta

### 10. Clientes y Vendedores en perfil Gestor — solo lectura ✅
- **Fecha:** 12/07/2026
- **Observación original:** Los gestores no deben crear o editar clientes o vendedores; esa información proviene del ERP.
- **Qué se hizo:** Se bloqueó la edición y creación de Clientes y Vendedores en el perfil del Gestor. Las pantallas se configuraron como vista de solo lectura.
- **Prioridad:** Alta

### 11. Roles Aprobadores y Voto Vinculante en Motivos de Movimiento ✅
- **Fecha:** 13/07/2026
- **Observación original:** El sistema debe permitir configurar roles aprobadores y si la aprobación es vinculante o no.
- **Qué se hizo:** Se agregaron columnas "Rol aprobador" y "Vinculante" en la tabla de motivos de movimiento. En los modales Agregar/Editar se incluyeron campos multi-select de roles y un checkbox de vinculación, con display condicional según si el motivo requiere aprobación.
- **Prioridad:** Media

### 12. Integración de Guías de Despacho (API / PDF / Pospuesto) ✅
- **Fecha:** 13/07/2026
- **Observación original:** El sistema debe consumir una API del sistema de facturación para emitir guías de despacho reales y adjuntar el PDF automáticamente.
- **Qué se hizo:** Al confirmar un envío, el modal ofrece 3 opciones:
  1. **Generar vía API** — simulación de 3 pasos: solicitud, procesamiento, respuesta con N° de guía y PDF adjunto.
  2. **Subir PDF** — carga manual de documento externo.
  3. **Hacer más tarde** — confirmar el envío sin GD y gestionarla posteriormente.
  
  Si se pospone, los botones de generación/subida quedan disponibles en las tablas de Asignaciones y Guías de Despacho. Aplica tanto para el flujo Mandante → Gestor como Gestor → Cliente Final.
- **Prioridad:** Alta

### 13. Campo RUT obligatorio en formulario de Gestores ✅
- **Fecha:** 13/07/2026
- **Observación original:** Se solicitó agregar el campo obligatorio "RUT" en el formulario de creación/edición de Gestores.
- **Qué se hizo:** Se agregó el campo RUT al formulario de gestores junto con las direcciones múltiples.
- **Prioridad:** Alta

### 14. Planillas de Inspección en flujo de recepción ✅
- **Fecha:** 13/07/2026
- **Observación original:** Resolver la integración visual de las planillas de inspección dentro del flujo de recepción del gestor.
- **Qué se hizo:** Se integraron las planillas de inspección (checklists) dentro del flujo de recepción del gestor, con plantillas predefinidas según tipo de activo (Inspección Estándar de Recepción, Vitrinas Refrigeradas, Congeladores, Barquilleras) y tipos de verificación por ítem (checkboxes, texto, captura de fotografías).
- **Prioridad:** Media

---

## Notas para el revisor

- Todos los cambios fueron aplicados sobre el prototipo navegable (HTML/CSS/JS estático).
- Las integraciones de API (guías de despacho, ERP) están **simuladas** en el prototipo; la implementación real corresponde a la fase de desarrollo.
- Los datos mostrados en tablas y dashboards son **datos de ejemplo** fijos en la maqueta.

---

## Cambios posteriores — Rediseño del flujo de Solicitudes de Nuevo Equipo (20/07/2026)

### 15. Nueva vista: Solicitudes de Nuevo Equipo (Gestor) ✅
- **Fecha:** 20/07/2026
- **Origen:** Rediseño del flujo de solicitudes de nuevo equipo (SDD `redesign-distributor-equipment-request-workflow`)
- **Qué se hizo:** Se creó `distribuidor/solicitudes-nuevo-equipo.html` como bandeja de entrada donde el Gestor gestiona las solicitudes de nuevo equipo enviadas por los vendedores desde la aplicación móvil. Incluye KPIs (Pendientes, En proceso, Convertidas, Total), filtros (búsqueda, estado, fechas), tabla con detalle de solicitud y acciones por fila: Ver detalle (modal con cliente, equipo, motivo, evidencia y stock disponible), Analizar stock y asignar (redirige a `asignacion-clientes.html?solicitud=SOL-XXX`), Posponer (reversible) y Descartar (modal con motivo obligatorio, terminal).
- **Prioridad:** Alta

### 16. Eliminación del Mandante del flujo de aprobación de solicitudes de nuevo equipo ✅
- **Fecha:** 20/07/2026
- **Qué se hizo:** Se eliminó al Mandante del flujo de aprobación de solicitudes de nuevo equipo. El Gestor gestiona directamente: revisión, análisis de stock, conversión en asignación, posposición o descarte. El Mandante no tiene vista ni rol aprobador en este flujo (RN-26).
- **Prioridad:** Alta

### 17. Cambio en la app móvil: selección de equipo específico ✅
- **Fecha:** 20/07/2026
- **Qué se hizo:** El vendedor ahora selecciona un equipo específico disponible (por serie, marca, modelo) del catálogo de equipos sin cliente asignado y en buen estado, en lugar de solicitar por tipo de equipo y cantidad (RN-27). Se actualizaron los datos mock en `app-data.js` (`solicitudesNuevoEquipo`) y la vista `solicitud-nuevo-equipo.html` del Prototipo Móvil.
- **Prioridad:** Alta

### 18. Sidebar navigation: nuevo enlace "Solicitudes de Nuevo Equipo" ✅
- **Fecha:** 20/07/2026
- **Qué se hizo:** Se agregó el enlace "Solicitudes de Nuevo Equipo" en la sección Operación del sidebar del Gestor, en los 18 archivos HTML del directorio `distribuidor/`. El enlace resuelve a `solicitudes-nuevo-equipo.html`.
- **Prioridad:** Media

### 19. Datos mock: `solicitudesNuevoEquipo` y `equiposDisponibles` ✅
- **Fecha:** 20/07/2026
- **Qué se hizo:** Se agregaron los arrays `solicitudesNuevoEquipo` (6 solicitudes de ejemplo con estados Pendiente, En proceso, Convertida, Pospuesta, Descartada) y `equiposDisponibles` (equipos sin cliente asignado y en buen estado) en `app-data.js` del Prototipo Móvil. Los datos se replican inline en la vista web del Gestor.
- **Prioridad:** Media

### 20. Rediseño de layout: Asignación a Clientes (vertical con collapse) ✅
- **Fecha:** 20/07/2026
- **Origen:** Rediseño del flujo de solicitudes de nuevo equipo (SDD `redesign-distributor-equipment-request-workflow`)
- **Qué se hizo:** Se rediseñó el layout de `distribuidor/asignacion-clientes.html` de dos columnas paralelas (equipos izquierda, clientes derecha) a un layout vertical con tres secciones: (1) sección colapsable de "Puntos de venta disponibles" a ancho completo con header colapsable, icono de toggle y resumen del cliente seleccionado — se auto-colapsa al seleccionar un cliente; (2) sub-tabla de solicitudes pendientes del cliente; (3) layout de dos columnas `two-col-equip-panel` (grid `1fr 320px`) con la tabla de equipos a la izquierda y el panel resumen como sidebar sticky a la derecha. Adicionalmente, se extrajo el CSS inline a `css/asignacion-clientes.css` y el JS inline a `js/asignacion-clientes.js` para mejorar la mantenibilidad.
- **Prioridad:** Alta
