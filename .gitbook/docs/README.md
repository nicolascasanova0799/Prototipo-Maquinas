# Documentación Funcional

> Documentación funcional del prototipo navegable (no funcional) de la **Plataforma de Gestión de Equipos Refrigerados** de Isstec. Cubre exclusivamente **qué hace cada vista, para quién y por qué existe** — no describe estilos visuales ni código (ver `css/styles.css` y `md/DESIGN.md` para el sistema de diseño).
>
> **Fuentes correlacionadas para esta documentación**: el HTML real de cada pantalla en este directorio (`index.html`, `mandante/*.html`, `distribuidor/*.html`) y la documentación funcional vigente (`requerimientos-de-producto.md`, `maestros-del-sistema.md`, `reglas-de-negocio.md`, `diagramas-del-sistema.md`, además de los documentos internos `../md/stitch_prompts.md`, `../md/DESIGN.md` y `../md/data_model.md`). Donde el prototipo y la documentación difieren, se documenta lo que **realmente existe en el prototipo**. `../md/verification_report.md` es un reporte histórico de QA anterior a la implementación actual del panel Gestor; sus observaciones de "archivo no existe" ya no aplican (ver §8, corregido tras verificación directa del código fuente el 07/07/2026).

## 1. Contexto del proyecto

La plataforma resuelve la pérdida de visibilidad y control que sufre un **Mandante** (dueño de equipos de frío, ej. Carozzi) sobre los activos que entrega en comodato a **Gestores** (antes denominados Distribuidores, ej. IceFree, Dimer) para instalarlos en puntos de venta de **Clientes finales**. Hoy ese control se lleva en planillas Excel, lo que genera pérdidas, uso indebido de los equipos y falta de trazabilidad. La plataforma reemplaza ese control manual con dos paneles web (Mandante y Gestor) que administran el ciclo de vida completo del equipo: carga masiva, asignación, recepción, asignación a cliente final, inventario, movimientos/bajas e informes. Ver [documentacion-inicial.md](documentacion-inicial.md "mention") §1-§7 para el detalle completo del problema y la solución de negocio.

**Alcance de este prototipo**: es una maqueta HTML estática (Bootstrap 5), sin backend ni lógica real, pensada para validar el flujo de usuario y presentar la solución comercialmente.

## 2. Roles y acceso

| Rol                       | Descripción                                                                                                                             | Paneles disponibles en el prototipo |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Mandante**              | Dueño de los equipos (ej. Carozzi). Administra maestros, asigna equipos, autoriza movimientos, consulta inventario e informes.           | Completo (22 vistas)                |
| **Gestor**                | Recibe equipos en comodato, los asigna a clientes finales, solicita movimientos y reporta inventario/ventas.                            | Completo (18 vistas)                |
| **Cliente final**         | Punto de venta donde se instala el equipo. No es usuario del sistema en esta fase; aparece solo como dato referenciado en otras vistas. | Sin acceso                          |

## 3. Estructura de navegación

Ambos paneles usan un sidebar fijo agrupado en secciones **Principal · Operación · Análisis · Maestros · Configuración**, definido en el Mandante y el Gestor.

**Sidebar Mandante** (todos los enlaces resuelven a un archivo real): `Principal`: Dashboard, Asignación de Equipos · `Operación`: Autorización de Movimientos, Consulta de Inventario, Trazabilidad · `Análisis`: Informes · `Maestros`: Equipos, Gestores, Servicio Técnico, Ubicaciones/Bodegas, Motivos de Movimiento, Tipos de Solicitud, Plantillas de Inspección, Tipos de Incidencias · `Configuración`: Usuarios, Roles. Los submenús **Grupo de Máquinas**, **Familia de Máquinas**, **Marcas** y **Modelos** quedan eliminados de la navegación porque esas clasificaciones se informan dentro de la carga masiva de equipos.

**Sidebar Gestor** (todos los enlaces resuelven a un archivo real, verificado directamente en `distribuidor/dashboard.html`): `Principal`: Dashboard, Recepción de Equipos, Asignación a Clientes · `Operación`: Solicitudes de Movimiento, Inventario, Guías de Despacho · `Análisis`: Reportes · `Maestros`: Clientes, Vendedores, Ubicaciones/Bodegas · `Configuración`: Usuarios, Roles. Clientes y Vendedores son vistas de consulta sincronizadas desde ERP; no permiten creación ni edición manual por parte del Gestor.

***

## 4. Vista transversal — Login

### Login

* **Nombre de la vista**: Login
* **Objetivo / problema que resuelve**: punto de entrada único a la plataforma; controla el acceso diferenciado por perfil (Mandante / Gestor).
* **Motivo por el que fue creada**: sin autenticación no existe forma de separar lo que ve y puede hacer cada actor del negocio (AUTH-1 en [requerimientos-de-producto.md](requerimientos-de-producto.md "mention")).
* **Funcionalidad principal**: formulario con RUT (validación de formato chileno), contraseña (con toggle mostrar/ocultar) y selector visual de rol (tarjetas radio "Mandante" / "Gestor"). Botón "Ingresar" con validación de campos obligatorios.
* **Flujo de usuario**: el usuario llega directamente (es la home del sitio) → ingresa RUT y contraseña → selecciona su rol manualmente → hace clic en "Ingresar" → si los datos son válidos, es redirigido al modo Mandante o Gestor según el rol elegido.
* **Relación con otras vistas**: es el punto de entrada a todas las demás vistas del prototipo; el botón "Cerrar sesión" del pie del sidebar (en cualquier vista de ambos paneles) regresa aquí.

***

## 5. Panel del Mandante

### 5.1 Dashboard Mandante

