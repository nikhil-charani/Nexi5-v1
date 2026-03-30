/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
  			headings: ['Poppins', 'sans-serif']
  		},
  		colors: {
  			primary: {
  				DEFAULT: "#0f4184",
  				dark: "#0b3166",
  			},
  			secondary: "#0b3166",
  			accent: "#1e5ab8",
  			background: "#F8FAFC",
  			foreground: "#0F172A",
  			card: "#FFFFFF",
  			border: "#E2E8F0",
  			textPrimary: "#0F172A",
  			textSecondary: "#64748B",
  		},
  		borderRadius: {
  			xl: '12px',
  			lg: '8px',
  			md: '6px',
  			sm: '4px'
  		},
  		boxShadow: {
  			'nexi5': '0px 10px 30px rgba(0,0,0,0.08)'
  		},
  		keyframes: {
  			scroll: {
  				'0%': { transform: 'translateX(0)' },
  				'100%': { transform: 'translateX(-50%)' }
  			}
  		},
  		animation: {
  			scroll: 'scroll 25s linear infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
