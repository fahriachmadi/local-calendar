import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.min.js");
require("./assets/css/style.css")
require("font-awesome/css/font-awesome.css")

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");