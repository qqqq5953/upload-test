import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import axios from 'axios';
import VueAxios from 'vue-axios';
import mitt from 'mitt';

import '@/assets/scss/reset.scss';

import HeaderSection from '@/components/HeaderSection.vue';
import FilterSection from '@/components/FilterSection.vue';
import PopularSection from '@/components/PopularSection.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';
import Pagination from '@/components/Pagination.vue';

import DefaultResult from '@/views/DefaultResult.vue';
import SearchResult from '@/views/SearchResult.vue';
import MoreResult from '@/views/MoreResult.vue';

const emitter = mitt();
const app = createApp(App).use(VueAxios, axios).use(router);
app.config.globalProperties.emitter = emitter;
app.component('HeaderSection', HeaderSection);
app.component('Navbar', Navbar);
app.component('FilterSection', FilterSection);
app.component('PopularSection', PopularSection);
app.component('Card', Card);
app.component('MoreResult', MoreResult);
app.component('Pagination', Pagination);

app.component('DefaultResult', DefaultResult);
app.component('SearchResult', SearchResult);

app.mount('#app');
