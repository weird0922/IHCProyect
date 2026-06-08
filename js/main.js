// ==========================================================================
// 1. SELECTORES DE ELEMENTOS (Captura de la Interfaz)
// ==========================================================================
const vistaLogin = document.getElementById('vista-login');
const appDashboard = document.getElementById('app-dashboard');
const formLogin = document.getElementById('form-login');
const alertaLogin = document.getElementById('alerta-login');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Selectores para la navegación de pestañas (SPA)
const enlacesNav = document.querySelectorAll('.nav-link');
const seccionesModulos = document.querySelectorAll('.seccion-modulo');

// Base de datos local simulada para usuarios registrados
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_ihc')) || [];

// Código MFA simulado en memoria
let codigoMfaGenerado = null;
let correoEnRegistro = null;

// ==========================================================================
// 2. LÓGICA DE INTERFACES INTERACTIVAS (Ruteo SPA sin recargar)
// ==========================================================================
enlacesNav.forEach(boton => {
    boton.addEventListener('click', () => {
        // Remover estado activo de todos los botones
        enlacesNav.forEach(btn => btn.classList.remove('activo'));
        // Agregar activo al botón presionado
        boton.classList.add('activo');

        // Ocultar todas las secciones del Dashboard
        seccionesModulos.forEach(seccion => seccion.classList.add('oculto'));
        
        // Mostrar la sección destino basada en el atributo data-target
        const targetId = boton.getAttribute('data-target');
        document.getElementById(targetId).classList.remove('oculto');
    });
});

// ==========================================================================
// 3. CONTROL DE AUTENTICACIÓN Y VALIDACIÓN (RF1, RF5, RNF3)
// ==========================================================================
formLogin.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se refresque

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validación de campos obligatorios vacíos (RF5)
    if (!email || !password) {
        mostrarErrorLogin('Por favor, rellene todos los campos obligatorios.');
        return;
    }

    // CONTROL DE ACCESO DIRECTO (Tu correo cualquiera + contraseña "admin")
    if (password === 'admin') {
        ingresarAlDashboard();
        return;
    }

    // CONTROL DE ACCESO PARA USUARIOS REGISTRADOS VÍA SIMULACIÓN OAUTH/MFA
    const usuarioEncontrado = usuariosRegistrados.find(u => u.email === email && u.password === password);
    if (usuarioEncontrado) {
        ingresarAlDashboard();
    } else {
        mostrarErrorLogin('Credenciales inválidas o contraseña incorrecta.');
    }
});

// Función para manejar el ingreso exitoso
function ingresarAlDashboard() {
    alertaLogin.classList.add('oculto');
    vistaLogin.classList.add('oculto');      // Oculta la pantalla de login
    appDashboard.classList.remove('oculto'); // Muestra la estructura de la plataforma SaaS
    formLogin.reset();
}

// Función para mostrar errores en el login con reducción de carga cognitiva
function mostrarErrorLogin(mensaje) {
    alertaLogin.textContent = mensaje;
    alertaLogin.classList.remove('oculto');
}

// Cierre de sesión seguro
btnCerrarSesion.addEventListener('click', () => {
    appDashboard.classList.add('oculto');
    vistaLogin.classList.remove('oculto');
});

// ==========================================================================
// 4. SIMULACIÓN CREATIVA DE REGISTRO MULTIFACTOR (OAuth Google / Microsoft)
// ==========================================================================
// Capturamos los botones de Google y Microsoft para disparar la experiencia guiada
const botonesOAuth = document.querySelectorAll('.btn-oauth');

botonesOAuth.forEach(btn => {
    btn.addEventListener('click', () => {
        // Pedimos el correo electrónico del alumno/usuario
        const correo = prompt("[Simulación OAuth] Ingrese su correo corporativo (ej: usuario@outlook.com o gmail.com):");
        
        if (!correo || !correo.includes('@')) {
            alert("Correo electrónico no válido para la federación de identidades.");
            return;
        }

        correoEnRegistro = correo.trim();
        // Generamos un número aleatorio de 6 dígitos simulando el token SMS/Email (MFA)
        codigoMfaGenerado = Math.floor(100000 + Math.random() * 900000);

        // Simulamos la llegada del mensaje informando el código en pantalla
        alert(`[Simulador MFA Corporativo]\nSe ha enviado un token de seguridad a su bandeja de entrada corporativa.\n\nSu código de verificación es: ${codigoMfaGenerado}`);

        // Solicitamos la verificación del token
        const codigoIngresado = prompt("Ingrese el código de verificación de 6 dígitos recibido:");

        if (parseInt(codigoIngresado) === codigoMfaGenerado) {
            // Token correcto: Ahora creará su contraseña permanente
            const nuevaPassword = prompt("¡Identidad Verificada con éxito!\nDefina su nueva contraseña corporativa para el portal:");

            if (!nuevaPassword || nuevaPassword.length < 4) {
                alert("La contraseña debe tener al menos 4 caracteres por políticas de seguridad corporativas.");
                return;
            }

            // Guardamos el nuevo usuario en el almacenamiento local
            usuariosRegistrados.push({
                email: correoEnRegistro,
                password: nuevaPassword
            });
            localStorage.setItem('usuarios_ihc', JSON.stringify(usuariosRegistrados));

            // Autocompletamos el formulario para mejorar la experiencia de usuario (HX)
            document.getElementById('login-email').value = correoEnRegistro;
            document.getElementById('login-password').value = nuevaPassword;

            alert("Registro completado en la base de datos local. Presione 'Iniciar Sesión' para acceder.");
        } else {
            alert("Código incorrecto. Autenticación multifactor rechazada.");
            codigoMfaGenerado = null;
            correoEnRegistro = null;
        }
    });
});
