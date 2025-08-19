import { fetchPlaceholders } from '../../scripts/placeholders.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.hero-carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.hero-carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.hero-carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

function restartSlideAnimations(slide) {
  // Add is-visible class to trigger animations (from SVG style)
  slide.classList.add('is-visible');

  // Remove and re-add animation classes to restart animations
  const animatedElements = slide.querySelectorAll('.hero-carousel-slide-left, .animated-curve, .hero-carousel-slide-content, .hero-cta, .hero-cta-arrow');
  animatedElements.forEach((element) => {
    element.style.animation = 'none';
    // Trigger reflow
    element.offsetHeight; // eslint-disable-line no-unused-expressions
    element.style.animation = null;
  });
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.hero-carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.hero-carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });

  // Restart animations for the active slide
  restartSlideAnimations(activeSlide);
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.hero-carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveSlide(entry.target);
        // Trigger animations when slide comes into view
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.5 });

  block.querySelectorAll('.hero-carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `hero-carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('hero-carousel-slide');

  // Create left panel (animated curve area)
  const leftPanel = document.createElement('div');
  leftPanel.classList.add('hero-carousel-slide-left');

  // Create curve container
  const curveContainer = document.createElement('div');
  curveContainer.classList.add('curve-container');

  const animatedCurve = document.createElement('div');
  animatedCurve.classList.add('animated-curve');
  curveContainer.appendChild(animatedCurve);
  leftPanel.appendChild(curveContainer);

  // Create right panel (content area)
  const rightPanel = document.createElement('div');
  rightPanel.classList.add('hero-carousel-slide-right');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('hero-carousel-slide-content');

  // Process row content
  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    if (colIdx === 0) {
      // First column is background image (optional)
      const picture = column.querySelector('picture');
      if (picture) {
        leftPanel.style.backgroundImage = `url(${picture.querySelector('img').src})`;
        leftPanel.style.backgroundSize = 'cover';
        leftPanel.style.backgroundPosition = 'center';
      }
    } else {
      // Other columns go to content area
      contentDiv.appendChild(column);
    }
  });

  // Create CTA if link exists
  const links = contentDiv.querySelectorAll('a');
  if (links.length > 0) {
    const ctaContainer = document.createElement('div');
    ctaContainer.classList.add('hero-cta');

    links.forEach((link) => {
      const ctaButton = document.createElement('button');
      ctaButton.classList.add('hero-cta-button');
      ctaButton.textContent = link.textContent || 'Learn more';
      ctaButton.onclick = () => window.open(link.href, '_blank');

      const ctaArrow = document.createElement('div');
      ctaArrow.classList.add('hero-cta-arrow');
      ctaArrow.onclick = () => window.open(link.href, '_blank');

      ctaContainer.appendChild(ctaButton);
      ctaContainer.appendChild(ctaArrow);

      // Remove original link
      link.remove();
    });

    contentDiv.appendChild(ctaContainer);
  }

  rightPanel.appendChild(contentDiv);
  slide.appendChild(leftPanel);
  slide.appendChild(rightPanel);

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

// Auto-play functionality
function setupAutoPlay(block, interval = 5000) {
  let autoPlayTimer;
  const slides = block.querySelectorAll('.hero-carousel-slide');

  if (slides.length < 2) return; // No autoplay for single slide

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      const currentSlide = parseInt(block.dataset.activeSlide || '0', 10);
      showSlide(block, currentSlide + 1);
    }, interval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Start autoplay
  startAutoPlay();

  // Pause on hover
  block.addEventListener('mouseenter', stopAutoPlay);
  block.addEventListener('mouseleave', startAutoPlay);

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `hero-carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Hero Carousel');

  const container = document.createElement('div');
  container.classList.add('hero-carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('hero-carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Hero Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('hero-carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('hero-carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('hero-carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
    setupAutoPlay(block);
  }

  // Initialize first slide
  block.dataset.activeSlide = '0';
  const firstSlide = block.querySelector('.hero-carousel-slide');
  if (firstSlide) {
    firstSlide.classList.add('is-visible');
  }
}
