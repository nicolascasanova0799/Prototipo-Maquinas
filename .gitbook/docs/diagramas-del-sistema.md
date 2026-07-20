# Diagramas del Sistema

## 1. Diagrama de casos de uso

```mermaid
flowchart LR
    Mandante((Mandante))
    Gestor((Gestor))

    subgraph Sistema["Plataforma de Gestión de Equipos"]
        UC1[Login]
        UC2[Administrar Maestro de Equipos]
        UC3[Administrar Gestores]
        UC4[Asignar Equipos a Gestor]
        UC5[Autorizar Movimientos / Bajas]
        UC6[Consultar Trazabilidad]
        UC7[Ver Informes y Geolocalización]
        UC8[Recibir e Inspeccionar Equipos]
        UC9[Asignar Equipos a Clientes]
        UC10[Solicitar Movimiento / Baja]
        UC11[Gestionar Inventario]
        UC12[Consultar Clientes y Vendedores sincronizados]
        UC13[Ver Reportes de Ventas y Rendimiento]
        UC14[Consultar Guías de Despacho]
    end

    Mandante --> UC1
    Mandante --> UC2
    Mandante --> UC3
    Mandante --> UC4
    Mandante --> UC5
    Mandante --> UC6
    Mandante --> UC7
    Mandante --> UC14

    Gestor --> UC1
    Gestor --> UC8
    Gestor --> UC9
    Gestor --> UC10
    Gestor --> UC11
    Gestor --> UC12
    Gestor --> UC13
```

## 2. Diagrama de flujo — Carga y Recepción de Equipos

> Basado en `Flujo_Carga_de_Maquinas_ERP.pdf` (validado con imagen proporcionada por usuario) y actualizado con respuestas de la reunión de validación del 03/07/2026.

```mermaid
flowchart TD
    A["Carozzi genera planilla con máquinas para un Gestor específico"] --> B["Mandante selecciona Gestor, sucursal de destino y lote de equipos"]
    B --> B2["Mandante confirma y envía la asignación al Gestor"]
    B2 --> B3["Modal ofrece: Generar GD vía API / Subir PDF / Hacer más tarde"]
    B3 --> B4["Sistema registra equipos en estado 'Asignado al Gestor' y notifica al Gestor"]
    B4 --> B5["Si se pospuso, GD se gestiona desde Asignaciones o Guías de Despacho (RN-16)"]
    B5 --> C["Se genera notificación al Gestor"]
    C --> D["Gestor recibe notificación y debe recibir máquinas"]
    D --> D2["Gestor registra llegada del lote (botón Registrar llegada en recepciones.html)"]
    D2 --> E["Gestor realiza inspección visual/checklist de las máquinas"]
    E --> F{"¿Máquinas OK?"}

    F -->|"Sí, todas o algunas"| G["Gestor acepta las máquinas OK y se cargan al Sistema"]
    G --> H["Gestor inicia la asignación de máquinas a los clientes"]
    H --> O["Las máquinas quedan disponibles para asignar"]

    F -->|"No, una o más con problema"| I["Gestor notifica las máquinas con problemas"]
    I --> J["Máquinas quedan en estado Rechazado o Pendiente de Revisión"]
    J --> K["Llega notificación de Recepción/Reparo al Mandante"]
    K --> L{"¿Existen reparos?"}

    L -->|"Sí"| M["Se atienden los reparos"]
    M --> N["Máquinas con reparos se sacan de la lista de asignación del Gestor"]
    N --> O

    L -->|"No"| P["Máquinas quedan a la espera de retiro por el Mandante"]
    P --> O
```

{% hint style="info" %}
**Caso especial — Rechazo del lote COMPLETO** _(confirmado 03/07/2026, RN-9)_: si el Gestor reporta problema en **todas** las máquinas del lote, el sistema aplica el mismo mecanismo que para un equipo individual rechazado — no existe un flujo separado. El lote completo queda en estado "Rechazado", a la espera de que el Mandante lo retire.
{% endhint %}

<details>

<summary>Preguntas del diagrama fuente — Estado final: ¿Qué pasa si el Gestor no acepta las máquinas?</summary>

RESPONDIDA: el flujo permite aceptación condicional (inspecciona y acepta lo que está bien, reporta lo que está mal).

</details>

<details>

<summary>Preguntas del diagrama fuente — Estado final: ¿Qué pasa si el Gestor acepta por error todas las máquinas, siendo que hay una mala?</summary>

RESPONDIDA: el flujo requiere inspección visual previo a aceptación, permitiendo notificación de máquinas con problemas.

</details>

<details>

<summary>Preguntas del diagrama fuente — Estado final: ¿Qué pasa si rechaza el lote COMPLETO?</summary>

RESPONDIDA 03/07/2026: mismo mecanismo que rechazo individual (ver arriba, RN-9).

