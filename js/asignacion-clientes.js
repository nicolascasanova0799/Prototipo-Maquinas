// ===== Asignación a Clientes — lógica =====

// ===== Referencias del DOM =====
const btnAsignar = document.getElementById('btnAsignar');
const btnLimpiar = document.getElementById('btnLimpiar');
const modalConfirmarEl = document.getElementById('modalConfirmarAsignacion');
const gdChoiceSection = document.getElementById('gdChoiceSection');
const gdGenSection = document.getElementById('gdGenSection');
const gdUploadSection = document.getElementById('gdUploadSection');
const gdSuccessSection = document.getElementById('gdSuccessSection');
const gdFooter = document.getElementById('gdFooter');
const gdModalClose = document.getElementById('gdModalClose');
const btnGenerarGDApi = document.getElementById('btnGenerarGDApi');
const btnSubirPDFChoice = document.getElementById('btnSubirPDFChoice');
const btnHacerMasTarde = document.getElementById('btnHacerMasTarde');
const uploadAreaGD = document.getElementById('uploadAreaGD');
const inputFileGD = document.getElementById('inputFileGD');
let gdAssignmentConfirmed = false;
const checkAllEquipos = document.getElementById('checkAllEquipos');
const checkboxesEquipos = document.querySelectorAll('.check-equipo');
const radiosClientes = document.querySelectorAll('.radio-cliente');
const tablaEquipos = document.getElementById('tablaEquipos');
const tablaClientes = document.getElementById('tablaClientes');
const alertaExito = document.getElementById('alertaExito');
const alertaExitoTexto = document.getElementById('alertaExitoTexto');
const alertaBorrador = document.getElementById('alertaBorrador');
const alertaBorradorTexto = document.getElementById('alertaBorradorTexto');
const btnGuardarBorrador = document.getElementById('btnGuardarBorrador');
const pageTitle = document.getElementById('pageTitle');
const headerEstado = document.getElementById('headerEstado');
const solicitudesPendientesSection = document.getElementById('solicitudesPendientesSection');
const tbodySolicitudesPendientes = document.getElementById('tbodySolicitudesPendientes');
const resumenEquiposCount = document.getElementById('resumenEquiposCount');
const resumenClienteDestino = document.getElementById('resumenClienteDestino');
const resumenClienteDireccion = document.getElementById('resumenClienteDireccion');
const resumenSolicitudOrigen = document.getElementById('resumenSolicitudOrigen');
const clientCollapseHeader = document.getElementById('clientCollapseHeader');
const clientCollapseBody = document.getElementById('clientCollapseBody');
const clientSelectedSummary = document.getElementById('clientSelectedSummary');

// ===== Mock solicitudes data (mirrors inbox solicitudes-nuevo-equipo.html) =====
const mockSolicitudes = [
    { id: 'SOL-001', clienteNombre: 'Almacén Don Luis', equipoSerie: 'FR-2001', equipoMarca: 'Foster', equipoModelo: 'F-200', motivo: 'Incremento de ventas estivales', cantidad: 1, estado: 'pendiente', fecha: '2025-07-18' },
    { id: 'SOL-002', clienteNombre: 'Minimarket La Esquina', equipoSerie: 'CZ-2100', equipoMarca: 'Coldex', equipoModelo: 'CX-300', motivo: 'Reemplazo de equipo antiguo', cantidad: 1, estado: 'en_proceso', fecha: '2025-07-15' },
    { id: 'SOL-003', clienteNombre: 'Almacén Don Luis', equipoSerie: 'FR-1023', equipoMarca: 'Carozzi', equipoModelo: 'SF-200', motivo: 'Apertura de nueva sección de bebidas', cantidad: 2, estado: 'pendiente', fecha: '2025-07-10' },
    { id: 'SOL-004', clienteNombre: 'Supermercado El Sol', equipoSerie: 'CZ-2230', equipoMarca: 'Coldex', equipoModelo: 'CX-200', motivo: 'Ampliación de línea de congelados', cantidad: 1, estado: 'convertida', fecha: '2025-07-05' },
    { id: 'SOL-005', clienteNombre: 'Minimarket La Esquina', equipoSerie: 'FR-2001', equipoMarca: 'Foster', equipoModelo: 'F-200', motivo: 'Demanda estacional', cantidad: 1, estado: 'pospuesta', fecha: '2025-07-08' },
    { id: 'SOL-006', clienteNombre: 'Botillería Amanecer', equipoSerie: 'CZ-2100', equipoMarca: 'Coldex', equipoModelo: 'CX-300', motivo: 'Cliente canceló el requerimiento', cantidad: 1, estado: 'descartada', fecha: '2025-07-03' }
];

