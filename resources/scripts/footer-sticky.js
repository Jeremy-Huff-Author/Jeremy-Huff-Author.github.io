const checkFooterSticky = () => {
  const mainContent = document.querySelector('main');
  const viewportHeight = window.innerHeight;

  if (mainContent.offsetHeight <= viewportHeight-75) {
    document.body.classList.add('sticky-footer');
  } else {
    document.body.classList.remove('sticky-footer');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkFooterSticky();
  window.addEventListener('resize', checkFooterSticky);
});