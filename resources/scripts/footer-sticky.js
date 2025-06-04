const checkFooterSticky = () => {
  const contentHeight = document.body.scrollHeight;
  const viewportHeight = window.innerHeight;
  const footer = document.querySelector('footer');
  const footerHeight = footer ? footer.offsetHeight : 0;

  if (contentHeight <= viewportHeight - footerHeight) {
    document.body.classList.add('sticky-footer');
  } else {
    document.body.classList.remove('sticky-footer');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkFooterSticky();
  window.addEventListener('resize', checkFooterSticky);
  const offcanvas = document.getElementById('offcanvas');
  if (offcanvas) {
    offcanvas.addEventListener('hidden.bs.offcanvas', checkFooterSticky);
    offcanvas.addEventListener('shown.bs.offcanvas', checkFooterSticky);
  }
});
