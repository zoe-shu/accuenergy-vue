<template>
    <a-row>
      <a-col :span="2">
        <a-button type="primary" @click="getCurrentLocation()" :loading="isLoadingCurrent">
          <font-awesome-icon v-if="!isLoadingCurrent" :icon="['fa', 'location-crosshairs']" />
        </a-button>
      </a-col>
      <a-col :span="20">
        <a-input
          type="text"
          ref="gmapAutocomplete"
          placeholder="Enter Location"
        
        />
        
      </a-col>
      <a-col>
        <a-button type="primary" @click="searchLocation()" :loading="isLoadingSeach">
          <font-awesome-icon :icon="['fa', 'magnifying-glass']" />
        </a-button>
      </a-col>
    </a-row>
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
  },
  mounted() {
    console.log(this.google);
    const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
        types: ["establishment"],
      };
    const autocomplete = new this.google.maps.places.Autocomplete((this.$refs.gmapAutocomplete), options);
    autocomplete.addListener("place_changed", () => {
      console.log('place changed');
      const place = autocomplete.getPlace();
      console.log(place);
    })
  },
  methods: {
    onSearch(value) {
      console.log(value);
    },
  },
};
</script>

<style scoped>
</style>