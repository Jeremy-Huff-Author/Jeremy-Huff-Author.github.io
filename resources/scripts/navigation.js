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

const updateNavbarOpacity = () => {
    const scrolled = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollThreshold = documentHeight * 0.1;
    const navbar = document.querySelector('.navbar');

    if (scrolled <= scrollThreshold) {
        navbar.style.setProperty('--bs-bg-opacity-custom', scrolled / scrollThreshold);
    } else {
        navbar.style.setProperty('--bs-bg-opacity-custom', 1);
    }
};

window.addEventListener('scroll', () => {
    updateNavbarOpacity();
});
