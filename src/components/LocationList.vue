<template>
  <a-pagination show-quick-jumper :default-current="1" :total="500" @change="onChange" />
</template>

<script>
export default {
  name: 'LocationList',
  methods: {
    onChange(pageNumber) {
      console.log('Page: ', pageNumber);
    },
  },
};
</script>

<style scoped>
</style>