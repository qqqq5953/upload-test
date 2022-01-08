<template>
  <div class="wrap">
    <header>
      <Navbar></Navbar>
      <section class="info_section">
        <h2>{{ defaultCardItem[this.Name] }}</h2>
        <p class="badge">
          {{
            defaultCardItem.Class1
              ? defaultCardItem.Class1
              : defaultCardItem.Class2
              ? defaultCardItem.Class2
              : '其他類'
          }}
        </p>
        <div class="info_content">
          <div class="info_img">
            <img
              :src="defaultCardItem.Picture.PictureUrl1"
              :alt="defaultCardItem[this.Name]"
            />
          </div>
          <div class="info_details">
            <h3>資訊</h3>
            <div class="info_details_phone">
              <h4>電話：</h4>
              <input
                id="phoneNumber"
                type="text"
                :value="defaultCardItem.Phone || '無'"
              />
              <div>
                <span>{{ defaultCardItem.Phone }}</span>
                <a href="#" @click.prevent="copyToClipBoard"
                  ><i class="far fa-copy"></i
                ></a>
              </div>
            </div>
            <div class="info_details_address">
              <h4>地址：</h4>
              <div>
                <span>{{ defaultCardItem.Address || '無' }}</span>
                <a href="#mapid"><i class="fas fa-map-marked-alt"></i></a>
              </div>
            </div>
            <div class="info_details_openTime">
              <h4>開放時間：</h4>
              <div>{{ defaultCardItem.OpenTime }}</div>
            </div>
          </div>
        </div>
      </section>
    </header>

    <div class="content">
      <section class="intro_section">
        <h3>介紹</h3>
        <article>{{ defaultCardItem.DescriptionDetail }}</article>
      </section>

      <section class="map_section">
        <h3>景點地圖</h3>
        <p>點擊以下按鈕搜尋</p>

        <nav class="search_by_type">
          <a
            href="#"
            class="search_by_type_btn"
            @click.capture.prevent="getNearByPlace(foodData, $event)"
            data-click="0"
          >
            <div class="search_by_type_icon">
              <i class="fas fa-2x fa-utensils"></i>
            </div>
            <span>搜尋附近餐廳</span>
          </a>

          <a
            href="#"
            class="search_by_type_btn"
            @click.capture.prevent="getNearByPlace(hotelData, $event)"
          >
            <div class="search_by_type_icon">
              <i class="fas fa-2x fa-bed"></i>
            </div>
            <span>搜尋附近住宿</span>
          </a>

          <a
            href="#"
            class="search_by_type_btn"
            @click.capture.prevent="getNearByPlace(eventData, $event)"
          >
            <div class="search_by_type_icon">
              <i class="fas fa-2x fa-star-half-alt"></i>
            </div>
            <span>搜尋附近活動</span>
          </a>
        </nav>

        <!--地圖-->
        <section class="map_section_details">
          <div class="map_wrap">
            <div
              id="mapid"
              class="map_default"
              style="width: 755px; height: 487px"
            ></div>
            <div v-if="noDataWarning" class="noDataWarning">查無資料</div>
            <!--  -->
          </div>
          <a
            href="#officialSite_section"
            class="hasOfficialSiteBtn"
            v-if="hasOfficialSiteBtn"
            @click.prevent="showTable"
          >
            <div class="hasOfficialSiteText">
              更多官網活動
              <i class="fas fa-chevron-down"></i>
            </div>
            <span>點擊並向下滾動</span>
          </a>
          <Card :item="cardItem" v-if="isCardShown" :txt="temp">
            <template #card_phone="{ item }">
              <div class="card_phone">
                <h5>
                  電話：{{ item.Phone || '無' }}
                  <i
                    class="fas fa-phone-alt"
                    :class="{ 'd-none': !item.Phone }"
                  ></i>
                </h5>
              </div>
            </template>
            <template #card_address="{ item }">
              <div class="card_address">地址：{{ item.Address || '無' }}</div>
            </template>
          </Card>
        </section>

        <OfficialSite
          id="officialSite_section"
          :item="officialSiteData"
          v-if="isTableShown"
        ></OfficialSite>
      </section>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import OfficialSite from '@/components/OfficialSite.vue';

