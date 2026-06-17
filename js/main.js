document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEYS = {
        usuario: "usuarioRegistradoGlobalTech",
        sesion: "sesionGlobalTech",
        legacyUsuario: "usuarioGlobalTech",
        nombre: "nombreUsuario",
        plan: "planUsuario",
        idioma: "idiomaGlobalTech"
    };

    const vistaAcceso = document.getElementById("vista-acceso");
    const vistaRegistro = document.getElementById("vista-registro");
    const vistaVerificacion = document.getElementById("vista-verificacion");
    const vistaPlanes = document.getElementById("vista-planes");
    const plataforma = document.getElementById("plataforma-globaltech");

    const formularioLogin = document.getElementById("form-login");
    const formularioRegistro = document.getElementById("form-registro");
    const formularioMFA = document.getElementById("form-mfa");

    const botonesMenu = Array.from(document.querySelectorAll(".item-menu"));
    const modulos = Array.from(document.querySelectorAll(".modulo"));
    const botonesIdioma = Array.from(document.querySelectorAll(".selector-idioma button"));
    const botonesPlan = Array.from(document.querySelectorAll(".seleccionar-plan"));
    const tiposIA = Array.from(document.querySelectorAll(".tipo-ia"));

    const botonRegistro = document.getElementById("btn-registro");
    const botonRegistroHero = document.getElementById("btn-registro-hero");
    const volverLogin = document.getElementById("btn-volver-login");
    const botonReenviar = document.getElementById("reenviar-codigo");
    const botonAnalisis = document.getElementById("ejecutar-analisis");
    const botonNuevoCliente = document.querySelector("#vista-clientes .accion-secundaria");
    const botonNuevoProyecto = document.querySelector("#vista-proyectos .accion-secundaria");
    const botonNuevoStudio = document.querySelector("#vista-studios .accion-secundaria");
    const botonEditarPerfil = document.querySelector("#vista-configuracion .accion-secundaria");
    const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");

    const panelLoginFlotante = document.getElementById("panel-login-flotante");
    const botonCerrarPanelLogin = document.getElementById("cerrar-login-panel");
    const disparadorCerebro = document.getElementById("disparador-login-cerebro");
    const botonAbrirLogin = document.getElementById("abrir-login-cerebro");
    const botonAbrirLoginSecundario = document.getElementById("abrir-login-secundario");
    const nucleoIA = document.querySelector(".nucleo-ia");

    const campoLoginEmail = document.getElementById("login-email");
    const campoLoginPassword = document.getElementById("login-password");
    const campoRegistroNombre = document.getElementById("registro-nombre");
    const campoRegistroEmail = document.getElementById("registro-email");
    const campoRegistroPassword = document.getElementById("registro-password");
    const campoRegistroConfirmar = document.getElementById("registro-password-confirmar");
    const campoCodigoVerificacion = document.getElementById("codigo-verificacion");

    const nombreUsuario = document.getElementById("nombre-usuario");
    const planUsuario = document.getElementById("plan-usuario");
    const configNombreUsuario = document.getElementById("config-nombre-usuario");
    const configPlanUsuario = document.getElementById("config-plan-usuario");
    const avatarUsuario = document.querySelector(".avatar-usuario");

    const codigoMFA = String(Math.floor(100000 + Math.random() * 900000));

    function parsearJSON(valor) {
        if (!valor) {
            return null;
        }

        try {
            return JSON.parse(valor);
        } catch (error) {
            console.warn("No se pudo leer la informacion almacenada.", error);
            return null;
        }
    }

    function capitalizar(texto) {
        if (!texto) {
            return "Sin plan";
        }

        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    function obtenerIniciales(nombre) {
        if (!nombre) {
            return "GT";
        }

        return nombre
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((segmento) => segmento.charAt(0).toUpperCase())
            .join("");
    }

    function leerUsuarioLegacy() {
        return parsearJSON(localStorage.getItem(STORAGE_KEYS.legacyUsuario));
    }

    function leerUsuarioRegistrado() {
        return parsearJSON(localStorage.getItem(STORAGE_KEYS.usuario)) || leerUsuarioLegacy();
    }

    function leerSesion() {
        return parsearJSON(localStorage.getItem(STORAGE_KEYS.sesion));
    }

    function guardarUsuarioRegistrado(usuario) {
        localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(usuario));
        localStorage.setItem(STORAGE_KEYS.legacyUsuario, JSON.stringify(usuario));
    }

    function guardarSesion(usuario) {
        localStorage.setItem(STORAGE_KEYS.sesion, JSON.stringify(usuario));
        localStorage.setItem(STORAGE_KEYS.nombre, usuario.nombre || "Usuario");
        localStorage.setItem(STORAGE_KEYS.plan, usuario.plan || "");
    }

    function limpiarSesion() {
        localStorage.removeItem(STORAGE_KEYS.sesion);
        localStorage.removeItem(STORAGE_KEYS.nombre);
        localStorage.removeItem(STORAGE_KEYS.plan);
    }

    function sincronizarPerfil(usuario = leerSesion() || leerUsuarioRegistrado()) {
        const nombre = usuario?.nombre || "Usuario";
        const plan = capitalizar(usuario?.plan || "Sin plan");

        if (nombreUsuario) {
            nombreUsuario.textContent = nombre;
        }

        if (planUsuario) {
            planUsuario.textContent = plan;
        }

        if (configNombreUsuario) {
            configNombreUsuario.textContent = nombre;
        }

        if (configPlanUsuario) {
            configPlanUsuario.textContent = plan;
        }

        if (avatarUsuario) {
            avatarUsuario.textContent = obtenerIniciales(nombre);
        }
    }

    function ocultarPantallasPrincipales() {
        [vistaAcceso, vistaRegistro, vistaVerificacion, vistaPlanes, plataforma].forEach((vista) => {
            vista?.classList.add("oculto");
            vista?.classList.remove("activo");
        });
    }

    function mostrarPantalla(vista) {
        ocultarPantallasPrincipales();
        vista?.classList.remove("oculto");
        vista?.classList.add("activo");
    }

    function mostrarModulo(idModulo = "vista-centro") {
        const moduloDestino = document.getElementById(idModulo) || document.getElementById("vista-centro");
        const contenedorPlataforma = document.querySelector(".contenido-plataforma");

        modulos.forEach((modulo) => {
            modulo.classList.remove("activo");
            modulo.classList.add("oculto");
        });

        botonesMenu.forEach((boton) => {
            boton.classList.toggle("activo", boton.dataset.seccion === moduloDestino?.id);
        });

        moduloDestino?.classList.remove("oculto");
        moduloDestino?.classList.add("activo");

        // Al cambiar de modulo, reinicia la vista arriba para evitar
        // que el usuario aterrice a mitad del contenido anterior.
        contenedorPlataforma?.scrollTo({ top: 0, behavior: "auto" });
        window.scrollTo({ top: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    function abrirPanelLogin() {
        if (!panelLoginFlotante) {
            return;
        }

        panelLoginFlotante.classList.add("abierto");
        panelLoginFlotante.setAttribute("aria-hidden", "false");
        document.body.classList.add("login-panel-abierto");

        window.setTimeout(() => {
            campoLoginEmail?.focus();
        }, 100);
    }

    function cerrarPanelLogin() {
        if (!panelLoginFlotante) {
            return;
        }

        panelLoginFlotante.classList.remove("abierto");
        panelLoginFlotante.setAttribute("aria-hidden", "true");
        document.body.classList.remove("login-panel-abierto");
    }

    function abrirPlataforma(idModulo = "vista-centro") {
        ocultarPantallasPrincipales();
        plataforma?.classList.remove("oculto");
        plataforma?.classList.add("activo");
        mostrarModulo(idModulo);
        sincronizarPerfil(leerSesion());
        cerrarPanelLogin();
    }

    function irARegistro() {
        cerrarPanelLogin();
        mostrarPantalla(vistaRegistro);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function volverAAcceso() {
        mostrarPantalla(vistaAcceso);
        cerrarPanelLogin();
    }

    function aplicarIdioma(idioma) {
        const idiomaActivo = idioma === "en" ? "en" : "es";

        document.documentElement.lang = idiomaActivo;
        localStorage.setItem(STORAGE_KEYS.idioma, idiomaActivo);

        document.querySelectorAll("[data-es][data-en]").forEach((elemento) => {
            elemento.textContent = idiomaActivo === "en" ? elemento.dataset.en : elemento.dataset.es;
        });

        document.querySelectorAll("[data-placeholder-es][data-placeholder-en]").forEach((elemento) => {
            elemento.placeholder = idiomaActivo === "en"
                ? elemento.dataset.placeholderEn
                : elemento.dataset.placeholderEs;
        });

        botonesIdioma.forEach((boton) => {
            boton.classList.toggle("idioma-activo", boton.dataset.language === idiomaActivo);
        });
    }

    function activarTipoIA(tipoActivo) {
        tiposIA.forEach((tipo) => {
            tipo.classList.toggle("activo", tipo === tipoActivo);
        });
    }

    function crearTarjetaCliente() {
        const contenedor = document.querySelector(".grid-clientes");

        if (!contenedor) {
            return;
        }

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-cliente";
        tarjeta.innerHTML = `
            <div class="cabecera-cliente">
                <div class="logo-cliente">GT</div>
                <div>
                    <h3>Nuevo Cliente</h3>
                    <span>Tecnologia</span>
                </div>
            </div>
            <div class="datos-cliente">
                <p><strong>Pais:</strong> Peru</p>
                <p><strong>Proyectos:</strong> 0 activos</p>
                <p><strong>Studio:</strong> Pendiente</p>
            </div>
            <div class="estado-cliente">Registro creado</div>
        `;

        contenedor.appendChild(tarjeta);
    }

    function crearProyecto() {
        const columna = document.querySelector(".tablero-proyectos .columna-proyecto");

        if (!columna) {
            return;
        }

        const proyecto = document.createElement("div");
        proyecto.className = "tarjeta-proyecto";
        proyecto.innerHTML = `
            <h4>Nuevo proyecto IA</h4>
            <p>Cliente: Pendiente</p>
            <div class="informacion-proyecto">
                <span>IA</span>
                <span>Nuevo</span>
            </div>
        `;

        columna.appendChild(proyecto);
    }

    function crearStudio() {
        const contenedor = document.querySelector(".red-studios");

        if (!contenedor) {
            return;
        }

        const studio = document.createElement("article");
        studio.className = "studio-card";
        studio.innerHTML = `
            <header>
                <div class="icono-studio">
                    <i class="fa-solid fa-layer-group"></i>
                </div>
                <div>
                    <h3>Nuevo Studio</h3>
                    <span>Area especializada</span>
                </div>
            </header>
            <div class="pods-container">
                <h4>Pods asignados</h4>
                <div class="pod">
                    <strong>Nuevo Pod</strong>
                    <span>0 especialistas</span>
                </div>
            </div>
            <footer>0 proyectos activos</footer>
        `;

        contenedor.appendChild(studio);
    }

    function editarPerfil() {
        const sesion = leerSesion();
        const usuarioRegistrado = leerUsuarioRegistrado();
        const baseUsuario = sesion || usuarioRegistrado;

        if (!baseUsuario) {
            alert("Primero inicia sesion para editar tu perfil.");
            return;
        }

        const nuevoNombre = prompt("Ingrese nuevo nombre:", baseUsuario.nombre || "");

        if (!nuevoNombre || nuevoNombre.trim() === "") {
            return;
        }

        const usuarioActualizado = {
            ...baseUsuario,
            nombre: nuevoNombre.trim()
        };

        if (usuarioRegistrado && usuarioRegistrado.correo === usuarioActualizado.correo) {
            guardarUsuarioRegistrado({
                ...usuarioRegistrado,
                nombre: usuarioActualizado.nombre
            });
        }

        guardarSesion(usuarioActualizado);
        sincronizarPerfil(usuarioActualizado);
        alert("Perfil actualizado correctamente");
    }

    function cerrarSesion() {
        limpiarSesion();
        formularioLogin?.reset();
        mostrarModulo("vista-centro");
        mostrarPantalla(vistaAcceso);
        cerrarPanelLogin();
        alert("Sesion cerrada correctamente");
    }

    formularioLogin?.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const correo = campoLoginEmail?.value.trim() || "";
        const password = campoLoginPassword?.value || "";

        let usuarioValido = null;

        if (correo === "blas272000@gmail.com" && password === "admin") {
            usuarioValido = {
                nombre: "Administrador GlobalTech",
                correo: "blas272000@gmail.com",
                password: "admin",
                plan: "enterprise"
            };
        } else {
            const usuarioRegistrado = leerUsuarioRegistrado();

            if (
                usuarioRegistrado &&
                usuarioRegistrado.correo === correo &&
                usuarioRegistrado.password === password
            ) {
                usuarioValido = usuarioRegistrado;
            }
        }

        if (!usuarioValido) {
            alert("Usuario o contrasena incorrectos");
            return;
        }

        guardarSesion(usuarioValido);
        sincronizarPerfil(usuarioValido);
        abrirPlataforma("vista-centro");
    });

    formularioRegistro?.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nombre = campoRegistroNombre?.value.trim() || "";
        const correo = campoRegistroEmail?.value.trim() || "";
        const password = campoRegistroPassword?.value || "";
        const confirmar = campoRegistroConfirmar?.value || "";

        if (password !== confirmar) {
            alert("Las contrasenas no coinciden");
            return;
        }

        const nuevoUsuario = {
            nombre,
            correo,
            password,
            plan: ""
        };

        guardarUsuarioRegistrado(nuevoUsuario);
        mostrarPantalla(vistaVerificacion);
        alert(`Codigo de verificacion enviado: ${codigoMFA}`);
    });

    formularioMFA?.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const codigoIngresado = campoCodigoVerificacion?.value.trim() || "";

        if (codigoIngresado !== codigoMFA) {
            alert("Codigo incorrecto");
            return;
        }

        alert("Cuenta verificada correctamente");
        mostrarPantalla(vistaPlanes);
    });

    botonReenviar?.addEventListener("click", () => {
        alert(`Nuevo codigo enviado: ${codigoMFA}`);
    });

    botonesPlan.forEach((boton) => {
        boton.addEventListener("click", () => {
            const planSeleccionado = boton.dataset.plan || "starter";
            const usuarioRegistrado = leerUsuarioRegistrado() || {
                nombre: "Usuario",
                correo: "",
                password: "",
                plan: ""
            };

            const usuarioActualizado = {
                ...usuarioRegistrado,
                plan: planSeleccionado
            };

            guardarUsuarioRegistrado(usuarioActualizado);
            guardarSesion(usuarioActualizado);
            sincronizarPerfil(usuarioActualizado);
            abrirPlataforma("vista-centro");
        });
    });

    botonesMenu.forEach((boton) => {
        boton.addEventListener("click", () => {
            mostrarModulo(boton.dataset.seccion || "vista-centro");
        });
    });

    tiposIA.forEach((tipo) => {
        tipo.addEventListener("click", () => {
            activarTipoIA(tipo);
        });
    });

    botonAnalisis?.addEventListener("click", () => {
        const entrada = document.getElementById("entrada-ia")?.value.trim() || "";
        const respuesta = document.getElementById("respuesta-ia");

        if (!entrada) {
            if (respuesta) {
                respuesta.textContent = "Ingresa informacion para ejecutar el analisis.";
            }
            return;
        }

        if (respuesta) {
            respuesta.textContent = "Analizando informacion mediante GT Neural Core...";
        }

        window.setTimeout(() => {
            const resultados = [
                "Se detectaron patrones importantes en los datos ingresados.",
                "El sistema identifico oportunidades de mejora empresarial.",
                "El modelo predictivo recomienda optimizar procesos actuales.",
                "La inteligencia artificial clasifico correctamente la informacion."
            ];

            const resultado = resultados[Math.floor(Math.random() * resultados.length)];

            if (respuesta) {
                respuesta.textContent = resultado;
            }

            const historial = document.querySelector(".panel-aprendizaje ul");

            if (historial) {
                const elemento = document.createElement("li");
                elemento.textContent = "Nuevo analisis ejecutado correctamente";
                historial.prepend(elemento);
            }
        }, 1400);
    });

    botonNuevoCliente?.addEventListener("click", crearTarjetaCliente);
    botonNuevoProyecto?.addEventListener("click", crearProyecto);
    botonNuevoStudio?.addEventListener("click", crearStudio);
    botonEditarPerfil?.addEventListener("click", editarPerfil);
    botonCerrarSesion?.addEventListener("click", cerrarSesion);

    [botonRegistro, botonRegistroHero].forEach((boton) => {
        boton?.addEventListener("click", irARegistro);
    });

    volverLogin?.addEventListener("click", volverAAcceso);

    [botonAbrirLogin, botonAbrirLoginSecundario, disparadorCerebro].forEach((disparador) => {
        disparador?.addEventListener("click", abrirPanelLogin);
    });

    disparadorCerebro?.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirPanelLogin();
        }
    });

    botonCerrarPanelLogin?.addEventListener("click", cerrarPanelLogin);

    panelLoginFlotante?.addEventListener("click", (evento) => {
        if (evento.target === panelLoginFlotante) {
            cerrarPanelLogin();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarPanelLogin();
        }
    });

    botonesIdioma.forEach((boton) => {
        boton.addEventListener("click", () => {
            aplicarIdioma(boton.dataset.language || "es");
        });
    });

    document.querySelectorAll(".opcion").forEach((opcion) => {
        opcion.addEventListener("click", () => {
            opcion.classList.toggle("seleccionado");
        });
    });

    document.querySelectorAll("#vista-configuracion .opcion strong").forEach((elemento) => {
        if (elemento.textContent.includes("Activada")) {
            elemento.dataset.estado = "seguro";
        }
    });

    document.querySelectorAll("button").forEach((boton) => {
        boton.addEventListener("mousedown", () => boton.classList.add("presionado"));
        boton.addEventListener("mouseup", () => boton.classList.remove("presionado"));
        boton.addEventListener("mouseleave", () => boton.classList.remove("presionado"));
    });

    if (nucleoIA) {
        window.setInterval(() => {
            nucleoIA.classList.toggle("activo");
        }, 2000);
    }

    const idiomaGuardado = localStorage.getItem(STORAGE_KEYS.idioma) || "es";
    aplicarIdioma(idiomaGuardado);
    sincronizarPerfil();

    const sesionActiva = leerSesion();

    if (sesionActiva) {
        abrirPlataforma("vista-centro");
    } else {
        mostrarPantalla(vistaAcceso);
        cerrarPanelLogin();
    }
});
