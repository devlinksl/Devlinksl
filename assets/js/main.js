/**
 * ============================================================================
 * MAIN JAVASCRIPT
 * Momoh Mustapha Sandi - Founder Portfolio
 * ============================================================================
 *
 * Core functionality including:
 * - Mobile navigation
 * - Form handling
 * - General utilities
 */

;(() => {
  /**
   * Mobile Navigation Handler
   */
  const MobileNav = {
    toggle: null,
    nav: null,
    isOpen: false,

    init() {
      this.toggle = document.querySelector(".mobile-menu-toggle")
      this.nav = document.querySelector(".mobile-nav")

      if (!this.toggle || !this.nav) return

      this.toggle.addEventListener("click", () => this.toggleMenu())

      // Close menu when clicking on a link
      this.nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => this.closeMenu())
      })

      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.closeMenu()
        }
      })

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (this.isOpen && !this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
          this.closeMenu()
        }
      })
    },

    toggleMenu() {
      this.isOpen ? this.closeMenu() : this.openMenu()
    },

    openMenu() {
      this.isOpen = true
      this.nav.classList.add("mobile-nav--open")
      this.toggle.setAttribute("aria-expanded", "true")
      document.body.style.overflow = "hidden"
    },

    closeMenu() {
      this.isOpen = false
      this.nav.classList.remove("mobile-nav--open")
      this.toggle.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    },
  }

  /**
   * Contact Form Handler
   */
  const ContactForm = {
    form: null,

    init() {
      this.form = document.querySelector("#contact-form")
      if (!this.form) return

      this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    },

    handleSubmit(e) {
      e.preventDefault()

      const formData = new FormData(this.form)
      const data = Object.fromEntries(formData)

      // Validate form
      if (!this.validate(data)) return

      // Show loading state
      const submitBtn = this.form.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        this.showSuccess()
        this.form.reset()
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 1500)
    },

    validate(data) {
      let isValid = true

      // Clear previous errors
      this.form.querySelectorAll(".form-error").forEach((el) => el.remove())

      // Validate required fields
      if (!data.name || data.name.trim() === "") {
        this.showError("name", "Name is required")
        isValid = false
      }

      if (!data.email || !this.isValidEmail(data.email)) {
        this.showError("email", "Valid email is required")
        isValid = false
      }

      if (!data.message || data.message.trim() === "") {
        this.showError("message", "Message is required")
        isValid = false
      }

      return isValid
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },

    showError(fieldName, message) {
      const field = this.form.querySelector(`[name="${fieldName}"]`)
      if (!field) return

      const error = document.createElement("span")
      error.className = "form-error"
      error.textContent = message
      error.style.cssText = `
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-1);
        display: block;
      `

      field.parentNode.appendChild(error)
      field.setAttribute("aria-invalid", "true")
    },

    showSuccess() {
      // Create success message
      const success = document.createElement("div")
      success.className = "form-success"
      success.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Thank you for your message! I'll get back to you soon.</span>
      `
      success.style.cssText = `
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        background-color: var(--color-success);
        color: white;
        border-radius: var(--radius-lg);
        margin-top: var(--space-4);
      `

      this.form.appendChild(success)

      // Remove after 5 seconds
      setTimeout(() => {
        success.style.opacity = "0"
        success.style.transition = "opacity 0.3s ease"
        setTimeout(() => success.remove(), 300)
      }, 5000)
    },
  }

  /**
   * Header scroll effect
   */
  const HeaderScroll = {
    header: null,
    lastScrollY: 0,

    init() {
      this.header = document.querySelector(".header")
      if (!this.header) return

      window.addEventListener("scroll", () => this.onScroll(), { passive: true })
    },

    onScroll() {
      const currentScrollY = window.pageYOffset

      // Add shadow when scrolled
      if (currentScrollY > 10) {
        this.header.style.boxShadow = "var(--shadow-md)"
      } else {
        this.header.style.boxShadow = ""
      }

      this.lastScrollY = currentScrollY
    },
  }

  /**
   * Active navigation link highlighting
   */
  const ActiveNav = {
    init() {
      const currentPage = window.location.pathname.split("/").pop() || "index.html"

      document.querySelectorAll(".nav__link, .mobile-nav__link").forEach((link) => {
        const href = link.getAttribute("href")

        if (href === currentPage || (currentPage === "" && href === "index.html")) {
          link.classList.add("nav__link--active", "mobile-nav__link--active")
        }
      })
    },
  }

  /**
   * Skills section - interactive tags
   */
  const SkillsTags = {
    init() {
      const skillTags = document.querySelectorAll(".skill-tag")

      skillTags.forEach((tag) => {
        tag.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-2px)"
        })

        tag.addEventListener("mouseleave", function () {
          this.style.transform = ""
        })
      })
    },
  }

  /**
   * Lazy loading for images
   */
  const LazyLoad = {
    init() {
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute("data-src")
              }
              img.classList.add("loaded")
              observer.unobserve(img)
            }
          })
        })

        document.querySelectorAll("img[data-src]").forEach((img) => {
          imageObserver.observe(img)
        })
      }
    },
  }

  /**
   * Initialize all modules
   */
  function init() {
    MobileNav.init()
    ContactForm.init()
    HeaderScroll.init()
    ActiveNav.init()
    SkillsTags.init()
    LazyLoad.init()
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }

  // Expose modules globally for debugging
  window.App = {
    MobileNav,
    ContactForm,
    HeaderScroll,
  }
})()
