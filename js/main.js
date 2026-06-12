// ==========================================================================
// VARIABLES GLOBALES
// ==========================================================================
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_ihc')) || [];
let usuarioActual = JSON.parse(localStorage.getItem('usuario_actual')) || null;
let tempUserData = {};
let codigoMfaGenerado = null;

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    if (usuarioActual) {
        mostrarDashboard();
    }
});

// ==========================================================================
// INICIALIZAR EVENTOS
// ==========================================================================
function inicializarEventos() {
    // Login
    document.getElementById('form-login').addEventListener('submit', manejarLogin);
    document.getElementById('btn-ir-registro').addEventListener('click', () => cambiarVista('vista-registro'));

    // Registro
    document.getElementById('form-registro').addEventListener('submit', manejarRegistro);
    document.getElementById('btn-ir-login').addEventListener('click', () => cambiarVista('vista-login'));

    // Verificación MFA
    document.getElementById('form-verificacion').addEventListener('submit', manejarVerificacion);
    document.getElementById('btn-reintentar-codigo').addEventListener('click', reenviarCodigo);

    // Suscripción
    document.querySelectorAll('.btn-elegir-plan').forEach(btn => {
        btn.addEventListener('click', (e) => manejarEleccionPlan(e.target.closest('.plan-card').dataset.plan));
    });

    // Navegación del Dashboard
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', manejarNavegacion);
    });

    // Cerrar sesión
    document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);

    // Exportar reportes
    document.querySelector('.btn-exportar-pdf')?.addEventListener('click', exportarPDF);
    document.querySelector('.btn-exportar-sheets')?.addEventListener('click', exportarGoogleSheets);

    // Analizar texto IA
    document.querySelector('.btn-analizar-texto')?.addEventListener('click', analizarTexto);
}

// ==========================================================================
// FUNCIONES DE NAVEGACIÓN ENTRE VISTAS
// ==========================================================================
function cambiarVista(vistaId) {
    document.querySelectorAll('.modulo-login').forEach(v => v.classList.add('oculto'));
    document.getElementById(vistaId).classList.remove('oculto');
}

// ==========================================================================
// FUNCIONES DE LOGIN
// ==========================================================================
function manejarLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const alerta = document.getElementById('alerta-login');

    if (!email || !password) {
        mostrarAlerta(alerta, 'Por favor, rellena todos los campos.');
        return;
    }

    // Acceso rápido con contraseña admin
    if (password === 'admin') {
        usuarioActual = { nombre: 'Usuario Demo', email: email, plan: 'premium' };
        localStorage.setItem('usuario_actual', JSON.stringify(usuarioActual));
        mostrarDashboard();
        return;
    }

    // Verificar credenciales
    const usuario = usuariosRegistrados.find(u => u.email === email && u.password === password);
    if (usuario) {
        usuarioActual = usuario;
        localStorage.setItem('usuario_actual', JSON.stringify(usuarioActual));
        mostrarDashboard();
    } else {
        mostrarAlerta(alerta, 'Credenciales inválidas. Verifica tu correo y contraseña.');
    }
}

// ==========================================================================
// FUNCIONES DE REGISTRO
// ==========================================================================
function manejarRegistro(e) {
    e.preventDefault();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;
    const alerta = document.getElementById('alerta-registro');

    if (!nombre || !email || !password || !password2) {
        mostrarAlerta(alerta, 'Por favor, rellena todos los campos.');
        return;
    }

    if (password !== password2) {
        mostrarAlerta(alerta, 'Las contraseñas no coinciden.');
        return;
    }

    if (password.length < 4) {
        mostrarAlerta(alerta, 'La contraseña debe tener al menos 4 caracteres.');
        return;
    }

    // Verificar que el correo no esté registrado
    if (usuariosRegistrados.some(u => u.email === email)) {
        mostrarAlerta(alerta, 'Este correo ya está registrado.');
        return;
    }

    // Guardar datos temporales y enviar a verificación
    tempUserData = { nombre, email, password };
    generarYEnviarCodigo(email);
    cambiarVista('vista-verificacion');
    document.getElementById('email-verificacion').textContent = email;
}

