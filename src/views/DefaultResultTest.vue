<template>
  <Loading
    :active="isLoading"
    :color="loaderColor"
    :width="loaderWidth"
    :height="loaderHeight"
  ></Loading>
  <!-- <div class="wrap"> -->
  <HeaderSectionTest ref="wrap"></HeaderSectionTest>
  <PopularSectionTest :data="placeData" defaultType="熱門景點">
    <template #card_section_title_text>
      <span>熱門景點</span>
      <img src="@/assets/images/place-icon.png" alt="place-icon" />
    </template>
  </PopularSectionTest>

  <PopularSectionTest :data="foodData" defaultType="熱門美食">
    <template #card_section_title_text>
      <span>熱門美食</span>
      <img src="@/assets/images/restaurant-icon.png" alt="restaurant-icon" />
    </template>
  </PopularSectionTest>

  <PopularSectionTest :data="eventData" defaultType="近期活動">
    <template #card_section_title_text>
      <span>近期活動</span>
      <img src="@/assets/images/event-icon.png" alt="event-icon"
    /></template>
  </PopularSectionTest>
  <!-- </div> -->
</template>

<script>
// import JsSHA from 'jssha';
import getDataMixin from '@/mixins/getDataMixin.js';

export default {
  mixins: [getDataMixin],
  data() {
    return {
      // Loader
      isLoading: false,
      loaderWidth: 150,
      loaderHeight: 150,
      loaderColor: 'rgba(47, 121, 140, 1)',
      // API
      // config: { headers: this.GetAuthorizationHeader() },
      placeUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/Taipei?$top=6&$format=JSON',
      foodUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/Taipei?$top=6&$format=JSON',
      eventUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/Taipei?$top=6&$format=JSON'
      // Data 存放
      // placeData: [],
      // foodData: [],
      // eventData: []
    };
  },
  methods: {
    // async getPlaceData() {
    //   try {
    //     const placeResponse = await this.axios.get(this.placeUrl, this.config);
    //     return placeResponse;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // async getFoodData() {
    //   let foodResponse = null;
    //   try {
    //     foodResponse = await this.axios.get(this.foodUrl, this.config);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   return foodResponse;
    // },
    // async getEventData() {
    //   let eventResponse = null;
    //   try {
    //     eventResponse = await this.axios.get(this.eventUrl, this.config);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   return eventResponse;
    // },
    // async getAllData() {
    //   try {
    //     this.isLoading = true;
    //     await Promise.all([
    //       this.getPlaceData(),
    //       this.getFoodData(),
    //       this.getEventData()
    //     ]).then((res) => {
    //       this.isLoading = false;
    //       this.placeData = res[0].data;
    //       this.foodData = res[1].data;
    //       this.eventData = res[2].data;
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // GetAuthorizationHeader() {
    //   const AppID = '096409078e0c483f87d2ae7551b214ea';
    //   const AppKey = '4s6NU76FhxsKZGCH06RzkVnXoSk';
    //   const GMTString = new Date().toGMTString();
    //   const ShaObj = new JsSHA('SHA-1', 'TEXT');
    //   ShaObj.setHMACKey(AppKey, 'TEXT');
    //   ShaObj.update('x-date: ' + GMTString);
    //   const HMAC = ShaObj.getHMAC('B64');
    //   const Authorization =
    //     'hmac username="' +
    //     AppID +
    //     '", algorithm="hmac-sha1", headers="x-date", signature="' +
    //     HMAC +
    //     '"';
    //   return {
    //     Authorization: Authorization,
    //     'X-Date': GMTString
    //   };
    // }
  },
  created() {
    // 取得預設資料
    // this.isLoading = true;

    // Promise.all([
    //   this.getPlaceData(),
    //   this.getFoodData(),
    //   this.getEventData()
    // ]).then((res) => {
    //   this.isLoading = false;

    //   this.placeData = res[0].data;
    //   this.foodData = res[1].data;
    //   this.eventData = res[2].data;
    // });
    this.getAllData();

    // this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped>
// @import '@/assets/scss/popularSection.scss';
img {
  margin-left: 24px;
  object-fit: cover;

  @include mobile {
    width: 16px;
    margin-left: 12px;
  }
}
</style>
