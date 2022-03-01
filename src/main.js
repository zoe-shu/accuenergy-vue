import { createApp } from 'vue'
import App from './App.vue'
import Config from './config.json'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueGoogleMaps  from '@fawmi/vue-google-maps'

import MapPage from './components/MapPage.vue'

const app = createApp(App)

library.add(fas)


app
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('MapPage', MapPage)

app.config.productionTip = false
app.use(Antd);
app.use(VueGoogleMaps, {
  load: {
      key: Config.GOOGLE_MAP,
      libraries: 'places',
      language: 'en',
  },
  autobindAllEvents: true,
}).mount('#app');
