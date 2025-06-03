// This file intentionally left empty.

fetch('/gallery/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    const carouselInner = document.querySelector('.carousel-inner');
    manifest.forEach((entry, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (index === 0) {
        carouselItem.classList.add('active');
      }

      const img = document.createElement('img');
      img.classList.add('d-block', 'w-100');
      img.src = `/${entry.path}/cover.jpg`;

      carouselItem.appendChild(img);
      carouselInner.appendChild(carouselItem);
    });
  });
