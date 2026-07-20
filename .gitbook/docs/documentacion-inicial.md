# Documentación Inicial

## Resumen ejecutivo

Este proyecto propone el diseño de una **plataforma independiente** para el control y trazabilidad del ciclo de vida de activos fríos (freezers y conservadoras de helados) que un **Mandante** (dueño de los equipos, ej. Carozzi) entrega en comodato a **Gestores** (antes denominados Gestores, ej. IceFree/Dimer) para su colocación en puntos de venta.

Hoy el Mandante pierde visibilidad y control sobre sus activos una vez que salen de su poder: no sabe con certeza dónde están, en qué estado se encuentran, ni si están siendo usados correctamente. El control se realiza manualmente vía planillas Excel, lo que genera errores, pérdidas por robo o daño, y uso indebido de los equipos (por ejemplo, almacenar productos ajenos al negocio).

La solución es una plataforma web modular, desacoplada de los ERP de cada gestor pero integrable con ellos vía API (SAP, Odoo, ERP Isstec), que administre el ciclo de vida completo del equipo: carga masiva, asignación, recepción, asignación a cliente final, inventario, movimientos, incidencias/bajas y reportes.

**Entregable de esta primera fase:** un **prototipo interactivo no funcional** (maqueta navegable, por ejemplo en Google Stitch) que permita validar el flujo de usuario y presentar la solución a clientes potenciales, sin lógica de negocio real ni datos productivos.

## Problema

* El Mandante no tiene visibilidad del estado ni la ubicación real de sus activos en terreno.
* Clientes finales usan los equipos de frío para fines no autorizados (ej. almacenar carnes o productos ajenos).
* El intercambio de información Mandante–Gestor se hace por planillas Excel y comunicaciones manuales, propensas a error y desactualización.
* Los gestores usan distintos ERP: algunos usan un sistema desarrollado por **Isstec** (el proveedor de esta plataforma), otros usan SAP, Odoo, u otros sistemas. Esto hace difícil una integración uniforme.
* No existe un flujo formal ni trazable para dar de baja, reparar o mover un equipo.

## Solución propuesta

Una plataforma web con base de datos propia, con dos paneles principales:

* **Panel del Mandante:** administración de la carga masiva de equipos, gestores, asignación de lotes de equipos, autorización de movimientos/bajas, control de SLA de servicio técnico, trazabilidad e informes (incluyendo geolocalización).
* **Panel del Gestor:** recepción e inspección de equipos asignados, asignación a clientes finales, solicitudes de movimiento/baja, gestión de inventario (solicitud, consulta, ajustes), consultas de clientes/vendedores sincronizados y reportes de rendimiento/ventas.

La plataforma se integra con los ERP de los gestores mediante API. Algunos gestores usan un ERP desarrollado por **Isstec** (el proveedor de esta plataforma), mientras que otros usan **SAP, Odoo** u otros sistemas. Clientes, vendedores y ventas provienen de esas integraciones; la carga manual queda acotada a la carga masiva de equipos del Mandante.

> **Nota sobre Isstec:** Isstec es la empresa proveedora que desarrolla esta plataforma. Algunos gestores ya usan un ERP que Isstec construyó; la nueva plataforma debe integrarse con ese ERP ("ERP Isstec") cuando esté disponible, pero también debe funcionar independientemente para gestores que usan otros ERP (SAP, Odoo) o sin ERP integrado.

> **Nota de alcance compartido:** la aplicación móvil de terreno se documenta como una iniciativa complementaria en el repositorio **Prototipo Móvil Máquinas**. El prototipo web actual no incorpora pantallas móviles ni captura desde dispositivos, pero debe consumir y mostrar los resultados operativos que esa aplicación envíe.

## Objetivos

1. Dar al Mandante visibilidad completa y auditable del ciclo de vida de cada activo.
2. Formalizar y trazar el proceso de carga masiva, aceptación/rechazo e inspección de equipos por parte del Gestor.
3. Reducir el uso de planillas Excel como mecanismo de control operativo.
4. Permitir que la plataforma se integre con múltiples ERP de gestores sin depender de uno solo.
5. Entregar un prototipo navegable que sirva como base de validación comercial y como especificación funcional para el desarrollo posterior.

## Alcance

### Dentro del alcance (Fase 1 — Maqueta)

* Paneles web para Mandante y Gestor.
* Flujos de: carga masiva/maestro de equipos, asignación Mandante → Gestor, recepción/inspección/aceptación o rechazo, asignación a cliente final, solicitudes de movimiento y baja, gestión de inventario, reportes e informes, geolocalización (mapa).
* **Generación de Guías de Despacho** para el traslado físico de equipos (Mandante → Gestor y Gestor → Cliente Final). Para Mandante→Gestor se requiere integración con la API de facturación del Mandante que devuelve el PDF de la guía.
* Definición de integración conceptual con ERP Isstec, SAP, Odoo — vía API, de forma automática. Clientes, vendedores y ventas se sincronizan desde ERP; carga manual de archivos solo para equipos del Mandante.

### Fuera del alcance (esta fase)

* Pantallas, captura de dispositivo e implementación técnica de la aplicación móvil de terreno; se gestionan en el proyecto complementario **Prototipo Móvil Máquinas**.
* Backend funcional real / procesamiento de datos productivos (el entregable es una maqueta no funcional).
* Implementación real de los conectores API con SAP/Odoo/ERP Isstec (solo diseño conceptual).
* **Gestión de máquinas propias del Gestor** — confirmado explícitamente fuera de alcance en reunión de validación del 03/07/2026; todo equipo del sistema pertenece al Mandante.

## Público objetivo

* **Mandante:** empresas dueñas de activos fríos que los entregan en comodato (ej. Carozzi).
* **Gestor:** empresas que administran y colocan los equipos en puntos de venta (ej. IceFree, Dimer).
* **Cliente final:** punto de venta (minimarket, almacén) donde se instala el equipo — no es usuario directo del sistema en esta fase, pero es un actor relevante del proceso de negocio.

## Visión general del proyecto

El sistema estructura el negocio en torno a dos roles con paneles diferenciados y un flujo de estados del activo (Activo, Asignado al Gestor, Asignado a Cliente, En SSTT, Pendiente de Revisión, Rechazado, Baja, etc.), gobernado por reglas de autorización donde el Gestor no puede dar de baja unilateralmente un equipo: siempre requiere aprobación del Mandante según roles aprobadores y voto vinculante configurados. Ver modelo unificado de estados en [reglas-de-negocio.md](reglas-de-negocio.md "mention").

## Documentos relacionados

| Documento                                                                | Contenido                                                              |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [README (1).md](<README (1).md> "mention")                               | Documentación del prototipo, que indica de forma detallada cada vista. |
| [diagramas-del-sistema.md](diagramas-del-sistema.md "mention")           | Diagramas Mermaid (casos de uso, flujos, ERD, secuencia, navegación)   |
| [requerimientos-de-producto.md](requerimientos-de-producto.md "mention") | Requisitos funcionales priorizados (MoSCoW)                            |
| [reglas-de-negocio.md](reglas-de-negocio.md "mention")                   | Reglas de negocio, supuestos y preguntas abiertas                      |
| [user-personas.md](user-personas.md "mention")                           | Perfiles de usuario, necesidades y escenarios de uso                   |
| [arquitectura-de-alto-nivel.md](arquitectura-de-alto-nivel.md "mention") | Definición de alto nivel de la arquitectura que tendrá la aplicación   |
