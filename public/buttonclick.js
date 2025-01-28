document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slides");
  const toolbarPhotos = document.querySelectorAll(".slide");
  const carouselInner = document.querySelector(".carousel-slider"); // Assuming only one carousel inner element

  // Click event listeners for each slide
  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      const category = slide.getAttribute("data-category");

      // Determine which slides to show based on category
      if (category === "slide1") {
        toolbarPhotos.forEach((photo, index) => {
          if (index < 5) {
            photo.style.display = "block";
          } else {
            photo.style.display = "none";
          }
        });
      } else if (category === "slide2") {
        toolbarPhotos.forEach((photo, index) => {
          if (index >= 5) {
            photo.style.display = "block";
          } else {
            photo.style.display = "none";
          }
        });
      }

      // Add 'active' class to the relevant photos
      toolbarPhotos.forEach((photo) => {
        photo.classList.remove("active");
      });

      if (category === "slide1") {
        toolbarPhotos.forEach((photo, index) => {
          if (index < 5) {
            photo.classList.add("active");
          }
        });
      } else if (category === "slide2") {
        toolbarPhotos.forEach((photo, index) => {
          if (index >= 5) {
            photo.classList.add("active");
          }
        });
      }

      // Reset carousel position to the starting point
      carouselInner.style.transform = `translate(128.6px)`;
      carouselInner.style.transition = 'transform 0.3s'; // Apply smooth transition

      // Add active class to highlight the current slide
      slides.forEach((s) => s.classList.remove("active"));
      slide.classList.add("active");
    });
  });

  // Initialize by showing the first category (optional)
  slides[0].click();
});
