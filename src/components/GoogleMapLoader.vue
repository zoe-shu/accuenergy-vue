<template>

  <div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
      <SearchBox :map="map" :google="google" >
      </SearchBox>
    </template>
    


    <div class="google-map" ref="googleMap"></div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';
// import Config from './config.json'

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
    markers: Array,
  },

  data() {
    return {
      google: null,
      map: null,

      isLoadingCurrent: false,
      isLoadingSearch: false,
    }
  },

  async mounted() {
    const googleMapApi = await new Loader({
      apiKey: this.apiKey, 
      libraries: ["places"],
    })
    // This returns a promise, but not a 'google' object
    this.google = await googleMapApi.load();
    // Set the google object from the correct location
    // this.google = window.google;

    // const options = {
    //     fields: ["formatted_address", "geometry", "name"],
    //     strictBounds: false,
    //     types: ["establishment"],
    //   };
    // const autocomplete = new this.google.maps.places.Autocomplete((this.$refs.gmapAutocomplete), options);
    // autocomplete.addListener("place_changed", () => {
    //   console.log('place changed');
    //   const place = autocomplete.getPlace();
    //   console.log(place);
    // })
    this.initMap()
    this.initInput()
    this.addMarker()
  },

  methods: {
    initMap() {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig)
      // new this.google.maps.Marker({
      //   position: { lat: 43.775142, lng: -79.412954 },
      //   map: this.map,
      //   title: "Hello World!",
      // });
    },
    initInput(){
      // const gmapAutocomplete = this.$refs.gmapAutocomplete
      // this.searchInput = new this.google.maps.places.Autocomplete(gmapAutocomplete);
      // this.searchInput.addListener("place_changed", () => {
      //   const place = this.searchInput.getPlace();
      //   console.log(place);
      // })
        const options = {
          fields: ["formatted_address", "geometry", "name"],
          strictBounds: false,
          types: ["establishment"],
        };
      const autocomplete = new this.google.maps.places.Autocomplete((this.$refs.gmapAutocomplete), options);
      console.log(autocomplete);
      autocomplete.addListener("place_changed", () => {
        console.log('place changed');
        const place = autocomplete.getPlace();
        console.log(place);
      })
    },
    addMarker(){
      this.markers.forEach(marker =>{
        new this.google.maps.Marker({
          position: marker.position,
          map: this.map,
          title: '',
        });
      })
    },
    getCurrentLocation() {
      this.isLoadingCurrent = true;
    },
    searchLocation(){

    },
    onChangeSearch(e){
      console.log(e);
      // console.log(this.searchInput);
      // this.searchInput.getPlaces();
    }
  }
}
</script>

<style scoped>
.google-map{
  width:100%;
  height:300px;
}

</style>