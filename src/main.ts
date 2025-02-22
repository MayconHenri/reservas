import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueTheMask from 'vue-the-mask';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(VueTheMask)
  .use(Vue3Toastify)
  .mount('#app')
