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
    exchangeRate: 0
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
    }
  }
});