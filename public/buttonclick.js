document.addEventListener('DOMContentLoaded', function() {
    const slides1 = document.querySelectorAll('.slide1');
    const slides2 = document.querySelectorAll('.slide2');
    const buttonSlider = document.querySelector('.button-slider');
    
    // Function to show the slides based on category
    function showSlides(category) {
      if (category === 'slide1') {
        slides1.forEach((slide, index) => {
          if (index < 5) {
            slide.style.display = 'block';
          } else {
            slide.style.display = 'none';
          }
        });
        slides2.forEach(slide => slide.style.display = 'none');
      } else if (category === 'slide2') {
        slides2.forEach((slide, index) => {
          if (index < 5) {
            slide.style.display = 'block';
          } else {
            slide.style.display = 'none';
          }
        });
        slides1.forEach(slide => slide.style.display = 'none');
      }
    }
  
    // Initially show 5 slides from slide1
    showSlides('slide1');
    
    // Handle click on button-slider to toggle active class
    buttonSlider.addEventListener('click', function(event) {
      const clickedSlide = event.target.closest('.slides');
      
      // Only proceed if an image is clicked
      if (clickedSlide && clickedSlide.dataset.category) {
        // Remove the active class from all slides
        const allSlides = document.querySelectorAll('.slide');
        allSlides.forEach(slide => slide.classList.remove('active'));
  
        // Add active class to clicked slide
        clickedSlide.classList.add('active');
        
        // Show corresponding slides based on clicked category
        const category = clickedSlide.dataset.category;
        showSlides(category);
      }
    });
  });