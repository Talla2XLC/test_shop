<template>
  <div id="app">
    <router-view :loading="loading"/>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'App',
  data() {
    return {
      // Не рендерим карточки продуктов, пока не обновим данные по каталогу\продуктам
      loading: true
    }
  },
  components: {
  },
  computed: {
    catalog() {
      return this.$store.state.catalog;
    },
    products() {
      return this.$store.state.products;
    },
    exchangeRate() {
      return this.$store.state.exchangeRate;
    }
  },
  mounted() {
    // После внедрения в DOM основного компонента приложения App.vue,
    // загружаем данные об актуальном курсе валют и обновляем данные о каталоге продуктции
    // и об имеющихся в наличии продуктах из файлов data.json и names.json
    this.updateExchangeRate();
    this.updateCatalog();
  },
  methods: {

    // Метод позволяет получить актуальные курсы валют от ЦБ РФ
    updateExchangeRate() {
      axios
          .get("https://www.cbr-xml-daily.ru/daily_json.js")
          .then(response => {
            const exchangeRate = +response.data.Valute.USD.Value;
            this.$store.dispatch("updateExchangeRate", exchangeRate);
          })
    },

    // Метод позволяет обновить данные о каталоге продукции во Vuex
    updateCatalog() {
      axios
        .get("names.json")
        .then(response => {
          const catalog = response.data;
          this.$store.dispatch("updateCatalog", catalog);
          this.updateProducts();
        })
    },

    // Метод позволяет обновить данные об имеющейся продукции во Vuex
    updateProducts() {
      axios
        .get("data.json")
        .then(response => {
          const products = response.data.Value.Goods;
          products.forEach(product => {
              this.setAttributesNames(product);
              this.addProductsToCatalog(product);
          });
          this.$store.dispatch("updateProducts", products);
        })
    },

    // Метод позволяет распределить имеющуюся продукцию по каталогу и завершить статус "Загрузка"
    addProductsToCatalog(product){
      this.catalog[product.G].products ?
          this.catalog[product.G].products.push(product) :
          this.catalog[product.G].products = [product]
      this.loading = false;
    },

    // Метод позволяет сопоставить id продукта и группы товаров и присвоить продукции актуальные названия из справочника
    setAttributesNames(product){
      this.setProductGroupName(product);
      this.setProductName(product);
      this.setProductQty(product);
      this.setProductPrice(product);
    },

    // Метод присваивает актуальное название группы товаров продукта по факту сопоставления со справочником продукции
    setProductGroupName(product){
      product.GroupName = this.catalog[product.G].G;
    },

    // Метод присваивает актуальное название продукта по факту сопоставления со справочником продукции
    setProductName(product){
      product.Name = this.catalog[product.G].B[product.T].N;
    },

    // Метод добавляет количяество продукта за счет хорошо читаемого свойство Qty объекту продукта
    setProductQty(product){
      product.Qty = product.P;
    },

    // Метод вычисляет и добавляет стоимость продукта согласно курса ЦБ РФ (USD + RUB)
    setProductPrice(product){
      product.PriceUSD = product.C;
      product.PriceRUB = +(product.PriceUSD * this.exchangeRate).toFixed(2);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
