document.addEventListener('DOMContentLoaded', () => {
  const checkFooterSticky = () => {
    const mainContent = document.querySelector('main');
    const viewportHeight = window.innerHeight;

    if (mainContent.offsetHeight <= viewportHeight) {
      document.body.classList.add('sticky-footer');
    } else {
      document.body.classList.remove('sticky-footer');
    }
  };

  checkFooterSticky();

  window.addEventListener('resize', checkFooterSticky);
});