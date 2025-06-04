const checkFooterSticky = () => {
  const contentHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const footer = document.querySelector('footer');
  const footerHeight = footer ? footer.offsetHeight : 0;

  console.log("contentHeight", contentHeight);
  console.log("viewportHeight", viewportHeight);
  console.log("footerHeight", footerHeight);
  console.log("contentHeight <= viewportHeight - footerHeight", contentHeight <= viewportHeight - footerHeight);

  if (contentHeight <= viewportHeight - footerHeight) {
    document.body.classList.add('sticky-footer');
  } else {
    document.body.classList.remove('sticky-footer');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkFooterSticky();
  window.addEventListener('resize', checkFooterSticky);
});
