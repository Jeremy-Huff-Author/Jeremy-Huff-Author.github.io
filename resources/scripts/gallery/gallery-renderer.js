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

      const captionDiv = document.createElement('div');
      captionDiv.classList.add('carousel-caption', 'd-none', 'd-md-block');

      const nameElement = document.createElement('h5');
      nameElement.textContent = entry.name;

      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = entry.description;

      captionDiv.appendChild(nameElement);
      captionDiv.appendChild(descriptionElement);
            carouselItem.appendChild(img);
            carouselItem.appendChild(captionDiv);
            carouselInner.appendChild(carouselItem);
          });
  });
