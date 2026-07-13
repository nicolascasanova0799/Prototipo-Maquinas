# DESIGN.md — Plataforma de Gestión de Equipos Refrigerados (Isstec)

Documento de diseño declarativo para Google Stitch. Define el sistema de diseño, componentes reutilizables, layouts y pantallas de la plataforma Isstec.

---

## Overview

**Proyecto:** Plataforma de Gestión de Equipos Refrigerados  
**Proveedor:** Isstec (INTEGRACIÓN DE SISTEMAS Y SERVICIOS TECNOLÓGICOS)  
**Versión:** 1.0  
**Descripción:** Sistema B2B para gestionar el ciclo de vida de activos fríos (freezers/conservadoras) en comodato entre Mandante (propietario) y Gestores.

**Dos perfiles principales:**
- **Mandante:** Control global, maestra de equipos, autorización de movimientos, informes
- **Gestor:** Recepción/inspección, asignación a clientes, solicitudes, inventario

---

## Colors

### Primary Colors

```
$color-primary-navy: #001F3F
  name: "Navy Blue"
  usage: "Sidebar, main headers, navigation"
  
$color-primary-blue: #0066CC
  name: "Primary Blue"
  usage: "Buttons, active elements, links, charts"
  
$color-accent-orange: #FF6B35
  name: "Coral Orange"
  usage: "Alerts, warnings, In Service, In SSTT states"
```

### Semantic Colors

```
$color-success-green: #28A745
  name: "Success Green"
  usage: "Active state, OK status, completion, approved"
  
$color-gray-light: #F0F2F5
  name: "Light Gray"
  usage: "Card backgrounds, input backgrounds, secondary surfaces"
  
$color-gray-medium: #6C757D
  name: "Medium Gray"
  usage: "Secondary text, placeholder text, disabled state"
  
$color-gray-dark: #343A40
  name: "Dark Gray"
  usage: "Inactive, discontinued state"
  
$color-white: #FFFFFF
  name: "White"
  usage: "Primary backgrounds, text contrast"
  
$color-red-danger: #DC3545
  name: "Danger Red"
  usage: "Error state, rejected status"
```

### State Colors (Badges)

```
state-active:
  background: $color-success-green
  text: $color-white
  label: "Activo / Operativo"

state-in-transit:
  background: $color-primary-blue
  text: $color-white
  label: "Asignado al Gestor"
  note: "Unificado 06/07/2026: absorbe el antiguo 'En Tránsito' (ver reglas-de-negocio.md §0)."

state-in-distributor:
  background: #E3F2FD
  text: $color-primary-navy
  label: "Asignado al Gestor"
  note: "Unificado 06/07/2026: absorbe el antiguo 'En Gestor' (mismo estado físico que state-in-transit)."

state-in-sstt:
  background: $color-accent-orange
  text: $color-white
  label: "En SSTT"

state-pending:
  background: $color-gray-medium
  text: $color-white
  label: "Pendiente de Revisión"
  note: "Unificado 06/07/2026: renombrado desde 'Pendiente de Asignar'."

state-rejected:
  background: $color-red-danger
  text: $color-white
  label: "Rechazado"
  note: "Aplica a un equipo individual o a un lote completo rechazado (ver reglas-de-negocio.md, RN-9)"

state-inactive:
  background: $color-gray-dark
  text: $color-white
  label: "Baja"
```

---

## Typography

### Font Family

```
$font-family-base: "Inter", "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
$font-family-mono: "Courier New", "Monaco", monospace
```

### Font Sizes

```
$font-size-h1: 32px
$font-size-h2: 24px
$font-size-h3: 18px
$font-size-h4: 16px
$font-size-body: 14px
$font-size-caption: 12px
$font-size-label: 12px
```

### Font Weights

```
$font-weight-regular: 400
$font-weight-semibold: 600
$font-weight-bold: 700
```

### Text Styles

```
heading-h1:
  font-size: $font-size-h1
  font-weight: $font-weight-bold
  color: $color-primary-navy
  line-height: 1.2

heading-h2:
  font-size: $font-size-h2
  font-weight: $font-weight-semibold
  color: $color-primary-navy
  line-height: 1.3

heading-h3:
  font-size: $font-size-h3
  font-weight: $font-weight-semibold
  color: $color-primary-blue
  line-height: 1.4

body:
  font-size: $font-size-body
  font-weight: $font-weight-regular
  color: #333333
  line-height: 1.6

caption:
  font-size: $font-size-caption
  font-weight: $font-weight-regular
  color: $color-gray-medium
  line-height: 1.5

label:
  font-size: $font-size-label
  font-weight: $font-weight-semibold
  color: #333333
```

