# Arquitectura de Alto Nivel

> Este documento describe una arquitectura **conceptual** para orientar tanto el diseño del prototipo navegable como el futuro desarrollo real. Las tecnologías sugeridas son **propuestas**, no decisiones cerradas, ya que la propuesta original no especifica stack técnico.

## 1. Principios de arquitectura

{% stepper %}
{% step %}
### Desacoplamiento del ERP

La lógica de negocio de los activos vive fuera de los ERP de Mandante y Gestores, permitiendo comercializar la plataforma como producto independiente (SaaS).
{% endstep %}

{% step %}
### Integración 100% vía API, automática

Sincronización de datos maestros (clientes/vendedores) y transaccionales (ventas) desde los ERP de los gestores (ERP Isstec, SAP, Odoo, u otros) de forma automática, sin requerir que el Gestor entregue información manualmente ni que el Mandante la solicite. _(Confirmado en reunión de validación 03/07/2026 y refinado en minuta 10/07/2026, RN-11, RN-12 y RN-19 — ver_ [reglas-de-negocio.md](reglas-de-negocio.md "mention")_)_
{% endstep %}

{% step %}
### Carga masiva acotada a datos maestros

La carga manual de archivos (Excel/CSV) queda acotada a la carga masiva de equipos del Mandante. No existe creación unitaria de equipos, y clientes/vendedores del Gestor provienen exclusivamente del ERP sincronizado. _(Actualizado tras minuta de revisión de maqueta 10/07/2026 — ver RN-17 y RN-19 en_ [reglas-de-negocio.md](reglas-de-negocio.md "mention")_)_
{% endstep %}

{% step %}
### Trazabilidad como eje central

Cada cambio de estado de un equipo debe quedar registrado con actor, fecha y motivo.
{% endstep %}

{% step %}
### Base de datos propia

La plataforma no depende del modelo de datos de ningún ERP externo; consume/expone datos vía integraciones programadas.
{% endstep %}

{% step %}
### Propiedad única de los activos

Todo equipo gestionado por la plataforma pertenece al Mandante (Carozzi); los gestores no gestionan equipos propios en esta fase. _(Confirmado en reunión de validación 03/07/2026 y actualizado en minuta 10/07/2026, RN-10)_
{% endstep %}
{% endstepper %}

## 2. Vista de módulos

<figure><img src=".gitbook/assets/ChatGPT Image 7 jul 2026, 04_31_33 p.m.png" alt=""><figcaption></figcaption></figure>

## 3. Responsabilidades de cada módulo

<table data-search="false"><thead><tr><th>Módulo</th><th>Responsabilidad</th></tr></thead><tbody><tr><td><strong>Panel Mandante</strong></td><td>UI para carga masiva de equipos, gestores, SLA, asignación a gestores, autorización de movimientos, informes y guías de despacho</td></tr><tr><td><strong>Panel Gestor</strong></td><td>UI para recepción/inspección, asignación a clientes, solicitudes de movimiento, inventario, reportes y consultas de clientes/vendedores sincronizados</td></tr><tr><td><strong>Servicio de Autenticación y Roles</strong></td><td>Login diferenciado por perfil (Mandante / Gestor) y control de permisos</td></tr><tr><td><strong>Servicio de Maestro de Equipos</strong></td><td>Carga masiva de equipos, atributos técnicos, historial de estados y búsqueda predictiva por serie/modelo/marca/tipo</td></tr><tr><td><strong>Servicio de Asignación / Workflow de Estados</strong></td><td>Máquina de estados del equipo (ver sección 5) y reglas de transición</td></tr><tr><td><strong>Servicio de Aprobaciones</strong></td><td>Evaluación de roles aprobadores y voto vinculante según motivo de movimiento</td></tr><tr><td><strong>Servicio de Guías de Despacho</strong></td><td>Orquestación de emisión Mandante→Gestor vía API de facturación, generación Gestor→Cliente vía ERP Isstec cuando aplique y adjunto de PDF externo para gestores sin generación integrada</td></tr><tr><td><strong>Servicio de Notificaciones</strong></td><td>Disparo de notificaciones ante hitos (asignación, recepción, reparo, aprobación de baja)</td></tr><tr><td><strong>Servicio de Inventario</strong></td><td>Solicitud, seguimiento y ajuste de inventarios físicos</td></tr><tr><td><strong>Servicio de Reportes / Analítica</strong></td><td>Piramidal de ventas, rendimiento por equipo, reporte cliente-máquina</td></tr><tr><td><strong>Servicio de Geolocalización</strong></td><td>Mapa de ubicación de equipos con filtros</td></tr><tr><td><strong>Gateway de Integración</strong></td><td>Conectores API con ERP de gestores, API de facturación del Mandante, APIs de ventas/clientes/vendedores y carga masiva de equipos del Mandante</td></tr></tbody></table>

