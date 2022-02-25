import { createApp } from 'vue'
import App from './App.vue'


import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Config from './config.json'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueGoogleMaps  from '@fawmi/vue-google-maps'

import MapPage from './components/MapPage.vue'
import MapContainer from './components/MapContainer.vue'
import SearchBox from './components/SearchBox.vue'
import LocationList from './components/LocationList.vue'

const app = createApp(App)

library.add(fas)


app
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('MapPage', MapPage)
  .component('MapContainer', MapContainer)
  .component('SearchBox', SearchBox)
  .component('LocationList', LocationList);
  
app.config.productionTip = false
app.use(Antd);
app.use(VueGoogleMaps, {
  load: {
      key: Config.GOOGLE_MAP,
      libraries: 'places',
  },
  autobindAllEvents: true,
}).mount('#app');
