import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex, VueAxios, axios);

export default new Vuex.Store({
  modules: {
  },
  state: {
    products: [],
    catalog: [],
    exchangeRate: 0,
    cart: []
  },
  mutations: {
    SET_PRODUCTS: (state, products) => {
      state.products = products;
    },
    SET_CATALOG: (state, catalog) => {
      state.catalog = catalog;
    },
    SET_EXCHANGE_RATE: (state, rate) => {
      state.exchangeRate = rate;
    },
    ADD_TO_CART: (state, product) => {
      product.QtyInCart = 1;
      state.cart.push(product);
    },
    REMOVE_FROM_CART: (state, product) => {
      const indexToRemove = state.cart.indexOf(product);
      state.cart.splice(indexToRemove, 1);
    },
    MARK_PRODUCT_TO_CART: (state, product) => {
      state.catalog[product.G].products.find(el => el.T === product.T).inCart = true;
    },
    MARK_PRODUCT_FROM_CART: (state, product) => {
      state.catalog[product.G].products.find(el => el.T === product.T).inCart = false;
    },
    SET_CART_QTY: (state, payload) => {
      state.cart.forEach(el => {
        if(+el.T === payload.productID) {
          el.QtyInCart = payload.newQty
        }
      });
    }
  },
  actions: {
    updateProducts(context, products) {
      context.commit("SET_PRODUCTS", products);
    },
    updateCatalog(context, catalog) {
      context.commit("SET_CATALOG", catalog);
    },
    updateExchangeRate(context, rate) {
      context.commit("SET_EXCHANGE_RATE", rate);
    },
    addToCart(context, product) {
      context.commit("ADD_TO_CART", product);
      context.commit("MARK_PRODUCT_TO_CART", product);
    },
    removeFromCart(context, product) {
      context.commit("REMOVE_FROM_CART", product);
      context.commit("MARK_PRODUCT_FROM_CART", product);
    },
    setCartQty(context, product) {
      context.commit("SET_CART_QTY", product);
    }
  }
});