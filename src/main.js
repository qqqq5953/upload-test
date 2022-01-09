import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import axios from 'axios';
import VueAxios from 'vue-axios';
import mitt from 'mitt';
import Loading from 'vue3-loading-overlay';

import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import '@/assets/scss/reset.scss';

import HeaderSection from '@/components/HeaderSection.vue';
import FilterSection from '@/components/FilterSection.vue';
import PopularSection from '@/components/PopularSection.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';
import Pagination from '@/components/Pagination.vue';
import NoResult from '@/components/NoResult.vue';

import DefaultResult from '@/views/DefaultResult.vue';
import MoreResult from '@/views/MoreResult.vue';
import MoreResultTest from '@/views/MoreResultTest.vue';

import HeaderSectionTest from '@/components/HeaderSectionTest.vue';
import FilterSectionTest from '@/components/FilterSectionTest.vue';
import DefaultResultTest from '@/views/DefaultResultTest.vue';
import PopularSectionTest from '@/components/PopularSectionTest.vue';
import PaginationTest from '@/components/PaginationTest.vue';

const emitter = mitt();
const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.config.globalProperties.emitter = emitter;

app.component('HeaderSection', HeaderSection);
app.component('FilterSection', FilterSection);
app.component('PopularSection', PopularSection);
app.component('Navbar', Navbar);
app.component('Card', Card);
app.component('MoreResult', MoreResult);
app.component('Pagination', Pagination);
app.component('NoResult', NoResult);

app.component('DefaultResult', DefaultResult);
app.component('Loading', Loading);

app.component('HeaderSectionTest', HeaderSectionTest);
app.component('FilterSectionTest', FilterSectionTest);
app.component('DefaultResultTest', DefaultResultTest);
app.component('PopularSectionTest', PopularSectionTest);
app.component('PaginationTest', PaginationTest);
app.component('MoreResultTest', MoreResultTest);

app.mount('#app');