// ===== State =====
let solicitudOrigenActiva = null;
let isReadOnly = false;

// Búsqueda
const buscarEquipo = document.getElementById('buscarEquipo');
const buscarCliente = document.getElementById('buscarCliente');

// ===== Collapse toggle for clients section =====
if (clientCollapseHeader) {
    clientCollapseHeader.addEventListener('click', function() {
        clientCollapseHeader.classList.toggle('collapsed');
        clientCollapseBody.classList.toggle('collapsed');
    });
}

// ===== Actualizar estado de botones y panel resumen =====
function actualizarEstado() {
    const equiposSeleccionados = document.querySelectorAll('.check-equipo:checked');
    const clienteSeleccionado = document.querySelector('.radio-cliente:checked');
    const countEquipos = equiposSeleccionados.length;
    const hasCliente = !!clienteSeleccionado;

    // Panel resumen: equipos count
    resumenEquiposCount.textContent = countEquipos;
    resumenEquiposCount.classList.toggle('placeholder', countEquipos === 0);

    // Panel resumen: cliente destino
    if (hasCliente) {
        const clienteRow = clienteSeleccionado.closest('tr');
        const clienteName = clienteSeleccionado.value;
        const clienteDireccion = clienteRow.dataset.direccion;
        const clienteComuna = clienteRow.dataset.comuna;
        resumenClienteDestino.textContent = clienteName;
        resumenClienteDestino.classList.remove('placeholder');
        resumenClienteDireccion.textContent = clienteDireccion + ', ' + clienteComuna;
        resumenClienteDireccion.classList.remove('placeholder');
        // Update collapse summary
        if (clientSelectedSummary) {
            clientSelectedSummary.textContent = '— ' + clienteName;
        }
    } else {
        resumenClienteDestino.textContent = 'Sin seleccionar';
        resumenClienteDestino.classList.add('placeholder');
        resumenClienteDireccion.textContent = '—';
        resumenClienteDireccion.classList.add('placeholder');
        if (clientSelectedSummary) {
            clientSelectedSummary.textContent = '';
        }
    }

    // Panel resumen: solicitud origen
    if (solicitudOrigenActiva) {
        resumenSolicitudOrigen.textContent = solicitudOrigenActiva;
        resumenSolicitudOrigen.classList.remove('placeholder');
    } else {
        resumenSolicitudOrigen.textContent = '—';
        resumenSolicitudOrigen.classList.add('placeholder');
    }

    // Habilitar/deshabilitar botones (no aplicar en modo lectura)
    if (!isReadOnly) {
        btnAsignar.disabled = !(countEquipos >= 1 && hasCliente);
        btnGuardarBorrador.disabled = !(countEquipos >= 1 || hasCliente);
        btnLimpiar.disabled = countEquipos === 0 && !hasCliente;
    }

    // Actualizar checkAll
    const allEquiposVisible = document.querySelectorAll('.check-equipo');
    checkAllEquipos.checked = allEquiposVisible.length > 0 && countEquipos === allEquiposVisible.length;
    checkAllEquipos.indeterminate = countEquipos > 0 && countEquipos < allEquiposVisible.length;
}

