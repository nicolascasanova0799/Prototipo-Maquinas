# Minuta de Revisión de Maqueta - Plataforma de Gestión de Equipos Refrigerados

---

# 1. Resumen ejecutivo

* **Objetivo de la reunión:** Revisar el prototipo interactivo (maqueta) de la Plataforma de Gestión de Equipos Refrigerados (ISSTEC) para identificar ajustes funcionales, de diseño y de flujo antes de proceder a la siguiente etapa de desarrollo.
* **Temas tratados:** Ajustes de marca (cambio de Sabori a Carozzi), consistencia de datos en el Dashboard, simplificación de menús de configuración (maestros), flujos de asignación y autorización de movimientos, e integraciones con sistemas externos (ERP y facturación).
* **Conclusiones generales:** El prototipo cumple con la estructura base definida. Se requiere corregir inconsistencias visuales y simplificar pantallas eliminando opciones manuales redundantes que serán resueltas mediante procesos automatizados (cargas masivas o APIs).

---

# 2. Contexto de la reunión

Se revisó la maqueta navegable de la plataforma web ISSTEC desde la perspectiva del perfil **Mandante** (dueño de los equipos) y del perfil **Distribuidor/Gestor**. El proyecto se encuentra en fase de validación de diseño de interfaz (UI/UX) y de flujos de navegación básicos.

---

# 3. Desarrollo de la reunión

### 3.1. Identidad Visual y Datos del Dashboard
* **Resumen de lo discutido:** Se solicitó cambiar el cliente de referencia y corregir inconsistencias en las métricas numéricas presentadas.
* **Observaciones:** 
  * Reemplazar la marca "Sabori" por "Carozzi" (incluyendo el logotipo).
  * Los números del panel de control no cuadran (la suma de equipos activos, en servicio técnico y solicitudes pendientes no coincide con el total de equipos mostrado).
* **Decisiones tomadas:** Modificar el texto y logo de "Sabori" por "Carozzi" y recalcular las cifras del Dashboard para que guarden consistencia matemática.

### 3.2. Terminología y Flujos de Asignación de Equipos
* **Resumen de lo discutido:** Se evaluó el lenguaje del menú de navegación y la lógica de asignación.
* **Observaciones:**
  * Reemplazar el término "Distribuidor" por "Gestor" en los títulos de asignación de equipos.
  * El botón "Nueva asignación" dentro del menú de "Autorización de Movimientos" genera confusión de flujo y debe corregirse.
* **Decisiones tomadas:** Cambiar la etiqueta "Distribuidor" por "Gestor" en las pantallas indicadas y reubicar o corregir el botón de "Nueva asignación" en el módulo correspondiente.

### 3.3. Búsqueda y Trazabilidad de Activos
* **Resumen de lo discutido:** Revisión del comportamiento del buscador de equipos en el módulo de trazabilidad.
* **Observaciones:** El buscador actual exige ingresar el número de serie exacto.
* **Propuestas de mejora:** Implementar un buscador predictivo e integral que permita buscar por modelo, marca o tipo de máquina, desplegando opciones sugeridas para selección.
* **Decisiones tomadas:** Diseñar el buscador con comportamiento predictivo/asistido para la versión final.

### 3.4. Integración de Guías de Despacho
* **Resumen de lo discutido:** Definición del funcionamiento técnico detrás de la generación de guías de despacho de equipos.
* **Observaciones:** El sistema debe consumir un servicio web (API) del sistema de facturación del Mandante para emitir la guía de despacho real, esperar la respuesta y adjuntar automáticamente el PDF generado.
* **Decisiones tomadas:** Definir esta integración como un requisito funcional crítico para la fase de desarrollo.

