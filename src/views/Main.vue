<template>
  <div class="main_page" v-if="!$attrs.loading">
    <ProductGroup v-for="item in catalog" :key="item.index" :productGroup="item" />
  </div>
</template>

<script>
import ProductGroup from "@/components/ProductGroup";

export default {
  name: "Main",
  computed: {
    catalog() {
      let correctedCatalog = [];
      Object.values(this.$store.state.catalog).forEach(el => {
        if (el.products) {
          correctedCatalog.push(el);
        }
      })
      return correctedCatalog;
    }
  },
  components: {
    ProductGroup
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
  padding: 0 5%
  justify-content: space-between
</style>
