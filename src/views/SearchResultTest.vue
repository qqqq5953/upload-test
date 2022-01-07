<template>
  <HeaderSectionTest></HeaderSectionTest>
  <h1>之後搜尋：{{ keywords }}</h1>
  <PopularSectionTest
    :data="searchedData"
    :resultType="`SearchResult?q=${keywords}`"
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
      placeUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/?&$format=JSON',
      foodUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/?&$format=JSON',
      eventUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON',
      placeData: [],
      foodData: [],
      eventData: [],
      allData: [],
      searchedData: null,
      keywords: '',
      path: ''
    };
  },
  methods: {
    async getPlaceData() {
      try {
        const placeResponse = await this.axios.get(this.placeUrl, this.config);
        return placeResponse;
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
      return foodResponse;
    },
    async getEventData() {
      let eventResponse = null;
      try {
        eventResponse = await this.axios.get(this.eventUrl, this.config);
      } catch (error) {
        console.log(error);
      }
      return eventResponse;
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

          this.placeData = res[0].data;
          this.foodData = res[1].data;
          this.eventData = res[2].data;
        });
      } catch (error) {
        console.log(error);
      }
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
  props: ['q'],
  watch: {
    q() {
      console.log('keywords 變動');
      this.path = this.$route.fullPath;
      console.log('path', this.path);

      this.keywords = this.q;
      this.matchKeywords(this.allData, this.keywords);
    }
  },
  async created() {
    await this.getAllData();
    this.allData = [...this.placeData, ...this.foodData, ...this.eventData];
    this.keywords = this.q;

    this.matchKeywords(this.allData, this.keywords);
    console.log('searchedData', this.searchedData);

    this.path = this.$route.fullPath;
    console.log('path', this.path);
  }
};
</script>