### 3.5. Depuración de Menús de Configuración (Maestros)
* **Resumen de lo discutido:** Simplificación de las tablas maestras de administración del Mandante.
* **Observaciones:**
  * **Creación manual de equipos:** El Mandante no creará equipos uno por uno. El botón "Nuevo equipo" debe eliminarse, manteniendo únicamente la opción de "Carga masiva" mediante planilla Excel.
  * **Clasificaciones:** Los menús de "Grupo de Máquinas", "Familia de Máquinas", "Marcas" y "Modelos" deben ser eliminados de la navegación, ya que estas categorías vendrán especificadas directamente dentro de la planilla de carga masiva de equipos.
  * **Gestores (Distribuidores):** Un gestor puede tener múltiples sucursales o bodegas de destino. El formulario de creación/edición de gestores debe permitir asociar más de una dirección física.
  * **Clientes y Vendedores:** Los distribuidores no deben poder crear o editar clientes o vendedores en este sistema, ya que dicha información proviene exclusivamente del ERP sincronizado. Esas pantallas en el perfil del distribuidor deben ser de solo lectura.
  * **Ubicaciones y Bodegas:** Cada bodega o ubicación registrada debe contar con un campo obligatorio de "RUT" para identificar claramente al dueño (Mandante o Gestor) de la instalación.
* **Decisiones tomadas:** Eliminar los menús y botones redundantes indicados, agregar la funcionalidad de direcciones múltiples a gestores y el campo RUT a bodegas.

### 3.6. Lógica de Aprobación de Movimientos
* **Resumen de lo discutido:** Definición de la matriz de autorización para solicitudes enviadas por el distribuidor.
* **Observaciones:** El sistema debe permitir configurar si una solicitud (ej. de baja o traslado de equipo) requiere aprobación de uno o varios roles específicos (ej. Administrador y Super Usuario) y si estas aprobaciones son vinculantes (todos deben aprobar) o no vinculantes (basta con la aprobación de uno).
* **Decisiones tomadas:** Incorporar los parámetros de "Rol aprobador" y "Voto vinculante" en el maestro de motivos de movimiento para automatizar el flujo de notificaciones y firmas por correo electrónico.

### 3.7. Módulo de Planillas de Inspección / Verificación de Equipos

* **Resumen de lo discutido:** Se revisó la estructura de las listas de chequeo que utilizará el Gestor al momento de recibir los equipos o realizar auditorías. El objetivo es asegurar un control estandarizado del estado físico y funcional de las máquinas.
* **Funcionalidades y características del prototipo:**
  * Plantillas por Tipo de Activo: La plataforma cuenta con plantillas predefinidas según la categoría del equipo (ej. Inspección Estándar de Recepción, Vitrinas Refrigeradas, Congeladores, Barquilleras).
  * Tipos de Verificación por Ítem: Cada ítem de la lista admite distintas dinámicas de respuesta, tales como casillas de selección (Checkboxes), campos de texto o captura obligatoria de fotografías (como evidencia del estado de la pintura, sellos herméticos o temperatura interna).
  * Flujo de Recepción Asociado: Cuando el Gestor registre la llegada de un lote de equipos, el sistema le exigirá completar la planilla de inspección correspondiente para cada máquina antes de permitir el cambio de estado a "Recibido".
* **Dudas y temas pendientes:**
  * Queda pendiente resolver la integración visual de estas planillas dentro del flujo de recepción del distribuidor, definiendo si la encuesta se desplegará de forma obligatoria pantalla por pantalla o si se permitirá una aprobación masiva en caso de que los equipos no presenten observaciones.

### 3.8. Direcciones Múltiples en Gestores (Distribuidores)
* **Resumen de lo discutido**: Se analizó la necesidad de que el perfil de cada Gestor soporte múltiples direcciones físicas de entrega.
* **Detalle de la observación**: Distribuidores de gran envergadura operan con más de una sucursal o centro de distribución local. El prototipo debe permitir registrar de forma dinámica múltiples direcciones para un mismo Gestor.
* **Justificación operativa**: Al momento de generar una guía de despacho desde el Mandante, el usuario requiere seleccionar obligatoriamente la sucursal de destino específica a la que se envían físicamente los equipos refrigerados.

