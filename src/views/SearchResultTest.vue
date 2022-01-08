<template>
  <Loading
    :active="isLoading"
    :color="loaderColor"
    :width="loaderWidth"
    :height="loaderHeight"
  ></Loading>
  <HeaderSectionTest></HeaderSectionTest>
  <PopularSectionTest
    :data="searchedData"
    :touristType="filteredType"
    :resultPath="path"
  ></PopularSectionTest>
</template>

<script>
import getDataMixin from '@/mixins/getDataMixin.js';

export default {
  mixins: [getDataMixin],
  data() {
    return {
      allData: [],
      searchedData: [],
      filteredType: '',
      filteredCity: '',
      keywords: '',
      path: '',
      // Loader
      isLoading: false,
      loaderWidth: 150,
      loaderHeight: 150,
      loaderColor: 'rgba(47, 121, 140, 1)'
    };
  },
  computed: {
    placeUrl() {
      console.log('觸發 placeUrl', this.filteredCity);
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${this.filteredCity}?&$format=JSON`;
    },
    foodUrl() {
      console.log('觸發 foodUrl', this.filteredCity);
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${this.filteredCity}?&$format=JSON`;
    },
    eventUrl() {
      console.log('觸發 eventUrl', this.filteredCity);
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/${this.filteredCity}?&$format=JSON`;
    }
  },
  methods: {
    matchKeywords(database, keywords) {
      this.searchedData = database.filter((data) => {
        const name = data.ScenicSpotName
          ? data.ScenicSpotName
          : data.RestaurantName
          ? data.RestaurantName
          : data.ActivityName;
        return name.match(keywords);
      });
      console.log('matchKeywords searchedData', this.searchedData);
    },
    async processFillterData(filteredType) {
      // 根據不同類型，抓取相對應資料
      if (filteredType === 'ScenicSpot') {
        this.searchedData = await this.getPlaceData();
        console.log('開始抓資料');
      }
      if (filteredType === 'Restaurant') {
        this.searchedData = await this.getFoodData();
        console.log('開始抓資料');
      }
      if (filteredType === 'Activity') {
        this.searchedData = await this.getEventData();
        console.log('開始抓資料');
      }
      console.log('searchedData', this.searchedData);
    }
  },
  props: ['inputKeywords', 'type', 'city'],
  watch: {
    async inputKeywords() {
      console.log('inputKeywords 變動', this.inputKeywords);

      // 將關鍵字與資料庫比對
      this.matchKeywords(this.allData, this.inputKeywords);

      // 讀取當前頁面路徑，並傳進 PopularSection.vue
      this.path = this.$route.fullPath;
      console.log('watch path', this.path);
    },
    async city() {
      console.log('city 變動', this.city);

      // 重新篩選後，將變數重新賦值
      this.filteredCity = this.city;

      // 重新篩選後，讀取當前頁面路徑，並傳進 PopularSection.vue
      this.path = this.$route.fullPath;
    },
    async type() {
      console.log('type 變動', this.type);

      // 重新篩選後，將變數重新賦值
      this.filteredType = this.type;

      // 重新篩選後，讀取當前頁面路徑，並傳進 PopularSection.vue
      this.path = this.$route.fullPath;
    },
    async filteredCity() {
      console.log('觸發 filteredCity', this.filteredCity);

      this.isLoading = true;
      this.processFillterData(this.filteredType);
      this.isLoading = false;
    },
    async filteredType() {
      console.log('觸發 filteredType', this.filteredType);

      this.isLoading = true;
      this.processFillterData(this.filteredType);
      this.isLoading = false;
    }
  },
  async created() {
    console.log('created inputKeywords', this.inputKeywords);

    // 搜尋用 API
    await this.getAllData();
    this.allData = [...this.placeData, ...this.foodData, ...this.eventData];

    // 搜尋：關鍵字傳入，開始處理資料
    this.inputKeywords && this.matchKeywords(this.allData, this.inputKeywords);

    // 篩選：旅遊類型及城市傳入，watch filteredCity
    this.filteredType = this.type;
    this.filteredCity = this.city;
    console.log('created filteredType', this.filteredType);
    console.log('created filteredCity', this.filteredCity);

    // 讀取當前頁面路徑，並傳進 PopularSection.vue
    this.path = this.$route.fullPath;
  }
};
</script>
