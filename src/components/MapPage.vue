<template>
  <!-- <SearchBox @get-current-location="getCurrentLocation" /> -->
  <MapContainer ref="mapContainer" />
  <!-- <CustomMap  /> -->
  <!-- <LocationList ref="locationList" :locationOptions="markers" /> -->
</template>

<script>
export default {
  name: 'MapPage',
  props:{
    // markers: Array,
  },
  data() {
    return {
      // markers: [],
      // markers: [],
    }
  },
  mounted() {
    // this.setMarker();
    // console.log(this.$refs.mapContainer)
  },
  methods: {

    // setMarker(){
    //   this.markers = [
    //     {lat: 43.775142, lng: -79.412954}
    //   ];
    // }
  }
}
</script>

<style scoped>

</style>