</details>

<details>

<summary>Preguntas del diagrama fuente — Estado final: ¿Qué pasa si el Gestor maneja máquinas propias (no del Mandante)?</summary>

RESPONDIDA 03/07/2026: no aplica en esta fase, no se gestionan máquinas propias del Gestor (RN-10).

</details>

<details>

<summary>Preguntas del diagrama fuente — Estado final: Nuevo</summary>

el flujo ahora incluye la emisión de **Guía de Despacho** vía API de facturación del Mandante, que se puede gestionar **durante o después** de confirmada la asignación (RN-16). Al confirmar el envío, el modal ofrece 3 opciones: Generar vía API, Subir PDF, o Hacer más tarde. Si se pospone, los botones quedan disponibles en Asignaciones y Guías de Despacho.

</details>

## 3. Diagrama de flujo — Ciclo de vida general del activo

> Basado en `PROPOSAL.md`, sección 7.

```mermaid
flowchart TD
    A[Compra de Activo] --> B[Registro en Maestro - Mandante]
    B --> C[Asignación a Gestor]
    C --> D[Recepción e Inspección por Gestor]
    D --> E{¿Aceptado?}
    E -->|Sí| F[Asignación a Cliente Final]
    E -->|No| G[Reporte de problema / reparo]
    F --> H[Despacho y Entrega Física]
    H --> I[Auditorías periódicas de terreno - aplicación móvil complementaria]
    I --> J{¿Solicitud de Baja / Siniestro / Servicio Técnico?}
    J -->|Sí| K[Aprobación del Mandante]
    K --> L[Retiro / Disposición del equipo]
    J -->|No| M[Continúa en operación normal]
```

## 4. Diagrama de componentes / arquitectura

```mermaid
flowchart TB
    subgraph Frontend
        PM[Panel Mandante - Web]
        PD[Panel Gestor - Web]
    end

    subgraph Backend["Capa de Servicios"]
        AUTH[Autenticación y Roles]
        EQ[Maestro de Equipos / Carga Masiva]
        WF[Workflow / Estados]
        APR[Aprobaciones]
        GD[Guías de Despacho]
        NOT[Notificaciones]
        INV[Inventario]
        REP[Reportes y Analítica]
        GEO[Geolocalización]
    end

    DB[(Base de Datos propia)]
    GW[Gateway de Integración]

    subgraph Externos["Sistemas Externos"]
        SAP[ERP SAP - Gestor]
        ODOO[ERP Odoo - Gestor]
        FAC[Facturación Mandante]
        FILE[Carga masiva de equipos]
    end

    PM --> AUTH
    PD --> AUTH
    PM --> EQ
    PM --> WF
    PM --> REP
    PM --> GEO
    PD --> EQ
    PD --> WF
    PD --> INV
    PD --> REP

    AUTH --> DB
    EQ --> DB
    WF --> DB
    INV --> DB
    APR --> DB
    GD --> DB
    REP --> DB
    GEO --> DB
    NOT --> DB

    GW --> SAP
    GW --> ODOO
    GD --> GW
    GW --> FAC
    GW --> FILE
    GW --> EQ
    GW --> DB
```

## 5. Diagrama de secuencia — Asignación y Recepción de Equipos

```mermaid
sequenceDiagram
    actor M as Mandante
    participant S as Plataforma
    participant F as API Facturación Mandante
    actor D as Gestor

    M->>S: Selecciona Gestor + sucursal de destino + lote de equipos
    S->>S: Registra equipos en estado "Asignado al Gestor"
    S->>D: Notificación - Debe recibir/cargar equipos
    Note over M,S: Al confirmar el envío, modal ofrece 3 opciones:
    alt Generar vía API
        S->>F: Solicita emisión de GD Mandante→Gestor
        F-->>S: Devuelve N° de GD + PDF
        S->>S: Adjunta PDF de GD recibido al despacho
    else Subir PDF
        M->>S: Adjunta PDF de GD generado externamente
    else Hacer más tarde
        M->>S: Confirma sin GD — botones quedan en Asignaciones/GD
    end
    D->>S: Inicia inspección visual
    Note over D,S: Por equipo individual: modal con planilla aplicable según tipo de máquina (RN-24/RN-25)
    alt Equipos OK
        D->>S: Acepta equipos (resultado de inspección)
        S->>S: Mantiene estado "Asignado al Gestor"
        D->>S: Asigna equipos a clientes finales
    else Equipos con problema
        D->>S: Reporta equipos con problema (resultado de inspección)
        S->>S: Actualiza estado a "Pendiente de Revisión"
        S->>M: Notificación de Recepción / Reparo
        M->>S: Consulta resultados de inspección en detalle de asignación
        M->>S: Evalúa y decide (reparo / baja)
        alt Requiere reparo
            S->>S: Estado "En SSTT"
            S->>S: Se excluye de lista de asignación
        else No requiere reparo
            S->>S: Fin del flujo
        end
    end
```