* **Nombre de la vista**: Dashboard Mandante
* **Objetivo / problema que resuelve**: dar al Mandante una visión general e inmediata del estado de su flota de equipos y de las solicitudes que requieren su atención, sin tener que revisar planillas.
* **Motivo por el que fue creada**: es la pantalla de aterrizaje tras el login; resume en un vistazo los indicadores clave del negocio (objetivo 1 de [documentacion-inicial.md](documentacion-inicial.md "mention")).
* **Funcionalidad principal**: 4 KPIs consistentes entre sí (Total de Equipos, Activos, En Servicio Técnico, Pendientes de Revisión), mapa con pines de ubicación de equipos, gráfico de dona con distribución de estados y tabla de "Solicitudes Pendientes" con acciones rápidas Aprobar/Rechazar. La maqueta debe usar cifras de ejemplo donde el desglose de estados de equipos cuadre matemáticamente con el total.
* **Flujo de usuario**: el Mandante llega aquí tras el login → visualiza KPIs y mapa → revisa la tabla de solicitudes pendientes → puede aprobar/rechazar directamente o hacer clic en "Ver todas" para ir al detalle completo.
* **Relación con otras vistas**: enlaza al formulario de autorizacion de movimientos ("Ver todas" solicitudes); es el punto de partida de la navegación hacia todo el sidebar Mandante.

### 5.2 Asignaciones de Equipos (listado)

* **Nombre de la vista**: Asignaciones de Equipos a Gestor
* **Objetivo / problema que resuelve**: dar visibilidad de todas las asignaciones de lotes de equipos realizadas o en curso hacia los gestores, evitando perder el registro en Excel.
* **Motivo por el que fue creada**: complemento natural de la pantalla de creación/edición de asignación; permite listar, filtrar, editar borradores y ver el detalle histórico de cada asignación.
* **Funcionalidad principal**: tabla de asignaciones con N° de asignación, gestor, cantidad de equipos, fecha y estado del registro (Borrador / Enviada / Completada — ver modelo unificado de estados en [reglas-de-negocio.md](reglas-de-negocio.md "mention")), con acciones "Editar" (si es borrador), "Ver detalle" (si ya fue confirmada) y "Eliminar". El botón "Nueva asignación" pertenece a este módulo; no debe mostrarse como acción dentro de Autorización de Movimientos.
* **Flujo de usuario**: se accede desde el ítem "Asignación de Equipos" del sidebar (sección Principal) → el usuario revisa la lista → hace clic en "Nueva asignación" para crear una, en "Editar" para continuar un borrador, o en "Ver detalle" para revisar una ya confirmada.
* **Relación con otras vistas**: enlaza al formulario de la asignacion de equipos en sus tres modos Ver, Agregar y Editar; consume el maestro de Gestores y el Maestro de Equipos.

### 5.3 Asignación de Equipos (creación / edición / detalle)

* **Nombre de la vista**: Asignación de Equipos a Gestor
* **Objetivo / problema que resuelve**: formalizar el traspaso de un lote de equipos del Mandante a un Gestor, dejando registro de la Guía de Despacho.
* **Motivo por el que fue creada**: es el flujo operativo central de la plataforma — sin asignación formal no hay forma de saber qué equipos están en poder de qué gestor (MAN-5 y MAN-5b en [requerimientos-de-producto.md](requerimientos-de-producto.md "mention")).
* **Funcionalidad principal**: selector de gestor destino, tabla de equipos disponibles con checkbox de selección, panel resumen sticky con el conteo de equipos seleccionados, botones "Confirmar asignación" / "Limpiar selección", y generación de Guía de Despacho mediante integración con el servicio de facturación del Mandante. Al confirmar, el sistema solicita la emisión de la guía, espera la respuesta, adjunta automáticamente el PDF generado y cambia el estado del equipo a "Asignado al Gestor". Soporta 3 modos Crear, Editar y Ver.
* **Flujo de usuario**: llega desde el listado de asignaciones (botón "Nueva asignación" o "Editar"/"Ver detalle") → selecciona gestor → marca los equipos a asignar → confirma → el sistema emite la Guía de Despacho vía API de facturación del Mandante y adjunta el PDF de respuesta → vuelve al listado.
* **Relación con otras vistas**: depende del Maestro de Equipos y del maestro de Gestores; su resultado es consumido conceptualmente por la Trazabilidad y por la Recepción del Gestor.
* **Nota de negocio (RN-16)**: la Guía de Despacho Mandante→Gestor se emite mediante API del sistema de facturación del Mandante. El PDF recibido se adjunta automáticamente al movimiento. Queda pendiente validar contrato técnico, tiempos de respuesta y manejo de errores de esa API.

### 5.4 Autorización de Movimientos

* **Nombre de la vista**: Autorización de Movimientos
* **Objetivo / problema que resuelve**: centralizar la aprobación/rechazo de solicitudes de baja, cambio o envío a SSTT que hace el Gestor, garantizando que ningún equipo se dé de baja sin el visto bueno del Mandante.
* **Motivo por el que fue creada**: formaliza la regla de negocio RN-1 ("el Gestor nunca puede aprobar sus propias solicitudes") y responde a MAN-6 en [requerimientos-de-producto.md](requerimientos-de-producto.md "mention").
* **Funcionalidad principal**: filtro por estado (Todos/Pendiente de Aprobación/Aprobada/Rechazada), tabla con Equipo, Gestor, Tipo de solicitud, Motivo, Fecha, Estado y acciones (Aprobar/Rechazar/Detalles), y un modal de detalle con timeline del equipo y evidencia adjunta (fotos/documentos).
* **Flujo de usuario**: se llega desde el sidebar (Operación) o desde el Dashboard ("Ver todas") → el Mandante filtra por pendientes → abre el detalle de una solicitud para revisar evidencia → aprueba o rechaza.
* **Relación con otras vistas**: recibe solicitudes que en el flujo de negocio completo se originarían en la (inexistente) pantalla de Solicitud de Movimiento del Gestor; su resultado se refleja en la Trazabilidad del equipo.

