<template>
  <div class="Cart list-group">
    <div class="topDescription">
      <span class="itemDescription">Наименование товара и описание</span>
      <span class="qty">Количество</span>
      <span class="price">Цена</span>
      <span class="empty" />
    </div>
    <CartItem
      v-for="product in cart"
      :key="product.T"
      :productID="product.T"
      :catalogID="product.G"
      @qtyUpdated="calculateSum"
    />
    <div class="totalAmount">
      <span class="totalAmount-text">Общая стоимость: </span>
      <span class="totalAmount-price">{{sum.toLocaleString() + ' руб.'}}</span>
    </div>
  </div>
</template>

<script>
import CartItem from "@/components/CartItem";

export default {
  name: "Cart",
  components: {
    CartItem
  },
  props: {
  },
  data() {
    return {
      sum: 0
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart
    },
    rate() {
      return this.$store.state.exchangeRate
    }
  },
  mounted() {
    this.calculateSum();
  },
  methods: {

    // вычисляем общую стоимость корзины
    calculateSum() {
      let sum = 0;
      this.$store.state.cart.forEach(product => {
        sum += product.QtyInCart * product.PriceUSD * this.rate
      })
      this.sum = +sum.toFixed(2);
    }
  },
  watch: {
    // следим за изменением курса валют, корректируем общую сумму
    rate(val, oldVal) {
      if(val !== oldVal) {
        this.calculateSum();
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.Cart

.topDescription
  display: flex
  flex-flow: row nowrap
  justify-content: space-between
  margin-bottom: 10px
  padding: 10px
  >span
    min-width: 15%
    text-align: start
    color: #a8a7a7

.itemDescription
  flex-grow: 1

.totalAmount
  align-self: flex-end
  margin-top: 10px
  &-text
    color: #a8a7a7
    font-size: 14px
  &-price
    font-weight: bold
    color: orangered
</style>
