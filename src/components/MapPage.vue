<template>
    <a-row>
      <a-col :span="2">
        <a-button type="primary" @click="getCurrentLocation()" :loading="isLoadingCurrent">
          <font-awesome-icon v-if="!isLoadingCurrent" :icon="['fa', 'location-crosshairs']" />
        </a-button>
      </a-col>
      <a-col :span="20">
        <GMapAutocomplete
          ref="autocomplete"
          style="width:100%"
          placeholder="Enter Location"
          @place_changed="setPlace"
          :select-first-on-enter="true"
          v-model="selectedAddress"
        >
        </GMapAutocomplete>
      </a-col>
      <a-col>
        <a-button type="primary" @click="onSubmitAutocomplete()" :loading="isLoadingSearch">
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
          v-if="current"
          :position="current.position"
          :clickable="true"
          @click="openInfoWindow(current.id)" >
          <GMapInfoWindow :opened="current.id">
            <div> {{ current.label }} </div>
          </GMapInfoWindow>
        </GMapMarker>
      <GMapMarker 
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          @click="openInfoWindow(m.id)" >
          <GMapInfoWindow :opened="openedMarkerID === m.id">
            <div> {{ m.label }} </div>
          </GMapInfoWindow>
        </GMapMarker>
      </GMapCluster>
    </GMapMap>

    <div>
      <a-button :type="isDisableDelete? 'default':'danger'" @click="clearLocList()" :disabled="isDisableDelete">
        Delete 
      </a-button>
      <a-row>
        <a-col :span="24">
          <a-checkbox v-for="marker in currentPageContent" 
            v-bind:key="marker.id" class="map-checkbox" 
            @change="onCheckLoc" :value="marker.id"
          >
            <a-row>
              <a-col :span="14">{{ marker.label }}</a-col>
              <a-col :span="5">{{ marker.timezoneId }}</a-col>
              <a-col :span="5">{{ marker.localTime }}</a-col>
            </a-row>
          </a-checkbox>
        </a-col>
      </a-row>
    <a-pagination simple :page-size="pageSize" :total="markersTotal" @change="onChangePage" />
  </div>
</template>

<script>
import Config from '../config.json';
import moment from 'moment-timezone';
const isLoadingCurrent = false,
      isLoadingSearch = false,
      isDisableDelete = true;

export default {
  name: 'MapPage',
  data() {
    return {
      center: { lat: 43.651070, lng: -79.347015 },
      currentPlace: null,
      markers: [],
      current: null,
      places: [],
      selectedAddress:'',
      selectedLoc: [],
      pageNumber: 1,
      pageSize: 10,
      markersTotal: 0,
      openedMarkerID: null,
      currentPage:1,
      currentPageContent: [],
      indexStart: 0,
      indexEnd: this.pageSize,
      isLoadingCurrent,
      isLoadingSearch,
      isDisableDelete,
    }
  },
  mounted() {
    this.onChangePage(this.currentPage);
  },
  methods: {
    // Map
    setPlace(place) {
      this.currentPlace = place;
      this.addMarker();
    },
    onSubmitAutocomplete(){
      // Click to select first result
      const el = this.$refs.autocomplete.$refs.input
      const ev = new Event('keydown')
      ev.which = 13
      ev.keyCode = 13
      return el.dispatchEvent(ev)
    },
    openInfoWindow(id){
      this.openedMarkerID = id
    },
    async getTimeZone(marker){
      const api = "https://maps.googleapis.com/maps/api/timezone/json?location="+marker.position.lat+","+marker.position.lng+"&timestamp=1331161200&key="+Config.GOOGLE_MAP;
      fetch(api)
      .then(response => response.json())
      .then(data => { 
        let update = this.markers.find(item => item.id === marker.id);
        update.timezoneId = data.timeZoneId;
        update.localTime = moment().tz(update.timezoneId).format("YYYY-MM-DD HH:mm:ss");
      });
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          id: this.currentPlace.place_id, 
          value: this.currentPlace.place_id,
          position: {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng(),
          }, 
          label: this.currentPlace.name,
          timezone: '',
          localTime: '',
        }
        this.getTimeZone(marker);
        this.markers.unshift(marker);
        this.openInfoWindow(this.currentPlace.place_id);
        this.center = marker.position;
        this.places.push(this.currentPlace);
        this.currentPlace = null;
        
      }
      this.markersTotal = this.markers.length;
      this.isDisableDelete = this.selectedLoc.length <= 0 ? true : false
      this.updateContent();
    },
    getCurrentLocation() {
      this.isLoadingCurrent = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const marker = {
              id: 0, 
              value: 0,
              position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              label: 'Current Location',
            };
            this.current = marker;
            this.center = marker.position;
            this.isLoadingCurrent = false;
          },
          () => {
            this.isLoadingCurrent = false;
            alert('cannot get current location');
          }
        );
      } else {
        // Browser doesn't support Geolocation
        this.isLoadingCurrent = false;
        alert('Browser doesn\'t support Geolocation');
      }
    },

    // Location List
    onCheckLoc(event) {
      const index = this.selectedLoc.indexOf(event.target.value);
      if(index > 0){
        this.selectedLoc.splice(index,1);
      }else{
        this.selectedLoc.push(event.target.value);
      }
      this.isDisableDelete = this.selectedLoc.length <= 0 ? true : false
    },
    clearLocList(){
      if(this.selectedLoc.length > 0){
        this.selectedLoc.forEach(loc => {
          this.markers = this.markers.filter(marker => marker.id != loc);
        })
        this.selectedLoc = [];
        this.markersTotal = this.markers.length;
        this.updateContent();
      }
      this.isDisableDelete = this.selectedLoc.length <= 0 ? true : false
    },

    // Pagination
    onChangePage(pageNumber) {
      this.selectedLoc = [];
      this.currentPage = pageNumber;
      this.indexStart = (pageNumber - 1) * this.pageSize;
      this.indexEnd = pageNumber * this.pageSize;
      this.updateContent();
    },
    updateContent(){
      this.currentPageContent = this.markers.slice(this.indexStart, this.indexEnd);
    }

  },
};
</script>

<style >
.g-map{
  width:100%;
  height:300px;
}
.ant-checkbox-wrapper.map-checkbox{
  display: flex;
}
.ant-checkbox-wrapper.map-checkbox .ant-checkbox + span{
  display: inline-block;
    width: 100%;
}
.ant-checkbox-wrapper.map-checkbox + .ant-checkbox-wrapper{
  margin-left: 0px;
}
.ant-checkbox-wrapper.map-checkbox .ant-checkbox-checked::after{
  border: none;
}
</style>