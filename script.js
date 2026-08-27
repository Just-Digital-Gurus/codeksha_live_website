document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }
  // Mobile Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (hamburgerBtn && navLinks) {
    const toggleMenu = () => {
      const isActive = navLinks.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active', isActive);
      const icon = hamburgerBtn.querySelector('i');
      if (icon) {
        icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    if (navOverlay) navOverlay.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) toggleMenu();
      });
    });
  }

  // Category Pill Buttons Toggle
  const pillBtns = document.querySelectorAll('.pill-btn');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Premium Section Accordion Toggle (Dynamic Height for Silky Smooth Animation)
  const accordionItems = document.querySelectorAll('.accordion-item');

  const updateAccordionHeights = () => {
    accordionItems.forEach(item => {
      const body = item.querySelector('.accordion-body');
      if (!body) return;
      if (item.classList.contains('active')) {
        body.style.maxHeight = body.scrollHeight + 30 + 'px';
      } else {
        body.style.maxHeight = '0px';
      }
    });
  };

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const icon = otherItem.querySelector('.icon');
        if (icon) icon.className = 'fa-solid fa-plus icon';
        const otherBody = otherItem.querySelector('.accordion-body');
        if (otherBody) otherBody.style.maxHeight = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        const icon = item.querySelector('.icon');
        if (icon) icon.className = 'fa-solid fa-minus icon';
        const body = item.querySelector('.accordion-body');
        if (body) body.style.maxHeight = body.scrollHeight + 30 + 'px';
      }
    });
  });

  // Initial set for active item
  updateAccordionHeights();

  // Ultra-Smooth Lerp Mouse Cursor Parallax for Floating Logos (WordPress, Shopify, Node.js)
  const premiumSection = document.getElementById('premiumSection');
  const floatingLogos = document.querySelectorAll('.floating-logo, .sparkle, .floating-shape');

  if (premiumSection && floatingLogos.length > 0) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const animateParallax = () => {
      // Lerp smooth spring easing
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      floatingLogos.forEach(logo => {
        const speed = parseFloat(logo.getAttribute('data-speed')) || 20;
        const x = (currentX * speed) / 450;
        const y = (currentY * speed) / 450;
        const rot = x * 0.06;
        logo.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      });

      requestAnimationFrame(animateParallax);
    };

    // Start continuous rAF animation loop
    animateParallax();

    premiumSection.addEventListener('mousemove', (e) => {
      const rect = premiumSection.getBoundingClientRect();
      targetX = e.clientX - rect.left - rect.width / 2;
      targetY = e.clientY - rect.top - rect.height / 2;
    });

    premiumSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });
  }

  // Courses Slider Engine
  const track = document.getElementById('coursesTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');

  if (!track) return;

  let originalCards = Array.from(track.children);
  const totalOriginals = originalCards.length;
  let currentIndex = totalOriginals; // Start in the middle set
  let isAnimating = false;

  // Clone items to form seamless left/right loops
  originalCards.forEach(card => {
    const cloneEnd = card.cloneNode(true);
    const cloneStart = card.cloneNode(true);
    track.appendChild(cloneEnd);
    track.insertBefore(cloneStart, track.firstChild);
  });

  const getVisibleCardsCount = () => {
    const width = window.innerWidth;
    if (width <= 600) return 1;
    if (width <= 900) return 2;
    if (width <= 1200) return 3;
    return 4;
  };

  const updateSlidePosition = (animated = true) => {
    const firstCard = track.querySelector('.course-card');
    if (!firstCard) return;

    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    const cardWidth = firstCard.getBoundingClientRect().width + gap;
    const offset = -(currentIndex * cardWidth);

    if (animated) {
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      track.style.transition = 'none';
    }

    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    updateProgress();
  };

  const updateProgress = () => {
    if (!progressFill) return;
    const normalizedIndex = (currentIndex % totalOriginals + totalOriginals) % totalOriginals;
    const maxIndex = Math.max(1, totalOriginals - 1);
    
    // Start at 20% (partially highlighted for slide 1)
    // Progressively grows to 100% on the final slide
    // Resets back to 20% when infinite loop restarts
    const minPercent = 20;
    const progressRatio = normalizedIndex / maxIndex;
    const percentage = minPercent + (progressRatio * (100 - minPercent));
    
    progressFill.style.width = `${Math.min(Math.max(percentage, minPercent), 100)}%`;
  };

  const handleNext = () => {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex++;
    updateSlidePosition(true);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex--;
    updateSlidePosition(true);
  };

  // Infinite loop boundary check
  track.addEventListener('transitionend', () => {
    isAnimating = false;

    if (currentIndex >= totalOriginals * 2) {
      currentIndex = totalOriginals;
      updateSlidePosition(false);
    } else if (currentIndex < totalOriginals) {
      currentIndex = totalOriginals * 2 - 1;
      updateSlidePosition(false);
    }
  });

  if (nextBtn) nextBtn.addEventListener('click', handleNext);
  if (prevBtn) prevBtn.addEventListener('click', handlePrev);

  // Touch Swipe Support for Mobile & Tablet
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 40;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlidePosition(false);
    }, 80);
  });

  // Initial layout setting
  updateSlidePosition(false);

  // Testimonials Slider Engine
  const testiTrack = document.getElementById('testimonialTrack');
  const testiPrevBtn = document.getElementById('testiPrevBtn');
  const testiNextBtn = document.getElementById('testiNextBtn');

  if (testiTrack) {
    let testiOriginalCards = Array.from(testiTrack.children);
    const testiTotalOriginals = testiOriginalCards.length;
    let testiIndex = testiTotalOriginals;
    let testiAnimating = false;

    testiOriginalCards.forEach(card => {
      const cloneEnd = card.cloneNode(true);
      const cloneStart = card.cloneNode(true);
      testiTrack.appendChild(cloneEnd);
      testiTrack.insertBefore(cloneStart, testiTrack.firstChild);
    });

    const updateTestiSlide = (animated = true) => {
      const firstCard = testiTrack.querySelector('.testimonial-card');
      if (!firstCard) return;

      const gap = parseFloat(window.getComputedStyle(testiTrack).gap) || 24;
      const cardWidth = firstCard.getBoundingClientRect().width + gap;
      const offset = -(testiIndex * cardWidth);

      if (animated) {
        testiTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      } else {
        testiTrack.style.transition = 'none';
      }

      testiTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const handleTestiNext = () => {
      if (testiAnimating) return;
      testiAnimating = true;
      testiIndex++;
      updateTestiSlide(true);
    };

    const handleTestiPrev = () => {
      if (testiAnimating) return;
      testiAnimating = true;
      testiIndex--;
      updateTestiSlide(true);
    };

    testiTrack.addEventListener('transitionend', () => {
      testiAnimating = false;
      if (testiIndex >= testiTotalOriginals * 2) {
        testiIndex = testiTotalOriginals;
        updateTestiSlide(false);
      } else if (testiIndex < testiTotalOriginals) {
        testiIndex = testiTotalOriginals * 2 - 1;
        updateTestiSlide(false);
      }
    });

    if (testiNextBtn) testiNextBtn.addEventListener('click', handleTestiNext);
    if (testiPrevBtn) testiPrevBtn.addEventListener('click', handleTestiPrev);

    let tTouchStartX = 0;
    let tTouchEndX = 0;

    testiTrack.addEventListener('touchstart', (e) => {
      tTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testiTrack.addEventListener('touchend', (e) => {
      tTouchEndX = e.changedTouches[0].screenX;
      const diff = tTouchStartX - tTouchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) handleTestiNext();
        else handleTestiPrev();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      updateTestiSlide(false);
    });

    updateTestiSlide(false);
  }

  // HERO FULL-CONTAINER INTERACTIVE SLIDER ENGINE (Big Student Image + Quote Card)
  const heroFullTrack = document.getElementById('heroFullTrack');
  const heroFullPrev = document.getElementById('heroFullPrev');
  const heroFullNext = document.getElementById('heroFullNext');
  const heroRightContainer = document.getElementById('heroRightContainer');

  if (heroFullTrack) {
    let fullSlides = Array.from(heroFullTrack.children);
    const totalFullSlides = fullSlides.length;

    // Clone slides for seamless infinite loop
    fullSlides.forEach(slide => {
      const cloneEnd = slide.cloneNode(true);
      const cloneStart = slide.cloneNode(true);
      heroFullTrack.appendChild(cloneEnd);
      heroFullTrack.insertBefore(cloneStart, heroFullTrack.firstChild);
    });

    let fullIndex = totalFullSlides;
    let fullAnimating = false;

    const updateFullPosition = (animated = true) => {
      const wrapper = heroFullTrack.parentElement;
      const slideWidth = wrapper ? wrapper.clientWidth : heroFullTrack.clientWidth;
      const offset = -(fullIndex * slideWidth);

      if (animated) {
        heroFullTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      } else {
        heroFullTrack.style.transition = 'none';
      }

      heroFullTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const handleFullNext = () => {
      if (fullAnimating) return;
      fullAnimating = true;
      fullIndex++;
      updateFullPosition(true);
      resetFullAutoPlay();
    };

    const handleFullPrev = () => {
      if (fullAnimating) return;
      fullAnimating = true;
      fullIndex--;
      updateFullPosition(true);
      resetFullAutoPlay();
    };

    heroFullTrack.addEventListener('transitionend', () => {
      fullAnimating = false;
      if (fullIndex >= totalFullSlides * 2) {
        fullIndex = totalFullSlides;
        updateFullPosition(false);
      } else if (fullIndex < totalFullSlides) {
        fullIndex = totalFullSlides * 2 - 1;
        updateFullPosition(false);
      }
    });

    if (heroFullNext) heroFullNext.addEventListener('click', handleFullNext);
    if (heroFullPrev) heroFullPrev.addEventListener('click', handleFullPrev);

    // Auto-play timer (every 4 seconds)
    let fullAutoPlayInterval = setInterval(handleFullNext, 4000);

    const resetFullAutoPlay = () => {
      clearInterval(fullAutoPlayInterval);
      fullAutoPlayInterval = setInterval(handleFullNext, 4000);
    };

    if (heroRightContainer) {
      heroRightContainer.addEventListener('mouseenter', () => clearInterval(fullAutoPlayInterval));
      heroRightContainer.addEventListener('mouseleave', () => resetFullAutoPlay());

      // Mouse Drag & Touch Swipe Gestures
      let isDragging = false;
      let startX = 0;
      let dragDiff = 0;

      heroRightContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        dragDiff = 0;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragDiff = e.pageX - startX;
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        if (dragDiff < -40) handleFullNext();
        else if (dragDiff > 40) handleFullPrev();
      });

      let touchStartX = 0;
      heroRightContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].pageX;
      }, { passive: true });

      heroRightContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].pageX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) handleFullNext();
          else handleFullPrev();
        }
      }, { passive: true });
    }

    window.addEventListener('resize', () => updateFullPosition(false));
    updateFullPosition(false);
  }
});
// FAQ Section Accordion (scoped separately from the Premium Learning accordion above)
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  const setFaqHeight = (item) => {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;
    answer.style.maxHeight = item.classList.contains('active') ? answer.scrollHeight + 30 + 'px' : '0px';
  };

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const icon = otherItem.querySelector('.icon');
        if (icon) icon.className = 'fa-solid fa-plus icon';
        setFaqHeight(otherItem);
      });

      if (!isActive) {
        item.classList.add('active');
        const icon = item.querySelector('.icon');
        if (icon) icon.className = 'fa-solid fa-minus icon';
        setFaqHeight(item);
      }
    });
  });

  setFaqHeight(document.querySelector('.faq-item.active') || faqItems[0]);
});
