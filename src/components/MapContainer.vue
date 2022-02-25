<template>
    <a-row>
      <a-col>
        <a-button type="primary" @click="getCurrentLocation()">
          <font-awesome-icon :icon="['fa', 'location-crosshairs']" />
        </a-button>
      </a-col>
      <a-col :span="20">
        <GMapAutocomplete
          style="width:100%"
          placeholder="Enter Location"
          @place_changed="setPlace"
        >
        </GMapAutocomplete>
      </a-col>
      <a-col>
        <a-button type="primary" @click="searchLocation()">
          <font-awesome-icon :icon="['fa', 'magnifying-glass']" />
        </a-button>
      </a-col>
    </a-row>

     <GMapMap
      :center="center"
      :zoom="14"
      class="g-map"
    >
    <GMapCluster>
      <GMapMarker 
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="openInfoWindow(m.id)" >
          <GMapInfoWindow
              
              :opened="openedMarkerID === m.id"
          >
            <div> {{ m.name }} </div>
          </GMapInfoWindow>
        </GMapMarker>
      </GMapCluster>
    </GMapMap>
</template>

<script>
export default {
  name: 'MapContainer',
  data() {
    return {
      center: { lat: 45.508, lng: -73.587 },
      currentPlace: null,
      markers: [],
      places: [],
    }
  },
  mounted() {
    this.getCurrentLocation();
  },
  methods: {
    setPlace(place) {
      console.log(place);
      this.currentPlace = place;
      this.addMarker();
    },
    searchLocation(){

    },
    openInfoWindow(id){
      this.openedMarkerID = id
    },
    addMarker() {
        if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ id: this.currentPlace.place_id, position: marker, name: this.currentPlace.name });
        this.openInfoWindow(this.currentPlace.place_id);
        this.center = marker;
        this.places.push(this.currentPlace);
        this.currentPlace = null;
      }
      console.log(this.markers);
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.markers[0] = { id: 0, position: this.center, name: 'You are here' };
          this.openInfoWindow(0);
        },
        () => {
          alert('cannot get current location');
        }
      );
    } else {
      // Browser doesn't support Geolocation
      alert('Browser doesn\'t support Geolocation');
    }
      this.addMarker();
    },
  },
};
</script>

<style scoped>
.g-map{
  width:100%;
  height:300px;
}

</style>