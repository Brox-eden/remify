  // FORCE SCROLL TO TOP ON LOAD
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    } else {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }
    // Clear the #hash from the URL so it doesn't jump
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    window.scrollTo(0, 0);
    }

    // -------------------------------------------------------------------
    // TYPING ANIMATION SCRIPT
    // -------------------------------------------------------------------
    const words = [
    "Workflow",
    "Scalability",
    "Scalable AI",
    "Systems"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100; // milliseconds per character
    const deletingSpeed = 60;
    const pauseTime = 1500; // Pause after full word is typed

    const textElement = document.getElementById('typewriter-text');
    let statsAnimated = false;

    function typeWriter() {
        if (!textElement) return; // Guard clause in case element isn't ready

    const currentWord = words[wordIndex];

    if (!isDeleting) {
        // Typing phase
        textElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
        // Word is fully typed, start pause, then delete
        isDeleting = true;
    setTimeout(typeWriter, pauseTime);
            } else {
        setTimeout(typeWriter, typingSpeed);
            }
        } else {
        // Deleting phase
        textElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
        // Word is fully deleted, move to the next word
        isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length; // Loop back to start if needed
    setTimeout(typeWriter, typingSpeed * 2); // Longer pause before typing next word
            } else {
        setTimeout(typeWriter, deletingSpeed);
            }
        }
    }

    // -------------------------------------------------------------------
    // STAT COUNTER FUNCTIONS (Your existing logic)
    // -------------------------------------------------------------------

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    const decimals = String(end).includes('.') ? String(end).split('.')[1].length : 0;
    let currentValue = start + progress * (end - start);

    if (obj.dataset.unit === 'time') {
        obj.textContent = Math.floor(currentValue) + '+';
        } else if (obj.dataset.unit === 'currency') {
        let formattedValue;

          // NEW LOGIC: If the TARGET (end) is huge, format as Millions from the start
          if (end >= 1000000) {
        // Always show as 0.0M, 0.5M, 2.1M etc.
        formattedValue = '$' + (currentValue / 1000000).toFixed(1) + 'M+';
          } else {
        formattedValue = '$' + Math.floor(currentValue) + '+';
          }
    obj.textContent = formattedValue;
        } else if (obj.dataset.unit === 'percentage') {
        obj.textContent = currentValue.toFixed(decimals) + '%';
        }

    if (progress < 1) {
        window.requestAnimationFrame(step);
        }
      };
    window.requestAnimationFrame(step);
    }
    function animateStats() {
        const statElements = document.querySelectorAll('.proof-stat-value');
        statElements.forEach(el => {
        let endValueString = el.textContent.replace(/[^\d\.]/g, '');

    if (el.textContent.includes('M')) {
        endValueString = parseFloat(endValueString) * 1000000;
          }

    const endValue = parseFloat(endValueString);

    animateValue(el, 0, endValue, 2000);
        });
    }

    // -------------------------------------------------------------------
    // INTERSECTION OBSERVER SETUP (NEW LOGIC)
    // -------------------------------------------------------------------

    function setupIntersectionObserver() {
        const targetSection = document.querySelector('.social-proof');

    if (!targetSection || statsAnimated) return;

    // Options: Trigger when 10% of the element is visible
    const options = {
        root: null, // viewport is the root
    rootMargin: '0px',
    threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                // Start the animation and prevent running again
                animateStats();
                statsAnimated = true;
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
        }, options);

    observer.observe(targetSection);
    }

    // -------------------------------------------------------------------
    // PROCESS SCROLL HIGHLIGHTER
    // -------------------------------------------------------------------
    function setupProcessObserver() {
        const steps = document.querySelectorAll('.process-step');

    const options = {
        root: null,
    rootMargin: '-40% 0px -40% 0px', // Triggers only when element is in the MIDDLE 20% of screen
    threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'active' class when in the middle
                entry.target.classList.add('active');
            } else {
                // Remove 'active' class when leaving the middle
                entry.target.classList.remove('active');
            }
        });
        }, options);

        steps.forEach(step => observer.observe(step));
    }

    // -------------------------------------------------------------------
    // PARTNER LOGO REVEAL
    // -------------------------------------------------------------------
    function setupPartnerObserver() {
        // Updated to target the new class .partner-card
        const partner = document.querySelector('.partner-card');
    if (!partner) return;

        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
        }, {threshold: 0.5 }); // Trigger when 50% visible

    observer.observe(partner);
    }

    // Start all animations and observers
    window.onload = function() {
        typeWriter();
    setupIntersectionObserver(); // For stats
    setupProcessObserver();      // For process steps
    setupPartnerObserver();
    };