## 4. Entidades principales (modelo de dominio)

<table data-search="false"><thead><tr><th>Entidad</th><th>Descripción</th><th>Atributos clave (propuestos)</th></tr></thead><tbody><tr><td><strong>Mandante</strong></td><td>Empresa dueña de los equipos</td><td>ID, Nombre, RUT</td></tr><tr><td><strong>Gestor</strong></td><td>Empresa que administra y coloca los equipos</td><td>ID, RUT, Nombre, Direcciones/Sucursales, Estado (Activo/Inactivo), Tipo de integración ERP (Isstec/SAP/Odoo/Otro)</td></tr><tr><td><strong>Cliente Final</strong></td><td>Punto de venta donde se instala el equipo; proviene del ERP del Gestor</td><td>ID, RUT, Nombre, Dirección, Gestor asociado, Estado de sincronización</td></tr><tr><td><strong>Vendedor</strong></td><td>Vendedor del Gestor; proviene del ERP y se consulta en solo lectura</td><td>ID, RUT, Nombre, Contacto, Clientes asociados</td></tr><tr><td><strong>Equipo (Activo)</strong></td><td>Unidad física identificada por N° de serie. <strong>Siempre pertenece al Mandante</strong> — no existen equipos propios del Gestor en esta fase (RN-10)</td><td>ID, N° Serie, Marca, Modelo, Grupo/Familia/Tipo, Estado actual, Gestor asignado, Cliente asignado, Coordenadas GPS (si aplica)</td></tr><tr><td><strong>Estado</strong></td><td>Estado posible de un equipo</td><td>Código, Nombre (Activo, Asignado al Gestor, Asignado a Cliente, En SSTT, Pendiente de Revisión, Rechazado, Baja)</td></tr><tr><td><strong>Movimiento / Solicitud</strong></td><td>Solicitud de baja, cambio o envío a SSTT</td><td>ID, Equipo, Tipo, Solicitante (Gestor), Estado de aprobación, Roles aprobadores, Voto vinculante, Aprobador(es), Fecha</td></tr><tr><td><strong>Ubicación / Bodega</strong></td><td>Lugar físico de almacenamiento, retiro o recepción</td><td>ID, Nombre, RUT dueño, Dirección, Tipo, Responsable, Estado</td></tr><tr><td><strong>Guía de Despacho</strong></td><td>Documento que respalda el traslado físico de un equipo (Mandante→Gestor o Gestor→Cliente Final). Mandante→Gestor se emite vía API de facturación del Mandante; Gestor→Cliente se genera vía ERP Isstec cuando aplique o se adjunta como PDF externo (RN-16)</td><td>ID, Equipo(s), Origen, Destino, Fecha de emisión, Tipo, Estado, Origen del documento (API Mandante / Generada Isstec / Adjunto manual), Archivo PDF</td></tr><tr><td><strong>Servicio Técnico (SSTT)</strong></td><td>Proveedor autorizado de reparación</td><td>RUT, Nombre, Dirección, SLA (días estimados)</td></tr><tr><td><strong>Inventario</strong></td><td>Proceso de conteo físico de equipos</td><td>ID, Gestor, Fecha, Estado (en curso/finalizado), Resultado</td></tr><tr><td><strong>Notificación</strong></td><td>Evento comunicado a un actor</td><td>ID, Tipo, Destinatario, Referencia (equipo/lote), Fecha</td></tr><tr><td><strong>Tipo de Máquina</strong></td><td>Atributo de clasificación importado con el equipo, usado para filtros y matching de ventas (RN-14); no es submenú administrable en esta fase</td><td>Código, Nombre, Familia/Grupo</td></tr><tr><td><strong>Venta (Transacción)</strong></td><td>Venta facturada notificada por el ERP de un Gestor vía API (RN-13); un mismo registro puede tener líneas asociadas a una máquina y líneas que no</td><td>ID, Gestor, N° Factura, Fecha, Cliente Final</td></tr><tr><td><strong>Línea de Venta</strong></td><td>Detalle de un producto dentro de una Venta; determina si proviene de una máquina gestionada y, de ser así, a qué Tipo de Máquina (y opcionalmente a qué equipo puntual) corresponde (RN-14)</td><td>ID, Venta, Código producto, Cantidad, Precio unitario, ¿Proviene de máquina?, Tipo de Máquina (si aplica), Equipo (si el ERP identifica el N° de serie)</td></tr></tbody></table>