### 3.9. Atribución de RUT en Ubicaciones y Bodegas
* **Resumen de lo discutido**: Se evaluó el formulario de registro de la sección de Ubicaciones y Bodegas de almacenamiento.
* **Detalle de la observación**: Dado que cada espacio de almacenamiento o bodega física pertenece a una entidad jurídica en particular, el formulario de creación y edición debe incorporar obligatoriamente el campo de RUT del responsable.
* **Justificación operativa**: Este dato permite al sistema identificar inequívocamente la propiedad del espacio (si la bodega pertenece al Mandante o a un Gestor específico) para efectos de control de inventario y responsabilidades sobre los activos allí alojados.

### 3.10 Integración de Guías de Despacho con APIs de ERP / Facturación
* **Resumen de lo discutido:** Se definió la estrategia para la emisión de guías de despacho, estableciendo que el proceso no debe ser manual, sino automatizado mediante integraciones directas con los sistemas de facturación o ERP de cada actor.
* **Detalle de la observación:** Cada vez que ocurra un movimiento de entrega o despacho (tanto en el perfil de Mandante al enviar equipos al Gestor, como en el perfil de Gestor al distribuir equipos a los clientes finales), el sistema debe respaldar legalmente el traslado.
* **Flujo y funcionamiento de la integración:**
  * El usuario selecciona los equipos y presiona la acción de envío (ej. "Enviar al Distribuidor" o "Asignar a Cliente").
  * La plataforma ISSTEC consume de manera inmediata una API expuesta por el sistema de facturación o ERP correspondiente (del Mandante o Gestor, según el caso).
  * Se transmiten los datos requeridos para la emisión del documento tributario.
  * El ERP procesa la solicitud, genera la guía de despacho y devuelve el documento en formato PDF a la plataforma.
  * El sistema ISSTEC asocia y almacena automáticamente este archivo PDF en la transacción del despacho correspondiente para su consulta o descarga.

---

# 4. Observaciones al prototipo

| Elemento afectado | Observación | Motivo / Problema | Cambio sugerido | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **Encabezado / Login** | Uso de marca "Sabori Chile" | Cambio de cliente objetivo | Cambiar textos y logos por "Carozzi" | Alta |
| **Métricas Dashboard** | Sumatoria inconsistente | Los números de equipos no cuadran | Ajustar datos fijos de la maqueta | Media |
| **Navegación / Textos** | Uso de palabra "Distribuidor" | Inconsistencia de terminología | Reemplazar por "Gestor" | Media |
| **Autorización de Movimientos** | Botón "Nueva asignación" mal ubicado | Ruido en el flujo de usuario | Reubicar o corregir acción del botón | Media |
| **Buscador (Trazabilidad)** | Búsqueda rígida por serie | Dificultad para localizar equipos | Convertir en buscador predictivo (por marca, modelo, etc.) | Alta |
| **Maestro de Equipos** | Botón "Nuevo equipo" habilitado | Riesgo de ingreso manual erróneo | Eliminar creación unitaria. Mantener solo carga masiva Excel | Alta |
| **Maestro de Gestores** | Dirección única por gestor | Gestores operan en varias sucursales | Permitir agregar múltiples direcciones/sucursales | Alta |
| **Módulo Maestros (Navegación)**| Menús redundantes ("Familia", "Grupo", "Marca", "Modelo") | Información implícita en la carga masiva | Eliminar estos submenús del menú lateral | Alta |
| **Ubicaciones y Bodegas** | Falta campo "RUT" en formulario | Imposibilidad de identificar propiedad | Agregar campo RUT obligatorio asociado a la bodega | Alta |
| **Clientes y Vendedores (Distribuidor)**| Formulario de edición/creación activo | Información de clientes pertenece al ERP | Deshabilitar edición. Configurar como vista de solo lectura | Alta |
| **Maestro Motivos de Movimiento** | Flujo de aprobación rígido | Falta flexibilidad en autorizaciones | Agregar campo para definir Roles Aprobadores y si es vinculante | Media |

---

# 5. Cambios solicitados

