# Propuesta de Plataforma para la Gestión de Equipos Refrigerados

## 1. Resumen ejecutivo

El proyecto plantea el diseño de una plataforma independiente para el control y la trazabilidad del ciclo de vida de activos fríos (freezers y conservadoras de helados). Actualmente, la empresa propietaria de los activos (el "Mandante", ej. Carozzi) carece de visibilidad y control real sobre el estado, ubicación y uso de sus equipos una vez entregados a los gestores autorizados. Esto genera ineficiencias, pérdidas por robo o daño, y mal uso de los activos por parte de los clientes finales (por ejemplo, almacenar productos ajenos).

La solución propuesta consiste en un sistema de gestión modular desacoplado de los ERP externos, pero integrado con ellos mediante APIs. La plataforma permitirá al Mandante y los Gestores gestionar los activos desde su ingreso y asignación hasta su disposición final. El objetivo principal es desarrollar un prototipo navegable (maqueta no funcional) orientado a presentar la solución a clientes potenciales y validar el flujo operativo.

***

## 2. Contexto

La iniciativa surge a partir de las necesidades detectadas en la operación de marcas como Carozzi y sus gestores (como Ice Free o Dimer). El Mandante adquiere los equipos refrigerados y los entrega en comodato a los gestores para que estos los coloquen en los puntos de venta (minimarkets, almacenes).

### Problemas identificados

* **Falta de visibilidad:** El Mandante no conoce el estado real ni la ubicación exacta de miles de activos en terreno.
* **Uso indebido de activos:** Clientes finales utilizan el espacio de frío para almacenar carnes, pollos u otros productos ajenos al negocio del Mandante.
* **Control manual ineficiente:** El intercambio de información entre el Mandante y los gestores se realiza mediante planillas Excel propensas a errores y desactualizaciones.
* **Diversidad de sistemas:** Los gestores utilizan distintos sistemas ERP (SAP, Odoo, ERP Isstec u otros), lo que dificulta una integración directa y uniforme.

***

## 3. Desarrollo del contenido

### 3.1. Arquitectura y enfoque del sistema

* **Resumen:** Se propone una plataforma web independiente con base de datos propia, integrada a los ERP de los gestores mediante APIs. Esto permite que el sistema funcione de manera homogénea independientemente de si el Gestor utiliza SAP, Odoo, ERP Isstec u otro software de gestión.
* **Conceptos clave:** Abstracción del ERP, integración vía API, base de datos independiente.
* **Requisitos:** Sincronización automática de clientes, vendedores y transacciones de venta desde el ERP del Gestor hacia la plataforma de activos.

### 3.2. Módulo del Mandante (Propietario de los Activos)

* **Resumen:** Panel de control para el dueño de los equipos (ej. Carozzi). Permite cargar activos, administrar gestores y autorizar solicitudes críticas de movimiento o bajas.
* **Funcionalidades clave:**
  * **Maestro de Equipos:** Carga masiva inicial de activos (marca, modelo, serie, grupo/familia/tipo) mediante planilla Excel/API; no existe alta unitaria.
  * **Gestión de Gestores:** Alta y administración de las empresas gestoras autorizadas, incluyendo múltiples direcciones/sucursales.
  * **Asignación de Activos:** Selección y despacho de lotes de máquinas hacia un Gestor específico, con emisión de Guía de Despacho vía API de facturación del Mandante.
  * **Autorización de Movimientos:** Validación de solicitudes de baja (por siniestro, robo o destrucción) antes de actualizar el inventario.
  * **Control de Servicios Técnicos y SLA:** Monitoreo de tiempos de reparación por parte de proveedores externos.
  * **Trazabilidad e Inventario:** Historial completo del ciclo de vida de cada máquina y consulta de reportes georreferenciados (mapas de ubicación).

### 3.3. Módulo del Gestor