## 6. Diagrama Entidad-Relación (ERD)

> Ver `data_model.md` para el detalle completo de campos, tipos y justificación (fuente de verdad del modelo). Este diagrama es la versión visual resumida, resincronizada 10/07/2026 con la minuta de revisión de maqueta: Gestor como término visible, direcciones múltiples, clientes/vendedores solo lectura ERP, RUT obligatorio en bodegas, aprobación configurable y Guía de Despacho vía API.

```mermaid
erDiagram
    MANDANTE ||--o{ EQUIPO : posee
    MANDANTE ||--o{ GESTOR : autoriza
    GESTOR ||--o{ GESTOR_DIRECCION : tiene
    GESTOR ||--o{ EQUIPO : administra
    GESTOR ||--o{ CLIENTE_FINAL : atiende
    GESTOR ||--o{ VENDEDOR : sincroniza
    EQUIPO }o--|| ESTADO : tiene
    EQUIPO ||--o{ MOVIMIENTO : genera
    MOVIMIENTO }o--|| GESTOR : solicitado_por
    MOVIMIENTO }o--o| GESTOR_DIRECCION : destino_sucursal
    MOVIMIENTO }o--|| MANDANTE : aprobado_por
    EQUIPO }o--o{ SERVICIO_TECNICO : reparado_por
    GESTOR ||--o{ INVENTARIO : realiza
    INVENTARIO ||--o{ EQUIPO : incluye
    CLIENTE_FINAL ||--o{ EQUIPO : recibe
    GUIA_DESPACHO ||--o{ EQUIPO : ampara
    MANDANTE ||--o{ GUIA_DESPACHO : emite
    GESTOR ||--o{ GUIA_DESPACHO : emite
    GUIA_DESPACHO ||--o{ EVIDENCIA_ADJUNTA : adjunta
    MOVIMIENTO ||--o{ EVIDENCIA_ADJUNTA : adjunta
    MANDANTE ||--o{ UBICACION_BODEGA : posee
    GESTOR ||--o{ UBICACION_BODEGA : posee
    EQUIPO }o--|| TIPO_MAQUINA : clasificado_como
    GESTOR ||--o{ VENTA : notifica
    VENTA ||--o{ LINEA_VENTA : contiene
    LINEA_VENTA }o--o| TIPO_MAQUINA : referencia
    LINEA_VENTA }o--o| EQUIPO : referencia

    MANDANTE {
        string id
        string nombre
        string rut
    }
    GESTOR {
        string id
        string rut
        string nombre
        string estado
        string tipo_integracion_erp
    }
    GESTOR_DIRECCION {
        string id
        string rut_dueno
        string direccion
        string comuna
        string tipo
        boolean es_principal
    }
    CLIENTE_FINAL {
        string id
        string rut
        string nombre
        string direccion
        string comuna
        string estado_sincronizacion
    }
    VENDEDOR {
        string id
        string rut
        string nombre
        string contacto
        string estado_sincronizacion
    }
    EQUIPO {
        string id
        string numero_serie
        string marca
        string modelo
        string estado_actual
    }
    ESTADO {
        string codigo
        string nombre
    }
    MOVIMIENTO {
        string id
        string tipo
        string estado_aprobacion
        string roles_aprobadores
        boolean voto_vinculante
        date fecha
    }
    GUIA_DESPACHO {
        string id
        string origen
        string destino
        string tipo
        date fecha_emision
        string estado
        string origen_documento
    }
    EVIDENCIA_ADJUNTA {
        string id
        string entidad_tipo
        string url
    }
    TIPO_MAQUINA {
        string codigo
        string nombre
        string familia
        string grupo
        string marca
        string modelo
    }
    VENTA {
        string id
        string numero_factura
        date fecha_venta
        string erp_origen
    }
    LINEA_VENTA {
        string id
        string codigo_producto
        number cantidad
        boolean proviene_de_maquina
    }
    SERVICIO_TECNICO {
        string rut
        string nombre
        string direccion
        int sla_dias
    }
    INVENTARIO {
        string id
        date fecha
        string estado
    }
    UBICACION_BODEGA {
        string id
        string propietario_tipo
        string propietario_id
        string rut_dueno
        string nombre
        string direccion
        string tipo
    }
```

## 7. Diagrama de navegación (pantallas del prototipo)

