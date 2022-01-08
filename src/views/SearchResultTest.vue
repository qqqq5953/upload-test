<template>
  <Loading
    :active="isLoading"
    :color="loaderColor"
    :width="loaderWidth"
    :height="loaderHeight"
  ></Loading>
  <HeaderSectionTest></HeaderSectionTest>
  <!-- filteredType: {{ filteredType }} -->
  <br />
  <!-- filteredCity: {{ filteredCity }} -->
  <PopularSectionTest
    :data="searchedData"
    :resultType="path"
  ></PopularSectionTest>
</template>

<script>
// import getDataMixin from '@/mixins/getDataMixin.js';
import JsSHA from 'jssha';

export default {
  // mixins: [getDataMixin],
  data() {
    return {
      config: { headers: this.GetAuthorizationHeader() },
      // placeUrl:
      //   'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/?&$format=JSON',
      // foodUrl:
      //   'https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/?&$format=JSON',
      // eventUrl:
      //   'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON',
      placeData: [],
      foodData: [],
      eventData: [],
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
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${this.filteredCity}?&$format=JSON`;
    },
    foodUrl() {
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${this.filteredCity}?&$format=JSON`;
    },
    eventUrl() {
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/${this.filteredCity}?&$format=JSON`;
    }
  },
  methods: {
    async getPlaceData() {
      try {
        const placeResponse = await this.axios.get(this.placeUrl, this.config);
        return placeResponse.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getFoodData() {
      let foodResponse = null;
      try {
        foodResponse = await this.axios.get(this.foodUrl, this.config);
      } catch (error) {
        console.log(error);
      }
      return foodResponse.data;
    },
    async getEventData() {
      let eventResponse = null;
      try {
        eventResponse = await this.axios.get(this.eventUrl, this.config);
      } catch (error) {
        console.log(error);
      }
      return eventResponse.data;
    },
    async getAllData() {
      try {
        this.isLoading = true;

        await Promise.all([
          this.getPlaceData(),
          this.getFoodData(),
          this.getEventData()
        ]).then((res) => {
          this.isLoading = false;

          this.placeData = res[0];
          this.foodData = res[1];
          this.eventData = res[2];
        });
      } catch (error) {
        console.log(error);
      }
    },
    async processSearchData() {
      // API
      await this.getAllData();
      this.allData = [...this.placeData, ...this.foodData, ...this.eventData];

      // 將關鍵字與資料庫比對
      this.matchKeywords(this.allData, this.inputKeywords);
    },
    matchKeywords(database, keywords) {
      this.searchedData = database.filter((data) => {
        const name = data.ScenicSpotName
          ? data.ScenicSpotName
          : data.RestaurantName
          ? data.RestaurantName
          : data.ActivityName;
        return name.match(keywords);
      });
      console.log('searchedData', this.searchedData);
    },
    GetAuthorizationHeader() {
      const AppID = '096409078e0c483f87d2ae7551b214ea';
      const AppKey = '4s6NU76FhxsKZGCH06RzkVnXoSk';

      const GMTString = new Date().toGMTString();
      const ShaObj = new JsSHA('SHA-1', 'TEXT');
      ShaObj.setHMACKey(AppKey, 'TEXT');
      ShaObj.update('x-date: ' + GMTString);
      const HMAC = ShaObj.getHMAC('B64');
      const Authorization =
        'hmac username="' +
        AppID +
        '", algorithm="hmac-sha1", headers="x-date", signature="' +
        HMAC +
        '"';
      return {
        Authorization: Authorization,
        'X-Date': GMTString
      };
    }
  },
  props: ['inputKeywords', 'type', 'city'],
  watch: {
    inputKeywords() {
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
      this.filteredType = this.type;

      // 重新篩選後，讀取當前頁面路徑，並傳進 PopularSection.vue
      this.path = this.$route.fullPath;
    },
    async filteredCity() {
      this.isLoading = true;

      // 根據不同類型，抓取相對應資料
      if (this.filteredType === 'ScenicSpot') {
        this.searchedData = await this.getPlaceData();
      }
      if (this.filteredType === 'Restaurant') {
        this.searchedData = await this.getFoodData();
        console.log('開始抓資料');
      }
      if (this.filteredType === 'Activity') {
        this.searchedData = await this.getEventData();
        console.log('開始抓資料');
      }

      this.isLoading = false;
    }
  },
  async created() {
    // 搜尋：關鍵字傳入，開始處理資料
    this.inputKeywords && (await this.processSearchData());

    // 篩選：旅遊類型及城市傳入，watch filteredCity
    this.filteredType = this.type;
    this.filteredCity = this.city;

    // 讀取當前頁面路徑，並傳進 PopularSection.vue
    this.path = this.$route.fullPath;
    console.log('created path', this.path);
  }
};
</script>