### 5.5 Trazabilidad de Equipo

* **Nombre de la vista**: Trazabilidad de Equipo
* **Objetivo / problema que resuelve**: dar auditoría completa del historial de un equipo específico, respondiendo "¿dónde ha estado y qué le ha pasado a este equipo?".
* **Motivo por el que fue creada**: cubre MAN-8, una necesidad explícita del negocio para poder disputar/verificar el estado de un activo ante reclamos o pérdidas.
* **Funcionalidad principal**: buscador predictivo/asistido por N° de serie, modelo, marca o tipo de máquina; card con la información actual del equipo (marca, modelo, estado, gestor, cliente) y un timeline vertical cronológico con cada evento (registro, asignación, recepción, asignación a cliente, envío a SSTT, baja) mostrando estado anterior → nuevo, actor y comentario.
* **Flujo de usuario**: se accede desde el sidebar (Operación) o desde el botón "Atrás" en el Maestro de Equipos → el usuario busca un N° de serie → revisa el card resumen y el timeline completo.
* **Relación con otras vistas**: se alcanza también desde el maestro de equipo (por equipo); consolida información generada por Asignación de Equipos, Autorización de Movimientos y (conceptualmente) Recepción/Asignación a Clientes del Gestor.

### 5.6 Informes

* **Nombre de la vista**: Informes
* **Objetivo / problema que resuelve**: dar visibilidad analítica (geográfica, comercial y de servicio técnico) sobre la flota de equipos, más allá del seguimiento operativo puntual.
* **Motivo por el que fue creada**: agrupa cuatro funcionalidades relacionadas de análisis (MAN-9 a MAN-12) en una sola pantalla con pestañas, evitando fragmentar la navegación.
* **Funcionalidad principal**: 4 tabs — **Geolocalización** (mapa con pines, filtros por tipo de máquina/gestor), **Piramidal de Ventas** (gráfico de barras de ventas por equipo), **Rendimiento por Equipo** (gráfico + tabla comparando ventas vs. equipos asignados) y **Servicio Técnico** (tabla de equipos en SSTT con proveedor, SLA y días en reparación). Filtro común de rango de fechas.
* **Flujo de usuario**: se accede desde el sidebar (Análisis) → el usuario navega entre tabs según el análisis que necesite → aplica filtros → revisa gráficos/tablas resultantes.
* **Relación con otras vistas**: consume datos del Maestro de Equipos, Gestores, Servicio Técnico y las clasificaciones de equipo informadas en la carga masiva. La regla de negocio RN-14 (matching venta↔máquina por línea de producto) es visible en los tabs de ventas/rendimiento.

### 5.7 Consulta de Inventario

* **Nombre de la vista**: Consulta de Inventario
* **Objetivo / problema que resuelve**: permitir al Mandante ver, en modo solo lectura, el resultado de los inventarios físicos que gestiona cada Gestor, sin poder generarlos ni ajustarlos (esa operación es exclusiva del Gestor).
* **Motivo por el que fue creada**: cubre MAN-7, aclarado explícitamente en [maestros-del-sistema.md](maestros-del-sistema.md "mention") §3.3 como una necesidad de control cruzado sin duplicar responsabilidades operativas.
* **Funcionalidad principal**: filtros por Gestor, Estado (En curso/Finalizado) y rango de fechas; tabla con Gestor, Fecha, Vendedor(es)/Comuna, Estado, N° de equipos inventariados y discrepancias detectadas; al expandir una fila se muestra el detalle (Equipo | Inventario Sistema | Inventario Físico | Diferencia), con codificación visual de diferencias positivas/negativas/cero.
* **Flujo de usuario**: se accede desde el sidebar (Operación) → el Mandante filtra por gestor/estado/fecha → expande una fila para revisar discrepancias puntuales.
* **Relación con otras vistas**: es la contraparte de solo lectura del flujo de Inventario del Gestor, quien realmente solicita, registra conteos y ajusta inventarios.

***

## 6. Panel del Mandante — Maestros

> Los maestros comparten tabla con buscador/filtros y paginación, pero no todos permiten alta manual. Tras la revisión de maqueta, **Equipos** se administra por carga masiva, y **Clientes/Vendedores** del Gestor son solo lectura por sincronización ERP.

### 6.1 Maestro de Equipos

* **Nombre de la vista**: Maestro de Equipos
* **Objetivo / problema que resuelve**: es el registro central de todos los activos fríos del Mandante — sin él no hay forma de saber cuántos equipos existen ni en qué estado están.
* **Motivo por el que fue creada**: núcleo del sistema (MAN-1); todas las demás operaciones (asignación, recepción, movimientos, inventario, informes) referencian un equipo de este maestro.
* **Funcionalidad principal**: buscador por N° de serie, filtros por Estado y Gestor, botón único "Carga masiva" para importar planilla Excel de equipos; tabla con N° Serie, Marca, Modelo, Tipo, Estado (badge), Gestor, Cliente/Ubicación, Condición y Última actualización; acciones "Ver detalle" y "Editar" solo para atributos permitidos por negocio; paginación. Se elimina el botón "Nuevo equipo" y la creación unitaria.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario busca/filtra equipos → carga equipos mediante planilla masiva o revisa el detalle → desde el detalle puede navegar a la Trazabilidad del equipo.
* **Relación con otras vistas**: alimenta Asignación de Equipos, Autorización de Movimientos, Trazabilidad, Consulta de Inventario e Informes; las clasificaciones Marca, Modelo, Grupo y Familia vienen en la planilla de carga masiva y no se administran como submenús manuales.

