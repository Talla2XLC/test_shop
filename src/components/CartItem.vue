<template>
  <div
    class="CartItem list-group-item "
  >
    <span class="productName">{{ product.Name }}</span>
    <div class="productQty">
      <div class="productQty-Top">
        <input type="number" v-model.number="newQtyInCart" min="1" max="999">
        <span>шт.</span>
      </div>
      <span class="productQty-warning" v-if="qtyLow">Количество ограничено</span>
    </div>
    <div class="productPrice">
      <span class="productPrice-amount">{{ calculatedPrice.toLocaleString() + ' руб.'}}</span>
      <span class="productPrice-text"> / шт.</span>
    </div>
    <span class="productDelete" @click="removeFromCart">Удалить</span>
  </div>
</template>

<script>
export default {
  name: "Product",
  props: {
    productID: [Number, String],
    catalogID: [Number, String]
  },
  data() {
    return {
      qtyLow: false,
      newQtyInCart: 0,
      calculatedPrice: 0
    }
  },
  computed: {
    product() {
      return this.$store.state.catalog[this.catalogID].products.find(el => el.T === this.productID)
    },
    QtyInCart() {
      return this.product.QtyInCart
    },
    cart() {
      return this.$store.state.cart
    },
    rate() {
      return this.$store.state.exchangeRate
    }
  },
  mounted() {
    this.newQtyInCart = this.QtyInCart
    this.calculatePrice();
  },
  methods: {
    addToCart() {
      this.$store.dispatch("addToCart", this.product);
      this.$emit('addProduct', this.product);
    },
    removeFromCart() {
      this.$store.dispatch("removeFromCart", this.product);
    },
    calculatePrice() {
      this.calculatedPrice = +(this.rate * this.product.PriceUSD * this.newQtyInCart).toFixed(2)
    }
  },
  watch: {
    // внедряем валидацию количества заказываемых товаров
    newQtyInCart(val) {
      // менее 1 заказать нельзя
      if(val < 1) {
        this.newQtyInCart = 1
      // более, чем доступно заказать нельзя
      } else if(val > this.product.Qty) {
        this.newQtyInCart = this.product.Qty
      // если товаров на складе мало, выводим оповещение
      } else if(this.product.Qty - val < 5) {
        this.qtyLow = true
      } else {
        this.qtyLow = false
      }

      // обновляем значение количества заказываемых товаров во Vuex
      // и создаём событие об изменении кол-ва товара в корзине
      if(this.newQtyInCart > 0){
        this.$store.dispatch("setCartQty", {
          productID: this.productID,
          newQty: this.newQtyInCart
        })
        this.calculatePrice();
        this.$emit('qtyUpdated');
      }
    },

    // следим за изменением курса валют, корректируем сумму
    rate(val, oldVal) {
      if(val !== oldVal) {
        this.calculatePrice();
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.CartItem
  display: flex
  flex-flow: row nowrap
  text-align: start
  justify-content: space-between
  padding: 10px
  position: relative
  >span, >div
    min-width: 15%
    text-align: start

.productName
  flex-grow: 1

.productQty
  display: flex
  flex-flow: column nowrap
  padding-right: 1rem
  box-sizing: border-box
  &-Top
    color: #a8a7a7
    >span
      margin-left: 4px
  &-warning
    border: darksalmon 1px dashed
    background-color: cornsilk
    font-size: 14px
    padding: 4px
    margin-top: 6px
    color: orangered

.productPrice
  &-amount
    font-weight: bold
  &-text
    font-size: 14px
    color: #a8a7a7

.productDelete
  cursor: pointer
  text-align: center !important
  &:hover
    font-weight: bold
</style>