// ===== Marcar/desmarcar fila de equipo seleccionada =====
function toggleEquipoRowStyle(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        row.classList.add('row-selected');
    } else {
        row.classList.remove('row-selected');
    }
}

// ===== Marcar/desmarcar fila de cliente seleccionada =====
function toggleClienteRowStyle(radio) {
    tablaClientes.querySelectorAll('tbody tr').forEach(tr => {
        tr.classList.remove('row-client-selected');
    });
    if (radio.checked) {
        radio.closest('tr').classList.add('row-client-selected');
    }
}

// ===== Auto-collapse clients section when a client is selected =====
function autoCollapseClients() {
    if (clientCollapseHeader && !clientCollapseHeader.classList.contains('collapsed')) {
        clientCollapseHeader.classList.add('collapsed');
        clientCollapseBody.classList.add('collapsed');
    }
}

// ===== Render solicitudes pendientes del cliente seleccionado =====
function renderSolicitudesPendientes(clienteName) {
    if (!clienteName || isReadOnly) {
        solicitudesPendientesSection.style.display = 'none';
        return;
    }
    const pendientes = mockSolicitudes.filter(s =>
        s.clienteNombre === clienteName &&
        (s.estado === 'pendiente' || s.estado === 'pospuesta')
    );
    if (pendientes.length === 0) {
        solicitudesPendientesSection.style.display = 'none';
        return;
    }
    tbodySolicitudesPendientes.innerHTML = pendientes.map(s => `
        <tr>
            <td class="fw-semibold">${s.id}</td>
            <td>${s.equipoSerie} <span class="text-muted" style="font-size:12px;">${s.equipoMarca} ${s.equipoModelo}</span></td>
            <td class="text-center">${s.cantidad}</td>
            <td style="font-size:13px;">${s.motivo}</td>
            <td style="font-size:13px;">${s.fecha}</td>
            <td>
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="analizarStock('${s.id}')">
                    <i class="bi bi-search me-1"></i>Analizar stock
                </button>
            </td>
        </tr>
    `).join('');
    solicitudesPendientesSection.style.display = 'block';
}

// ===== Analizar stock: auto-seleccionar equipo de la solicitud =====
window.analizarStock = function(solicitudId) {
    const sol = mockSolicitudes.find(s => s.id === solicitudId);
    if (!sol) return;
    const equipoRow = tablaEquipos.querySelector('tbody tr[data-serie="' + sol.equipoSerie + '"]');
    if (equipoRow) {
        const cb = equipoRow.querySelector('.check-equipo');
        if (cb && !cb.disabled) {
            cb.checked = true;
            toggleEquipoRowStyle(cb);
        }
        solicitudOrigenActiva = sol.id;
        actualizarEstado();
        equipoRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert('El equipo ' + sol.equipoSerie + ' solicitado no está disponible. Selecciona un equipo alternativo manualmente.');
        solicitudOrigenActiva = sol.id;
        actualizarEstado();
    }
};

// ===== Checkbox individual de equipo =====
checkboxesEquipos.forEach(cb => {
    cb.addEventListener('change', function() {
        toggleEquipoRowStyle(this);
        actualizarEstado();
    });
});

// ===== Checkbox seleccionar todos los equipos =====
checkAllEquipos.addEventListener('change', function() {
    checkboxesEquipos.forEach(cb => {
        if (cb.closest('tr').style.display !== 'none') {
            cb.checked = this.checked;
            toggleEquipoRowStyle(cb);
        }
    });
    actualizarEstado();
});

// ===== Radio individual de cliente =====
radiosClientes.forEach(rd => {
    rd.addEventListener('change', function() {
        toggleClienteRowStyle(this);
        renderSolicitudesPendientes(this.value);
        autoCollapseClients();
        actualizarEstado();
    });
});

