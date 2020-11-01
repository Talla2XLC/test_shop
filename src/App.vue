<template>
  <div id="app">
    <Header v-if="!isLoading"/>
    <router-view :loading="isLoading" />
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";

export default {
  name: 'App',
  data() {
    return {
      catalog: [],
      products: [],

      // Фиксируем, идёт ли загрузка продукции
      productsLoading: true,

      // Фиксируем, идёт ли загрузка каталога
      catalogLoading: true,

      // Фиксируем, идёт ли загрузка курса валют
      exchangeRateLoading: true
    }
  },
  components: {
    Header
  },
  computed: {
    exchangeRate() {
      return this.$store.state.exchangeRate;
    },

    // Не рендерим карточки продуктов, пока не обновим данные по каталогу, продуктам и курсу валют
    isLoading() {
      return (this.productsLoading && this.catalogLoading && this.exchangeRateLoading)
    }
  },
  async mounted() {
    // После внедрения в DOM основного компонента приложения App.vue,
    // загружаем данные об актуальном курсе валют и обновляем данные о каталоге продуктции
    // и об имеющихся в наличии продуктах из файлов data.json и names.json
    await this.updateExchangeRate();
    await this.updateCatalog();
  },
  methods: {

    // Метод позволяет получить актуальные курсы валют от ЦБ РФ
    async updateExchangeRate() {
      await axios
        .get("https://www.cbr-xml-daily.ru/daily_json.js")
        .then(response => {
          const exchangeRate = +response.data.Valute.USD.Value;
          this.$store.dispatch("updateExchangeRate", exchangeRate);
          this.exchangeRateLoading = false;
        })
    },

    // Метод позволяет обновить данные о каталоге продукции
    async updateCatalog() {
      await axios
        .get("names.json")
        .then(response => {
          this.catalog = response.data;
          this.updateProducts().then(() => {
            this.$store.dispatch("updateProducts", this.products);
            this.productsLoading = false;
          });
        })
    },

    // Метод позволяет обновить данные об имеющейся продукции во Vuex
    async updateProducts() {
      await axios
        .get("data.json")
        .then(response => {
          const products = response.data.Value.Goods;
          products.forEach(product => {
            this.setAttributesNames(product);
            this.addProductsToCatalog(product);
          });
          this.products = products;
        })
    },

    // Метод позволяет распределить имеющуюся продукцию по каталогу, обновить Vuex и завершить статус "Загрузка"
    addProductsToCatalog(product){
      this.catalog[product.G].products ?
        this.catalog[product.G].products.push(product) :
        this.catalog[product.G].products = [product]
    this.$store.dispatch("updateCatalog", this.catalog);
    this.catalogLoading = false;
    },

    // Метод позволяет сопоставить id продукта и группы товаров и присвоить продукции актуальные названия из справочника
    setAttributesNames(product){
      this.setProductGroupName(product);
      this.setProductName(product);
      this.setProductQty(product);
      this.setProductPrice(product);
      this.setProductCartStatus(product);
    },

    // Метод присваивает актуальное название группы товаров продукта по факту сопоставления со справочником продукции
    setProductGroupName(product){
      product.GroupName = this.catalog[product.G].G;
    },

    // Метод присваивает актуальное название продукта по факту сопоставления со справочником продукции
    setProductName(product){
      product.Name = this.catalog[product.G].B[product.T].N;
    },

    // Метод добавляет количество продукта за счет хорошо читаемого свойство Qty объекту продукта
    setProductQty(product){
      product.Qty = product.P;
    },

    // Метод добавляет стоимость продукта за счет хорошо читаемого свойство PriceUSD объекту продукта
    setProductPrice(product){
      product.PriceUSD = product.C;
    },

    // Метод устанваливает свойство объекту товара, отвечающее за его состаояние нахождения в корзине
    setProductCartStatus(product){
      product.inCart = false;
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
  padding: 0 5%
}
</style>