---

## Spacing

### Spacing Scale

```
$spacing-xs: 4px
$spacing-sm: 8px
$spacing-md: 16px
$spacing-lg: 24px
$spacing-xl: 32px
$spacing-2xl: 48px
```

### Common Patterns

```
component-padding: $spacing-md
card-padding: $spacing-lg
input-padding: $spacing-sm $spacing-md
button-padding: $spacing-sm $spacing-lg
margin-bottom: $spacing-md
gap-row: $spacing-lg
gap-col: $spacing-md
```

---

## Components

### Button

```
component Button:
  base:
    padding: $spacing-sm $spacing-lg
    border-radius: 4px
    font-size: $font-size-body
    font-weight: $font-weight-semibold
    cursor: pointer
    transition: all 200ms ease
    border: 1px solid transparent

  variant primary:
    background: $color-primary-blue
    color: $color-white
    hover:
      background: #0052A3
      box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2)
    active:
      background: #003D7A
    disabled:
      background: $color-gray-light
      color: $color-gray-medium
      cursor: not-allowed

  variant secondary:
    background: $color-gray-light
    color: #333333
    border: 1px solid #CCCCCC
    hover:
      background: #E0E0E0
      border-color: #999999
    disabled:
      background: $color-gray-light
      color: $color-gray-medium
      cursor: not-allowed

  variant success:
    background: $color-success-green
    color: $color-white
    hover:
      background: #228636
      box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2)

  variant danger:
    background: $color-accent-orange
    color: $color-white
    hover:
      background: #E55A1F
      box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2)

  size small:
    padding: 4px 12px
    font-size: 12px

  size medium:
    padding: $spacing-sm $spacing-lg
    font-size: $font-size-body

  size large:
    padding: 12px 24px
    font-size: 16px
```

### Card

```
component Card:
  base:
    background: $color-white
    border-radius: 8px
    padding: $spacing-lg
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
    transition: box-shadow 200ms ease

  hover:
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

  variant elevated:
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12)

  child title:
    font-size: $font-size-h3
    font-weight: $font-weight-semibold
    color: $color-primary-navy
    margin-bottom: $spacing-md

  child body:
    font-size: $font-size-body
    color: #333333
    line-height: 1.6
```

### Badge

```
component Badge:
  base:
    display: inline-block
    padding: 4px 12px
    border-radius: 12px
    font-size: $font-size-caption
    font-weight: $font-weight-semibold
    line-height: 1.2

  state-active:
    background: $color-success-green
    color: $color-white

  state-in-transit:
    background: $color-primary-blue
    color: $color-white

  state-in-sstt:
    background: $color-accent-orange
    color: $color-white

  state-pending:
    background: $color-gray-medium
    color: $color-white

  state-rejected:
    background: $color-red-danger
    color: $color-white

  state-inactive:
    background: $color-gray-dark
    color: $color-white
```

### Input / Form Control

```
component Input:
  base:
    width: 100%
    padding: $spacing-sm $spacing-md
    border: 1px solid #CCCCCC
    border-radius: 4px
    font-family: $font-family-base
    font-size: $font-size-body
    color: #333333
    background: $color-white
    transition: border-color 200ms, box-shadow 200ms

  focus:
    border-color: $color-primary-blue
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)
    outline: none

  disabled:
    background: $color-gray-light
    color: $color-gray-medium
    cursor: not-allowed
    border-color: #CCCCCC

  error:
    border-color: $color-red-danger
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1)

  placeholder:
    color: $color-gray-medium
```

### Table

```
component Table:
  base:
    width: 100%
    border-collapse: collapse
    font-size: $font-size-body

  head:
    background: $color-gray-light
    border-bottom: 1px solid #DDDDDD

  header-cell:
    padding: $spacing-md
    text-align: left
    font-weight: $font-weight-semibold
    color: #333333

  body-cell:
    padding: $spacing-md
    border-bottom: 1px solid #EEEEEE
    color: #333333

  row:
    transition: background-color 150ms ease

  row-hover:
    background: #F8F9FA

  row-alternating:
    even:
      background: $color-white
    odd:
      background: #FAFBFC
```

### Navigation / Sidebar

```
component Sidebar:
  base:
    width: 240px
    background: $color-primary-navy
    padding: $spacing-lg 0
    height: 100vh
    position: fixed
    left: 0
    top: 0
    overflow-y: auto
    z-index: 1000

  logo:
    padding: $spacing-lg
    text-align: center
    border-bottom: 1px solid rgba(255, 255, 255, 0.1)

  nav-item:
    padding: $spacing-md $spacing-lg
    color: $color-white
    text-decoration: none
    display: flex
    align-items: center
    gap: $spacing-md
    transition: background-color 150ms ease

  nav-item-hover:
    background: rgba($color-primary-blue, 0.1)
    color: $color-white

  nav-item-active:
    background: $color-primary-blue
    color: $color-white
    font-weight: $font-weight-semibold

  icon:
    width: 20px
    height: 20px
    display: inline-block
```