### 6.2 Gestores

* **Nombre de la vista**: Gestores
* **Objetivo / problema que resuelve**: administrar el alta y estado de los gestores autorizados a recibir equipos en comodato.
* **Motivo por el que fue creada**: cubre MAN-4; sin un maestro de gestores no se podría filtrar ni restringir a quién se le asignan equipos.
* **Funcionalidad principal**: tabla con Nombre, RUT, direcciones/sucursales asociadas, Estado (Activo/Inactivo), N° de equipos asignados y tipo de integración ERP (Isstec/SAP/Odoo/Otro, mostrado como subtítulo bajo el nombre); botón "Agregar gestor" y modal CRUD con soporte para múltiples direcciones físicas.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario da de alta o edita un gestor → registra una o más sucursales/bodegas de destino → define su tipo de integración ERP.
* **Relación con otras vistas**: es dropdown obligatorio en Asignación de Equipos y filtro en Maestro de Equipos, Autorización de Movimientos e Informes. Solo gestores en estado Activo pueden recibir asignaciones.

### 6.3 Servicio Técnico

* **Nombre de la vista**: Servicio Técnico
* **Objetivo / problema que resuelve**: registrar los proveedores de SSTT autorizados y su SLA comprometido, para poder medir atrasos en reparación.
* **Motivo por el que fue creada**: cubre MAN-3; necesario para que Autorización de Movimientos e Informes puedan referenciar a quién se envía un equipo a reparar y en cuánto tiempo debería volver.
* **Funcionalidad principal**: tabla con Nombre, RUT, Dirección, SLA (días) y Estado; modal CRUD de alta/edición.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario administra el catálogo de proveedores SSTT.
* **Relación con otras vistas**: consumido por el tab "Servicio Técnico" de Informes (SLA y días en reparación) y conceptualmente por la Solicitud de Movimiento del Gestor (envío a SSTT).

### 6.4 Ubicaciones / Bodegas

* **Nombre de la vista**: Ubicaciones / Bodegas
* **Objetivo / problema que resuelve**: dar un origen/destino físico normalizado a cada movimiento de equipo (bodegas del Mandante, del Gestor, puntos de retiro), en vez de usar texto libre.
* **Motivo por el que fue creada**: base para la trazabilidad y la geolocalización de equipos.
* **Funcionalidad principal**: tabla con nombre, RUT del dueño, dirección, tipo, responsable y estado; modal CRUD. El campo RUT es obligatorio para identificar si la bodega pertenece al Mandante o a un Gestor.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración simple de catálogo.
* **Relación con otras vistas**: usada conceptualmente por la (inexistente) Recepción de Equipos del Gestor, por Trazabilidad e Informes/Geolocalización.

### 6.5 Motivos de Movimiento

* **Nombre de la vista**: Motivos de Movimiento
* **Objetivo / problema que resuelve**: estandarizar las razones por las que se mueve un equipo (asignación, baja, cambio, reparación, devolución), para poder reportarlas de forma consistente.
* **Motivo por el que fue creada**: cubre MAN-16; antes era un enum fijo del ERP, aquí se vuelve administrable por el Mandante.
* **Funcionalidad principal**: tabla con código, nombre, descripción, roles aprobadores, voto vinculante y estado; modal CRUD. La configuración permite definir si debe aprobar uno o varios roles, y si la aprobación de cada rol es obligatoria para completar el movimiento.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración del catálogo de motivos.
* **Relación con otras vistas**: es dropdown en la (inexistente) Solicitud de Movimiento del Gestor y criterio de decisión en Autorización de Movimientos; también aparece en Trazabilidad.

### 6.6 Tipos de Solicitud

* **Nombre de la vista**: Tipos de Solicitud
* **Objetivo / problema que resuelve**: evitar que cada gestor invente sus propias categorías de solicitud, estandarizando qué tipos existen en toda la plataforma y cuáles requieren aprobación del Mandante.
* **Motivo por el que fue creada**: cubre MAN-18; se separó de Motivos de Movimiento (04/07/2026) porque los motivos catalogan _por qué_ se mueve un equipo y los tipos de solicitud catalogan _qué tipos de trámite existen_ (algunos con motivo asociado, otros sin él, ej. "Solicitud de Inventario").
* **Funcionalidad principal**: tabla con código, nombre, descripción, motivo de movimiento asociado (opcional), si requiere aprobación y estado; modal CRUD.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → el Mandante administra el catálogo; el Gestor solo selecciona de los tipos disponibles (en pantallas que en este prototipo aún no existen para el Gestor).
* **Relación con otras vistas**: dropdown en la (inexistente) Solicitud de Movimiento; columna "Tipo solicitud" en Autorización de Movimientos y Trazabilidad.

### 6.7 Plantillas de Inspección

* **Nombre de la vista**: Plantillas de Inspección
* **Objetivo / problema que resuelve**: estandarizar qué se revisa al inspeccionar un equipo recibido, dando respaldo objetivo ante disputas Mandante↔Gestor sobre el estado de un equipo.
* **Motivo por el que fue creada**: cubre MAN-17 (prioridad Could); checklist configurable en lugar de criterios informales.
* **Funcionalidad principal**: tabla con nombre, descripción, ítems de la plantilla, a qué aplica y estado; modal CRUD principal + modal secundario para administrar los ítems de cada plantilla.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → el Mandante define o edita una plantilla y sus ítems de verificación.
* **Relación con otras vistas**: se usa como checklist en la pantalla de Recepción de Equipos del Gestor. Queda pendiente validar si el checklist se despliega obligatoriamente por equipo/pantalla o si se permitirá aprobación masiva cuando no existan observaciones.

