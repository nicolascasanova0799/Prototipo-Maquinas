# User Personas

> Los perfiles a continuación se construyeron a partir de los actores explícitamente mencionados en [.](./ "mention"). Los nombres y datos personales son ficticios; el contexto de negocio, objetivos y frustraciones están basados en los documentos fuente. Donde se infiere algo no explícito, se marca como **(supuesto)**.

***

## Persona 1 — Administrador del Mandante

**Nombre ficticio:** Marcela Reyes\
**Rol:** Jefa de Activos / Administradora de Flota en Carozzi\
**Perfil de sistema:** Usuario del **Panel del Mandante**

### Contexto

Marcela es responsable de controlar los cientos o miles de freezers y conservadoras que Carozzi entrega en comodato a gestores como IceFree y Dimer. Hoy gestiona esta información en planillas Excel que pueden quedar desactualizadas.

### Objetivos

* Saber en todo momento cuántos equipos tiene, en qué estado y con qué Gestor.
* Autorizar (o rechazar) solicitudes de baja, cambio o reparación de equipos.
* Controlar que los servicios técnicos cumplan los SLA acordados.
* Visualizar la distribución geográfica de los activos y su rendimiento comercial.

### Necesidades

* Un maestro único de equipos, alimentado por carga masiva/API, sin alta individual.
* Un flujo formal de asignación de equipos a gestores.
* Alertas/autorizaciones cuando un gestor solicita mover o dar de baja un equipo.
* Reportes de ventas e informes por equipo y geolocalización.

### Frustraciones actuales

* No sabe si un Gestor "aceptó por error" un lote de máquinas donde había una en mal estado.
* No tiene trazabilidad histórica de por dónde ha pasado una máquina.
* Depende de que el Gestor le informe manualmente los problemas.

### Escenario de uso

Marcela genera o recibe la planilla masiva con las máquinas a enviar a un gestor específico, selecciona el gestor en el sistema y confirma la asignación. El sistema emite la Guía de Despacho vía API de facturación del Mandante, adjunta el PDF recibido y notifica automáticamente al gestor. Días después, Marcela recibe una notificación de recepción/reparo: algunas máquinas fueron rechazadas por daños. Revisa el detalle y decide si autoriza el reparo o el retiro definitivo del equipo.

***

## Persona 2 — Operador del Gestor

**Nombre ficticio:** Rodrigo Salas\
**Rol:** Encargado de Operaciones en IceFree (gestor)\
**Perfil de sistema:** Usuario del **Panel del Gestor**

### Contexto

Rodrigo recibe lotes de equipos desde el Mandante y es responsable de inspeccionarlos, aceptarlos o rechazarlos, y luego asignarlos a los puntos de venta (clientes finales) de su cartera. También gestiona inventarios físicos periódicos.

### Objetivos

* Recibir e inspeccionar visualmente los equipos que llegan, aceptando los que están en buen estado y reportando los que no.
* Asignar equipos a clientes de forma ágil.
* Solicitar al Mandante el retiro, cambio o baja de un equipo (por robo, incendio, falla, etc.), sujeto a la matriz de aprobación configurada.
* Ver el rendimiento de ventas de cada punto de venta versus el equipo asignado.

### Necesidades

* Un flujo claro de "aceptar / rechazar" al recibir equipos, con evidencia de por qué se rechaza.
* Completar checklists de inspección con evidencia cuando el tipo de activo lo requiera.
* Consultar su cartera de clientes y vendedores sincronizados desde su propio ERP (SAP u otro), sin mantenerlos manualmente en la plataforma.
* Reportes propios de ventas y rendimiento por equipo.

### Frustraciones actuales

* Si acepta por error un lote completo sin detectar una máquina dañada, no hay forma fácil de corregirlo después **(punto identificado explícitamente como pregunta abierta en el flujo de carga)**.
* No tiene un canal formal para solicitar bajas; hoy depende de comunicación informal con el Mandante.
* Maneja distintos sistemas según el gestor (algunos con ERP propio tipo SAP/Odoo, otros no).

### Escenario de uso

Rodrigo recibe una notificación de que debe cargar/recibir un lote de máquinas. Realiza la inspección visual: la mayoría están en buen estado y las acepta, quedando cargadas en el sistema para poder asignarlas a clientes. Una máquina presenta daños, por lo que la marca como "con problema"; esa máquina queda con estado pendiente y se genera una notificación de recepción/reparo hacia el flujo correspondiente. Si el reparo aplica, la máquina se excluye de su lista de asignación hasta que se resuelva.

***

## Persona 3 — Cliente Final (Punto de Venta)

**Nombre ficticio:** Almacén Don Luis\
**Rol:** Punto de venta que recibe el equipo en su local\
**Perfil de sistema:** **No es usuario directo del sistema en esta fase** — es un actor de negocio referenciado por el Gestor.

### Contexto

Es el minimarket o almacén donde finalmente se instala el freezer/conservadora para la venta de helados u otros productos del Mandante.

### Objetivos (desde la perspectiva del negocio)

* Contar con el equipo en buen estado para exhibir y vender los productos del Mandante.

### Frustración que el sistema busca resolver

* Uso indebido del equipo (almacenar productos ajenos al negocio, como carnes o pollos), lo cual el sistema busca detectar mediante auditorías futuras (app móvil, fuera de alcance de esta fase).

### Nota

Este actor no requiere pantallas propias en el prototipo, pero es relevante para los flujos de "Asignación a Cliente Final" y para los futuros reportes de auditoría de uso.

***

## Persona 4 — Operador de Terreno _(fuera de alcance de esta fase — referencia futura)_

**Nombre ficticio:** Katherine Muñoz\
**Rol:** Vendedora/Auditora de terreno del Gestor\
**Perfil de sistema:** Futura app móvil **(explícitamente pospuesta en la propuesta, sección 3.4 y 8)**

### Contexto

Visita los puntos de venta para verificar físicamente que el equipo esté presente, en buen estado y usado correctamente.

### Objetivos

* Escanear el código/QR del equipo para identificarlo rápidamente.
* Confirmar presencia física (toma de inventario).
* Registrar evidencia fotográfica y ubicación GPS, incluyendo si detecta productos no autorizados dentro del equipo.

> Se incluye este perfil solo como **referencia documental**, ya que la propuesta indica explícitamente que la app móvil no debe considerarse en esta etapa. No se generarán pantallas ni prompts de Stitch para este perfil.

***

## Resumen comparativo

| Persona                          | Panel                    | Prioridad en el prototipo           | Estado                             |
| -------------------------------- | ------------------------ | ----------------------------------- | ---------------------------------- |
| Marcela (Mandante)               | Panel del Mandante       | Alta                                | En alcance                         |
| Rodrigo (Gestor)                 | Panel del Gestor         | Alta                                | En alcance                         |
| Almacén Don Luis (Cliente Final) | N/A (actor referenciado) | Media (como dato, no como pantalla) | En alcance parcial                 |
| Katherine (Terreno)              | App móvil                | N/A                                 | **Fuera de alcance** (fase futura) |
