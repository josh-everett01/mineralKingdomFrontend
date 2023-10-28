<template>
  <div>
    <h2>All Auctions</h2>
    <ul>
      <li v-for="auction in auctions" :key="auction.id">
        {{ auction.title }}, {{ auction.description }},
        {{ auction.startingPrice }}, {{ auction.startTime }},
        {{ auction.endTime }}, {{ auction.mineralName }},
        {{ auction.auctionStatusName }}, {{ auction.bidCount }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      auctions: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('https://localhost:7240/api/Auction');
      this.auctions = response.data;
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  },
};
</script>