## 5. Máquina de estados del Equipo (propuesta, basada en Propuesta §5, PDF de flujo y validación 03/07/2026)

<figure><img src=".gitbook/assets/ChatGPT Image 7 jul 2026, 04_34_42 p.m.png" alt=""><figcaption></figcaption></figure>

**Regla clave:** el Gestor **no puede** mover un equipo a estado "Baja" unilateralmente; toda baja requiere una solicitud formal aprobada por el Mandante (ver [reglas-de-negocio.md](reglas-de-negocio.md "mention")).

**Regla confirmada 03/07/2026 (RN-9):** el estado "Rechazado" aplica de forma idéntica sea un equipo individual o el lote completo — no existe un flujo especial para "rechazo total del lote". El equipo/lote rechazado queda a la espera de que el Mandante lo retire.

## 6. Integraciones

> **Actualizado 10/07/2026:** el negocio confirmó que la integración con los ERP de los gestores es **100% vía API y automática** para clientes, vendedores y ventas — no depende de cargas manuales del Gestor. Además, la Guía de Despacho Mandante→Gestor debe emitirse vía API de facturación del Mandante.

<table data-search="false"><thead><tr><th>Integración</th><th>Dirección</th><th>Propósito</th><th>Estado</th></tr></thead><tbody><tr><td>ERP Isstec (Gestor) → Plataforma</td><td>Entrante, automática</td><td>Sincronización automática de clientes, vendedores y ventas del Gestor</td><td>Diseño conceptual — confirmado como vía API automática</td></tr><tr><td>ERP propio del Gestor (SAP / Odoo / otro) → Plataforma</td><td>Entrante, automática</td><td>Sincronización automática de clientes, vendedores y ventas para gestores que usan otros ERP</td><td>Diseño conceptual — confirmado como vía API automática</td></tr><tr><td>ERP / fuente maestra del Mandante (Carozzi) → Plataforma</td><td>Entrante</td><td>Carga inicial y sincronización de la maestra de equipos</td><td>Requisito explícito; alta individual eliminada</td></tr><tr><td>Plataforma → Facturación del Mandante</td><td>Saliente/Entrante</td><td>Emisión de Guía de Despacho Mandante→Gestor y recepción del PDF generado</td><td>Requisito confirmado; contrato técnico pendiente</td></tr><tr><td>ERP del Gestor/Isstec → Plataforma (API Notificación de Venta)</td><td>Entrante, por evento</td><td>Notificación de cada venta al momento de facturar; matching a nivel de línea de producto contra Tipo de Máquina (RN-13, RN-14)</td><td>Diseño conceptual — propuesta de contrato en <a data-mention href="reglas-de-negocio.md">reglas-de-negocio.md</a>§4</td></tr><tr><td>Plataforma → ERP del Gestor (API Catálogo de Tipos de Máquina)</td><td>Saliente</td><td>Permite al ERP mapear sus SKU a los tipos de máquina de la plataforma antes de notificar ventas</td><td>Diseño conceptual</td></tr><tr><td>Archivo plano (Excel/CSV)</td><td>Entrante/Manual</td><td>Carga masiva de <strong>equipos</strong> del Mandante (nunca clientes, vendedores ni ventas)</td><td>Confirmado como carga masiva acotada (RN-17/RN-19)</td></tr><tr><td>Carga manual de PDF de Guía de Despacho</td><td>Entrante/Manual</td><td>Para gestores que no operan con sistema Isstec en el tramo Gestor→Cliente: adjuntar el PDF de la guía generada externamente</td><td>Requisito confirmado</td></tr></tbody></table>

