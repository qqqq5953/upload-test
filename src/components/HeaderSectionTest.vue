<template>
  <Loading
    :active="isLoading"
    :color="loaderColor"
    :width="loaderWidth"
    :height="loaderHeight"
  ></Loading>
  <header class="header" :style="{ backgroundImage: `url(${image})` }">
    <Navbar></Navbar>
    <section class="banner">
      <h2 class="banner_title">尋找台灣</h2>
      <h3 class="banner_subtitle">景點、活動、美食</h3>
      <div class="banner_search outline">
        <div class="banner_searchBar outline">
          <input
            type="text"
            placeholder="請輸入關鍵字"
            v-model.trim="search"
            @keyup.enter="searchBtn"
          />
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
      <input
        type="button"
        class="banner_searchBtn"
        @click="searchBtn"
        value="搜尋"
        :disabled="!this.search"
      />
      <!-- :get-mask="hasMask" -->
      <FilterSectionTest
        v-if="hasMask"
        @close-mask="changeMaskStatus"
      ></FilterSectionTest>
    </section>
  </header>
</template>

<script>
export default {
  data() {
    return {
      image:
        'https://images.unsplash.com/photo-1612249632917-bc95d832105b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      // Loader
      isLoading: false,
      loaderColor: 'rgba(47, 121, 140, 1)',
      loaderWidth: 150,
      loaderHeight: 150,
      // other
      hasMask: false,
      temp: '',
      search: ''
    };
  },
  methods: {
    changeMaskStatus() {
      this.hasMask = !this.hasMask;
    },
    async searchBtn() {
      console.log('searchBtn');

      if (this.search === '') return;

      // 傳送資料到 SearchSection.vue
      this.$router.push({ name: 'SearchResult', query: { q: this.search } });

      this.search = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/header.scss';
.outline {
  outline: 2px solid red;
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