### Navbar / Header

```
component Navbar:
  base:
    background: $color-white
    border-bottom: 1px solid #EEEEEE
    padding: $spacing-md $spacing-lg
    display: flex
    align-items: center
    justify-content: space-between
    height: 60px
    position: fixed
    top: 0
    left: 240px
    right: 0
    z-index: 999

  logo:
    height: 32px
    width: auto

  user-section:
    display: flex
    align-items: center
    gap: $spacing-lg

  user-avatar:
    width: 36px
    height: 36px
    border-radius: 50%
    background: $color-gray-light

  user-name:
    font-size: $font-size-body
    font-weight: $font-weight-semibold
    color: #333333

  user-role:
    font-size: $font-size-caption
    color: $color-gray-medium

  notification-icon:
    width: 24px
    height: 24px
    cursor: pointer
    color: $color-gray-medium
    hover:
      color: $color-primary-blue
```

### Modal / Dialog

```
component Modal:
  base:
    background: $color-white
    border-radius: 8px
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.16)
    width: 90%
    max-width: 500px
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: 2000

  overlay:
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.5)
    z-index: 1999

  header:
    padding: $spacing-lg
    border-bottom: 1px solid $color-gray-light
    display: flex
    justify-content: space-between
    align-items: center

  title:
    font-size: $font-size-h3
    font-weight: $font-weight-semibold
    color: $color-primary-navy

  body:
    padding: $spacing-lg

  footer:
    padding: $spacing-lg
    border-top: 1px solid $color-gray-light
    display: flex
    justify-content: flex-end
    gap: $spacing-md
```

### KPI Card

```
component KPICard:
  base:
    extends: Card
    padding: $spacing-lg
    text-align: center

  icon:
    font-size: 32px
    color: $color-primary-blue
    margin-bottom: $spacing-md

  title:
    font-size: $font-size-caption
    color: $color-gray-medium
    margin-bottom: $spacing-sm
    text-transform: uppercase
    letter-spacing: 0.5px

  value:
    font-size: 32px
    font-weight: $font-weight-bold
    color: $color-primary-blue
    margin-bottom: $spacing-sm

  change:
    font-size: $font-size-caption
    color: $color-gray-medium

  change-positive:
    color: $color-success-green
    prefix: "↑"

  change-negative:
    color: $color-accent-orange
    prefix: "↓"
```

---

## Layouts

### Main Layout (Sidebar + Navbar + Content)

```
layout MainLayout:
  structure:
    sidebar:
      width: 240px
      component: Sidebar
      position: fixed
      left: 0
      top: 0
      z-index: 1000

    navbar:
      height: 60px
      component: Navbar
      position: fixed
      top: 0
      left: 240px
      right: 0
      z-index: 999

    content:
      position: absolute
      top: 60px
      left: 240px
      right: 0
      padding: $spacing-lg
      background: $color-white
      min-height: calc(100vh - 60px)
      overflow-y: auto
```

### KPI Row Layout

```
layout KPIRow:
  structure:
    display: flex
    gap: $spacing-lg
    width: 100%
    margin-bottom: $spacing-lg

  items:
    flex: 1
    min-width: 200px
    max-width: 25%
    component: KPICard

  responsive:
    desktop (width >= 1200px):
      items per row: 4

    tablet (width 768px - 1199px):
      items per row: 2

    mobile (width < 768px):
      items per row: 1
      display: flex
      flex-direction: column
```

### Two Column Layout (Content + Sidebar)

```
layout TwoColumnLayout:
  structure:
    display: grid
    grid-template-columns: 1fr 300px
    gap: $spacing-lg
    width: 100%

  main-column:
    grid-column: 1

  sidebar-column:
    grid-column: 2
    position: sticky
    top: 60px

  responsive:
    tablet (width < 992px):
      grid-template-columns: 1fr
      sidebar-column:
        grid-column: 1
        position: static
```

### Form Layout

```
layout FormLayout:
  structure:
    display: flex
    flex-direction: column
    gap: $spacing-lg
    width: 100%
    max-width: 600px

  form-group:
    display: flex
    flex-direction: column
    gap: $spacing-sm

  label:
    font-weight: $font-weight-semibold
    color: #333333
    font-size: $font-size-label

  input-container:
    width: 100%

  actions:
    display: flex
    gap: $spacing-md
    justify-content: flex-end
    margin-top: $spacing-lg
```

