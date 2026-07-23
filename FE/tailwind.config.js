/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OhStem Kinetic Design System Standards
        "primary": "#006c49",
        "secondary": "#0051d5",
        "primary-container": "#10b981",
        "secondary-container": "#346cef",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-primary-container": "#00422b",
        "on-secondary-container": "#fefcff",

        // Admin Specific Overrides (to preserve original look)
        "admin-primary": "#004ac6",
        "admin-secondary": "#006c49",
        "admin-primary-container": "#2563eb",
        "admin-secondary-container": "#6cf8bb",
        "admin-on-secondary-container": "#00714d",

        // Surface System
        "surface": "#f8f9ff",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "on-surface": "#0b1c30",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-gray": "#F5F5F5",
        "surface-variant": "#d3e4fe",
        "on-surface-variant": "#3f4943",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        
        // Containers
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",

        // Outline
        "outline": "#6f7a72",
        "outline-variant": "#bec9c0",
        "surface-tint": "#006c49",

        // Status & Accents
        "sky-blue": "#0799D4",
        "error-red": "#FE4641",
        "warning-amber": "#FFA305",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Tertiary
        "tertiary": "#772f2c",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#954642",
        "on-tertiary-container": "#ffccc8",

        // Fixed Colors
        "primary-fixed": "#9df4c8",
        "primary-fixed-dim": "#81d8ad",
        "on-primary-fixed": "#002113",
        "on-primary-fixed-variant": "#005236",
        "secondary-fixed": "#dbe1ff",
        "secondary-fixed-dim": "#b4c5ff",
        "on-secondary-fixed": "#00174b",
        "on-secondary-fixed-variant": "#003ea7",
        "tertiary-fixed": "#ffdad7",
        "tertiary-fixed-dim": "#ffb3ae",
        "on-tertiary-fixed": "#3e0406",
        "on-tertiary-fixed-variant": "#78302d"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "xl-large": "1.5rem", // corresponding to 24px in design document
        "full": "9999px"
      },
      spacing: {
        "base": "4px",
        "xs": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "40px",
        "xl": "64px",
        "gutter": "24px",
        "container-max": "1280px",
        
        // Admin spacing
        "stack_gap": "16px",
        "container_padding": "24px",
        "inline_gap": "12px",
        "sidebar_width": "260px",
        "grid_gutter": "20px"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "500" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],

        // Admin dashboard specific typography sizes
        "admin-display": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "admin-title-lg": ["18px", { "lineHeight": "24px", "fontWeight": "600" }],
        "admin-title-md": ["16px", { "lineHeight": "24px", "fontWeight": "500" }],
        "admin-headline-lg": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "admin-headline-md": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "admin-body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "admin-body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "admin-label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "admin-label-sm": ["11px", { "lineHeight": "16px", "fontWeight": "500" }]
      }
    },
  },
  plugins: [],
}
