<template>
  <a-row>
    <a-col>
      <a-button type="primary" @click="$emit('getCurrentLocation')">
        <font-awesome-icon :icon="['fa', 'location-crosshairs']" />
      </a-button>
    </a-col>
    <a-col :span="20">
      <a-input-search
        placeholder="Enter Location"
        enter-button="Search"
        size="large"
        @search="onSearch"
      />
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'SearchBox',
  methods: {
    onSearch(value) {
      console.log(value);
    },
  },
};
</script>

<style scoped>
</style>