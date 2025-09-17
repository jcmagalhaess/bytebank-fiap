/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
      },
      colors: {
        // Brand Colors
          brandPrimary: "#00AAFF",
          brandPrimaryHover: "#0087CA",
          brandSecondary: "#0F2C59",
          brandSecondaryHover: "#709E32",
          brandTertiary: "transparent",
          brandTertiaryHover: "#B1C9E0",
        // UI Colors
          backgroundPrimary: "#FFFFFF",
          backgroundSecondary: "#DDEBF8",
          textPrimary: "#1F2C38",
          textSecondary: "#5A7184",
        // Feedback Colors
          feedbackSuccess: "#8CC63F",
          feedbackAction: "#E6007A",
          feedbackDanger: "#ef4444",
          feedbackInfo: "#3B82F6",
          feedbackWarning: "#F59E0B",
      },
      boxShadow: {
        sm: "0px 2px 4px rgba(15, 44, 89, 0.08)",
        md: "0px 4px 12px rgba(15, 44, 89, 0.10)",
        lg: "0px 8px 24px rgba(15, 44, 89, 0.12)",
        xl: "0px 16px 48px rgba(15, 44, 89, 0.20)",
      },
      fontSize: {
        h1: ["48px", { lineHeight: "56px", letterSpacing: "0.17px" }],
        h2: ["36px", { lineHeight: "44px", letterSpacing: "0.17px" }],
        h3: ["28px", { lineHeight: "36px", letterSpacing: "0.17px" }],
        h4: ["24px", { lineHeight: "32px", letterSpacing: "0.17px" }],
        h5: ["20px", { lineHeight: "28px", letterSpacing: "0.17px" }],
        h6: ["18px", { lineHeight: "26px", letterSpacing: "0.17px" }],
        p: ["16px", { lineHeight: "24px", letterSpacing: "0.17px" }],
        sm: ["14px", { lineHeight: "20px", letterSpacing: "0.17px" }],
        caption: ["12px", { lineHeight: "16px", letterSpacing: "0.17px" }],
      },
      fontWeight: {
        regular: "400",
        semibold: "600",
        bold: "700",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "48px",
        xxl: "64px",
      },
    },
  },
  plugins: [],
};
