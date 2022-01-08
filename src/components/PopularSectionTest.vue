<template>
  <!-- <HeaderSection></HeaderSection> -->
  <!-- v-if="searchData" -->
  <Loading
    :active="isLoading"
    :color="loaderColor"
    :width="loaderWidth"
    :height="loaderHeight"
  ></Loading>
  <!-- v-if="resultType === 'MoreResult' || resultType === 'resultType'" -->
  <PaginationTest
    :current-page="currentPage"
    :total-pages="totalPages"
    @page-change="onPageChange"
    :resultType="resultType"
  ></PaginationTest>
  <section class="card_section">
    <div class="card_section_title">
      <slot v-if="!searchTypeData" name="card_section_title_text"></slot>
      <div>{{ searchTypeData }}</div>
      <img
        v-if="searchTypeData === '熱門景點'"
        src="@/assets/images/place-icon.png"
        alt="place-icon"
      />
      <img
        v-else-if="searchTypeData === '熱門美食'"
        src="@/assets/images/restaurant-icon.png"
        alt="restaurant-icon"
      />
      <img
        v-else-if="searchTypeData === '近期活動'"
        src="@/assets/images/event-icon.png"
        alt="event-icon"
      />
    </div>
    <div class="card_section_content">
      <Card v-for="obj in paginatedData" :key="obj.ID" :item="obj">
        <!-- <template #card_moreInfoBtn>
          <router-link :to="{ name: 'CardDetail' }" >
            <button type="button" class="card_moreInfoBtn">查看詳情</button>
          </router-link>
        </template> -->
      </Card>
    </div>
    <router-link
      :to="{ name: 'MoreResult' }"
      v-if="defaultType"
      @click="moreResult"
    >
      <button type="button" class="card_section_morePlaceBtn">
        看更多{{ defaultType }}
      </button>
    </router-link>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    },
    defaultType: {
      type: String
    },
    resultType: {
      type: String,
      default: 'SearchResult'
    }
  },
  data() {
    return {
      searchData: null,
      searchTypeData: '',
      paginatedData: null,
      // 分頁資訊
      currentPage: 1,
      cardPerPage: 9,
      totalPages: '',
      // Loader
      isLoading: false,
      loaderWidth: 150,
      loaderHeight: 150,
      loaderColor: 'rgba(47, 121, 140, 1)'
    };
  },
  methods: {
    moreResult() {
      // 傳送到 MoreResult.vue (用 localStorage)
      const moreResult = JSON.stringify(this.defaultType);
      console.log('========moreResult 發射========', moreResult);
      localStorage.setItem('passToMoreResult', moreResult);
    },
    setPageButton(data) {
      this.totalPages = Math.ceil(data.length / this.cardPerPage);
    },
    setPageData(data) {
      console.log('執行 setPageData');
      console.log('resultType', this.resultType);

      const page = this.currentPage;
      const perPage = this.cardPerPage;
      const start = page * perPage - perPage;
      const end = page * perPage;

      // console.log('currentPage', page);
      // console.log('perPage', perPage);
      // console.log('start', start);
      // console.log('end', end);
      // console.log('更新前 paginatedData - setPageData', this.paginatedData);
      // console.log('setPageData 切割結果', data.slice(start, end));

      return data.slice(start, end);
    },
    onPageChange(page) {
      console.log('pageChange', page);
      this.currentPage = page;
    }
  },
  watch: {
    data() {
      // this.paginatedData = this.data;
      this.paginatedData = this.setPageData(this.data);
      this.setPageButton(this.data);
      // 重設起始頁面
      this.currentPage = 1;
      // console.log('paginatedData - watch data', this.paginatedData);
    },
    currentPage() {
      // 當所在頁面變動時，重新賦值給 paginatedData

      if (!this.searchData) {
        console.log('執行條件');
        this.paginatedData = this.setPageData(this.data);
        // console.log('paginatedData - currentPage', this.paginatedData);

        return;
      }

      console.log('執行正常');
      this.paginatedData = this.setPageData(this.searchData);
      console.log('paginatedData - currentPage', this.paginatedData);
    },
    searchData() {
      console.log('searchData 有變動');

      // 重設起始頁面
      this.currentPage = 1;

      // 設置分頁按鈕
      this.setPageButton(this.searchData);

      // 當篩選或搜尋資料完成時，賦值給 PpaginatedData
      this.paginatedData = this.setPageData(this.searchData);
    }
  },
  async created() {
    console.log('PopulatSection created');
    console.log('resultType', this.resultType);

    this.isLoading = true;

    // 接收篩選資料 from FilterSection.vue
    await this.emitter.on('filteredData', (data) => {
      this.searchData = data.filteredData;
      this.searchTypeData = data.filteredTypeData;
      console.log('emit on searchData', this.searchData);
      console.log('emit on searchTypeData', this.searchTypeData);
    });

    // 接收搜尋資料 from HeaderSection.vue
    await this.emitter.on('searchData', (data) => {
      this.searchData = data.searchData;
      this.searchTypeData = data.title;
      console.log('emit on searchData 的 searchData', this.searchData);
      console.log('emit on searchData 的 searchTypeData', this.searchTypeData);
    });

    this.isLoading = false;
  },
  beforeUnmount() {
    console.log('PopularSection beforeUnmont');

    this.emitter.off('filteredData');
    this.emitter.off('searchData');
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/popularSection.scss';
// .card_section {
//   padding: 55px 7.09%;
//   &:nth-of-type(2) {
//     background-color: $color-secondary;
//   }

//   @include pad {
//     padding: 55px 10%;
//   }

//   @include mobile {
//     padding: 30px 50px;
//   }
// }

// .card_section_title {
//   font-weight: bold;
//   font-size: $font-size-xxl;
//   color: $color-primary;
//   margin-bottom: 70px;

//   @include mobile {
//     font-size: $font-size-md;
//     text-align: center;
//     margin-bottom: 30px;
//   }

//   .fas {
//     margin-left: 24px;
//   }
// }

// .card_section_title_icon {
//   margin-left: 23px;
// }

// .card_section_content {
//   display: flex;
//   justify-content: space-between;
//   flex-wrap: wrap;
// }

// .card_section_morePlaceBtn {
//   @include btn-reset;
//   background-color: $color-white-50;
//   color: $color-primary;
//   font-size: $font-size-xl;
//   font-weight: 700;
//   border: 3px solid $color-primary;
//   border-radius: 20px;
//   width: 61%;
//   display: block;
//   margin: 0 auto;

//   @include pad {
//     border-radius: 10px;
//   }

//   @include mobile {
//     font-size: $font-size-sm;
//     width: 85%;
//   }
// }
</style>
