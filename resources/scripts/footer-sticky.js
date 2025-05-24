const checkFooterSticky = () => {
  const contentHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;

  if (contentHeight <= viewportHeight) {
    document.body.classList.add('sticky-footer');
  } else {
    document.body.classList.remove('sticky-footer');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkFooterSticky();
  window.addEventListener('resize', checkFooterSticky);
});