export default {
  components: {
    OfficialSite
  },
  data() {
    return {
      // 地圖資料
      greenIconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      redIconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      blueIconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      blueIcon: {},
      redIcon: {},
      greenIcon: {},
      latitude: '',
      longitude: '',
      geoArr: [],
      currentLatitude: '',
      currentLongitude: '',
      defaultMarkerPopup: {},
      mymap: {},
      // 卡片資料
      Name: '',
      cardItem: {},
      defaultCardItem: {},
      cityValue: '',
      cityData: [
        { name: '臺北市', value: 'Taipei' },
        { name: '新北市', value: 'NewTaipei' },
        { name: '桃園市', value: 'Taoyuan' },
        { name: '臺中市', value: 'Taichung' },
        { name: '臺南市', value: 'Tainan' },
        { name: '高雄市', value: 'Kaohsiung' },
        { name: '基隆市', value: 'Keelung' },
        { name: '新竹市', value: 'Hsinchu' },
        { name: '新竹縣', value: 'HsinchuCounty' },
        { name: '苗栗縣', value: 'MiaoliCounty' },
        { name: '彰化縣', value: 'ChanghuaCounty' },
        { name: '南投縣', value: 'NantouCounty' },
        { name: '雲林縣', value: 'YunlinCounty' },
        { name: '嘉義縣', value: 'ChiayiCounty' },
        { name: '嘉義市', value: 'Chiayi' },
        { name: '屏東縣', value: 'PingtungCounty' },
        { name: '宜蘭縣', value: 'YilanCounty' },
        { name: '花蓮縣', value: 'HualienCounty' },
        { name: '臺東縣', value: 'TaitungCounty' },
        { name: '金門縣', value: 'KinmenCounty' },
        { name: '澎湖縣', value: 'PenghuCounty' },
        { name: '連江縣', value: 'LienchiangCounty' }
      ],
      foodData: [],
      hotelData: [],
      eventData: [],
      filteredData: [],
      selectedData: {},
      officialSiteData: [],
      filteredDataByDistance: [],
      isCardShown: true,
      noDataWarning: false,
      hasOfficialSiteBtn: false,
      isTableShown: false,
      // 暫存變數
      temp: ''
    };
  },
  computed: {
    foodUrl() {
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${this.cityValue}?&$format=JSON`;
    },
    hotelUrl() {
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/Hotel/${this.cityValue}?&$format=JSON`;
    },
    eventUrl() {
      return `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/${this.cityValue}?&$format=JSON`;
    }
  },
  methods: {
    copyToClipBoard() {
      const phoneNumber = document.getElementById('phoneNumber');
      phoneNumber.select();
      document.execCommand('copy');
      alert('已複製電話至剪貼簿');
    },
    // 1.取得傳進來的景點所在城市
    async getcityValue() {
      try {
        const cityValue = this.cityData.filter(
          (item) => this.defaultCardItem.City === item.name
        );
        this.cityValue = cityValue[0].value;

        console.log('cityValue', this.cityValue);
      } catch (error) {
        console.log(error);
      }
    },
    // 2-1.取得該城市之 餐廳資料
    async getFoodDataByCity() {
      try {
        const foodResponse = await this.axios.get(this.foodUrl, this.config);
        this.foodData = foodResponse.data;
        // console.log('foodData', this.foodData);
        console.log('foodData');
      } catch (error) {
        console.log(error);
      }
    },
    // 2-2.取得該城市之 住宿資料
    async getHotelDataByCity() {
      try {
        const hotelResponse = await this.axios.get(this.hotelUrl, this.config);
        this.hotelData = hotelResponse.data;
        // console.log('hotelData', this.hotelData);
        console.log('hotelData');
      } catch (error) {
        console.log(error);
      }
    },
    // 2-3.取得該城市之 活動資料
    async getEventDataByCity() {
      try {
        const eventResponse = await this.axios.get(this.eventUrl, this.config);
        this.eventData = eventResponse.data;
        // console.log('eventData', this.eventData);
        console.log('eventData');
      } catch (error) {
        console.log(error);
      }
    },
    // 3.取得 傳進來的景點 附近餐廳/住宿/活動資料
    getNearByPlace(rawData, e) {
      console.log('===========================================');
      console.log('rawData', rawData);
      // console.log("前一個 cardItem", this.cardItem);
      // console.log("nodeName",e.target.nodeName);
      // if (e.target.nodeName !== "I") return;
      // console.log("dataset",e.target.dataset);

      // 不顯示卡片& Table
      this.isCardShown = false;
      this.isTableShown = false;

      // 清除前一筆地圖資料
      this.clearPreviousData();
      this.changeDefaultMarkerPopup(this.redIcon, 'custom-popup-red');

      // 取得取得 餐廳/住宿/活動 資料(依行政區)
      // const filteredDataByDistrict = this.getDataByDistrict(rawData);

      // console.log("filteredDataByDistrict",filteredDataByDistrict);
      // 取得取得 餐廳/住宿/活動 資料(依距離)
      // this.filteredDataByDistance = this.getDataByDistance(filteredDataByDistrict);
      this.filteredDataByDistance = this.getDataByDistance(rawData);

      // 渲染圖標及Popup
      this.renderMarkerAndPopup([...this.filteredDataByDistance]);

      // 重新定位地圖 view
      this.findBounds(this.filteredDataByDistance);
    },
    findBounds(filteredDataByDistance) {
      if (!filteredDataByDistance.length) {
        this.mymap.flyTo([this.latitude, this.longitude], 18);
        return;
      }

      // 將座標分成緯度及經度
      const latArr = [];
      const lngArr = [];
      filteredDataByDistance.forEach((data) => {
        const latitude = data.Position.PositionLat;
        const longitude = data.Position.PositionLon;
        latArr.push(latitude);
        lngArr.push(longitude);
      });

      // 把default座標加入比較
      latArr.push(this.latitude);
      lngArr.push(this.longitude);

      // 找到座標最大及最小值
      const [minLat, minLng] = [Math.min(...latArr), Math.min(...lngArr)];
      const [maxLat, maxLng] = [Math.max(...latArr), Math.max(...lngArr)];

      // 定位地圖，常數為微調值
      this.mymap.fitBounds([
        [minLat - 0.0005, minLng - 0.0005],
        [maxLat + 0.001, maxLng + 0.001]
      ]);
    },
    calculateDistance(lat, lng, placeLat, placeLng) {
      const radian = 6371; // Radius of the earth in km
      const latitude = (lat * Math.PI) / 180;
      const longitude = (placeLat * Math.PI) / 180;
      const dLatitude = ((placeLat - lat) * Math.PI) / 180;
      const dLongitude = ((placeLng - lng) * Math.PI) / 180;

      const a =
        Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
        Math.cos(latitude) *
          Math.cos(longitude) *
          Math.sin(dLongitude / 2) *
          Math.sin(dLongitude / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = radian * c; // in kilometers

      return distance;
    },
    nameFilter(data) {
      const Name = data.ScenicSpotName
        ? 'ScenicSpotName'
        : data.RestaurantName
        ? 'RestaurantName'
        : data.HotelName
        ? 'HotelName'
        : 'ActivityName';
      return Name;
    },
    getDataByDistance(rawData) {
      const filteredDataByDistance = rawData.filter((data) => {
        const Name = this.nameFilter(data);

        // 如果活動是網站活動(可視情況增加條件 data.Location === "to see the official site")
        if (!data.Address && Name === 'ActivityName') {
          this.officialSiteData.push(data);
          console.log('this.officialSiteData', this.officialSiteData);
          return;
        }

        // 如果 data 名字 等於 頁面標題，return
        if (data[Name] === this.defaultCardItem[this.Name]) return;

        const latitude = data.Position.PositionLat;
        const longitude = data.Position.PositionLon;
        return (
          this.calculateDistance(
            latitude,
            longitude,
            this.latitude,
            this.longitude
          ) <= 1
        );
      });

      console.log('filteredDataByDistance', filteredDataByDistance);

      // 如果沒有匹配的資料，顯示"查無資料"
      if (!filteredDataByDistance.length) {
        this.noDataWarning = true;
      } else {
        this.noDataWarning = false;
      }

      // 如果有更多官網資訊資料，顯示"查看更多"按鈕
      if (this.officialSiteData.length) {
        this.hasOfficialSiteBtn = true;
      } else {
        this.hasOfficialSiteBtn = false;
      }

      return filteredDataByDistance;
    },
    showCard(e) {
      console.log('/////////////////showCard///////////////////');

      // 找到當前座標之地點資料
      const selectedPosition = [e.latlng.lat, e.latlng.lng];
      const selectedSpot = this.filteredDataByDistance.filter((data) => {
        const dataPosition = [
          data.Position.PositionLat,
          data.Position.PositionLon
        ];
        return (
          JSON.stringify(selectedPosition) === JSON.stringify(dataPosition)
        );
      });

      console.log('showCard, selectedSpot', selectedSpot);

      // 傳送資料至 card 元件
      this.cardItem = { ...selectedSpot[0] };

      // 顯示卡片
      this.isCardShown = true;
      this.hasOfficialSiteBtn = false;

      // 定位地圖 view 至點選位置
      this.mymap.flyTo(selectedPosition, 18);

      // 改變圖標顏色
      const Name = this.nameFilter({ ...selectedSpot[0] });
      this.changeCurrentMarkerColor(
        this.cardItem[Name],
        selectedPosition,
        this.cardItem
      );
      this.changePreviousMarkerColor();

      // 防止點擊多次而造成圖標重疊
      if (this.defaultMarkerPopup.marker.getIcon() === this.greenIcon) return;
      this.changeDefaultMarkerPopup(this.greenIcon, 'custom-popup-green');

      console.log('showCard, 現在的 cardItem[this.Name]', this.cardItem[Name]);
      console.log('showCard, 現在的 cardItem', this.cardItem);
      console.log('showCard, geoArr', this.geoArr);
    },
    renderMarkerAndPopup(filteredDataByDistance) {
      filteredDataByDistance.forEach((data) => {
        const dataLatitude = data.Position.PositionLat;
        const dataLongitude = data.Position.PositionLon;
        const dataName = this.nameFilter(data);
        const markerPopup = this.setMarkerPopup(
          dataLatitude,
          dataLongitude,
          data[dataName],
          this.blueIcon,
          this.showCard,
          'custom-popup-blue'
        );

        // 儲存地圖資料
        this.savePositionData(dataName, markerPopup.marker, markerPopup.popup);
      });
      console.log('geoArr', this.geoArr);
    },
    changeDefaultMarkerPopup(icon, customPopup) {
      // 移除 default marker 及 popup
      this.removeLayer(this.defaultMarkerPopup.marker);
      this.removeLayer(this.defaultMarkerPopup.popup);

      // 將 default 地點換成綠色
      this.defaultMarkerPopup = this.setMarkerPopup(
        this.latitude,
        this.longitude,
        `${this.defaultCardItem[this.Name]}`,
        icon,
        this.showDefaultCard,
        customPopup
      );
      this.mymap.addLayer(this.defaultMarkerPopup.popup);
      this.mymap.addLayer(this.defaultMarkerPopup.marker);
    },
    changeCurrentMarkerColor(name, selectedPosition, selectedSpot) {
      console.log(
        '///////////////// changeCurrentMarkerColor ///////////////////'
      );

      const latitude = selectedPosition[0];
      const longitude = selectedPosition[1];

      // 找出當下點到的圖標及popup
      const selectedLayer = this.geoArr.filter(
        (item) =>
          item.marker.getLatLng().lat === latitude &&
          item.marker.getLatLng().lng === longitude
      );

      // 找到點選的圖標資料並將其從陣列geoArr移除
      const Name = this.nameFilter(selectedSpot);
      const selectedItem = this.geoArr.filter(
        (item) => item.name === selectedSpot[Name]
      );
      const index = this.geoArr.indexOf(selectedItem[0]);
      this.geoArr.splice(index, 1);

      // 移除舊圖標
      const selectedMarker = selectedLayer[0].marker;
      const selectedPopup = selectedLayer[0].popup;
      this.removeLayer(selectedMarker);
      this.removeLayer(selectedPopup);

      console.log('selectedSpot', selectedSpot);
      console.log('selectedSpotName', Name);
      console.log('selectedMarker', selectedMarker);
      console.log('selectedPopup', selectedPopup);
      console.log('selectedPopup._content', selectedPopup._content);
      console.log('name', name);

      // 建立新圖標
      const newMarkerPopup = this.setMarkerPopup(
        latitude,
        longitude,
        selectedPopup._content,
        this.redIcon,
        this.showCard,
        'custom-popup-red'
      );

      // 儲存新地圖資料
      this.savePositionData(name, newMarkerPopup.marker, newMarkerPopup.popup);
    },
    changePreviousMarkerColor() {
      console.log(
        '///////////////// changeCurrentMarkerColor ///////////////////'
      );

      const geoArrLength = this.geoArr.length;
      console.log('geoArrLength', geoArrLength);

      // 只有一筆資料(沒有前一筆)
      if (geoArrLength === 1) return;

      // 找到前一個點擊的 marker
      const previousItem = this.geoArr.filter(
        (item) => item === this.geoArr[geoArrLength - 2]
      );
      const previousItemIndex = this.geoArr.indexOf(previousItem[0]);

      // 建立藍色 marker
      const previousItemLatitude = previousItem[0].marker.getLatLng().lat;
      const previousItemLongitude = previousItem[0].marker.getLatLng().lng;
      const previousItemName = previousItem[0].name;
      const resetPreviousMarkerPopup = this.setMarkerPopup(
        previousItemLatitude,
        previousItemLongitude,
        previousItemName,
        this.blueIcon,
        this.showCard,
        'custom-popup-blue'
      );

      console.log('previousItem', previousItem[0]);
      console.log('previousItemIndex', previousItemIndex);
      console.log('previousItemName', previousItemName);

      // 將previous marker 從 geoArr 移除並將更新的 marker 資料插入 geoArr
      this.geoArr.splice(previousItemIndex, 1, {
        name: previousItemName,
        marker: resetPreviousMarkerPopup.marker,
        popup: resetPreviousMarkerPopup.popup
      });

      // 移除舊圖標
      const previousMarker = previousItem[0].marker;
      const previousPopup = previousItem[0].popup;
      this.removeLayer(previousMarker);
      this.removeLayer(previousPopup);
    },
    removeLayer(layer) {
      // 刪除圖標
      this.mymap.removeLayer(layer);
    },
    savePositionData(name, marker, popup) {
      this.geoArr.push({ name, marker, popup });
    },
    showDefaultCard() {
      console.log('showDefaultCard');
      this.isCardShown = true;
      this.hasOfficialSiteBtn = false;
      this.cardItem = this.defaultCardItem;
    },
    showTable() {
      this.isTableShown = true;
    },
    clearPreviousData() {
      this.geoArr.forEach((item) => {
        this.removeLayer(item.marker);
        this.removeLayer(item.popup);
      });

      while (this.geoArr.length) {
        this.geoArr.pop();
      }

      while (this.officialSiteData.length) {
        this.officialSiteData.pop();
      }
    },
    setMap(latitude, longitude) {
      console.log('傳進來的', latitude, longitude);
      this.mymap = L.map('mapid', {
        zoomSnap: 0.5,
        zoom: 15,
        minZoom: 13,
        center: [latitude, longitude],
        closePopupOnClick: false
      });

      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 25,
          id: 'mapbox/streets-v11',
          // id: "mapbox/light-v10",
          tileSize: 512,
          zoomOffset: -1,
          errorTilrUrl:
            'http://bpic.588ku.com/element_pic/16/12/07/706f7ff4f15725b17ba1d30d384e6468.jpg',
          accessToken:
            'pk.eyJ1IjoicXFxcTU5NTMiLCJhIjoiY2t3MnhkdTE1MWptNjJubnRjNTJhcnZyZSJ9.Ue5C7QEKSmc03Ysh3vOB2Q'
        }
      ).addTo(this.mymap);

      // 目前位置標記
      this.defaultMarkerPopup = this.setMarkerPopup(
        latitude,
        longitude,
        `${this.defaultCardItem[this.Name]}`,
        this.redIcon,
        this.showDefaultCard,
        'custom-popup-red'
      );
    },
    setMarkerPopup(latitude, longitude, pupUpContent, icon, card, customPopup) {
      const marker = L.marker([latitude, longitude], { icon: icon })
        .addTo(this.mymap)
        .on('click', card);

      const popup = L.popup(
        { autoClose: false, closeButton: false, className: customPopup },
        marker
      )
        .setLatLng([latitude, longitude])
        .setContent(pupUpContent)
        .openOn(this.mymap);

      return { marker, popup };
    },
    createIcon(colorIcon) {
      const iconObject = new L.Icon({
        iconUrl: colorIcon,
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      return iconObject;
    }
  },
  created() {
    console.log('cardDetail created');

    // 接收 Card.vue 傳來資料（讀取localStorage）
    this.temp = localStorage.getItem('moreInfoBtnDnone');
    this.defaultCardItem = JSON.parse(
      localStorage.getItem('passToCardDetails')
    );

    console.log('defaultCardItem', this.defaultCardItem);

    // 複製一份到 cardItem
    this.cardItem = this.defaultCardItem;

    // 定義 defaultCardItem 的 Name 為何
    this.Name = this.nameFilter({ ...this.defaultCardItem });

    this.getcityValue();
    this.getFoodDataByCity();
    this.getHotelDataByCity();
    this.getEventDataByCity();

    this.blueIcon = this.createIcon(this.blueIconUrl);
    this.redIcon = this.createIcon(this.redIconUrl);
    this.greenIcon = this.createIcon(this.greenIconUrl);
  },
  mounted() {
    console.log('cardDetail mounted');

    this.latitude = this.defaultCardItem.Position.PositionLat;
    this.longitude = this.defaultCardItem.Position.PositionLon;
    this.setMap(this.latitude, this.longitude);
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/cardDetail.scss';

.card {
  margin-bottom: 0;

  &:not(&:nth-of-type(3n)) {
    margin-right: 0;
  }
}
</style>
