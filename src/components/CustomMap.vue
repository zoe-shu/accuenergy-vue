
<template>
  <GoogleMapLoader
    :mapConfig="mapConfig"
    apiKey="AIzaSyCNs8wxk_VVEvoGcUFO3HZ8oVSU68PAKbA"
    :markers="markers"
  >
  </GoogleMapLoader>
</template>

<script>
import GoogleMapLoader from './GoogleMapLoader.vue'
// import MapMarkers from './MapMarkers.vue'

export default {
  // props: {
  //   markers: Array
  // },
  components: {
    GoogleMapLoader,
    // MapMarkers,
  },
  data () {
    return {
      searchInput: null,
      markers: [
        { id: 0, position: { lat: 43.775142, lng: -79.412954 } },
      ],
    }
  },

  computed: {
    mapConfig () {
      return {
        center: this.mapCenter,
        zoom: 14,
      }
    },

    mapCenter () {
      return this.markers[0].position
    }
  },
  mounted(){
    
    // console.log(this.markers);
     
  }
}
</script>