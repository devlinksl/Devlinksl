/**
 * ============================================================================
 * THEME MANAGEMENT
 * Momoh Mustapha Sandi - Founder Portfolio
 * ============================================================================
 *
 * Handles system-based theme detection and manual theme switching
 * Supports: system (auto), light, dark
 */

;(() => {
  // Theme constants
  const THEME_KEY = "mms-theme-preference"
  const THEMES = {
    SYSTEM: "system",
    LIGHT: "light",
    DARK: "dark",
  }

  // Theme state
  let currentTheme = THEMES.SYSTEM

  /**
   * Get the saved theme preference from localStorage
   * @returns {string} The saved theme or 'system' as default
   */
  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || THEMES.SYSTEM
    } catch (e) {
      console.warn("localStorage not available:", e)
      return THEMES.SYSTEM
    }
  }

  /**
   * Save theme preference to localStorage
   * @param {string} theme - The theme to save
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch (e) {
      console.warn("Could not save theme preference:", e)
    }
  }

  /**
   * Get the system color scheme preference
   * @returns {string} 'dark' or 'light'
   */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return THEMES.DARK
    }
    return THEMES.LIGHT
  }

  /**
   * Apply theme to the document
   * @param {string} theme - The theme to apply (system, light, or dark)
   */
  function applyTheme(theme) {
    const root = document.documentElement

    if (theme === THEMES.SYSTEM) {
      // Remove data-theme to let CSS handle system preference
      root.removeAttribute("data-theme")
    } else {
      root.setAttribute("data-theme", theme)
    }

    // Update current theme state
    currentTheme = theme

    // Update theme toggle button icon
    updateThemeToggleIcon()

    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme } }))
  }

  /**
   * Update the theme toggle button icon based on current theme
   */
  function updateThemeToggleIcon() {
    const toggleButtons = document.querySelectorAll(".theme-toggle")

    toggleButtons.forEach((button) => {
      const sunIcon = button.querySelector(".theme-icon--sun")
      const moonIcon = button.querySelector(".theme-icon--moon")
      const systemIcon = button.querySelector(".theme-icon--system")

      if (!sunIcon || !moonIcon) return

      // Hide all icons first
      sunIcon.style.display = "none"
      moonIcon.style.display = "none"
      if (systemIcon) systemIcon.style.display = "none"

      // Show appropriate icon based on current theme
      if (currentTheme === THEMES.SYSTEM) {
        if (systemIcon) {
          systemIcon.style.display = "block"
        } else {
          // Fallback: show sun/moon based on system preference
          const systemPreference = getSystemTheme()
          if (systemPreference === THEMES.DARK) {
            moonIcon.style.display = "block"
          } else {
            sunIcon.style.display = "block"
          }
        }
      } else if (currentTheme === THEMES.DARK) {
        moonIcon.style.display = "block"
      } else {
        sunIcon.style.display = "block"
      }

      // Update aria-label
      const label =
        currentTheme === THEMES.SYSTEM
          ? "Using system theme, click to use light theme"
          : currentTheme === THEMES.LIGHT
            ? "Using light theme, click to use dark theme"
            : "Using dark theme, click to use system theme"
      button.setAttribute("aria-label", label)
    })
  }

  /**
   * Cycle through themes: system -> light -> dark -> system
   */
  function cycleTheme() {
    let nextTheme

    switch (currentTheme) {
      case THEMES.SYSTEM:
        nextTheme = THEMES.LIGHT
        break
      case THEMES.LIGHT:
        nextTheme = THEMES.DARK
        break
      case THEMES.DARK:
        nextTheme = THEMES.SYSTEM
        break
      default:
        nextTheme = THEMES.SYSTEM
    }

    saveTheme(nextTheme)
    applyTheme(nextTheme)
  }

  /**
   * Initialize theme management
   */
  function initTheme() {
    // Apply saved theme immediately
    const savedTheme = getSavedTheme()
    applyTheme(savedTheme)

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", () => {
          if (currentTheme === THEMES.SYSTEM) {
            // Re-apply to trigger any necessary updates
            applyTheme(THEMES.SYSTEM)
          }
        })
      }
    }

    // Set up theme toggle click handlers
    document.addEventListener("click", (e) => {
      const toggleButton = e.target.closest(".theme-toggle")
      if (toggleButton) {
        cycleTheme()
      }
    })
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme)
  } else {
    initTheme()
  }

  // Expose API globally
  window.ThemeManager = {
    getTheme: () => currentTheme,
    setTheme: (theme) => {
      if (Object.values(THEMES).includes(theme)) {
        saveTheme(theme)
        applyTheme(theme)
      }
    },
    cycleTheme,
    THEMES,
  }
})()
