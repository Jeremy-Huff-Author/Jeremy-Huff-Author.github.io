const checkFooterSticky = () => {
  const contentHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  
  if (contentHeight < viewportHeight) {
    document.body.classList.add('sticky-footer');
  } else {
    document.body.classList.remove('sticky-footer');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkFooterSticky();
  window.addEventListener('resize', checkFooterSticky);
});

// Ensure the footer position is recalculated after all resources such as
// images have loaded. This helps with pages that dynamically add content
// or include images that change the overall height after DOMContentLoaded.
window.addEventListener('load', checkFooterSticky);
