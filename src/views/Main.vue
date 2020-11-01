<template>
  <div class="main_page" v-if="!loading && catalog">
    <ProductGroup v-for="(value, key) in catalog" :key="key" :catalogID="key" />
  </div>
</template>

<script>
import ProductGroup from "@/components/ProductGroup";

export default {
  name: "Main",
  components: {
    ProductGroup
  },
  props: {
    loading: Boolean
  },
  computed: {
    catalog() {
      return this.$store.state.catalog;
    }
  }
};
</script>

<style lang="sass" scoped>
.main_page
  flex-grow: 1
  position: relative
  display: -webkit-flex
  display: -moz-flex
  display: -ms-flex
  display: -o-flex
  display: flex
  flex-flow: row wrap
  justify-content: space-between
</style>