### 6.8 Tipos de Incidencias / Catálogo de Fallas

* **Nombre de la vista**: Tipos de Incidencias
* **Objetivo / problema que resuelve**: catalogar los tipos de fallas o siniestros (pérdida, robo, destrucción, daño) que puede sufrir un equipo, con su severidad y categoría.
* **Motivo por el que fue creada**: corresponde al Módulo de Siniestros e Incidencias (GEN-3 en [requerimientos-de-producto.md](requerimientos-de-producto.md "mention")).
* **Funcionalidad principal**: tabla con código, categoría, severidad y si requiere derivación a SSTT; modal CRUD.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración del catálogo de fallas.
* **Relación con otras vistas**: se referenciaría al reportar un problema en la (inexistente) Recepción de Equipos del Gestor y en Solicitud de Movimiento.

***

## 7. Configuración (ambos paneles)

### 7.1 Usuarios

* **Nombre de la vista**: Usuarios
* **Objetivo / problema que resuelve**: administrar las cuentas de las personas que operan la plataforma dentro de cada organización (Mandante o Gestor).
* **Motivo por el que fue creada**: soporta el control de acceso diferenciado exigido por AUTH-2.
* **Funcionalidad principal**: tabla de usuarios con acciones de alta/edición (estructura equivalente en ambos paneles, con contenido propio para cada rol).
* **Flujo de usuario**: se accede desde el sidebar (Configuración) → el administrador da de alta un usuario y le asigna un rol del catálogo de Roles.
* **Relación con otras vistas**: depende del maestro de Roles; define quién puede operar como Mandante o Gestor.

### 7.2 Roles

* **Nombre de la vista**: Roles
* **Objetivo / problema que resuelve**: definir perfiles de acceso con distintos niveles de permiso dentro de cada panel.
* **Motivo por el que fue creada**: cubre AUTH-2 (Should); necesario para no dar acceso total a todos los usuarios de una organización.
* **Funcionalidad principal**: tabla de roles con acción "Agregar rol", que abre un modal con un acordeón de permisos agrupado por sección del sidebar (Principal, Operación, etc.), permitiendo marcar qué módulos puede ver/editar cada rol.
* **Flujo de usuario**: se accede desde el sidebar (Configuración) → el administrador crea o edita un rol → marca los permisos por sección/pantalla en el acordeón → guarda.
* **Relación con otras vistas**: es prerrequisito de Usuarios; sus permisos referencian, uno a uno, las pantallas del sidebar de cada panel.

***

## 8. Panel del Gestor

> **Nota de verificación (07/07/2026)**: se confirmó directamente contra el código fuente que las 18 vistas del panel Gestor están implementadas (no solo el Dashboard). Cada enlace del sidebar de `distribuidor/dashboard.html` resuelve a un archivo HTML real y funcional. Los nombres de archivo conservan `distribuidor` por compatibilidad técnica del prototipo, aunque la terminología funcional visible es **Gestor**.

### 8.1 Dashboard Gestor

* **Nombre de la vista**: Dashboard Gestor
* **Objetivo / problema que resuelve**: dar al Gestor una vista general del estado de sus equipos y de las notificaciones relevantes del día a día (lotes recibidos, rechazos, inventarios, aprobaciones, sincronizaciones).
* **Motivo por el que fue creada**: pantalla de aterrizaje tras el login como Gestor, equivalente en propósito al Dashboard Mandante.
* **Funcionalidad principal**: 4 KPIs (Pendientes de inspección, Asignados a clientes, Pendientes de asignar, Solicitudes en curso), lista de notificaciones recientes con badges de estado (Nuevo/Alerta/Revisión/Aprobada/Sincronizado) y un gráfico de dona con la distribución de equipos entre esos 4 estados.
* **Flujo de usuario**: el Gestor llega aquí tras el login → revisa KPIs y notificaciones → navega desde aquí a Recepción, Asignación a Clientes, Solicitudes, Inventario, Guías de Despacho o Reportes.
* **Relación con otras vistas**: en el sidebar enlaza a todas las demás vistas del panel Gestor (Recepción de Equipos, Asignación a Clientes, Solicitudes de Movimiento, Inventario, Guías de Despacho, Reportes, Clientes, Vendedores, Ubicaciones/Bodegas, Usuarios, Roles) — todos los archivos existen y son funcionales.

### 8.2 Recepción de Equipos (listado de lotes)

* **Nombre de la vista**: Recepción de Equipos
* **Objetivo / problema que resuelve**: listar los lotes de equipos enviados por el Mandante y su estado de proceso, siendo el punto de entrada al flujo de recepción.
* **Motivo por el que fue creada**: formaliza el paso del flujo de negocio original en que el Gestor recibe notificación de que debe cargar/recibir máquinas.
* **Funcionalidad principal**: KPIs por estado de lote (En Tránsito, Pendiente de Inspección, Recibidos, Con Problema, Rechazados); filtros (N° recepción/asignación/guía, estado, origen, fechas); tabla con N° Recepción, N° Asignación, Origen, Equipos (count), Fecha Llegada, Estado, Guía de Despacho y Acciones; acción **"Registrar llegada"** (transiciona el lote de "En Tránsito" a "Pendiente de Inspección" vía modal, sin recargar la página) y **"Inspeccionar"/"Continuar"** (lleva al detalle de inspección); modal de detalle con resumen de inspección y tabla de equipos del lote.
* **Flujo de usuario**: se accede desde el sidebar (Principal) → el Gestor revisa lotes pendientes → registra la llegada física → hace clic en "Inspeccionar" para pasar al detalle.
* **Relación con otras vistas**: recibe lotes generados conceptualmente en `mandante/asignacion-equipos.html`; enlaza a `recepcion-equipos.html` (§8.3).

