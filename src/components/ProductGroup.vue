<template>
  <div
    class="productGroup list-group"
    :class="{dropup: isOpen}"
  >
    <button
      class="btn btn-secondary dropdown-toggle"
      @click.prevent="toggleList"
    >
      {{productGroup.G}}
    </button>
    <Product
      v-for="product in productGroup.products"
      :key="product.T"
      :product="product"
      :isOpen="isOpen"
    />
  </div>
</template>

<script>
import Product from "@/components/Product";

export default {
  name: 'productGroup',
  data() {
    return {
      isOpen: false
    }
  },
  props: {
    productGroup: Object
  },
  components: {
    Product
  },
  methods: {
    toggleList() {
      console.log(1);
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="sass" scoped>
.productGroup
  margin: 1rem
  width: 40%
  flex-grow: 1
</style>