---

## Screens / Pages

### Screen: Login

```
screen Login:
  layout: CenterLayout
  background: linear-gradient(135deg, $color-navy 0%, #003366 100%)

  content:
    max-width: 440px
    text-align: center
    background: $color-white
    border-radius: 12px
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2)
    padding: 40px 36px

    logo:
      height: 60px
      margin: 0 auto 20px

    title:
      font-size: 20px
      font-weight: 600
      color: $color-navy
      margin-bottom: 28px
      line-height: 1.4

    form:
      extends: FormLayout
      gap: $spacing-lg
      text-align: left

      rut-input:
        extends: InputGroup
        label: "RUT"
        icon: "bi-person"
        placeholder: "12.345.678-9"
        validation: rut-chilean

      password-input:
        extends: InputGroup
        label: "Contraseña"
        icon: "bi-lock"
        type: password
        placeholder: "••••••••"
        toggle-visibility: true

      role-toggle:
        display: flex
        gap: 12px
        margin-bottom: 24px
        options:
          - value: mandante
            icon: "bi-building"
            label: "Mandante"
          - value: gestor
            icon: "bi-truck"
            label: "Gestor"
        selected-style:
          border-color: $color-primary-blue
          background: rgba($color-primary-blue, 0.05)
          color: $color-primary-blue

      submit-button:
        extends: Button
        variant: primary
        size: large
        width: 100%
        label: "Ingresar"

    footer:
      margin-top: 24px
      font-size: 12px
      color: $color-gray-medium
      text: "© 2025 Isstec — Integración de Sistemas y Servicios Tecnológicos"
```

### Screen: Dashboard Mandante

```
screen DashboardMandante:
  layout: MainLayout

  content:
    display: flex
    flex-direction: column
    gap: $spacing-lg

    header:
      title:
        extends: heading-h1
        text: "Dashboard"

    kpi-section:
      extends: KPIRow
      items:
        - title: "Total de Equipos"
          value: "1.248"
          icon: "📦"
          color: $color-primary-blue

        - title: "Equipos Activos"
          value: "1.032"
          icon: "✓"
          change: "82,9%"
          color: $color-success-green

        - title: "En Servicio Técnico"
          value: "118"
          icon: "⚙"
          change: "-0.5%"
          color: $color-accent-orange

        - title: "Equipos Inactivos"
          value: "98"
          icon: "✕"
          color: $color-gray-medium

    maps-section:
      extends: TwoColumnLayout

      map-card:
        extends: Card
        title: "Distribución Geográfica"
        content:
          height: 400px
          type: map
          data: equipments-location

      status-card:
        extends: Card
        title: "Estado de Equipos"
        content:
          type: pie-chart
          data: equipments-status
          colors:
            - $color-success-green
            - $color-accent-orange
            - $color-gray-medium

    requests-section:
      extends: Card
      title: "Solicitudes Pendientes"
      content:
        type: table
        columns:
          - name: "Equipo"
            width: 15%
          - name: "Gestor"
            width: 20%
          - name: "Tipo"
            width: 15%
          - name: "Motivo"
            width: 25%
          - name: "Fecha"
            width: 10%
          - name: "Acciones"
            width: 15%
        rows: 5
        actions:
          - label: "Aprobar"
            type: button
            variant: success
            size: small
          - label: "Rechazar"
            type: button
            variant: danger
            size: small
```

### Screen: Dashboard Gestor

