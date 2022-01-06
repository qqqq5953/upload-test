<template>
  <header class="header">
    <Navbar></Navbar>

    <section class="banner">
      <h2 class="banner_title">尋找台灣</h2>
      <h3 class="banner_subtitle">景點、活動、美食</h3>
      <div class="banner_search">
        <div class="banner_searchBar">
          <input
            type="text"
            placeholder="請輸入關鍵字"
            v-model.trim="search"
            @keyup.enter="searchBtn"
          />
          <!-- this.$router.push({ name: 'SearchResult' }); -->

          <i class="fas fa-lg fa-search"></i>
        </div>
        <button
          type="button"
          class="banner_filterBtn"
          @click="this.hasMask = !this.hasMask"
        >
          <div class="banner_filterIcon">
            <i class="fas fa-bars"></i>
          </div>
          <span class="banner_filterText">篩選</span>
        </button>
      </div>
      <router-link :to="{ name: 'SearchResult' }">
        <input
          type="button"
          class="banner_searchBtn"
          @click="searchBtn"
          value="搜尋"
          :disabled="!this.search"
        />
      </router-link>
      <!-- :get-mask="hasMask" -->
      <FilterSection
        v-if="hasMask"
        @close-mask="changeMaskStatus"
      ></FilterSection>
    </section>
  </header>
</template>

<script>
import JsSHA from 'jssha';

export default {
  // props: ['allData'],
  data() {
    return {
      hasMask: false,
      temp: '',
      search: '',
      allData: [],
      placeUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/Taipei?&$format=JSON',
      foodUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/Taipei?&$format=JSON',
      eventUrl:
        'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/Taipei?&$format=JSON'
    };
  },
  methods: {
    changeMaskStatus() {
      this.hasMask = !this.hasMask;
      this.emitter.emit('activate-loading', this.hasMask);
    },
    async getAllData() {
      try {
        const urlArr = [this.placeUrl, this.foodUrl, this.eventUrl];
        const responseArr = [];
        for (let i = 0; i < urlArr.length; i++) {
          const response = await this.axios.get(urlArr[i], this.config);
          responseArr.push(...response.data);
        }
        this.allData = [...responseArr];
        // console.log('responseArr', responseArr);
        // console.log('this.allData', this.allData);
      } catch (error) {
        console.log(error);
      }
    },
    async searchBtn() {
      console.log('searchBtn');
      this.$router.push({ name: 'SearchResult' });

      if (this.search === '') return;

      await this.getAllData();

      const searchData = this.allData.filter((data) => {
        const name = data.ScenicSpotName
          ? data.ScenicSpotName
          : data.RestaurantName
          ? data.RestaurantName
          : data.ActivityName;
        // const city = data.City;
        return name.match(this.search);
      });

      // 傳送資料到 PopularSection.vue
      this.emitter.emit('searchData', { searchData, title: '搜尋結果' });

      this.search = '';
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
    // this.getAllData();
  },
  beforeUnmount() {
    console.log('HeaderSection beforeUnmont');
    this.emitter.off('searchData');
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/header.scss';
.outline {
  outline: 1px solid red;
}
// .nav {
//   padding-left: 57px;
//   padding-top: 39px;

//   @include mobile {
//     padding-top: 16px;
//     padding-left: 27px;
//   }

//   .logo {
//     display: flex;
//     align-items: center;
//     text-decoration: none;

//     i {
//       display: block;
//       width: 70px;
//       height: 72px;
//     }
//   }

//   .websiteName {
//     display: block;
//     font-size: 22px;
//     color: white;
//     margin-left: 14px;
//     -webkit-text-stroke: 1px $color-primary;
//   }
// }

// .header {
//   background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80')
//     no-repeat center center / cover;

//   .banner {
//     padding: 55px 19.7% 70px;
//     text-align: center;
//     width: 100%;

//     @include pad {
//       padding: 35px 10% 55px;
//     }

//     @include mobile {
//       padding: 25px 32px 55px;
//     }
//   }

//   .banner_title {
//     font-size: $font-size-xxxl;
//     font-weight: bold;
//     color: $color-white-50;
//     line-height: 1.2;
//     margin-bottom: 25px;

//     @include pad {
//       font-size: $font-size-xxl;
//       margin-bottom: 15px;
//     }

//     @include mobile {
//       font-size: $font-size-xl;
//       margin-bottom: 10px;
//     }
//   }

//   .banner_subtitle {
//     font-size: $font-size-xxl;
//     font-weight: bold;
//     color: $color-white-50;
//     line-height: 1.2;

//     @include pad {
//       font-size: $font-size-lg;
//     }

//     @include mobile {
//       font-size: $font-size-md;
//     }
//   }

//   .banner_search {
//     margin-top: 35px;
//     margin-bottom: 60px;
//     display: flex;
//     justify-content: center;

//     @include pad {
//       margin-bottom: 35px;
//     }

//     @include mobile {
//       margin-top: 26px;
//       margin-bottom: 0px;
//     }
//   }

//   .banner_searchBar {
//     width: 77%;
//     position: relative;

//     @include mobile {
//       width: 83%;
//     }

//     input[type='text'] {
//       width: 100%;
//       border-radius: 20px;
//       border: none;
//       outline: none;
//       padding: 20px 0px 20px 24px;
//       font-size: $font-size-xl;
//       line-height: 1.2;
//       background-color: $color-white-50;

//       @include pad {
//         font-size: $font-size-md;
//         padding: 16px 0px 16px 16px;
//         border-radius: 10px;
//       }

//       @include mobile {
//         font-size: $font-size-sm;
//         padding: 13px 0px 13px 13px;
//         border-radius: 10px;
//       }
//     }

//     .fa-search {
//       line-height: 1.2;
//       position: absolute;
//       width: 28px;
//       height: 28px;
//       color: #797979;
//       right: 20px;
//       top: 0;
//       bottom: 0;
//       margin: auto;

//       @include pad {
//         font-size: $font-size-md;
//         width: 21px;
//         height: 21px;
//       }

//       @include mobile {
//         font-size: $font-size-sm;
//         width: 14px;
//         height: 14px;
//       }
//     }
//   }

//   .banner_filterBtn,
//   .banner_searchBtn {
//     @include btn-reset;
//     font-size: 22px;
//   }

//   .banner_filterBtn {
//     @include btn-rectangle;
//     @include btn-hover;
//     margin-left: 22px;
//     padding: 21px 43px;
//     display: flex;
//     align-items: center;

//     @include pad {
//       padding: 16px 20px;
//       border-radius: 10px;
//     }

//     @include mobile {
//       padding: 12px 10px;
//       border-radius: 8px;
//       margin-left: 11px;
//     }

//     .banner_filterIcon {
//       line-height: 1.2;

//       .fa-bars {
//         display: block;
//         font-size: $font-size-lg;
//       }
//     }

//     .banner_filterText {
//       font-size: 22px;
//       line-height: 1.2;
//       margin-left: 14px;

//       @include pad {
//         font-size: $font-size-md;
//         margin-left: 10px;
//       }

//       @include mobile {
//         display: none;
//       }
//     }
//   }

//   .banner_searchBtn {
//     @include btn-pill;
//     @include btn-hover;
//     display: block;
//     margin: 0 auto;
//     width: 219px;

//     @include pad {
//       font-size: 20px;
//     }

//     @include mobile {
//       display: none;
//     }
//   }
// }
</style>
