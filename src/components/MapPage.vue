<template>
  <!-- <SearchBox @get-current-location="getCurrentLocation" /> -->
  <MapContainer ref="mapContainer" />
  <LocationList ref="locationList" />
</template>

<script>
export default {
  name: 'MapPage',
  mounted() {
    console.log(this.$refs.mapContainer)
  },
  methods: {
   
      
  }
}
</script>

<style scoped>
</style>