/**
 * ============================================================================
 * ANIMATIONS
 * Momoh Mustapha Sandi - Founder Portfolio
 * ============================================================================
 *
 * Scroll-based reveal animations and micro-interactions
 * Uses Intersection Observer for performance
 */

;(() => {
  /**
   * Initialize scroll-based reveal animations
   * Elements with class 'reveal' will animate when they enter the viewport
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal")

    if (!revealElements.length) return

    // Check for Intersection Observer support
    if (!("IntersectionObserver" in window)) {
      // Fallback: show all elements immediately
      revealElements.forEach((el) => el.classList.add("revealed"))
      return
    }

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
          // Stop observing once revealed
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    revealElements.forEach((el) => observer.observe(el))
  }

  /**
   * Initialize button micro-interactions
   * Adds tactile feedback on button press
   */
  function initButtonInteractions() {
    const buttons = document.querySelectorAll(".btn")

    buttons.forEach((button) => {
      // Add pressed state
      button.addEventListener("mousedown", () => {
        button.style.transform = "scale(0.98)"
      })

      button.addEventListener("mouseup", () => {
        button.style.transform = ""
      })

      button.addEventListener("mouseleave", () => {
        button.style.transform = ""
      })

      // Add ripple effect
      button.addEventListener("click", function (e) {
        createRipple(e, this)
      })
    })
  }

  /**
   * Create ripple effect on element
   * @param {Event} event - The click event
   * @param {HTMLElement} element - The element to add ripple to
   */
  function createRipple(event, element) {
    // Skip if element already has a ripple
    const existingRipple = element.querySelector(".ripple")
    if (existingRipple) {
      existingRipple.remove()
    }

    // Create ripple element
    const ripple = document.createElement("span")
    ripple.classList.add("ripple")

    // Calculate ripple size and position
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    // Apply styles
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `

    // Ensure element has relative positioning
    const computedPosition = getComputedStyle(element).position
    if (computedPosition === "static") {
      element.style.position = "relative"
    }
    element.style.overflow = "hidden"

    element.appendChild(ripple)

    // Remove ripple after animation
    ripple.addEventListener("animationend", () => {
      ripple.remove()
    })
  }

  /**
   * Add ripple animation keyframes to document
   */
  function addRippleStyles() {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Initialize card hover effects
   */
  function initCardEffects() {
    const cards = document.querySelectorAll(".card, .project-card")

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease"
      })
    })
  }

  /**
   * Initialize smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href")

        // Skip if it's just "#"
        if (targetId === "#") return

        const target = document.querySelector(targetId)

        if (target) {
          e.preventDefault()

          const headerHeight = document.querySelector(".header")?.offsetHeight || 0
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  }

  /**
   * Initialize parallax effect for hero section
   */
  function initParallax() {
    const hero = document.querySelector(".hero")
    if (!hero) return

    let ticking = false

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset
          const heroHeight = hero.offsetHeight

          // Only apply parallax when hero is visible
          if (scrolled < heroHeight) {
            const parallaxSpeed = 0.3
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`
          }

          ticking = false
        })

        ticking = true
      }
    })
  }

  /**
   * Initialize stagger animation for grid items
   */
  function initStaggerAnimation() {
    const grids = document.querySelectorAll(".grid")

    grids.forEach((grid) => {
      const items = grid.querySelectorAll(".card, .project-card, .article-card")

      items.forEach((item, index) => {
        item.style.animationDelay = `${index * 100}ms`
      })
    })
  }

  /**
   * Initialize all animations
   */
  function initAnimations() {
    addRippleStyles()
    initScrollReveal()
    initButtonInteractions()
    initCardEffects()
    initSmoothScroll()
    initStaggerAnimation()

    // Optional: enable parallax on larger screens
    if (window.innerWidth >= 768) {
      initParallax()
    }
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimations)
  } else {
    initAnimations()
  }

  // Expose for external use
  window.Animations = {
    initScrollReveal,
    createRipple,
  }
})()