* **Resumen:** Herramienta para que el Gestor administre los equipos asignados por el Mandante, controle su entrega al cliente final en los puntos de venta y gestione las solicitudes de nuevo equipo enviadas por los vendedores desde la aplicación móvil.
* **Funcionalidades clave:**
  * **Recepción de Equipos:** Proceso de aceptación o rechazo (con registro de daños o discrepancias) de las máquinas enviadas por el Mandante.
  * **Asignación a Clientes:** Vinculación de un equipo a un cliente final; la Guía de Despacho se gestiona desde el listado de asignaciones realizadas.
  * **Solicitudes de Movimiento:** Creación de peticiones de retiro, cambio de equipo o baja (por robo/incendio) dirigidas al Mandante.
  * **Solicitudes de Nuevo Equipo (bandeja de entrada):** Gestión directa por parte del Gestor de las solicitudes de nuevo equipo enviadas por los vendedores desde la aplicación móvil. El Gestor revisa, analiza stock, pospone o descarta sin intervención del Mandante. Al convertir una solicitud en asignación, el sistema pre-selecciona automáticamente el equipo y cliente (RN-26 a RN-29).
  * **Control de Inventario y Mapa:** Visualización geográfica de los activos y programación de auditorías físicas en terreno.
  * **Reportes de Rendimiento:** Comparación de las ventas de helados del cliente frente a la cantidad de máquinas asignadas para evaluar la rentabilidad del activo.

### 3.4. Aplicación móvil (operación en terreno)

* **Resumen:** Herramienta móvil para uso del personal de terreno (vendedores o transportistas) enfocada en la verificación y auditoría física de los activos, y en la creación de solicitudes de nuevo equipo.
* **Funcionalidades clave:**
  * **Lectura de Código de Barras / QR:** Identificación rápida del activo en el punto de venta.
  * **Toma de Inventario:** Confirmación de la presencia física de la máquina.
  * **Registro de Evidencia:** Captura fotográfica de la máquina y su estado, permitiendo reportar si contiene productos no autorizados o si presenta daños.
  * **Solicitud de Nuevo Equipo:** El vendedor selecciona un equipo específico disponible (por serie, marca, modelo) del catálogo de equipos sin cliente asignado y en buen estado, y lo solicita para un cliente final. La solicitud llega directamente al Gestor, sin intervención del Mandante (RN-27).

### 3.5. Alcance de la maqueta (fase inicial)

* **Resumen:** El entregable inmediato será un prototipo interactivo no funcional (maqueta navegable).
* **Restricción:** No procesará datos reales ni ejecutará lógica de negocio en el backend; su propósito es simular la experiencia de usuario y el flujo de navegación para aprobación comercial.

***

## 4. Funcionalidades identificadas

* **Autenticación (Login):** Acceso diferenciado por perfiles (Mandante, Gestor).
* **Carga de Archivos:** Importación masiva de equipos del Mandante mediante planilla Excel/API. Clientes, vendedores y ventas no se cargan manualmente; provienen del ERP vía API.
* **Maestro de Equipos:** Registro único de cada activo con sus atributos técnicos (número de serie, marca, modelo, estado actual).
* **Flujo de Asignación y Recepción:** Herramienta bidireccional para despachar equipos y confirmar su recepción en bodega del Gestor.
* **Gestión de Guías de Despacho:** Emisión Mandante→Gestor vía API de facturación del Mandante y gestión Gestor→Cliente vía ERP Isstec o adjunto PDF externo, según integración.
* **Módulo de Siniestros e Incidencias:** Registro de pérdidas, robos o destrucción con carga de archivos de evidencia (actas policiales, fotografías).
* **Auditoría de Inventario Georreferenciada:** Módulo para programar inspecciones y registrar coordenadas GPS del activo en terreno.
* **Mapa de Calor y Rentabilidad:** Interfaz geográfica que muestra la ubicación de los equipos con indicadores visuales de rendimiento comercial (ventas del punto de venta vs. costo de mantenimiento del activo).

***

## 5. Reglas de negocio y requisitos

### Reglas de negocio

