<template>
  <HeaderSection></HeaderSection>
  <PopularSection
    :data="placeData"
    defaultType="熱門景點"
    resultType="DefaultType"
  >
    <template #card_section_title_text>
      熱門景點
      <img src="@/assets/images/place-icon.png" alt="place-icon" />
    </template>
  </PopularSection>

  <PopularSection
    :data="foodData"
    defaultType="熱門美食"
    resultType="DefaultType"
  >
    <template #card_section_title_text>
      熱門美食
      <img src="@/assets/images/restaurant-icon.png" alt="restaurant-icon" />
    </template>
  </PopularSection>

  <PopularSection
    :data="eventData"
    defaultType="近期活動"
    resultType="DefaultType"
  >
    <template #card_section_title_text>
      近期活動
      <img src="@/assets/images/event-icon.png" alt="event-icon"
    /></template>
  </PopularSection>
</template>

<script>
import JsSHA from 'jssha';

export default {
  data() {
    return {
      config: { headers: this.GetAuthorizationHeader() },
      defaultPlaceUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/Taipei?$top=6&$format=JSON',
      defaultFoodUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/Taipei?$top=6&$format=JSON',
      defaultEventUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/Taipei?$top=6&$format=JSON',
      // Data 存放
      placeData: [],
      foodData: [],
      eventData: []
    };
  },
  methods: {
    async getPlaceData() {
      try {
        const placeResponse = await this.axios.get(
          this.defaultPlaceUrl,
          this.config
        );
        this.placeData = placeResponse.data;
        // console.log('預設資料 placeData', this.placeData);
      } catch (error) {
        console.log(error);
      }
    },
    async getFoodData() {
      try {
        const foodResponse = await this.axios.get(
          this.defaultFoodUrl,
          this.config
        );
        this.foodData = foodResponse.data;
        // console.log('預設資料 foodData', this.foodData);
      } catch (error) {
        console.log(error);
      }
    },
    async getEventData() {
      try {
        const eventResponse = await this.axios.get(
          this.defaultEventUrl,
          this.config
        );
        this.eventData = eventResponse.data;
        // console.log('預設資料 eventData', this.eventData);
      } catch (error) {
        console.log(error);
      }
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
  created() {
    // 取得預設資料
    this.getPlaceData();
    this.getFoodData();
    this.getEventData();
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/popularSection.scss';
</style>