// ===== Click en fila de cliente para seleccionar radio =====
tablaClientes.querySelectorAll('tbody tr').forEach(tr => {
    tr.addEventListener('click', function(e) {
        if (e.target.tagName === 'INPUT') return;
        const radio = this.querySelector('.radio-cliente');
        if (radio && !radio.disabled) {
            radio.checked = true;
            toggleClienteRowStyle(radio);
            renderSolicitudesPendientes(radio.value);
            autoCollapseClients();
            actualizarEstado();
        }
    });
});

// ===== Limpiar selección =====
btnLimpiar.addEventListener('click', function() {
    checkboxesEquipos.forEach(cb => {
        cb.checked = false;
        toggleEquipoRowStyle(cb);
    });
    radiosClientes.forEach(rd => {
        rd.checked = false;
    });
    tablaClientes.querySelectorAll('tbody tr').forEach(tr => {
        tr.classList.remove('row-client-selected');
    });
    checkAllEquipos.checked = false;
    solicitudOrigenActiva = null;
    solicitudesPendientesSection.style.display = 'none';
    actualizarEstado();
});

// ===== Guardar borrador =====
btnGuardarBorrador.addEventListener('click', function() {
    const count = document.querySelectorAll('.check-equipo:checked').length;
    const clienteRadio = document.querySelector('.radio-cliente:checked');
    const clienteName = clienteRadio ? clienteRadio.value : 'Sin cliente';
    const solOrigen = solicitudOrigenActiva || 'Ninguna';
    alertaBorradorTexto.innerHTML = `Borrador guardado: ${count} equipo${count !== 1 ? 's' : ''}, ${clienteName}. Solicitud origen: ${solOrigen}. Puedes editarlo desde <strong>Asignaciones Realizadas</strong>.`;
    alertaBorrador.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        window.location.href = 'asignaciones-realizadas.html';
    }, 2500);
});

// ===== Búsqueda de equipos =====
buscarEquipo.addEventListener('input', function() {
    const term = this.value.toLowerCase().trim();
    let visibleCount = 0;
    tablaEquipos.querySelectorAll('tbody tr').forEach(tr => {
        const serie = (tr.dataset.serie || '').toLowerCase();
        const marca = (tr.dataset.marca || '').toLowerCase();
        const modelo = (tr.dataset.modelo || '').toLowerCase();
        const match = !term || serie.includes(term) || marca.includes(term) || modelo.includes(term);
        tr.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });
    document.getElementById('contadorEquipos').textContent = visibleCount + (visibleCount === 1 ? ' equipo' : ' equipos');
});

// ===== Búsqueda de clientes =====
buscarCliente.addEventListener('input', function() {
    const term = this.value.toLowerCase().trim();
    let visibleCount = 0;
    tablaClientes.querySelectorAll('tbody tr').forEach(tr => {
        const nombre = (tr.dataset.cliente || '').toLowerCase();
        const direccion = (tr.dataset.direccion || '').toLowerCase();
        const comuna = (tr.dataset.comuna || '').toLowerCase();
        const match = !term || nombre.includes(term) || direccion.includes(term) || comuna.includes(term);
        tr.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });
    document.getElementById('contadorClientes').textContent = visibleCount + (visibleCount === 1 ? ' cliente' : ' clientes');
});