* El Gestor no puede dar de baja unilateralmente un equipo del Mandante; requiere una solicitud formal y la aprobación del Mandante en la plataforma.
* Un equipo solo puede ser asignado a un cliente final si previamente ha sido recibido y aceptado formalmente por el Gestor en el sistema.
* El estado visible del equipo debe cambiar automáticamente a "Asignado al Gestor" al ser asignado al Gestor, y se mantiene en ese estado tras la confirmación de recepción (la distinción "en camino" vs. "ya recibido" se modela en el estado del lote de recepción, no en el estado del equipo).
* Las auditorías de inventario de los activos deben registrar de manera obligatoria la ubicación por coordenadas GPS y evidencia fotográfica del estado del freezer.
* El Mandante no participa en la aprobación de solicitudes de nuevo equipo; el Gestor gestiona directamente las solicitudes enviadas por los vendedores desde la aplicación móvil (RN-26).
* El vendedor solicita un equipo específico disponible (por serie, marca, modelo), no un tipo de equipo y cantidad (RN-27).

### Requisitos técnicos

* **Independencia del ERP:** La lógica de negocio de los activos debe residir fuera de los ERPs de los gestores.
* **Compatibilidad de Integración:** La arquitectura debe exponer endpoints API/adaptadores para integrarse con ERP Isstec, SAP, Odoo y otros sistemas. La carga manual queda limitada a equipos del Mandante.
* **Foco del Prototipo:** El desarrollo inicial debe limitarse a una maqueta interactiva navegable para demostración comercial.

***

## 6. Entidades y conceptos clave

* **Mandante:** Empresa propietaria y proveedora de los equipos fríos (ej. Carozzi).
* **Gestor:** Empresa encargada de la logística de distribución y colocación de los activos en los puntos de venta. Antes se denominaba Gestor en algunos documentos/rutas heredadas.
* **Cliente Final:** Punto de venta comercial (minimarket, almacén) donde se instala físicamente la máquina para la venta al público.
* **Activo (Equipo Refrigerado):** Unidad física (congeladora, conservadora) identificada de forma única por su número de serie.
* **SLA (Service Level Agreement):** Acuerdo de nivel de servicio que define los tiempos máximos permitidos para la reparación de un equipo por parte de los servicios técnicos autorizados.

***

## 7. Flujo general del proceso

<figure><img src=".gitbook/assets/ChatGPT Image 7 jul 2026, 03_10_41 p.m.png" alt=""><figcaption></figcaption></figure>

***

## 8. Decisiones y supuestos

* **Desacoplamiento:** Se decide no construir la solución dentro del ERP propietario del Mandante para facilitar la comercialización de la plataforma como un producto SaaS independiente para otros sectores o empresas de consumo masivo.
* **Uso de Base de Datos Propia:** Se asume que el sistema operará con almacenamiento de datos aislado, consumiendo datos maestros del ERP mediante integraciones programadas.
* **Postergación de la App Móvil:** Se decide priorizar el diseño de los paneles web (Mandante y Gestor) en la primera fase de la maqueta interactiva, dejando la interfaz de la aplicación móvil de terreno para una etapa posterior.

***

## Contexto consolidado

Este documento resume la propuesta de desarrollo de una Plataforma de Gestión de Equipos Refrigerados. Su propósito es solucionar la pérdida de control e ineficiencia logística que experimentan las empresas productoras (Mandantes) al ceder sus conservadoras de frío en comodato a gestores y comercios minoristas. El sistema se estructurará de forma desacoplada de los ERPs tradicionales, operando mediante interfaces web independientes apoyadas en una base de datos propia e integraciones vía API.

La plataforma controlará el ciclo de vida del activo a través de dos perfiles principales: el Mandante, encargado del control de flota, autorizaciones de baja y monitoreo de servicios técnicos; y el Gestor, responsable de la recepción, asignación local, inventario y medición del rendimiento comercial del activo. El proyecto iniciará con la construcción de un prototipo navegable no funcional diseñado para validar la experiencia de usuario y los flujos lógicos clave antes de iniciar la fase de desarrollo de software.