### 8.3 Recepción de Equipos (inspección)

* **Nombre de la vista**: Recepción de Equipos — inspección
* **Objetivo / problema que resuelve**: inspeccionar visualmente cada equipo de un lote específico y decidir si se acepta o se reporta con problema antes de darlo por recibido.
* **Motivo por el que fue creada**: evita que el Gestor acepte por error una máquina en mal estado; obliga a una inspección explícita antes de confirmar la recepción.
* **Funcionalidad principal**: tabla de equipos del lote con acciones "Aceptar"/"Reportar Problema" por fila; integración con la plantilla de inspección aplicable al tipo de activo; tipos de verificación por ítem (checkbox, texto, fotografía obligatoria cuando aplique); formulario inline de Motivo (alimentado desde el maestro Tipos de Incidencias del Mandante) al reportar un problema; resumen con barra de progreso (aceptados/con problema/pendientes); botón "Confirmar recepción" (deshabilitado hasta revisar todos los equipos). La aprobación masiva sin observaciones queda pendiente de validación de UX/negocio.
* **Flujo de usuario**: se llega desde la vista de listado de recepciones (botón "Inspeccionar"/"Continuar") → se revisa equipo por equipo (o en lote) → se confirma la recepción → se vuelve al listado.
* **Relación con otras vistas**: equipos aceptados quedan disponibles para la asignación a los clientes; equipos con problema quedarían pendientes de una solicitud/autorización en el flujo Mandante. Si todo el lote resulta con problema, queda "Rechazado" en su totalidad.
* **Pendiente de validación**: definir si el checklist se presenta pantalla por pantalla por cada equipo o si existirá una aprobación masiva solo cuando no se registren observaciones.

### 8.4 Asignación a Clientes (listado)

* **Nombre de la vista**: Asignaciones Realizadas
* **Objetivo / problema que resuelve**: listar las asignaciones de equipos ya entregados a clientes finales (puntos de venta), siendo el punto de entrada al flujo de asignación.
* **Motivo por el que fue creada**: da trazabilidad de qué equipo quedó en qué punto de venta y centraliza la gestión de la Guía de Despacho de ese tramo (Gestor→Cliente).
* **Funcionalidad principal**: KPIs (Asignados a clientes, En SSTT, Retirados/Devueltos, Clientes activos); filtros (N° asignación/cliente/serie, estado, comuna, fechas); tabla con N° Asignación, Cliente, Comuna, Equipos, Fecha, Estado y Guía de Despacho; acciones "Ver" (detalle), **"Generar GD"** (simula generación automática vía ERP Isstec con modal de 3 pasos: confirmación → spinner → éxito) y **"Subir PDF"** (drag & drop para gestores sin sistema Isstec).
* **Flujo de usuario**: se accede desde el sidebar (Principal) → se revisa el listado o se crea una nueva asignación con el botón del navbar → se gestiona la Guía de Despacho de cada fila desde esta misma tabla.
* **Relación con otras vistas**: el botón "Nueva asignación" del navbar lleva a la asignación de equipos a clientes (§8.5); consolidada también en la vista de las guias de despachos(§8.12).

### 8.5 Asignación a Clientes Finales (creación)

* **Nombre de la vista**: Asignación de Clientes
* **Objetivo / problema que resuelve**: vincular un equipo aceptado con un cliente final concreto, materializando la entrega física del equipo al punto de venta.
* **Motivo por el que fue creada**: es el paso operativo que traspasa un equipo desde la bodega del Gestor al punto de venta.
* **Funcionalidad principal**: dos columnas con buscador — "Equipos para asignar" (izquierda) y "Puntos de venta disponibles" (derecha); interacción de selección de equipo + cliente + botón "Asignar"; modal de confirmación que aclara que la Guía de Despacho se gestiona después, desde la tabla de Asignaciones Realizadas.
* **Flujo de usuario**: se llega desde el botón "Nueva asignación" del navbar o desde el listado de asignaciones a clientes→ se elige equipo y cliente → se confirma → se retorna al listado.
* **Relación con otras vistas**: depende de la vista de clientes (§8.14) sincronizada desde ERP para tener puntos de venta disponibles; su resultado aparece en el listado de asignaciones de equipos a clientes.
* **Pendiente de validación**: definir si la logística de entrega al cliente final requiere un módulo de transporte/firma de conformidad o si se manejará solo como cambio de estado y respaldo documental.

### 8.6 Solicitudes de Movimiento (listado)

* **Nombre de la vista**: Solicitudes de Movimiento
* **Objetivo / problema que resuelve**: listar las solicitudes de baja, cambio, envío a SSTT o retorno que el Gestor ha enviado al Mandante para su aprobación.
* **Motivo por el que fue creada**: formaliza el seguimiento de solicitudes que, por regla de negocio (RN-1), el Gestor no puede resolver unilateralmente.
* **Funcionalidad principal**: tabla "Solicitudes enviadas" con Equipo, Tipo, Fecha de envío, Estado (Pendiente/Aprobada/Rechazada) y Resultado; botón "Nueva solicitud" (navbar y contenido).
* **Flujo de usuario**: se accede desde el sidebar (Operación) → se revisa el estado de solicitudes ya enviadas o se crea una nueva.
* **Relación con otras vistas**: el botón "Nueva solicitud" lleva al formulario de crear una nueva solicitud (§8.7); las solicitudes se resuelven en el mandante, desde la autorización de solicitudes (Solo los tipos de solicitudes que requieran aprobación por parte del mandante).

### 8.7 Nueva Solicitud de Movimiento (creación)