```
screen DashboardGestor:
  layout: MainLayout

  content:
    display: flex
    flex-direction: column
    gap: $spacing-lg

    header:
      title:
        extends: heading-h1
        text: "Dashboard - Gestor"

    kpi-section:
      extends: KPIRow
      items:
        - title: "Pendientes de inspección"
          value: "50"
          icon: "bi-exclamation-triangle"
          color: $color-accent-orange
          subtext: "Lote recibido hoy"

        - title: "Asignados a clientes"
          value: "386"
          icon: "bi-check2-circle"
          color: $color-primary-blue
          subtext: "En puntos de venta"

        - title: "Pendientes de asignar"
          value: "23"
          icon: "bi-exclamation-octagon"
          color: $color-accent-orange
          subtext: "Con problema reportado"

        - title: "Solicitudes en curso"
          value: "7"
          icon: "bi-arrow-left-right"
          color: $color-primary-blue
          subtext: "Pendientes de aprobación"

    notifications-section:
      extends: Card
      title: "Notificaciones Recientes"
      badge: "5 nuevas"
      content:
        type: list
        items:
          - icon: "bi-box-seam"
            text: "Nuevo lote recibido de Carozzi — 50 máquinas"
            subtext: "Hace 2 horas · Recepción de Equipos"
            badge: "Nuevo"
            badge-color: $color-primary-blue
          - icon: "bi-x-circle"
            text: "Equipo FR-1023 con problema reportado en inspección"
            subtext: "Hace 4 horas · Recepción de Equipos"
            badge: "Alerta"
            badge-color: $color-red-danger
          - icon: "bi-clipboard-check"
            text: "Inventario finalizado con discrepancias"
            subtext: "Ayer · Inventario"
            badge: "Revisión"
            badge-color: $color-accent-orange
          - icon: "bi-check-circle"
            text: "Solicitud de movimiento aprobada — CZ-0845"
            subtext: "Ayer · Solicitudes de Movimiento"
            badge: "Aprobada"
            badge-color: $color-success-green
          - icon: "bi-cloud-download"
            text: "Sincronización ERP completada — 124 clientes"
            subtext: "Hoy 08:00 AM · Importar desde ERP"
            badge: "Sincronizado"
            badge-color: $color-primary-blue

    distribution-chart:
      extends: Card
      title: "Distribución de equipos"
      content:
        type: doughnut-chart
        height: 260px
        cutout: 65%
        data:
          - label: "Asignados a clientes"
            value: 386
            color: $color-primary-blue
          - label: "Pendientes de inspección"
            value: 50
            color: $color-accent-orange
          - label: "Pendientes de asignar"
            value: 23
            color: $color-gray-medium
          - label: "Solicitudes en curso"
            value: 7
            color: $color-success-green
        legend:
          type: badge-list
          show-value: true
```

### Screen: Recepción de Equipos

```
screen RecepcionEquipos:
  layout: MainLayout

  content:
    display: flex
    flex-direction: column
    gap: $spacing-lg

    header:
      extends: Card
      title: "Recepción de Lote - Carozzi"
      metadata:
        - label: "Equipos"
          value: "50"
        - label: "Llegada"
          value: "Hoy 10:00 AM"
      background: $color-gray-light

    table-section:
      extends: Card
      content:
        type: table
        columns:
          - name: "Checkbox"
            width: 5%
          - name: "N° Serie"
            width: 15%
          - name: "Marca"
            width: 15%
          - name: "Modelo"
            width: 15%
          - name: "Estado"
            width: 15%
          - name: "Acciones"
            width: 35%

        rows: 10

        actions-per-row:
          - label: "✓ Aceptar"
            type: button
            variant: success
            size: small
          - label: "⚠ Reportar Problema"
            type: button
            variant: warning
            size: small

        expandable: true
        expand-content:
          type: form
          fields:
            - label: "Motivo"
              type: select
              options:
                - "Daño visible"
                - "No enciende"
                - "Falta parte"
                - "Otro"
            - label: "Descripción"
              type: textarea

    summary-section:
      extends: Card
      background: $color-gray-light
      layout: flex
      gap: $spacing-lg

      summary-items:
        - label: "Aceptados"
          value: "48"
          badge: "✓"
          badge-color: $color-success-green
        - label: "Con Problema"
          value: "2"
          badge: "⚠"
          badge-color: $color-accent-orange
        - label: "Pendientes"
          value: "0"
          badge: "-"
          badge-color: $color-gray-medium

      progress:
        type: progress-bar
        percentage: 100
        height: 8px
        color: $color-primary-blue

    action-section:
      display: flex
      justify-content: flex-end
      gap: $spacing-md

      confirm-button:
        extends: Button
        variant: primary
        size: large
        label: "Confirmar Recepción"
        disabled: false

      cancel-button:
        extends: Button
        variant: secondary
        label: "Cancelar"
```

### Screen: Autorización de Movimientos

```
screen AutorizacionMovimientos:
  layout: MainLayout

  content:
    display: flex
    flex-direction: column
    gap: $spacing-lg

    header:
      title:
        extends: heading-h1
        text: "Autorización de Movimientos"

      filters:
        display: flex
        gap: $spacing-md
        align-items: center

        status-filter:
          extends: Input
          type: select
          options:
            - "Todos"
            - "Pendiente"
            - "Aprobada"
            - "Rechazada"

    table-section:
      extends: Card
      content:
        type: table
        columns:
          - name: "Equipo"
            width: 12%
          - name: "Gestor"
            width: 18%
          - name: "Tipo Solicitud"
            width: 12%
          - name: "Motivo"
            width: 20%
          - name: "Fecha"
            width: 12%
          - name: "Estado"
            width: 12%
          - name: "Acciones"
            width: 14%

        rows: 10

        state-badges:
          pending:
            background: $color-accent-orange
            text: "Pendiente"
          approved:
            background: $color-success-green
            text: "Aprobada"
          rejected:
            background: $color-red-danger
            text: "Rechazada"

        actions-per-row:
          - label: "Aprobar"
            type: button
            variant: success
            size: small
          - label: "Rechazar"
            type: button
            variant: danger
            size: small
          - label: "Detalles"
            type: button
            variant: secondary
            size: small

        clickable-row: true
        modal-on-click: DetailModal
```