## 7. Consideraciones técnicas

* **Multiplicidad de ERP:** el gateway de integración debe soportar distintos formatos/protocolos (SAP Business One, Odoo, ERP Isstec y API de facturación del Mandante), lo que sugiere un patrón de **adaptadores por conector**. No se contempla carga manual de clientes, vendedores ni ventas como respaldo; esos datos quedan sincronizados por API.
* **Idempotencia y trazabilidad:** cada carga (API o archivo) debe quedar registrada para poder auditar qué se cargó, cuándo y por quién.
* **Concurrencia de aceptación de lotes:** el flujo de "aceptar/rechazar" un lote completo de máquinas debe permitir aceptación granular (por equipo), no solo masiva, para evitar el riesgo señalado en el PDF de aceptar por error un equipo dañado.
* **Roles y multi-tenant:** cada Gestor debe ver solo sus propios equipos y clientes; el Mandante ve el global. Si en el futuro hay más de un Mandante en la plataforma (modelo SaaS), se requiere aislamiento por Mandante también.
* **Notificaciones:** requeridas en varios puntos del flujo (asignación, recepción, reparo/aprobación); se sugiere un servicio de notificaciones desacoplado (email/in-app) para esta fase futura de desarrollo real.

## 8. Stack tecnológico sugerido _(propuesta, no confirmada por el negocio)_

| Capa                  | Sugerencia                                  | Nota                                                                       |
| --------------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| Frontend              | React / Next.js                             | Compatible con exportación de diseño desde herramientas como Google Stitch |
| Backend               | Node.js (NestJS) o equivalente              | Orientado a APIs REST modulares por servicio                               |
| Base de datos         | PostgreSQL                                  | Relacional, adecuada para el modelo de entidades descrito                  |
| Integraciones         | Adaptadores REST/SOAP según ERP (SAP, Odoo) | Se sugiere capa de adaptadores independiente                               |
| Mapas/Geolocalización | Google Maps API o Mapbox                    | Para módulos de geolocalización e informes                                 |
| Notificaciones        | Servicio de colas + email/push              | Para desacoplar disparo de eventos                                         |

> **Importante:** para la fase actual (maqueta no funcional), **no se requiere implementar backend real**; este stack es una referencia para la fase de desarrollo posterior.

## 9. Riesgos técnicos identificados

| Riesgo                                                                                               | Impacto                                                                                           | Mitigación propuesta                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Diversidad de ERPs de gestores                                                                 | Alta complejidad de integración                                                                   | Arquitectura de adaptadores por ERP, contrato canónico de integración y colas/reintentos. La carga manual no aplica para clientes, vendedores ni ventas. |
| Granularidad del matching venta↔máquina no definida a nivel de N° de serie (ver preguntas abiertas) | Reportes de rendimiento por equipo pueden quedar a nivel de tipo de máquina, no de equipo puntual | Validar con negocio si el ERP puede identificar el N° de serie exacto en cada venta                                                                                                     |
| API de facturación del Mandante sin contrato definido | No se puede emitir ni adjuntar automáticamente la Guía de Despacho Mandante→Gestor | Validar endpoint, autenticación, payload, respuesta PDF, timeouts, reintentos y trazabilidad de errores |
| Aceptación masiva de lotes sin inspección individual                                                 | Equipos dañados ingresan como "buenos"                                                            | Acciones en lote permitidas con modal de confirmación obligatorio que advierte sobre la omisión de inspección; el usuario puede revertir equipos individualmente tras una acción masiva |
| Ausencia de app móvil en esta fase                                                                   | No hay verificación física de uso indebido                                                        | Aceptado como limitación temporal, documentado como fuera de alcance                                                                                                                    |
