import DefaultTheme from "vitepress/theme-without-fonts";
import CustomLayout from "./CustomLayout.vue";
// Import Tailwind entry for the theme. Replace or remove `custom.css` styles as you migrate.
import "./tailwind.css";

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
