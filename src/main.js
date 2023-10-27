import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faShower,
  faBed,
  faHouse,
  faDoorClosed,
  faEnvelope,
  faWifi,
  faPersonSwimming,
  faSquareParking,
  faBellConcierge,
  faHotTubPerson,
  faWater,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faShower,
  faBed,
  faHouse,
  faDoorClosed,
  faEnvelope,
  faWifi,
  faPersonSwimming,
  faSquareParking,
  faBellConcierge,
  faHotTubPerson,
  faWater,
  faPaperPlane
);
import 'bootstrap';
import App from './App.vue';
import { router } from './routes';

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app');
