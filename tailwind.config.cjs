module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#e6f0f5",
          100: "#c7dbe3",
          200: "#9dbecb",
          300: "#6f9db1",
          400: "#477d96",
          500: "#2c5f79",
          600: "#1c4b61",
          700: "#123a4d",
          800: "#0a2f3e",
          900: "#00293c"
        },
        ember: {
          500: "#8c1b1b",
          600: "#731515",
          700: "#5b1111"
        }
      },
      boxShadow: {
        glow: "0 18px 50px rgba(0, 41, 60, 0.12)"
      }
    }
  },
  plugins: []
};