// ===== Abrir modal al asignar =====
btnAsignar.addEventListener('click', function() {
    const equiposSeleccionados = document.querySelectorAll('.check-equipo:checked');
    const clienteRadio = document.querySelector('.radio-cliente:checked');
    const count = equiposSeleccionados.length;
    const clienteName = clienteRadio.value;
    const clienteRow = clienteRadio.closest('tr');
    const clienteDireccion = clienteRow.dataset.direccion;
    const clienteComuna = clienteRow.dataset.comuna;

    let equiposHTML = '';
    equiposSeleccionados.forEach(cb => {
        const row = cb.closest('tr');
        equiposHTML += `<div class="eq-item">
            <span class="eq-serie">${row.dataset.serie}</span>
            <span class="eq-detail">${row.dataset.marca} · ${row.dataset.modelo} · ${row.dataset.familia}</span>
        </div>`;
    });

    document.getElementById('resumenCount').textContent = count + (count !== 1 ? ' equipos' : ' equipo');
    document.getElementById('resumenCliente').textContent = clienteName;
    document.getElementById('resumenDireccion').textContent = clienteDireccion + ', ' + clienteComuna;
    document.getElementById('resumenEquipos').innerHTML = equiposHTML;

    const modal = new bootstrap.Modal(document.getElementById('modalConfirmarAsignacion'));
    modal.show();
});

// ===== GD Multi-step modal logic =====
function resetGDModal() {
    gdChoiceSection.style.display = '';
    gdGenSection.style.display = 'none';
    gdUploadSection.style.display = 'none';
    gdSuccessSection.style.display = 'none';
    gdFooter.innerHTML = '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>';
    gdModalClose.style.display = '';
    inputFileGD.value = '';
    document.getElementById('numDocumentoGD').value = '';
    uploadAreaGD.classList.remove('has-file');
    uploadAreaGD.querySelector('.upload-text').textContent = 'Haz clic o arrastra el archivo aquí';
    uploadAreaGD.querySelector('.upload-hint').textContent = 'Formato PDF · Máx. 10 MB';
    document.getElementById('errorFileGD').style.display = 'none';
    gdAssignmentConfirmed = false;
}

function confirmarAsignacion(gdInfo) {
    if (gdAssignmentConfirmed) return;
    gdAssignmentConfirmed = true;
    const seleccionados = document.querySelectorAll('.check-equipo:checked');
    const clienteRadio = document.querySelector('.radio-cliente:checked');
    const count = seleccionados.length;
    const clienteName = clienteRadio ? clienteRadio.value : '';
    seleccionados.forEach(cb => { const row = cb.closest('tr'); row.remove(); });
    radiosClientes.forEach(rd => { rd.checked = false; });
    tablaClientes.querySelectorAll('tbody tr').forEach(tr => { tr.classList.remove('row-client-selected'); });
    checkAllEquipos.checked = false;
    solicitudOrigenActiva = null;
    solicitudesPendientesSection.style.display = 'none';
    let msg = `Asignación confirmada. ${count} equipo${count !== 1 ? 's' : ''} asignado${count !== 1 ? 's' : ''} a <strong>${clienteName}</strong>.`;
    if (gdInfo) {
        msg += ` Guía de Despacho ${gdInfo.number} ${gdInfo.type === 'auto' ? 'generada vía API' : 'adjuntada'}.`;
    } else {
        msg += ' Recuerda gestionar la Guía de Despacho desde <strong>Asignaciones Realizadas</strong>.';
    }
    alertaExitoTexto.innerHTML = msg;
    alertaExito.style.display = 'flex';
    actualizarEstado();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { alertaExito.style.display = 'none'; }, 6000);
}

modalConfirmarEl.addEventListener('show.bs.modal', resetGDModal);

// Option 1: Generar vía API
btnGenerarGDApi.addEventListener('click', function() {
    gdChoiceSection.style.display = 'none';
    gdGenSection.style.display = '';
    gdFooter.innerHTML = '';
    gdModalClose.style.display = 'none';
    const progressText = document.getElementById('gdProgressText');
    setTimeout(() => { progressText.textContent = 'Obteniendo respuesta del ERP…'; }, 1200);
    setTimeout(() => {
        const gdNum = 'GD-' + String(Math.floor(Math.random() * 9000) + 1000);
        gdGenSection.style.display = 'none';
        gdSuccessSection.style.display = '';
        document.getElementById('gdSuccessText').textContent = 'Asignación confirmada y Guía de Despacho generada';
        document.getElementById('gdSuccessNumber').textContent = gdNum;
        document.getElementById('gdSuccessHint').textContent = 'El PDF se ha adjuntado automáticamente a la asignación.';
        gdFooter.innerHTML = '<button type="button" class="btn btn-primary" id="btnCerrarSuccess">Cerrar</button>';
        gdModalClose.style.display = '';
        document.getElementById('btnCerrarSuccess').addEventListener('click', function() {
            confirmarAsignacion({ number: gdNum, type: 'auto' });
            bootstrap.Modal.getInstance(modalConfirmarEl).hide();
        });
    }, 2800);
});

