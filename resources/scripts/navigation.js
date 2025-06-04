document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    updateNavbarOpacity(); // Set opacity on page load

    if (hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.href.endsWith(hash)) {
                link.classList.add('active');
            }
        });
        scrollToTarget(hash);
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelectorAll('.nav-link').forEach(innerLink => {
            innerLink.classList.remove('active');
        });
        event.target.classList.add('active');
        scrollToTarget(event.target.hash);
    });
});

const scrollToTarget = (hash) => {
    let targetElement = null;
    document.querySelectorAll('[data-target]').forEach(element => {
        if (element.getAttribute('data-target').includes(hash.substring(1))) {
            targetElement = element;
        }
    });
    if (targetElement) {
        setTimeout(() => {
            window.location.href =  hash;
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }, 350);
    }
};

const navbarTogler = document.querySelector('.navbar-toggler');
if(navbarTogler) {
    navbarTogler.addEventListener('click', () => {
        const navbar = document.querySelector('.navbar');
        if(navbar) {
            let origOpacity = navbar.style.getPropertyValue('--bs-bg-opacity-custom');
            navbar.classList.toggle('open');
            if(navbar.classList.contains('open')) {
                navbar.style.setProperty('--bs-bg-opacity-custom', 1);
            } else {
                navbar.style.setProperty('--bs-bg-opacity-custom', origOpacity);
            }
        }
    });
}

const updateNavbarOpacity = () => {

    const navbarCollape = document.querySelector('.navbar-collapse');
    console.log("navbarCollape.classList.contains('show')", navbarCollape.classList.contains('show'));
    console.log("navbarCollape.classList.contains('collapsing')", navbarCollape.classList.contains('collapsing'));
    console.log("navbarCollape && !(navbarCollape.classList.contains('show') && navbarCollape.classList.contains('collapsing'))", navbarCollape && !(navbarCollape.classList.contains('show') && navbarCollape.classList.contains('collapsing')));
    if (navbarCollape && !(navbarCollape.classList.contains('show') && navbarCollape.classList.contains('collapsing'))) {
        console.log("skipping updateNavbarOpacity()");
        return;
    }

    const scrolled = window.scrollY;
    const heroSection = document.querySelector('.hero-section');
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = heroSection ? heroSection.offsetHeight : 0;

    if (scrolled <= scrollThreshold) {
        navbar.style.setProperty('--bs-bg-opacity-custom', scrolled / scrollThreshold);
    } else {
        navbar.style.setProperty('--bs-bg-opacity-custom', 1);
    }
};

window.addEventListener('scroll', () => {
    updateNavbarOpacity();
});