* [ ] Reemplazar todos los logotipos y menciones de "Sabori Chile" por "Carozzi".
* [ ] Modificar los contadores del Dashboard para que el desglose de equipos sume con precisión el "Total de equipos".
* [ ] Cambiar el término "Distribuidor" por "Gestor" en todos las menciones en el prototipo tanto en modo Mandante como Gestor.
* [ ] Resolver el comportamiento y destino del botón "Nueva asignación" en la pantalla de Autorización de Movimientos.
* [ ] Eliminar el botón "Nuevo equipo" en el maestro de equipos; mantener exclusivamente el botón de "Carga masiva".
* [ ] Ocultar/eliminar del menú lateral los submenús: Grupo de Máquinas, Familia de Máquinas, Marcas y Modelos.
* [ ] Modificar el formulario de registro de Gestores para permitir la entrada de múltiples direcciones/sucursales de entrega.
* [ ] Agregar el campo obligatorio "RUT" en el formulario de creación/edición de Ubicaciones y Bodegas.
* [ ] Bloquear la edición y creación de Clientes y Vendedores en el perfil del Distribuidor (convertir en pantallas de solo lectura).
* [ ] Actualizar el modal de "Agregar motivo de movimiento" para incluir los campos "Requiere aprobación de (Rol)" y la casilla de verificación "Es vinculante".
* [ ] Resolver la integración visual de las planillas de inspección dentro del flujo de recepción del distribuidor.
* [ ] Resolver para agregar direcciones multiples a entidades (Gestores, Ubicaciones y Bodegas).
* [ ] Agregar el campo obligatorio "RUT" en el formulario de creación/edición de Gestores.
* [ ] Implementar el prototipo de la generacion de guias de despachos.

---

# 6. Decisiones y acuerdos

* Se valida que el sistema de gestión de activos mantendrá independencia de los ERPs, pero capturará los datos de los clientes y vendedores de forma automática a través de APIs de integración, evitando que se duplique el ingreso de información de manera manual.
* Se aprueba el prototipo de "Planillas de Inspección" (Checklists) para la recepción y control de equipos por parte del distribuidor.

---

# 7. Riesgos, dudas y temas abiertos

* **Flujo de Logística de Distribución:** Aún se debe analizar a detalle cómo el Distribuidor registra la asignación al cliente final, específicamente si requiere acoplar un módulo de transporte o si se manejará como un estado plano en el sistema.
* **Interacción del Checklist de Inspección:** Queda pendiente definir técnicamente cómo se vincula el resultado de las inspecciones de los equipos con el estado de recepción en la base de datos para reportar problemas de forma inmediata.

---

# 8. Próximos pasos

1. **Nicolas Casanova:** Implementar las correcciones acordadas en el prototipo interactivo antes del lunes.
2. **Manuel Aparicio:** Realizar una revisión final de la maqueta corregida junto con Román.
3. **Equipo de Proyecto:** Iniciar el levantamiento de requisitos para el módulo de Cobranzas de la plataforma "Ice Free".

---

# 9. Contexto consolidado para otra IA

### Contexto Consolidado

Este documento resume la sesión de revisión de la maqueta de la **Plataforma de Gestión de Equipos Refrigerados (ISSTEC)**. La plataforma está pensada como una solución desacoplada para el control del ciclo de vida de los activos de frío (freezers) de una gran empresa fabricante (originalmente Sabori, ahora redefinida comercialmente como **Carozzi**) que entrega sus equipos en comodato a distribuidores (**Gestores**) para su colocación en puntos de venta.

Durante la sesión se definieron cambios cruciales para simplificar la plataforma. Se acordó que la información del maestro de equipos se cargará exclusivamente mediante plantillas Excel masivas, eliminando la creación individual. Del mismo modo, datos dinámicos como clientes, vendedores, marcas, modelos y familias de máquinas se extraerán automáticamente de las planillas de carga o de la integración API con el ERP del Gestor, eliminando pantallas de ingreso manuales redundantes y bloqueando la edición por parte del Distribuidor. 

Técnicamente, se introdujo la necesidad de un flujo de aprobación flexible para los movimientos de activos en donde se pueda parametrizar qué roles deben autorizar una solicitud (baja, traslado, etc.) y si la aprobación tiene carácter vinculante o no. Finalmente, el equipo de diseño procederá a realizar estos ajustes sobre el prototipo interactivo para proceder con la aprobación de la maqueta y dar inicio al desarrollo del módulo de cobranzas en una etapa subsiguiente.