// Option 2: Subir PDF
btnSubirPDFChoice.addEventListener('click', function() {
    gdChoiceSection.style.display = 'none';
    gdUploadSection.style.display = '';
    gdFooter.innerHTML = '<button type="button" class="btn btn-outline-secondary" id="btnBackToChoice">Volver</button><button type="button" class="btn btn-primary" id="btnConfirmarUpload"><i class="bi bi-save me-2"></i>Guardar y confirmar</button>';
    document.getElementById('btnBackToChoice').addEventListener('click', function() {
        gdUploadSection.style.display = 'none';
        gdChoiceSection.style.display = '';
        gdFooter.innerHTML = '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>';
    });
    document.getElementById('btnConfirmarUpload').addEventListener('click', function() {
        if (!inputFileGD.files || !inputFileGD.files[0]) {
            document.getElementById('errorFileGD').style.display = 'block';
            return;
        }
        const numDoc = document.getElementById('numDocumentoGD').value.trim();
        const gdNum = numDoc || ('GD-' + String(Math.floor(Math.random() * 9000) + 1000));
        gdUploadSection.style.display = 'none';
        gdSuccessSection.style.display = '';
        document.getElementById('gdSuccessText').textContent = 'Asignación confirmada y PDF adjuntado';
        document.getElementById('gdSuccessNumber').textContent = gdNum;
        document.getElementById('gdSuccessHint').textContent = 'El PDF se ha adjuntado a la asignación.';
        gdFooter.innerHTML = '<button type="button" class="btn btn-primary" id="btnCerrarSuccess">Cerrar</button>';
        document.getElementById('btnCerrarSuccess').addEventListener('click', function() {
            confirmarAsignacion({ number: gdNum, type: 'manual' });
            bootstrap.Modal.getInstance(modalConfirmarEl).hide();
        });
    });
});

// Upload area interactions
uploadAreaGD.addEventListener('click', function() { inputFileGD.click(); });
inputFileGD.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            uploadAreaGD.classList.add('has-file');
            uploadAreaGD.querySelector('.upload-text').textContent = 'Archivo cargado — clic para cambiar';
            uploadAreaGD.querySelector('.upload-hint').textContent = file.name;
            document.getElementById('errorFileGD').style.display = 'none';
        } else {
            alert('Solo se permiten archivos PDF.');
            this.value = '';
        }
    }
});
uploadAreaGD.addEventListener('dragover', function(e) {
    e.preventDefault(); this.style.borderColor = 'var(--azul-primario)'; this.style.background = 'rgba(0, 102, 204, 0.06)';
});
uploadAreaGD.addEventListener('dragleave', function(e) {
    e.preventDefault(); this.style.borderColor = ''; this.style.background = '';
});
uploadAreaGD.addEventListener('drop', function(e) {
    e.preventDefault(); this.style.borderColor = ''; this.style.background = '';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        inputFileGD.files = e.dataTransfer.files;
        inputFileGD.dispatchEvent(new Event('change'));
    }
});

// Option 3: Hacer más tarde
btnHacerMasTarde.addEventListener('click', function() {
    confirmarAsignacion(null);
    bootstrap.Modal.getInstance(modalConfirmarEl).hide();
});

