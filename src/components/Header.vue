<template>
  <header class="Header">
    <div class="rate">
      <span class="rate-text">Курс валют: </span>
      <input type="number" v-model.number="rate" min="1" max="999">
      <span class="rate-price"> руб. / USD</span>
    </div>
    <router-link
        tag="button"
        to="/"
        type="button"
        class="btn btn-info cart-btn"
        v-if="this.$route.path !== '/'"
    >
      На главную
    </router-link>
    <router-link
      tag="button"
      to="/cart"
      type="button"
      class="btn btn-success cart-btn"
    >
      Корзина {{cart.length ? '(' + cart.length + ')' : ''}}
    </router-link>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
  },
  computed: {
    cart() {
      return this.$store.state.cart
    },
    vuexRate(){
      return this.$store.state.exchangeRate
    }
  },
  data() {
    return {
      rate: null
    }
  },
  mounted() {
    this.rate = this.vuexRate
  },
  watch: {
    // внедряем валидацию курса валют
    rate(val, oldVal) {
      if(val !== oldVal){
        // менее 20 задать нельзя
        if(val < 20) {
          this.rate = 20
          // более 80 задать нельзя
        } else if(val > 80) {
          this.rate = 80
        }

        // обновляем значение курса валют во Vuex
        // и создаём событие об изменении курса валют
        this.$store.dispatch("updateExchangeRate", this.rate)
        this.$emit('rateUpdated')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.Header
  display: flex
  flex-flow: row nowrap
  justify-content: flex-end

.cart-btn
  margin: 1rem

.rate
  align-self: center
</style>