* **Nombre de la vista**: Nueva Solicitud
* **Objetivo / problema que resuelve**: crear una solicitud formal dirigida al Mandante (baja definitiva, cambio de equipo, envío a SSTT, retorno al Mandante o solicitud de inventario).
* **Motivo por el que fue creada**: reemplaza la comunicación informal con el Mandante que hoy hacen los gestores; deja registro auditable.
* **Funcionalidad principal**: formulario con buscador de equipo (autocompletado por N° de serie), tipo de solicitud (select, alimentado desde el maestro Tipos de Solicitud del Mandante), motivo (textarea) y zona de carga de evidencia (drag & drop, multi-archivo); botones "Enviar solicitud a Mandante para aprobación", "Cancelar" y "Limpiar". El flujo de aprobación se determina por la configuración del Motivo de Movimiento: roles aprobadores y voto vinculante.
* **Flujo de usuario**: se llega desde el listado de solicitudes o desde el botón del navbar → se completa el formulario y se adjunta evidencia → se envía → queda "Pendiente de Aprobación" y retorna al listado.
* **Relación con otras vistas**: depende del maestro de tipos de solicitud; su resultado se aprueba/rechaza en la vista de aprobación de movimientos por parte del mandante.

### 8.8 Gestión de Inventario (listado)

* **Nombre de la vista**: Inventario
* **Objetivo / problema que resuelve**: listar las solicitudes de toma de inventario físico gestionadas por el Gestor, siendo el punto de entrada al flujo completo de inventario.
* **Motivo por el que fue creada**: cubre la gestión web de solicitudes/conteo/ajustes de inventario (DIS-5 a DIS-7), distinta de la futura auditoría física con GPS/fotos de la app móvil (fuera de alcance de esta fase).
* **Funcionalidad principal**: KPIs (En curso, En ajuste, Finalizados, Total); filtros (ID, vendedor, comuna, estado, fechas); tabla con ID, Fecha, Vendedor(es)/Comuna, Estado, N° equipos inventariados, Discrepancias y Acciones ("Registrar conteo" en curso, "Ajustar" en ajuste); botón "Nueva solicitud".
* **Flujo de usuario**: se accede desde el sidebar (Operación) → se revisa el listado o se crea una nueva solicitud.
* **Relación con otras vistas**: alimenta al formulario de solicitud de movimientos (§8.9), a la toma de inventario (§8.10) y el ajuste de inventario (§8.11); es la fuente de datos de la consulta de inventario por parte del mandante(solo lectura).

### 8.9 Solicitud de Inventario (creación)

* **Nombre de la vista**: Solicitud de Inventario
* **Objetivo / problema que resuelve**: iniciar una nueva toma de inventario físico, definiendo su alcance antes del conteo.
* **Motivo por el que fue creada**: separa la decisión de "qué y cuándo inventariar" del acto de contar físicamente los equipos.
* **Funcionalidad principal**: formulario con filtros opcionales "por vendedor" y "por comuna" (si se omiten, aplica a todos), rango de fechas obligatorio y observación; botones "Crear solicitud" y "Cancelar".
* **Flujo de usuario**: se llega desde la vista de Inventarios o el botón del navbar → se define el alcance y fechas → se crea → la solicitud queda "En curso", pendiente de conteo físico.
* **Relación con otras vistas**: primer paso del flujo de inventario; continúa en la vista de toma de inventario.

### 8.10 Registro de Conteo Físico

* **Nombre de la vista**: Registro de Conteo
* **Objetivo / problema que resuelve**: ingresar manualmente el resultado del conteo físico de equipos para una solicitud "En curso".
* **Motivo por el que fue creada**: cierra el hueco entre la solicitud y el ajuste — sin este paso no existen valores de "Inventario Físico" con los que comparar.
* **Funcionalidad principal**: tabla de equipos con Inventario Sistema (esperado) vs. Inventario Físico (input editable) y Diferencia calculada automáticamente; barra de progreso ("X de Y equipos contabilizados"); botones "Guardar progreso", "Finalizar inventario" (deshabilitado hasta completar todos los equipos) y "Volver".
* **Flujo de usuario**: se llega desde la vista del listado de inventarios solicitados (botón "Registrar conteo" en filas "En curso") → se ingresan los valores físicos → se finaliza → el inventario pasa a "Finalizado" o "En ajuste" según haya o no discrepancias.
* **Relación con otras vistas**: paso intermedio entre el formulario de solicitud de inventario y el ajuste del inventario.

### 8.11 Ajuste de Inventario

* **Nombre de la vista**: Ajuste de Inventario
* **Objetivo / problema que resuelve**: corregir el valor del sistema según las discrepancias detectadas en el conteo físico.
* **Motivo por el que fue creada**: sin este paso, el sistema seguiría mostrando datos desactualizados respecto a la realidad física registrada.
* **Funcionalidad principal**: tabla comparativa (Sistema vs. Físico vs. Diferencia con badge positivo/negativo/sin diferencia) con botón "Corregir" por fila; resumen de conteos; botón "Confirmar ajustes" (siempre habilitado, permite aceptar diferencias sin corregir) y "Volver".
* **Flujo de usuario**: se llega desde el listado de inventarios solicitados (botón "Ajustar" en filas "En ajuste") → se corrigen (o no) discrepancias → se confirma → el inventario pasa a "Finalizado".
* **Relación con otras vistas**: último paso del flujo vista de listado de inventarios→ formulario de solicitud de inventario → toma de inventario → ajuste de inventario.

### 8.12 Guías de Despacho (Gestor)

