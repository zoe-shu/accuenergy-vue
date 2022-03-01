<template>
  <MapPage/>
  <!-- <CustomMap /> -->

</template>

<script>
import MapPage from './components/MapPage.vue'
// import CustomMap from './components/CustomMap.vue'

export default {
  name: 'App',
  components: {
    // CustomMap
    MapPage
  }
}
</script>

<style>
.map-checkbox .ant-checkbox-wrapper {
    display: block;
    margin-right: 0;
}
</style>
