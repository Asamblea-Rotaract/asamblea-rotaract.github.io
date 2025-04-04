document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const pressStart = document.getElementById('pressStart');
    const contentBox = document.getElementById('contentBox');
    const content = document.getElementById('content');
    const navbar = document.getElementById('navbar');
    const arrowUp = document.querySelector(".arrow.up");
    const arrowDown = document.querySelector(".arrow.down");
    const triggerImage = document.getElementById("logo"); // Imagen para activar la reversión

    let started = false;
    let isReversed = false;
    let isScrolling = false;

    function checkScroll() {
        // Verifica si el scroll está en el principio o en el fondo, ajustado para dispositivos móviles
        if (isScrolling) return;
        isScrolling = true;

        requestAnimationFrame(() => {
            const scrollTop = content.scrollTop;
            const clientHeight = content.clientHeight;
            const scrollHeight = content.scrollHeight;

	    const tolerance = 2;

	    if (scrollTop <= tolerance) {
            	arrowUp.classList.add("hidden");
	    } else {
            	arrowUp.classList.remove("hidden");
    	    }

    	    if (scrollTop + clientHeight >= scrollHeight - tolerance) {
            	arrowDown.classList.add("hidden");
    	    } else {
            	arrowDown.classList.remove("hidden");
    	    }

            isScrolling = false;
        });
    }

    function startAnimation() {
        if (started) return;
        started = true;
        pressStart.style.animation = 'blink 0.1s infinite';
        setTimeout(() => {
            startScreen.style.opacity = '0';
            setTimeout(() => {
                startScreen.style.display = 'none';
                navbar.classList.add('visible');
                contentBox.classList.add('active');
                setTimeout(() => {
                    contentBox.classList.add('expanded');
                }, 500);
            }, 500);
        }, 500);
    }

    function reverseAnimation() {
        if (!started) return;
        started = false;
        contentBox.classList.remove('expanded');
        setTimeout(() => {
            contentBox.classList.remove('active');
            navbar.classList.remove('visible');
            setTimeout(() => {
                startScreen.style.display = 'flex';
                setTimeout(() => {
                    startScreen.style.opacity = '1';
                    pressStart.style.animation = ''; // Detiene la animación de parpadeo
                }, 50);
            }, 500);
        }, 500);
    }

    arrowUp.addEventListener("click", () => {
    	content.scrollTo({
    	    top: 0,
    	    behavior: "smooth"
    	});
    });

    arrowDown.addEventListener("click", () => {
    	content.scrollTo({
    	    top: content.scrollHeight - content.clientHeight,
    	    behavior: "smooth"
        });
    });

    content.addEventListener("scroll", checkScroll);
    window.addEventListener("load", checkScroll);

    startScreen.addEventListener('wheel', startAnimation);
    startScreen.addEventListener('click', startAnimation);
    startScreen.addEventListener('touchstart', startAnimation);

    // Evento para activar la reversión
    triggerImage.addEventListener("click", reverseAnimation);
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault(); // Evita el salto directo en la página

        let contenedor = document.getElementById("content");
        let targetId = this.getAttribute("href").substring(1); // Obtiene el ID de la sección destino
        let seccion = document.getElementById(targetId);

        if (seccion) {
            let paddingTop = parseInt(window.getComputedStyle(contenedor).paddingTop);
            let posicionFinal = seccion.offsetTop - contenedor.offsetTop - paddingTop;

            // Asegurar que no se pase del límite inferior del contenedor
            let maxScroll = contenedor.scrollHeight - contenedor.clientHeight;
            let posicionAjustada = Math.min(posicionFinal, maxScroll);

            // Hacer scroll dentro del contenedor
            contenedor.scrollTo({
                top: posicionAjustada,
                behavior: "smooth"
            });
        }
    });
});