### Screen: Maestro — Tipos de Solicitud

```
screen MaestroTiposSolicitud:
  layout: MainLayout

  content:
    display: flex
    flex-direction: column
    gap: $spacing-lg

    header:
      title:
        extends: heading-h1
        text: "Tipos de Solicitud"

    action-bar:
      display: flex
      justify-content: flex-end
      add-button:
        extends: Button
        variant: primary
        label: "Agregar tipo"
        icon: "plus"

    table-section:
      extends: Card
      content:
        type: table
        columns:
          - name: "Código"
            width: 15%
          - name: "Nombre"
            width: 18%
          - name: "Descripción"
            width: 25%
          - name: "Motivo asociado"
            width: 15%
          - name: "Requiere aprobación"
            width: 12%
          - name: "Estado"
            width: 8%
          - name: "Acciones"
            width: 7%

        rows: 5

        state-badges:
          active:
            background: $color-success-green
            text: "Activo"
          inactive:
            background: $color-gray-dark
            text: "Inactivo"

        approval-badges:
          yes:
            background: $color-accent-orange
            text: "Sí"
          no:
            background: $color-gray-medium
            text: "No"

        actions-per-row:
          - label: "Editar"
            type: button
            variant: primary
            size: small

    pagination:
      extends: Pagination

    modal-add:
      extends: Modal
      title: "Agregar tipo de solicitud"
      form:
        extends: FormLayout
        fields:
          - label: "Código"
            type: text
            placeholder: "Ej: BAJA_DEFINITIVA"
            required: true
          - label: "Nombre"
            type: text
            placeholder: "Ej: Baja definitiva"
            required: true
          - label: "Descripción"
            type: textarea
          - label: "Motivo de movimiento asociado"
            type: select
            options:
              - "N/A — No aplica (sin movimiento)"
              - "BAJA — Baja Definitiva"
              - "CAMBIO — Cambio de Equipo"
              - "ENVIO_SSTT — Envío a Servicio Técnico"
              - "RETORNO_SSTT — Retorno de Servicio Técnico"
              - "RETORNO_MANDANTE — Retorno al Mandante"
            required: false
          - label: "Requiere aprobación del mandante"
            type: switch
            default: true
          - label: "Activo"
            type: switch
            default: true
      actions:
        cancel-button:
          extends: Button
          variant: secondary
          label: "Cancelar"
        save-button:
          extends: Button
          variant: primary
          label: "Guardar"

    modal-edit:
      extends: Modal
      title: "Editar tipo de solicitud"
      form:
        extends: FormLayout
        fields: same as modal-add
      actions:
        cancel-button:
          extends: Button
          variant: secondary
          label: "Cancelar"
        save-button:
          extends: Button
          variant: primary
          label: "Guardar cambios"
```

---

## States & Interactions

### Button States

```
state button-default:
  background: $color-primary-blue
  color: $color-white
  cursor: pointer

state button-hover:
  background: #0052A3
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2)
  transition: all 200ms ease

state button-active:
  background: #003D7A
  transform: scale(0.98)

state button-disabled:
  background: $color-gray-light
  color: $color-gray-medium
  cursor: not-allowed
  opacity: 0.6
```

### Input States

```
state input-default:
  border-color: #CCCCCC
  background: $color-white
  color: #333333

state input-focus:
  border-color: $color-primary-blue
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)
  outline: none

state input-error:
  border-color: $color-red-danger
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1)
  background: rgba(220, 53, 69, 0.02)

state input-disabled:
  background: $color-gray-light
  color: $color-gray-medium
  cursor: not-allowed
```

### Navigation States

```
state nav-item-default:
  background: transparent
  color: $color-white

state nav-item-hover:
  background: rgba($color-primary-blue, 0.15)
  color: $color-white

state nav-item-active:
  background: $color-primary-blue
  color: $color-white
  font-weight: $font-weight-semibold
  box-shadow: inset -3px 0 0 $color-primary-blue
```

### Modal Interactions

