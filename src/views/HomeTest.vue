<template>
  <div class="wrap">
    <!-- <Pagination
      v-if="searchData"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="onPageChange"
    ></Pagination> -->
    <!-- header原本是在app.vue -->
    <!-- <HeaderSection></HeaderSection> -->
    <DefaultResult></DefaultResult>
    <!-- 用動態路由判斷 -->
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     // 接收篩選或搜尋資料
  //     searchData: null,
  //     searchTypeData: '',
  //     // 分頁資訊
  //     currentPage: 1,
  //     cardPerPage: 9,
  //     totalPages: ''
  //   };
  // },
  // methods: {
  //   setPageButton() {
  //     this.totalPages = Math.ceil(this.searchData.length / this.cardPerPage);
  //   },
  //   setPageData(data) {
  //     const page = this.currentPage;
  //     const perPage = this.cardPerPage;
  //     const start = page * perPage - perPage;
  //     const end = page * perPage;
  //     return data.slice(start, end);
  //   },
  //   onPageChange(page) {
  //     console.log('pageChange', page);
  //     this.currentPage = page;
  //   }
  // },
  // watch: {
  //   currentPage() {
  //     // 當所在頁面變動時，重新傳送資料給 PopularSection.vue
  //     console.log('currentPage 發送');
  //     this.emitter.emit('paginatedData', {
  //       paginatedData: this.setPageData(this.searchData),
  //       searchTypeData: this.searchTypeData
  //     });
  //   },
  //   searchData() {
  //     // 重設起始頁面
  //     this.currentPage = 1;
  //     // 設置分頁按鈕
  //     this.setPageButton();
  //     // 當篩選或搜尋資料完成時，傳送資料給 PopularSection.vue
  //     console.log('searchData 發送');
  //     console.log('searchTypeData 發送', this.searchTypeData);
  //     this.emitter.emit('paginatedData', {
  //       paginatedData: this.setPageData(this.searchData),
  //       searchTypeData: this.searchTypeData
  //     });
  //   }
  // },
  // created() {
  //   // 接收篩選資料
  //   this.emitter.on('filteredData', (data) => {
  //     this.searchData = data.filteredData;
  //     this.searchTypeData = data.filteredTypeData;
  //     console.log('emit on searchData', this.searchData);
  //     console.log('emit on searchTypeData', this.searchTypeData);
  //   });
  //   // 接收搜尋資料
  //   this.emitter.on('searchData', (data) => {
  //     this.searchData = data.searchData;
  //     this.searchTypeData = data.title;
  //     console.log('emit on searchData 的 searchData', this.searchData);
  //     console.log('emit on searchData 的 searchTypeData', this.searchTypeData);
  //   });
  // }
};
</script>

<style lang="scss" scoped>
.wrap {
  max-width: 1440px;
  margin: 0 auto;
  height: 100vh;
}

.disabled {
  pointer-events: none;
  cursor: none;
}

.d-none {
  display: none !important;
}

.card_section_title_icon {
  margin-left: 23px;
  vertical-align: bottom;
}
</style>
