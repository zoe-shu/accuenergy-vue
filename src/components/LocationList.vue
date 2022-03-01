<template>


  <a-pagination show-quick-jumper :default-current="1" :total="500" @change="onChangePage" />
</template>

<script>

export default {
  name: 'LocationList',
  data() {
    return {

    };
  },
  methods: {
    onChangePage(pageNumber) {
      console.log('Page: ', pageNumber);
    },


  },
};
</script>

<style scoped>
</style>