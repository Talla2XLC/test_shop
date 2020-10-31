<template>
  <div class="product list-group-item" v-if="isOpen">
    <span class="productName">{{ product.Name }} ({{product.Qty}})</span>
    <span class="productPrice">{{ product.PriceRUB }}</span>
  </div>
</template>

<script>
export default {
  name: "Product",
  props: {
    product: Object,
    isOpen: Boolean
  },
}
</script>

<style lang="sass" scoped>
.product
  display: flex
  flex-flow: row nowrap
  text-align: start
  justify-content: space-between
  padding: 0

.productName
  padding: 0.75rem

.productPrice
  background-color: #f3f3f3
  height: 100%
  padding: 0.75rem
  min-width: 100px
  display: flex
  flex-flow: row nowrap
  align-items: center
  font-weight: bold
</style>