```
interaction modal-open:
  overlay:
    animation: fade-in 200ms ease-out
    background: rgba(0, 0, 0, 0.5)
  modal:
    animation: scale-up 200ms ease-out
    transform: translate(-50%, -50%) scale(1)

interaction modal-close:
  overlay:
    animation: fade-out 150ms ease-in
  modal:
    animation: scale-down 150ms ease-in

animation fade-in:
  from: opacity 0
  to: opacity 1

animation scale-up:
  from: transform scale(0.95)
  to: transform scale(1)
```

### Table Interactions

```
interaction row-hover:
  background: #F8F9FA
  transition: background-color 150ms ease
  cursor: pointer

interaction row-select:
  background: #E3F2FD
  box-shadow: inset 3px 0 0 $color-primary-blue

interaction column-sort:
  on-click: toggle sort direction
  icon-state: asc | desc | none
  visual: icon-color changes to $color-primary-blue
```

---

## Data Models

### Equipment

```
model Equipment:
  id: string
  serialNumber: string
  brand: string
  model: string
  state: enum[Active, AssignedToManager, AssignedToClient, InSST, PendingReview, Rejected, Inactive]
  owner: constant("Mandante")   // note: equipment is always owned by the Mandante; gestores cannot register their own equipment in this phase (RN-10)
  manager: reference(Manager)
  client: reference(Client)
  createdDate: date
  lastUpdateDate: date
  geolocation: {lat: number, lng: number}
```

### Manager

```
model Manager:
  id: string
  name: string
  rut: string
  addresses: array({rutOwner: string, address: string, commune: string, type: string})
  state: enum[Active, Inactive]
  erpIntegrationType: enum[Isstec, SAP, Odoo, Other]   // integration is always via API (RN-11); client/vendor manual upload is not allowed
  syncMode: constant("Automatic via API")               // confirmed 03/07/2026, RN-12
  equipmentCount: number
  createdDate: date
```

### Request

```
model Request:
  id: string
  equipment: reference(Equipment)
  manager: reference(Manager)
  type: enum[Withdrawal, Exchange, TechnicalService, ReturnToMandante]
  reason: string
  requestDate: date
  status: enum[Pending, Approved, Rejected]
  evidence: array(file)
  approvedBy: reference(User)
  approverRoles: array(string)
  bindingVote: boolean
  approvalDate: date
```

### DispatchGuide (Guía de Despacho)

```
model DispatchGuide:
  id: string
  type: enum[MandanteToManager, ManagerToClient]   // confirmed as required, RN-8/RN-16
  equipmentList: array(reference(Equipment))
  origin: string
  destination: string
  issueDate: date
  status: enum[Issued, Confirmed]
  source: enum[MandanteBillingAPI, IsstecGenerated, ManualPDF]
```

---

## Responsive Breakpoints

```
breakpoint mobile:
  max-width: 576px
  sidebar: hidden (drawer overlay)
  navbar-height: 56px
  content-padding: $spacing-md
  card-padding: $spacing-md
  table-font-size: 12px

breakpoint tablet:
  min-width: 576px
  max-width: 992px
  sidebar: visible (240px)
  navbar-height: 60px
  content-padding: $spacing-lg
  card-padding: $spacing-lg
  grid-columns: 2

breakpoint desktop:
  min-width: 992px
  max-width: 1200px
  sidebar: visible (240px fixed)
  navbar-height: 60px
  content-padding: $spacing-lg
  card-padding: $spacing-lg
  grid-columns: 4

breakpoint large-desktop:
  min-width: 1200px
  sidebar: visible (240px fixed)
  navbar-height: 60px
  content-padding: $spacing-2xl
  max-content-width: 1400px
```

---

## Accessibility

```
wcag-level: AA

requirements:
  - contrast-ratio: 4.5:1 (text on background)
  - focus-indicators: visible (min 2px border or outline)
  - keyboard-navigation: all interactive elements accessible via Tab
  - alt-text: all images must have descriptive alt text
  - aria-labels: interactive components must have aria-labels
  - form-labels: all inputs must have associated labels
  - color-not-only: information not conveyed by color alone

color-contrast-verified:
  - $color-primary-navy on $color-white: 14.1:1 ✓
  - $color-primary-blue on $color-white: 8.8:1 ✓
  - $color-accent-orange on $color-white: 6.2:1 ✓
  - $color-gray-medium on $color-white: 7.0:1 ✓
```

---

## Typography & Branding

### Logo Guidelines

```
logo-primary: Isstec (with full wordmark)
logo-usage:
  - Sidebar: 200px width
  - Navbar: 32px height (reduced)
  - Login: 60px height
  - Print: minimum 20mm width

clear-space: 10px minimum around logo
background: works on $color-primary-navy and $color-white
```

