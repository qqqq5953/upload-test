<template>
  <div
    class="loading_mask"
    style="
      background-color: rgba(0, 0, 0, 0.5);
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
    "
    :style="{ height: `${getScrollHeight}px` }"
  >
    <div class="filterArea-wrap">
      <div class="filterArea">
        <ul class="typeArea" ref="typeArea">
          <li class="popularItem">
            <h4>分類</h4>
            <details class="dropdown" data-id="inner">
              <summary class="dropdown_item_selected">
                {{ this.selectedType.name }}
              </summary>
              <ul class="dropdown_list">
                <template v-for="item in popularType" :key="item.name">
                  <li
                    class="dropdown_item"
                    @click.prevent="selectPopularType(item)"
                  >
                    {{ item.name }}
                  </li>
                </template>
              </ul>
            </details>
          </li>
          <a href="#"
            ><i class="fas fa-2x fa-times" @click.prevent="closeMask"></i
          ></a>
        </ul>

        <ul
          class="regionArea"
          ref="regionArea"
          @toggle.capture="dropdownListToggle($event)"
        >
          <template v-for="regionItem in regionData" :key="regionItem">
            <li class="region">
              <h4>{{ regionItem.regionName.name }}地區</h4>
              <details class="dropdown" data-id="inner">
                <summary class="dropdown_item_selected">
                  {{ regionItem.selectedCity }}
                </summary>
                <ul class="dropdown_list">
                  <template v-for="item in regionItem.regionCity" :key="item">
                    <li
                      class="dropdown_item"
                      @click="
                        dropdownItemsSelected($event);
                        selectRegion(item.region, item.city, item.value);
                      "
                    >
                      {{ item.city }}
                    </li>
                  </template>
                </ul>
              </details>
            </li>
          </template>
        </ul>
        <input
          type="button"
          class="banner_filterForm_searchBtn"
          @click="sendFilterData"
          value="搜尋"
          ref="filterBtn"
        />
      </div>
    </div>

    <!-- <div class="filterArea-wrap"></div> -->
  </div>
</template>