// ==========================================================================
// FUNCIONES DE VERIFICACIÓN MFA
// ==========================================================================
function generarYEnviarCodigo(email) {
    codigoMfaGenerado = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SIMULACIÓN] Código enviado a ${email}: ${codigoMfaGenerado}`);
    alert(`Código de verificación: ${codigoMfaGenerado}`);
}

function reenviarCodigo() {
    generarYEnviarCodigo(tempUserData.email);
}

function manejarVerificacion(e) {
    e.preventDefault();
    const codigoIngresado = document.getElementById('codigo-mfa').value.trim();
    const alerta = document.getElementById('alerta-verificacion');

    if (!codigoIngresado) {
        mostrarAlerta(alerta, 'Por favor, ingresa el código de verificación.');
        return;
    }

    if (codigoIngresado === codigoMfaGenerado) {
        cambiarVista('vista-suscripcion');
    } else {
        mostrarAlerta(alerta, 'Código incorrecto. Por favor, inténtalo de nuevo.');
    }
}

// ==========================================================================
// FUNCIONES DE SUSCRIPCIÓN
// ==========================================================================
function manejarEleccionPlan(plan) {
    const nuevoUsuario = {
        nombre: tempUserData.nombre,
        email: tempUserData.email,
        password: tempUserData.password,
        plan: plan
    };

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuarios_ihc', JSON.stringify(usuariosRegistrados));
    usuarioActual = nuevoUsuario;
    localStorage.setItem('usuario_actual', JSON.stringify(usuarioActual));
    mostrarDashboard();
}

// ==========================================================================
// FUNCIONES DEL DASHBOARD
// ==========================================================================
function mostrarDashboard() {
    document.querySelectorAll('.modulo-login').forEach(v => v.classList.add('oculto'));
    document.getElementById('app-dashboard').classList.remove('oculto');
    actualizarInfoUsuario();
}

function actualizarInfoUsuario() {
    if (usuarioActual) {
        document.getElementById('usuario-nombre-dashboard').textContent = usuarioActual.nombre;
        document.getElementById('usuario-plan-dashboard').innerHTML = `<i class="fas fa-user"></i> ${capitalizarPrimeraLetra(usuarioActual.plan)}`;
    }
}

function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function manejarNavegacion(e) {
    const btn = e.currentTarget;
    const targetId = btn.dataset.target;

    // Actualizar estado de los botones
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');

    // Mostrar la sección correspondiente
    document.querySelectorAll('.seccion-modulo').forEach(s => s.classList.add('oculto'));
    document.getElementById(targetId).classList.remove('oculto');
}

function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuario_actual');
    document.getElementById('app-dashboard').classList.add('oculto');
    document.getElementById('form-login').reset();
    cambiarVista('vista-login');
}

// ==========================================================================
// FUNCIONES DE ALERTAS
// ==========================================================================
function mostrarAlerta(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove('oculto');
    setTimeout(() => {
        elemento.classList.add('oculto');
    }, 4000);
}

// ==========================================================================
// FUNCIONES DE EXPORTACIÓN
// ==========================================================================
function exportarPDF() {
    alert('Exportando reporte a PDF... [SIMULACIÓN]');
}

function exportarGoogleSheets() {
    alert('Exportando reporte a Google Sheets... [SIMULACIÓN]');
}

// ==========================================================================
// FUNCIONES DE IA
// ==========================================================================
function analizarTexto() {
    const texto = document.getElementById('ia-input-prompt').value.trim();
    const resultado = document.getElementById('resultado-ia');

    if (!texto) {
        alert('Por favor, ingresa un texto para analizar.');
        return;
    }

    resultado.classList.remove('oculto');
    resultado.innerHTML = `<p><strong>Resultado del análisis:</strong> El texto tiene un tono ${Math.random() > 0.5 ? 'positivo' : 'neutral'}.</p>`;
}