> Actualizado 04/07/2026: los sidebars de ambos roles se reorganizaron en secciones **Principal**, **Operación**, **Análisis**, **Maestros** y **Configuración** (ver `maestros.md`). Las opciones de maestros no llevan el prefijo "Maestro de".
>
> Actualizado 17/07/2026 (proceso de Inventario): se agregó "Consulta de Inventario" (solo lectura, MAN-7) al panel del Mandante. La toma física en terreno se documenta en el proyecto Prototipo Móvil Máquinas; sus resultados deben alimentar la consulta y seguimiento web (GEN-5).
>
> Actualizado 10/07/2026: alineado con la minuta de revisión de maqueta. "Gestor" se usa como nombre técnico heredado en rutas, pero la terminología funcional visible es **Gestor**. Se eliminan del sidebar Mandante los submenús Grupo de Máquinas, Familia de Máquinas, Marcas y Modelos; esas clasificaciones provienen de la carga masiva de equipos. Clientes y Vendedores del Gestor quedan como vistas de solo lectura sincronizadas por ERP.
>
> Actualizado 07/07/2026: se eliminaron los nodos D7 ("Sincronización de Clientes vía API") y D8 ("Notificación de Ventas vía API") — su funcionalidad se documenta como definiciones técnicas de API en `reglas-de-negocio.md` §4, no como pantallas del prototipo. "Guías de Despacho" (D11) y "Reportes" (D6) ya estaban en el sidebar y ahora tienen prompts individuales en `stitch_prompts.md` (3.6 y 3.7 respectivamente). Se agregó M10 ("Guías de Despacho") al panel Mandante (Operación) y D0c ("Vendedores") al panel Gestor (Maestros), alineado al prototipo implementado.

```mermaid
flowchart TD
    Login[Login] --> RolCheck{Rol seleccionado manualmente}
    RolCheck -->|Mandante| DashM[Dashboard Mandante]
    RolCheck -->|Gestor| DashD[Dashboard Gestor]

    subgraph PrincipalM["Principal — Mandante"]
        M0[Dashboard]
        M3[Asignación de Equipos a Gestor]
    end

    subgraph OperacionM["Operación — Mandante"]
        M4[Autorización de Movimientos]
        M9[Consulta de Inventario *solo lectura*]
        M5[Trazabilidad]
        M10[Guías de Despacho]
    end

    subgraph AnalisisM["Análisis — Mandante"]
        M6[Informes: Geolocalización / Ventas / SSTT]
    end

    subgraph MaestrosM["Maestros — Mandante"]
        M1[Equipos]
        M2[Gestores]
        M2b[Servicio Técnico]
        M2e[Ubicaciones / Bodegas]
        M2f[Motivos de Movimiento]
        M2h[Tipos de Solicitud]
        M2g[Plantillas de Inspección]
        M2k[Tipos de Incidencias / Catálogo de Fallas]
    end

    subgraph ConfigM["Configuración — Mandante"]
        M7[Usuarios]
        M8[Roles]
    end

    DashM --> PrincipalM
    DashM --> OperacionM
    DashM --> AnalisisM
    DashM --> MaestrosM
    DashM --> ConfigM

    M3 --> M3b[GD: 3 opciones al confirmar — Generar API / Subir PDF / Hacer más tarde]

    subgraph PrincipalD["Principal — Gestor"]
        D0d[Dashboard]
        D1[Recepción de Equipos]
        D3[Asignación a Clientes — vista de listado]
    end

    subgraph OperacionD["Operación — Gestor"]
        D4[Solicitud de Movimiento]
        D5[Gestión de Inventario — vista de listado]
        D11[Guías de Despacho]
    end

    subgraph AnalisisD["Análisis — Gestor"]
        D6[Reportes de Ventas y Rendimiento]
    end

    subgraph MaestrosD["Maestros — Gestor"]
        D0[Clientes — solo lectura ERP]
        D0c[Vendedores — solo lectura ERP]
        D0b[Ubicaciones / Bodegas]
    end

    subgraph ConfigD["Configuración — Gestor"]
        D9[Usuarios]
        D10[Roles]
    end

    DashD --> PrincipalD
    DashD --> OperacionD
    DashD --> AnalisisD
    DashD --> MaestrosD
    DashD --> ConfigD

    D3 --> D3c[Asignación a Clientes — pantalla de creación]
    D3 --> D3b[Guía de Despacho: gestionada desde tabla de Asignaciones Realizadas — RN-16]
    D3b --> D3b1[Generar GD — automática vía ERP Isstec]
    D3b --> D3b2[Subir PDF — carga manual para ERP externo / Mandante]

    D5 --> D5a[Solicitud de Inventario — pantalla de creación]
    D5 --> D5c[Registro de Conteo Físico — ingreso manual de conteo por equipo]
    D5 --> D5b[Ajuste de Inventario — pantalla de ajuste de discrepancias]
    D5a --> D5c
    D5c --> D5b

    D1 --> D2[Inspección: modal con planilla por equipo — Aceptar / Con Problema / Rechazar (RN-25)]
```