// ===== URL param support =====
const urlParams = new URLSearchParams(window.location.search);
const paramSolicitud = urlParams.get('solicitud');
const paramMode = urlParams.get('mode');
const paramId = urlParams.get('id');

// --- ?solicitud=SOL-XXX: pre-load solicitud data ---
if (paramSolicitud) {
    const sol = mockSolicitudes.find(s => s.id === paramSolicitud);
    if (sol) {
        radiosClientes.forEach(rd => {
            if (rd.value === sol.clienteNombre) {
                rd.checked = true;
                toggleClienteRowStyle(rd);
                renderSolicitudesPendientes(rd.value);
            }
        });
        const equipoRow = tablaEquipos.querySelector('tbody tr[data-serie="' + sol.equipoSerie + '"]');
        if (equipoRow) {
            const cb = equipoRow.querySelector('.check-equipo');
            if (cb) {
                cb.checked = true;
                toggleEquipoRowStyle(cb);
            }
        } else {
            alert('El equipo ' + sol.equipoSerie + ' solicitado no está disponible. Selecciona un equipo alternativo manualmente.');
        }
        solicitudOrigenActiva = sol.id;
    }
}

// --- ?mode=edit&id=ASG-XXX: load draft state ---
if (paramMode === 'edit' && paramId) {
    pageTitle.textContent = 'Editar Asignación ' + paramId;
    headerEstado.style.display = 'inline-flex';

    if (paramId === 'ASG-C-0158') {
        radiosClientes.forEach(rd => {
            if (rd.value === 'Minimarket Don Eduardo') {
                rd.checked = true;
                toggleClienteRowStyle(rd);
                renderSolicitudesPendientes(rd.value);
            }
        });
        const eqChecks = document.querySelectorAll('.check-equipo');
        if (eqChecks[0]) { eqChecks[0].checked = true; toggleEquipoRowStyle(eqChecks[0]); }
        if (eqChecks[1]) { eqChecks[1].checked = true; toggleEquipoRowStyle(eqChecks[1]); }
        solicitudOrigenActiva = 'SOL-003';
    } else if (paramId === 'ASG-C-0157') {
        radiosClientes.forEach(rd => {
            if (rd.value === 'Botillería La Esquina') {
                rd.checked = true;
                toggleClienteRowStyle(rd);
                renderSolicitudesPendientes(rd.value);
            }
        });
        const eqChecks = document.querySelectorAll('.check-equipo');
        if (eqChecks[0]) { eqChecks[0].checked = true; toggleEquipoRowStyle(eqChecks[0]); }
        solicitudOrigenActiva = 'SOL-005';
    }
}

// --- ?mode=view&id=ASG-XXX: read-only mode ---
if (paramMode === 'view' && paramId) {
    isReadOnly = true;
    pageTitle.textContent = 'Detalle Asignación ' + paramId;
    headerEstado.style.display = 'inline-flex';
    headerEstado.innerHTML = '<i class="bi bi-eye"></i> Enviada';
    headerEstado.style.background = '#E3F2FD';
    headerEstado.style.color = '#0D47A1';

    checkboxesEquipos.forEach(cb => cb.disabled = true);
    checkAllEquipos.disabled = true;
    radiosClientes.forEach(rd => rd.disabled = true);
    buscarEquipo.disabled = true;
    buscarCliente.disabled = true;
    btnAsignar.style.display = 'none';
    btnGuardarBorrador.style.display = 'none';
    btnLimpiar.style.display = 'none';

    if (paramId === 'ASG-0040') {
        radiosClientes.forEach(rd => {
            if (rd.value === 'Supermercado El Ahorro') {
                rd.checked = true;
                toggleClienteRowStyle(rd);
            }
        });
        checkboxesEquipos.forEach((cb, i) => {
            if (i < 3) {
                cb.checked = true;
                toggleEquipoRowStyle(cb);
            }
        });
    }
}

// ===== Inicializar =====
actualizarEstado();