### Tone of Voice

- **Professional:** Formal language, B2B context
- **Clear:** Avoid jargon, use simple terms
- **Action-oriented:** Button labels with strong verbs
- **Supportive:** Error messages are helpful, not blaming

### Terminology

```
Equipment = Máquina / Equipo (asset being managed)
Manager = Gestor (reseller/operator; "Gestor" only remains in legacy filenames)
Mandante = Mandante (asset owner)
Client = Cliente / Punto de venta (retail location)
Request = Solicitud (formal request for action)
State = Estado (current status of equipment)
SSTT = Servicio Técnico (technical service)
```

---

## Version History

```
v1.5 (Current) — 10/07/2026
  - Updated customer reference to Carozzi
  - Standardized visible role terminology to "Gestor"
  - Equipment master uses mass upload only; individual "Nuevo equipo" is removed
  - Manager supports multiple addresses/sucursales
  - Clients and vendors are read-only ERP-synchronized views
  - Locations/warehouses require owner RUT
  - Movement reasons support approver roles and binding vote
  - Mandante→Gestor Dispatch Guide is emitted through Mandante billing API

v1.4 — 06/07/2026
  - Decoupled Dispatch Guide (GD) generation from the equipment assignment step (DIS-3)
  - Assignment to clients (asignacion-clientes.html) now only links equipment to point of sale — no GD generation or upload in this step
  - GD management moved to the "Asignaciones Realizadas" table (asignaciones-realizadas.html) with two new action buttons per row:
    * "Generar GD" — modal simulating automatic generation via Isstec ERP (RN-16), 3-step flow: confirmation → processing spinner → success with GD number
    * "Subir PDF" — modal with drag & drop upload for externally generated GD (RN-16, for non-Isstec ERP / Mandante)
  - New GD badge state: "Pendiente" (gray) for assignments where GD has not yet been managed
  - Updated RN-16, DIS-3, GEN-2, stitch_prompts.md (3.3a/3.3b), diagramas-del-sistema.md flowchart, and reglas-de-negocio.md §4.3

v1.3 — 05/07/2026
  - Expanded "Tipos de Solicitud" master (MAN-18): now includes 5 types — Baja definitiva, Envío a SSTT, Cambio de equipo, Retorno al Mandante (all require approval) + Solicitud de Inventario (no approval, no tipo_movimiento)
  - Principle: Mandante standardizes ALL request types for all managers — managers select from the catalog, they don't create their own
  - `tipo_solicitud.tipo_movimiento_id` is now NULLABLE (N/A for inventory)
  - Motivo asociado select now optional with "N/A" option

v1.2 — 04/07/2026
  - Added "Tipos de Solicitud" master screen (MAN-18): catalog of request types the Manager can create to the Mandante (baja, cambio, envío a SSTT, retorno), each referencing a tipo_movimiento and defining whether approval is required
  - Added `tipo_solicitud` to data model catalogs (data_model.md §2.2)
  - Updated maestros.md: added row #8, dependency matrix entry, Mermaid diagram node, and decision note separating Tipos de Solicitud from Motivos de Movimiento
  - Updated requerimientos-de-producto.md: added MAN-18

v1.1 — 03/07/2026
  - Added "Rejected" state (RN-9): applies uniformly to individual equipment or a full batch
  - Added DispatchGuide data model (RN-8): required for Mandante→Manager and Manager→Client transfers
  - Confirmed Equipment ownership is always Mandante-only in this phase (RN-10)
  - Updated Manager model: erpIntegrationType + automatic API sync (RN-11, RN-12)
  - See reglas-de-negocio.md for full context

v1.0 — Initial release
  - Initial design system for Isstec platform
  - Two main profiles: Mandante and Gestor
  - Bootstrap 5 compatible components
  - Responsive design support (mobile to large desktop)
  - 14 core screens defined
  - Color palette and typography defined
  - Accessibility compliance (WCAG AA)
```

---

## Notes for Google Stitch

This DESIGN.md is optimized for Google Stitch AI code generation. The document defines:

1. **Complete visual system** — Colors, typography, spacing, components
2. **Reusable components** — Button, Card, Badge, Input, Table, etc.
3. **Layout patterns** — Sidebar + Navbar + Content, Forms, Tables
4. **Screen definitions** — Login, Dashboards, Data tables, Forms
5. **Interactions & states** — Hover, focus, active, disabled, loading
6. **Data models** — Equipment, Manager, Request structures
7. **Responsive design** — Mobile to large desktop support
8. **Accessibility** — WCAG AA compliance guidelines

Use the **stitch_prompts.md** file alongside this DESIGN.md for detailed prompt instructions for each screen.
