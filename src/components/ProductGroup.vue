<template>
  <div
    class="productGroup list-group"
    :class="{dropup: isOpen}"
    v-if="hasProducts"
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
      :productID="product.T"
      :catalogID="product.G"
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
      isOpen: false,
      hasProductsInCart: false
    }
  },
  props: {
    catalogID: [Number, String],
  },
  computed: {
    productGroup() {
      return this.$store.state.catalog[this.catalogID]
    },

    // Проверяем на наличие продукции данной категории
    hasProducts() {
      return Object.prototype.hasOwnProperty.call(this.productGroup, 'products');
    },

    cart: {
      get() {
        return this.$store.state.cart
      }
    }
  },
  components: {
    Product
  },
  methods: {
    toggleList() {
      this.isOpen = !this.isOpen
    },
    // проверяем, есть ли товары данной группы в корзине
    checkProductsInCart() {
      this.cart.forEach(el => {
        if (+el.G === +this.catalogID){
          this.hasProductsInCart = true;
          this.isOpen = true;
        }
      });
    }
  },
  mounted() {
    // Открываем список группы товаров, если хотябы один из товаров представлен в корзине
    this.checkProductsInCart()
  }
}
</script>

<style lang="sass" scoped>
.productGroup
  margin: 1rem
  width: 40%
  flex-grow: 1
</style>
