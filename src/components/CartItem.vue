<template>
  <div class="cart-item-card">
    <h3>{{ item.name }}</h3>
    <!-- Image gallery -->
    <div
      class="image-gallery"
      @mouseover="showControls = true"
      @mouseleave="showControls = false"
    >
      <button
        v-if="showControls"
        class="gallery-control prev"
        @click="prevImage"
      >
        &lt;
      </button>
      <img :src="activeImage" alt="Item Image" class="gallery-image" />
      <button
        v-if="showControls"
        class="gallery-control next"
        @click="nextImage"
      >
        &gt;
      </button>
    </div>
    <!-- Thumbnails -->
    <div class="thumbnails">
      <img
        v-for="(url, index) in allImages"
        :key="index"
        :src="url"
        :alt="`Thumbnail ${index + 1}`"
        class="thumbnail-image"
        :class="{ active: activeImageIndex === index }"
        @click="setActiveImage(index)"
      />
    </div>
    <!-- Video player (if applicable) -->
    <video v-if="mineralData" controls class="item-video">
      <source :src="mineralData.videoURL" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <p>${{ item.price }}</p>
    <div class="button-container">
      <button @click="removeFromCart(item.id)" class="button remove-from-cart">
        Remove from Cart
      </button>
    </div>
  </div>
</template>

<script>
import MineralService from "../services/MineralService";
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      activeImageIndex: 0,
      showControls: false,
      mineralData: null,
    };
  },
  computed: {
    allImages() {
      if (this.mineralData) {
        return [
          this.mineralData.imageURL,
          ...this.mineralData.imageURLs,
        ].filter(Boolean);
      }
      return [];
    },
    activeImage() {
      console.log(this.allImages);
      return this.allImages[this.activeImageIndex];
    },
  },
  methods: {
    async loadMineralDetails() {
      const mineralData = await MineralService.getMineral(this.item.id);
      // Assuming fetchMineral returns the mineral data
      this.mineralData = mineralData;
      console.log(mineralData);
    },
    prevImage() {
      if (this.activeImageIndex > 0) {
        this.activeImageIndex--;
      } else {
        this.activeImageIndex = this.allImages.length - 1;
      }
    },
    nextImage() {
      if (this.activeImageIndex < this.allImages.length - 1) {
        this.activeImageIndex++;
      } else {
        this.activeImageIndex = 0;
      }
    },
    formattedPrice() {
      // Check if price is a number and return formatted price
      return !isNaN(parseFloat(this.item.price))
        ? `$${this.item.price.toFixed(2)}`
        : "Price not available";
    },
    removeFromCart(itemId) {
      // Emit an event to the parent component
      console.log("Emitting remove-item event with itemId:", itemId);
      this.$emit('remove-item', itemId);
    },
  },
  mounted() {
    this.loadMineralDetails();
    console.log(
      "Item price:",
      this.item.price,
      "Type:",
      typeof this.item.price
    );
  },
  watch: {
    "item.mineralId": function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadMineralDetails();
      }
    },
  },
};
</script>

<style scoped>
.cart-item-card {
  border: 1px solid #ccc;
  padding: 1em;
  border-radius: 10px;
  overflow: hidden;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.item-image {
  width: 100%;
  object-fit: cover;
  border-bottom: 1px solid #ccc;
  border-radius: 8px;
}

.item-video {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.button {
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  color: white;
  border: none;
  background-color: black;
}

.image-gallery {
  display: flex;
  position: relative;
  overflow-x: auto;
}

.gallery-image {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.gallery-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  /* Additional styling for size, padding, etc. */
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.thumbnail-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail-image.active,
.thumbnail-image:hover {
  opacity: 1;
}

.item-video {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