<script>
export default {
  emits: ['closeMask'],
  computed: {
    getScrollHeight() {
      return document.documentElement.scrollHeight;
    }
  },
  data() {
    return {
      test: '200vh',
      regionData: [
        {
          regionName: { name: '北部', value: 'north' },
          regionCity: [
            { region: '北部', city: '基隆市', value: 'Keelung' },
            { region: '北部', city: '臺北市', value: 'Taipei' },
            { region: '北部', city: '新北市', value: 'NewTaipei' },
            { region: '北部', city: '桃園市', value: 'Taoyuan' },
            { region: '北部', city: '新竹市', value: 'Hsinchu' },
            { region: '北部', city: '新竹縣', value: 'HsinchuCounty' },
            { region: '北部', city: '宜蘭縣', value: 'YilanCounty' }
          ],
          selectedCity: '' || '選擇縣市'
        },
        {
          regionName: { name: '中部', value: 'middle' },
          regionCity: [
            { region: '中部', city: '苗栗縣', value: 'MiaoliCounty' },
            { region: '中部', city: '臺中市', value: 'Taichung' },
            { region: '中部', city: '彰化縣', value: 'ChanghuaCounty' },
            { region: '中部', city: '南投縣', value: 'NantouCounty' },
            { region: '中部', city: '雲林縣', value: 'YunlinCounty' }
          ],
          selectedCity: '' || '選擇縣市'
        },
        {
          regionName: { name: '南部', value: 'south' },
          regionCity: [
            { region: '南部', city: '嘉義縣', value: 'ChiayiCounty' },
            { region: '南部', city: '嘉義市', value: 'Chiayi' },
            { region: '南部', city: '臺南市', value: 'Tainan' },
            { region: '南部', city: '高雄市', value: 'Kaohsiung' },
            { region: '南部', city: '屏東縣', value: 'PingtungCounty' }
          ],
          selectedCity: '' || '選擇縣市'
        },
        {
          regionName: { name: '東部', value: 'east' },
          regionCity: [
            { region: '東部', city: '花蓮縣', value: 'HualienCounty' },
            { region: '東部', city: '臺東縣', value: 'TaitungCounty' }
          ],
          selectedCity: '' || '選擇縣市'
        },
        {
          regionName: { name: '離島', value: 'island' },
          regionCity: [
            { region: '離島', city: '金門縣', value: 'KinmenCounty' },
            { region: '離島', city: '澎湖縣', value: 'PenghuCounty' },
            { region: '離島', city: '連江縣', value: 'LienchiangCounty' }
          ],
          selectedCity: '' || '選擇縣市'
        }
      ],
      popularType: [
        { name: '熱門景點', value: 'ScenicSpot' },
        { name: '熱門美食', value: 'Restaurant' },
        { name: '近期活動', value: 'Activity' }
      ],
      // popularType: ["熱門景點","熱門美食","近期活動"],
      selectedType: '' || { name: '熱門景點', value: 'ScenicSpot' },
      selectedCityValue: '',
      dropdownsOpen: [],
      regionArea: [],
      dropdownsNoText: [],
      dropdownsHasText: []
      // handler: {
      //   click: [this.closeMask, this.sendFilterData],
      //   'keyup.enter': [this.closeMask, this.sendFilterData]
      // }
    };
  },
  methods: {
    closeMask() {
      console.log('關閉');
      // 到 HeaderSection.vue
      this.$emit('closeMask');
    },
    sendFilterData() {
      if (!this.selectedCityValue) return;

      this.closeMask();
      this.$router.push({
        name: 'SearchResult',
        query: { type: this.selectedType.value, city: this.selectedCityValue }
      });

      this.resetFilter();
    },
    selectPopularType(type) {
      this.selectedType = type;

      // 關閉已打開的選單
      const dropdownsOpen =
        this.$refs.typeArea.querySelectorAll('.dropdown[open]');
      dropdownsOpen.forEach(function (dropdown, i) {
        if (event.target === dropdown) return;
        dropdown.removeAttribute('open');
      });
    },
    selectRegion(region, cityName, cityValue) {
      // this.$refs.filterBtn.focus();

      this.selectedCityValue = cityValue;
      switch (region) {
        case '北部': {
          this.regionData[0].selectedCity = cityName;
          break;
        }
        case '中部': {
          this.regionData[1].selectedCity = cityName;
          break;
        }
        case '南部': {
          this.regionData[2].selectedCity = cityName;
          break;
        }
        case '東部': {
          this.regionData[3].selectedCity = cityName;
          break;
        }
        case '離島': {
          this.regionData[4].selectedCity = cityName;
          break;
        }
        default: {
          break;
        }
      }
    },
    resetFilter() {
      this.selectedCityValue = '';
      this.regionData.forEach((regionItem) => {
        regionItem.selectedCity = '選擇縣市';
        console.log('reset 完成', regionItem.selectedCity);
      });
    },

    dropdownListToggle(event) {
      console.log('------------------------------------------');
      // Only run if the dropdown is open
      if (!event.target.open) return;

      // 定義打開的選單
      this.regionArea = this.$refs.regionArea;
      this.dropdownsOpen = this.regionArea.querySelectorAll('.dropdown[open]');
      this.dropdownsOpen.forEach(function (dropdown, i) {
        if (event.target === dropdown) return;

        // 如果點擊到的選單與打開的選單不同，則關閉已打開的選單
        dropdown.removeAttribute('open');
        dropdown.removeAttribute('selectedItem');
      });
    },
    dropdownItemsSelected(event) {
      // 定義有及沒有選擇內容的選單
      const dropdownsNoText = this.regionArea.querySelectorAll(
        '.dropdown:not(.dropdown[selectedItem])'
      );
      const dropdownsHasText = this.regionArea.querySelectorAll(
        '.dropdown[selectedItem]'
      );

      // 重新定義(抓取)打開的選單
      this.dropdownsOpen = this.regionArea.querySelectorAll('.dropdown[open]');
      this.dropdownsOpen.forEach((dropdown) => {
        // 限制將選到的內容只放入當下有 [open] 選單的 summary 中
        const dropdownsOpenSummary = dropdown.querySelector('summary');
        dropdownsOpenSummary.textContent = event.target.textContent;

        // 選單收合
        dropdown.removeAttribute('open');

        // 標記 selectedItem：選單已有選擇內容
        dropdown.setAttribute('selectedItem', 'hasText');

        // 選單的選擇狀況
        this.dropdownListStatus(dropdownsNoText, dropdownsHasText);
      });
    },
    dropdownListStatus(withoutText, withText) {
      withoutText.forEach((noTextItem) => {
        noTextItem.addEventListener('click', function (event) {
          if (event.target.nodeName !== 'LI') return;

          // 如點選尚未選擇的選項，則將所有已選內容的選單移除 selectedItem 標記，並改成"選擇縣市"
          withText.forEach((hasTextItem) => {
            console.log('hasTextItem', hasTextItem);
            hasTextItem.removeAttribute('selectedItem');
            const dropdownsHasTextSummary =
              hasTextItem.querySelector('summary');
            dropdownsHasTextSummary.textContent = '選擇縣市';
          });
        });
      });
    },
    // 可刪除
    changeSearchSectionStatus() {
      // this.emitter.emit('searchStatus', true);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/filter.scss';
// .mask {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   position: relative;
//   padding: 20px 0;
// }

// .banner_filterArea {
//   position: absolute;

//   // margin: auto;
//   // top: 418px;
//   // left: 26.6%;
//   // right: 14.9%;

//   display: flex;
//   flex-direction: column;
//   background-color: #fff;
//   border-radius: 20px;

//   // // 三角形
//   // &::before {
//   // content: "";
//   // position: absolute;
//   // top: -22px;
//   // right: 14%;
//   // border-top: 50px solid #fff;
//   // border-left: 50px solid transparent;
//   // border-top-left-radius: 7px;
//   // border-top-right-radius: 7px;
//   // transform: rotate(-45deg);

//   // @include pad {
//   // display: none;
//   // }
//   // }

//   @include mobile {
//     border-radius: 10px 10px 0px 0px;
//     width: 100%;
//     position: absolute;
//     top: 72px;
//   }

//   .typeArea {
//     padding: 34px 62px 35px;
//     border-bottom: 1px solid #dcdcdc;
//     display: flex;
//     justify-content: space-between;
//     position: relative;

//     @include pad {
//       padding: 30px 50px;
//     }

//     @include mobile {
//       border-bottom: none;
//       padding: 20px 62px 0;
//     }

//     a {
//       padding: 10px;
//       position: absolute;
//       right: 52px;

//       @include mobile {
//         top: 16px;
//         padding: 5px;
//         right: 20px;
//       }

//       .fa-times {
//         color: #dcdcdc;

//         @include mobile {
//           font-size: $font-size-md;
//         }
//       }
//     }
//   }

//   .regionArea {
//     padding: 35px 62px 40px;
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-between;

//     @include pad {
//       padding: 30px 50px;
//     }

//     @include mobile {
//       display: block;
//       padding: 20px 62px;
//     }

//     .region:not(:nth-last-child(1)) {
//       margin-bottom: 30px;

//       @include mobile {
//         margin-bottom: 20px;
//       }
//     }
//   }

//   .popularItem,
//   .region {
//     width: 44.9%;

//     @include mobile {
//       width: 100%;
//     }

//     h4 {
//       text-align: left;
//       margin-bottom: 25px;
//       font-size: $font-size-xxl;
//       font-weight: bold;
//       line-height: 1.2;

//       @include pad {
//         font-size: $font-size-xl;
//         margin-bottom: 16px;
//       }

//       @include mobile {
//         font-size: $font-size-md;
//         margin-bottom: 10px;
//       }
//     }
//   }

//   .dropdown {
//     position: relative;
//     cursor: pointer;
//     line-height: 1.2;

//     &::after {
//       content: '';
//       position: absolute;
//       right: 20px;
//       top: 0;
//       bottom: 0;
//       margin: auto;
//       width: 10px;
//       height: 10px;
//       border-top: 1px solid #999;
//       border-right: 1px solid #999;
//       transform: rotate(135deg);
//       transition: transform 0.3s;
//     }

//     &[open]::after {
//       transform: rotate(-45deg);
//     }

//     &[open] > .dropdown_item_selected ~ * {
//       animation: expand 0.3s ease-in-out;
//     }

//     @keyframes expand {
//       0% {
//         opacity: 0;
//         transform: translateY(0px);
//       }

//       100% {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }
//   }

//   .dropdown_item_selected {
//     position: relative;
//     background: #ffffff;
//     box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
//     border-radius: 14px;
//     padding: 19px 28px;
//     text-align-last: left;
//     color: $color-dark-50;
//     font-size: $font-size-md;

//     @include pad {
//       border-radius: 10px;
//       padding: 15px 12px;
//     }

//     @include mobile {
//       border-radius: 10px;
//       font-size: $font-size-sm;
//       padding: 15px 12px;
//     }
//   }

//   .dropdown_list {
//     position: absolute;
//     z-index: 2;
//     top: 65px;
//     left: 0;
//     right: 0;
//     box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
//     border-radius: 14px;
//     background-color: #fff;
//     text-align: center;

//     @include mobile {
//       top: 55px;
//       border-radius: 10px;
//       font-size: $font-size-sm;
//       box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
//     }

//     & > .dropdown_item:not(:last-child) {
//       border-bottom: 1px solid #dcdcdc;
//     }
//   }

//   .dropdown_item {
//     padding: 19px 28px 19px 28px;

//     @include mobile {
//       padding: 15px 12px;
//     }

//     &:first-of-type:hover {
//       background-color: $color-primary;
//       color: #fff;
//       border-radius: 14px 14px 0 0;
//     }

//     &:last-of-type:hover {
//       background-color: $color-primary;
//       color: #fff;
//       border-radius: 0 0 14px 14px;
//     }

//     &:hover {
//       background-color: $color-primary;
//       color: #fff;
//     }
//   }

//   .banner_filterForm_searchBtn {
//     @include btn-reset;
//     @include btn-pill;
//     @include btn-hover;
//     width: 25.9%;
//     margin: 0px auto 30px;
//     font-size: 22px;
//     font-weight: 700;

//     @include mobile {
//       margin-bottom: 46px;
//       font-size: $font-size-sm;
//       width: 48%;
//     }
//   }
// }

// .loading_mask {
//   overflow: hidden;
// }

// details > summary {
//   list-style: none;
// }

// ::marker {
//   display: none;
// }
</style>
