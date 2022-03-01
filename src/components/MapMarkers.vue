
<script>
// import Marker from './GoogleMapLoader'

export default {
  name: 'MapMarkers',
  // inject: ["google", "map"],
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },
  data(){
    // return { 
    //   marker: null
    // }
  },
  mounted(){
    console.log(this.marker);
    console.log(this.google);
    console.log(this.map);
    
    
  //  this.google.maps.Marker({
  //     position: this.marker.position,
  //     marker: this.marker,
  //     map: this.map,
  //     // icon: POINT_MARKER_ICON_CONFIG
  //   })
  }
}
</script>