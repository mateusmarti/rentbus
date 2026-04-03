import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'leaflet/dist/leaflet.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBars,
  faRightFromBracket,
  faUser,
  faFileCirclePlus,
  faMoneyBillWave,
  faBus,
  faBuilding,
  faUsers,
  faRoad,
  faCreditCard,
  faUserTie,
  faHouse,
  faMapLocationDot,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faBars,
  faRightFromBracket,
  faUser,
  faFileCirclePlus,
  faMoneyBillWave,
  faBus,
  faBuilding,
  faUsers,
  faRoad,
  faCreditCard,
  faUserTie,
  faHouse,
  faMapLocationDot,
  faClipboardList
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router).mount('#app')