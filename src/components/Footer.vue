<!-- components/Footer.vue -->
<template>
  <footer
    ref="footer"
    :style="footerStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    class="footer"
  >
    <p>
      Common Law copyright statement has been noted: ©Mineral Kingdom 2024. All
      Rights Reserved. Not For Hire
    </p>
    <nav>
      <a href="/privacy-policy">Privacy Policy</a> |
      <a href="/terms-and-conditions">Terms & Conditions</a> |
      <a href="/auction-rules">Auction Rules</a> |
      <a href="/buying-rules">Buying Rules</a>
    </nav>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      baseOpacity: 0.8,
      hoverOpacity: 1.0,
      isHovering: false,
    };
  },
  computed: {
    footerStyle() {
      return {
        "--opacity": this.isHovering ? this.hoverOpacity : this.baseOpacity,
        opacity: `var(--opacity)`,
      };
    },
  },
  methods: {
    handleScroll() {
      const scrollTotal =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const scrolledPercentage = scrollY / scrollTotal;

      // Adjust these values as needed
      const startChange = 0.8; // Start changing opacity at 80% scroll
      const endChange = 1; // End changing opacity at 100% scroll

      if (scrolledPercentage > startChange) {
        // Map the scroll percentage to the opacity range
        const opacityRange = 1 - 0.8; // 1.0 opacity to 0.8 opacity
        const scrollRange = endChange - startChange;
        const scrollFraction = (scrolledPercentage - startChange) / scrollRange;
        this.baseOpacity = 0.8 + scrollFraction * opacityRange;
      } else {
        this.baseOpacity = 0.8; // Default opacity
      }
    },
    handleMouseEnter() {
      this.isHovering = true;
    },
    handleMouseLeave() {
      this.isHovering = false;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 20px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0;
  transition: opacity 0.3s ease-in-out; /* Smooth transition for opacity */
}
.footer a {
  color: white;
  margin: 0 10px;
}

.footer:hover {
  opacity: var(--opacity);
}
.footer a:hover {
  text-decoration: underline;
}
</style>
