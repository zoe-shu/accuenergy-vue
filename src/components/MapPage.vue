<template>
  <div class="map-page-wrap">
    <a-row align="center" justify="space-between" class="search-bar-container">
      <a-col flex="50px">
        <a-button @click="getCurrentLocation()" :loading="isLoadingCurrent">
          <font-awesome-icon v-if="!isLoadingCurrent" :icon="['fa', 'location-crosshairs']" />
        </a-button>
      </a-col>
      <a-col flex="auto">
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
      <a-col flex="50px" align="right">
        <a-button type="primary" @click="onSubmitAutocomplete()" :loading="isLoadingSearch">
          <font-awesome-icon :icon="['fa', 'magnifying-glass']" />
        </a-button>
      </a-col>
    </a-row>

    <GMapMap
      :center="center"
      :zoom="14"
      class="map-container"
    >
      <GMapCluster>
        <GMapMarker 
            v-if="current"
            :position="current.position"
            :clickable="true"
            @click="openInfoWindow(current.id)" >
            <GMapInfoWindow :opened="current.id">
              <div>{{ current.label }}</div>
            </GMapInfoWindow>
          </GMapMarker>
        <GMapMarker 
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            @click="openInfoWindow(m.id)" >
            <GMapInfoWindow :opened="openedMarkerID === m.id">
              <div>{{ m.label }}</div>
            </GMapInfoWindow>
          </GMapMarker>
        </GMapCluster>
    </GMapMap>

    <div class="location-list-container">
      <a-row class="table-header-container" v-if="currentPageContent.length > 0" >
        <a-col style="margin-right:1rem">
          <span style="font-weight:bold">Time Zone: </span>
          <span>{{ timeZone }}</span>
          </a-col>
        <a-col>
          <span style="font-weight:bold">Local Time: </span>
          <span>{{ localTime }}</span>
        </a-col>
      </a-row>
       <a-button class="clear-button"
        :type="isDisableDelete? 'default':'danger'" 
        @click="clearLocList()" 
        :disabled="isDisableDelete"
      >
        Delete 
      </a-button>
      <a-row>
        <a-col :span="24">
          <a-checkbox v-for="marker in currentPageContent" 
            v-bind:key="marker.id" class="map-checkbox" 
            @change="onCheckLoc" :value="marker.id"
          >
            <a-row>
              <a-col >{{ marker.label }}</a-col>
            </a-row>
          </a-checkbox>
        </a-col>
      </a-row>
      <a-pagination simple 
        :page-size="pageSize" 
        :default-current="currentPage" 
        :total="markersTotal" 
        @change="onChangePage" 
      />
    </div>
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
      selectedAddress: '',
      selectedLoc: [],
      pageSize: 10,
      markersTotal: 0,
      openedMarkerID: null,
      currentPage: 1,
      currentPageContent: [],
      indexStart: 0,
      indexEnd: this.pageSize,
      timeZone: '',
      localTime: '',
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
      ev.which = 13 //Enter key
      ev.keyCode = 13 //Enter key
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
        let date =  moment().tz(data.timezoneId);
        this.timeZone = data.timeZoneId;
        this.localTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
      });
    },
    addMarker() {
      if (this.currentPlace) {
        if(!this.markers.find(marker => marker.id === this.currentPlace.place_id)){
          const marker = {
            id: this.currentPlace.place_id, 
            value: this.currentPlace.place_id,
            position: {
              lat: this.currentPlace.geometry.location.lat(),
              lng: this.currentPlace.geometry.location.lng(),
            }, 
            label: this.currentPlace.name,
          }
          this.getTimeZone(marker);
          this.markers.unshift(marker);
          this.openInfoWindow(this.currentPlace.place_id);
          this.center = marker.position;
          this.places.push(this.currentPlace);
          this.currentPlace = null;
        }
      }
      this.markersTotal = this.markers.length;
      this.isDisableDelete = this.selectedLoc.length <= 0 ? true : false;
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
      if(event.target.checked){
        this.selectedLoc.push(event.target.value);
      }else{
        const index = this.selectedLoc.indexOf(event.target.value);
        this.selectedLoc.splice(index, 1);
      }
      this.isDisableDelete = this.selectedLoc.length <= 0 ? true : false;
    },
    clearLocList(){
      if(this.selectedLoc.length > 0){
        this.selectedLoc.forEach(loc => {
          this.markers = this.markers.filter(marker => marker.id != loc);
        })
        this.selectedLoc = [];
        this.markersTotal = this.markers.length;
        if(this.currentPage > 1){
          while( Math.ceil(this.markersTotal / this.pageSize) < this.currentPage ){
            this.currentPage -= 1;
          }
        }
        this.onChangePage(this.currentPage);       
      }
      this.isDisableDelete = this.selectedLoc.length <= 0 ? true : false
    },

    // Pagination
    onChangePage(pageNumber) {
      this.selectedLoc = [];
      this.isDisableDelete = this.selectedLoc.length <= 0 ? true : false;
      this.currentPage = pageNumber;
      this.indexStart = (pageNumber - 1) * this.pageSize;
      this.indexEnd = (this.markersTotal > this.pageSize || this.markersTotal == 0) ? pageNumber * this.pageSize : this.markersTotal;
      this.updateContent();
    },
    updateContent(){
      this.currentPageContent = this.markers.slice(this.indexStart, this.indexEnd);
    }

  },
};
</script>

<style >
.map-page-wrap{
  padding: 1rem;
}
.search-bar-container, .map-container{
  margin-bottom: 1rem;
}
.pac-target-input{
  margin: 0;
  height: 100%;
}
.map-container{
  width: 100%;
  height: 300px;
}
.clear-button{
  margin-bottom: .5rem;
}
.table-header-container{
  margin-bottom: 1rem;
}
.location-list-container .ant-checkbox-inner{
  top: 4px;
}
.ant-checkbox-wrapper.map-checkbox{
  display: flex;
  margin-bottom: 0.5rem;
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