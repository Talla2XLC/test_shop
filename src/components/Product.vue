<template>
  <div
    class="product list-group-item btn btn-warning"
    :class="{
      productInCart: product.inCart,
      decreased: priceDecreased,
      increased: priceIncreased
    }"
    v-if="isOpen"
    @click="handleProductClick"
  >
    <span class="productName">{{ product.Name }} ({{ product.Qty }})</span>
    <span class="productPrice">{{ priceRUB.toLocaleString() }}</span>
    <div class="cartActionWrapper">
      <span
        class="cartActionBtn btn"
        :class="{
          'btn-success': !product.inCart,
          'btn-danger': product.inCart
        }"
      >
        {{ !product.inCart ? "Добавить в корзину" : "Убрать из корзины" }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Product",
  props: {
    productID: [Number, String],
    catalogID: [Number, String],
    isOpen: Boolean
  },
  data() {
    return {
      priceRUB: 0,
      priceIncreased: false,
      priceDecreased: false
    }
  },
  mounted() {
    this.calculatePrice();
  },
  computed: {

    // Идентифицируем продукт по ID группы товаров и ID товара
    product() {
      return this.$store.state.catalog[this.catalogID].products.find(el => el.T === this.productID)
    },
    cart() {
      return this.$store.state.cart
    },
    rate() {
      return this.$store.state.exchangeRate
    }
  },
  methods: {
    addToCart() {
      this.$store.dispatch("addToCart", this.product);
      this.$emit('addProduct', this.product);
      // this.product.inCart = true;
    },
    removeFromCart() {
      this.$store.dispatch("removeFromCart", this.product);
      // this.product.inCart = false;
    },
    handleProductClick(){
      this.product.inCart ? this.removeFromCart() : this.addToCart()
    },

    // вычисляет стоимость, внедряет маркеры повышения\понижения цены товара
    calculatePrice() {
      const newPrice = +(this.product.PriceUSD * this.rate).toFixed(2);
      if (this.priceRUB > newPrice) {
        this.priceDecreased = true;
        this.priceIncreased = false
      } else if (this.priceRUB < newPrice) {
        this.priceDecreased = false;
        this.priceIncreased = true
      } else {
        this.priceDecreased = false;
        this.priceIncreased = false
      }
      this.priceRUB = newPrice;
    }
  },
  watch: {
    // следим за изменением курса валют, корректируем общую сумму
    rate(val, oldVal) {
      if(val !== oldVal) {
        this.calculatePrice();
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.product
  display: flex
  flex-flow: row nowrap
  text-align: start
  justify-content: space-between
  padding: 0
  position: relative
  &:hover .cartActionWrapper
    display: flex

.productName
  padding: 0.75rem

.productPrice
  background-color: #f3f3f399
  height: 100%
  padding: 0.75rem
  min-width: 100px
  display: flex
  flex-flow: row nowrap
  align-items: center
  font-weight: bold

.productInCart
  background-color: #f2e07e !important

.cartActionWrapper
  position: absolute
  display: none
  justify-content: center
  height: 100%
  width: 100%
  opacity: 0.7

.cartActionBtn
  margin: auto 0

.increased
  background-color: #adff2f88

.decreased
  background-color: #ff000088
</style>