* **Nombre de la vista**: Guías de Despacho
* **Objetivo / problema que resuelve**: dar al Gestor un listado centralizado de todas las guías de despacho asociadas (recepción Mandante→Gestor y despacho Gestor→Cliente).
* **Motivo por el que fue creada**: evita tener que buscar la guía dentro de cada asignación individual; da visibilidad de cumplimiento documental.
* **Funcionalidad principal**: KPIs (Total GD, Generadas automáticamente, PDF adjuntos, Pendientes); filtros (N° GD/asignación/cliente, tipo, estado, fechas); tabla con N° GD, Tipo, Origen, Destino, Equipos, Fecha, Estado y Acciones (Ver, Generar GD, Subir PDF, Descargar PDF).
* **Flujo de usuario**: se accede desde el sidebar (Operación) → se revisan o gestionan guías pendientes.
* **Relación con otras vistas**: las mismas acciones de generar/subir GD también están disponibles en la vista de asignaciones realizadas; se refleja también en el mandante.

### 8.13 Reportes

* **Nombre de la vista**: Reportes
* **Objetivo / problema que resuelve**: analizar ventas y rendimiento comercial de los equipos asignados a cada cliente del Gestor.
* **Motivo por el que fue creada**: permite comparar las ventas de cada punto de venta contra el equipo asignado, para evaluar la rentabilidad del activo.
* **Funcionalidad principal**: 3 pestañas — "Ventas y Rendimiento" (gráfico de barras + tabla de rendimiento por equipo), "Cliente–Máquina" (relación cliente↔equipo↔ventas) y "Geolocalización" (mapa de equipos asignados a clientes); filtro común de rango de fechas.
* **Flujo de usuario**: se accede desde el sidebar (Análisis) → se navega entre pestañas → se filtra por fecha/cliente/comuna.
* **Relación con otras vistas**: consume datos del maestro de clientes y de las asignaciones realizadas. Nota de negocio RN-14: el cálculo de ventas se hace por línea de producto, agrupando por Tipo de Máquina si no hay N° de serie identificado.

### 8.14 Clientes

* **Nombre de la vista**: Clientes
* **Objetivo / problema que resuelve**: consultar los puntos de venta (clientes finales) del Gestor.
* **Motivo por el que fue creada**: sin un cliente disponible no se puede asignar ningún equipo a un punto de venta; este dato proviene exclusivamente del ERP sincronizado.
* **Funcionalidad principal**: tabla de clientes (nombre, RUT, dirección, comuna, estado de sincronización) con buscador y filtros. Es una vista de solo lectura: no permite crear, editar ni eliminar clientes desde la plataforma.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario consulta clientes sincronizados desde ERP.
* **Relación con otras vistas**: alimenta el formulario de asignaciones de clientes a equipos, la vista de guia de despacho, los reportes y listado de inventarios.

### 8.15 Vendedores

* **Nombre de la vista**: Vendedores
* **Objetivo / problema que resuelve**: consultar los vendedores del Gestor y organizar la lectura de cartera de clientes por responsable.
* **Motivo por el que fue creada**: se usa como filtro operativo en solicitudes de inventario ("por vendedor") y para asignar clientes por vendedor.
* **Funcionalidad principal**: tabla de solo lectura (nombre, RUT, teléfono, email, clientes asignados, estado de sincronización). No permite creación, edición ni asignación manual de clientes; la relación vendedor-cliente proviene del ERP.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → el usuario consulta vendedores sincronizados desde ERP.
* **Relación con otras vistas**: alimenta el filtro "por vendedor" del formulario de solicitud de inventario y la asignación de clientes.

### 8.16 Ubicaciones / Bodegas (Gestor)

* **Nombre de la vista**: Ubicaciones / Bodegas
* **Objetivo / problema que resuelve**: administrar bodegas y puntos de retiro propios del Gestor donde recibe, almacena o retira equipos.
* **Motivo por el que fue creada**: da un origen/destino físico normalizado a los movimientos que gestiona el propio Gestor, en vez de texto libre.
* **Funcionalidad principal**: tabla con CRUD (nombre, RUT del dueño, dirección, tipo, responsable, estado) y modal de alta/edición — pantalla completamente funcional en el prototipo. El RUT es obligatorio para identificar claramente al dueño de la instalación.
* **Flujo de usuario**: se accede desde el sidebar (Maestros) → administración simple del catálogo.
* **Relación con otras vistas**: complementa al maestro de ubicación y bodegas del Mandante, pero administra las bodegas propias del Gestor.

### 8.17 Usuarios (Gestor)

Ver [§7.1 Usuarios](#71-usuarios) — misma vista/patrón, con alcance limitado a los usuarios de la organización Gestor. Pantalla completamente funcional (tabla con filtros, CRUD por modal), no un stub.

### 8.18 Roles (Gestor)

Ver [§7.2 Roles](#72-roles) — misma vista/patrón, con alcance limitado a los roles de la organización Gestor. Incluye el mismo acordeón de permisos por sección del sidebar, funcional.

***

## 9. Referencias

| Documento                                                                | Uso en esta documentación                                                |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [documentacion-inicial.md](documentacion-inicial.md "mention")           | Contexto de negocio, problema y objetivos generales                      |
| [requerimientos-de-producto.md](requerimientos-de-producto.md "mention") | IDs de funcionalidades (MAN-x, DIS-x, GEN-x, AUTH-x) citados por vista   |
| [arquitectura-de-alto-nivel.md](arquitectura-de-alto-nivel.md "mention") | Definición de alto nivel de la arquitectura que tendrá la aplicación     |
| [reglas-de-negocio.md](reglas-de-negocio.md "mention")                   | Reglas de negocio (RN-x) referenciadas en los flujos                     |
| [maestros-del-sistema.md](maestros-del-sistema.md "mention")             | Propósito y conexiones de cada maestro del Mandante y Gestor       |
| [maestros-del-sistema.md](maestros-del-sistema.md "mention")             | Documento que indica todas las conexiones de los maestros (Mantenedores) |
