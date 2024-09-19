jQuery(document).ready(function($) {
    const slidesContainer = $('.slides'); // The container that holds all the slides
    const slideItems = $('.tstmnl-nav-slider-item');
    const prevArrow = $('.arrow.prev');
    const nextArrow = $('.arrow.next');
    const mainContent = $('.foty-content'); 
    const mainImage = $('.foty-right img'); 
    
    let index = 0;
   const containerWidth = slidesContainer.width();  // Total width of the container
   const totalGaps = 0; // There are two gaps (between three slides)
   const slideWidth = (containerWidth - totalGaps) / 3; // Calculate slide width accounting for the gaps

    const totalSlides = slideItems.length;
    let isDragging = false;
    let startX, currentX;

    // Clone the first and last slides to create the infinite loop effect
    const firstSlidesClone = slideItems.slice(0, 3).clone();
    const lastSlidesClone = slideItems.slice(-3).clone();

    // Append clones to the start and end of the slides container
    slidesContainer.append(firstSlidesClone).prepend(lastSlidesClone);

    // Adjust the starting position to show the original first slide
    slidesContainer.css('transform', `translateX(${-3 * slideWidth}px)`);

    // Function to update the main section based on the selected slide
    function updateMainSection($slide) {
        const data = {
            ratingSrc: $slide.find('.rating-main .foty-stars img').attr('src'),
            logoSrc: $slide.find('.rating-main .foty-data img').attr('src'),
            name: $slide.find('.tstmnl-nav-slider-text h5').text(),
            title: $slide.find('.tstmnl-nav-slider-text p').first().text(),
            content: $slide.find('.content').text() || 'Default content here',
            imageSrc: $slide.find('.tstmnl-nav-slider-img img').attr('src')
        };
        mainContent.find('.foty-stars img').attr('src', data.ratingSrc);
        mainContent.find('.foty-data img').attr('src', data.logoSrc);
        mainContent.find('.foty-des h6').html(`${data.name} - <span>${data.title}</span>`);
        mainContent.find('.foty-des p').text(data.content);
        mainImage.attr('src', data.imageSrc);
    }

    // Function to activate a slide and update the main section
    function activateSlide(newIndex) {
        index = newIndex;
        const realIndex = index % totalSlides; // Get the actual index for the real slides
        updateMainSection(slideItems.eq(realIndex));
        animateSlides();
    }

    // Function to animate the slides moving left or right
    function animateSlides() {
        const offset = -(index + 3) * slideWidth; // Account for the cloned slides
        slidesContainer.css('transition', 'transform 0.5s ease-in-out');
        slidesContainer.css('transform', `translateX(${offset}px)`);

        // Handle the infinite loop by resetting the position when reaching a clone
        slidesContainer.on('transitionend', function() {
            if (index >= totalSlides) {
                index = 0;
                slidesContainer.css('transition', 'none');
                slidesContainer.css('transform', `translateX(${-3 * slideWidth}px)`);
            } else if (index < 0) {
                index = totalSlides - 1;
                slidesContainer.css('transition', 'none');
                slidesContainer.css('transform', `translateX(${-totalSlides * slideWidth}px)`);
            }
        });
    }

    // Function to handle click on slides, including clones
    function handleSlideClick($slide) {
        const clickedIndex = $slide.index() - 3; // Adjust for the cloned slides
        index = clickedIndex;
        activateSlide(index);
    }

    // Event listener for the original slide items
    slideItems.click(function() {
        handleSlideClick($(this));
    });

    // Event listener for the cloned slide items
    slidesContainer.find('.tstmnl-nav-slider-item').click(function() {
        handleSlideClick($(this));
    });

    // Event listener for the previous arrow
    prevArrow.click(function() {
        index = (index > 0) ? index - 1 : -1;
        activateSlide(index);
    });

    // Event listener for the next arrow
    nextArrow.click(function() {
        index = (index < totalSlides - 1) ? index + 1 : totalSlides;
        activateSlide(index);
    });

    // Common function to handle both touch and mouse movements
    function handleSwipe(startX, currentX) {
        if (startX - currentX > 30) { // Swipe left
            index = (index < totalSlides - 1) ? index + 1 : totalSlides;
            activateSlide(index);
        } else if (startX - currentX < -30) { // Swipe right
            index = (index > 0) ? index - 1 : -1;
            activateSlide(index);
        }
    }

    // Add touch swipe functionality for the main content section
    mainContent.on('touchstart mousedown', function(e) {
        isDragging = true;
        startX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
    });

    mainContent.on('touchmove mousemove', function(e) {
        if (!isDragging) return;
        currentX = e.type === 'touchmove' ? e.originalEvent.touches[0].clientX : e.clientX;
    });

    mainContent.on('touchend mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        handleSwipe(startX, currentX);
    });

    // Add touch and mouse swipe functionality for the slider
    slidesContainer.on('touchstart mousedown', function(e) {
        isDragging = true;
        startX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
    });

    slidesContainer.on('touchmove mousemove', function(e) {
        if (!isDragging) return;
        currentX = e.type === 'touchmove' ? e.originalEvent.touches[0].clientX : e.clientX;
    });

    slidesContainer.on('touchend mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        handleSwipe(startX, currentX);
    });

    // Activate the first slide on load
    activateSlide(0);
});
