<template>
  <div class="card">
    <div class="card_image">
      <img :src="item.Picture.PictureUrl1" />
      <p
        class="card_description"
        :class="{ 'd-none': !item.DescriptionDetail }"
      >
        {{ item.DescriptionDetail }}
      </p>
      <p class="card_description" :class="{ 'd-none': item.DescriptionDetail }">
        {{ item.Description }}
      </p>
    </div>
    <div class="card_body">
      <div class="card_header">
        <div class="card_header_location">
          <i class="fas fa-map-marker-alt"></i>
          <span v-if="item.City">{{ item.City }}</span>
          <span v-else-if="item.Address">{{
            item.Address[2] === '縣' || item.Address[2] === '市'
              ? item.Address.slice(0, 3)
              : item.Address.slice(0, 2)
          }}</span>
          <span v-else>無</span>
        </div>
        <h4 class="card_header_title">
          {{
            item.ScenicSpotName
              ? item.ScenicSpotName
              : item.RestaurantName
              ? item.RestaurantName
              : item.HotelName
              ? item.HotelName
              : item.ActivityName
          }}
        </h4>
      </div>
      <slot name="card_phone" :item="item"></slot>
      <slot name="card_address" :item="item"></slot>
      <div class="card_openTime">
        <h5>開放時間：</h5>
        <div class="card_openTime_details">{{ item.OpenTime || '無' }}</div>
      </div>
    </div>
    <!-- <slot name="card_moreInfoBtn" @click="toContentPage"></slot> -->
    <router-link
      :to="{ name: 'CardDetail' }"
      @click="toContentPage"
      v-if="txt !== 'cardDetail'"
    >
      <button type="button" class="card_moreInfoBtn">查看詳情</button>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['item', 'txt', 'name'],
  methods: {
    toContentPage() {
      console.log('card 發送');

      // 傳送到 CardDetails.vue (用 localStorage)
      const cardItem = JSON.stringify({ ...this.item });
      const moreInfoBtnDnone = 'cardDetail';
      localStorage.setItem('passToCardDetails', cardItem);

      // 讓 CardDetail 中的卡片不要有"查看更多"按鈕
      localStorage.setItem('moreInfoBtnDnone', moreInfoBtnDnone);

      // 換頁時回到頁面最上方
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/scss/card.scss';
// .d-none {
//   display: none !important;
// }
// .card {
//   box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
//   border-radius: 14px;
//   // width: 366px;
//   width: 29.5%;
//   margin-bottom: 70px;
//   display: flex;
//   flex-direction: column;

//   &:not(&:nth-of-type(3n)) {
//     margin-right: 70px;
//   }

//   &:hover .card_image > .card_description {
//     border-radius: 14px 14px 0 0;
//     opacity: 1;
//     background-color: rgba(0, 0, 0, 0.5);
//     transform: scale(1);
//   }

//   @include pad {
//     width: 45%;
//   }

//   @include mobile {
//     margin-bottom: 34px;
//     width: 140px;
//     width: 100%;
//   }

//   .card_image {
//     height: 251px;
//     border-radius: 14px 14px 0 0;
//     background: linear-gradient(
//       45deg,
//       rgba(47, 122, 140, 0.85),
//       rgba(47, 201, 255, 0.7)
//     );
//     position: relative;

//     @include pad {
//       height: 190px;
//     }

//     @include mobile {
//       height: 170px;
//     }

//     //&::after {
//     // content: "圖片載入中...";
//     // position: absolute;
//     // top: 0;
//     // bottom: 0;
//     // left: 0;
//     // right: 0;
//     // display: flex;
//     // justify-content: center;
//     // align-items: center;
//     // font-size: 28px;
//     // font-weight: bold;
//     // color: #fff;

//     // @include mobile {
//     // font-size: $font-size-md;
//     // }
//     // }

//     img {
//       border-radius: 14px 14px 0 0;
//       object-fit: cover;
//       width: 100%;
//       height: 251px;
//       display: block;
//       position: relative;
//       z-index: 2;

//       @include pad {
//         height: 190px;
//       }

//       @include mobile {
//         height: 170px;
//       }

//       &::after {
//         content: 'Sorry! 無法顯示圖片';
//         position: absolute;
//         left: 0;
//         right: 0;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 95%;
//         font-size: 28px;
//         font-weight: bold;

//         @include pad {
//           font-size: $font-size-md;
//         }
//       }
//     }

//     .card_description {
//       position: absolute;
//       padding: 16px 30px;
//       top: 0;
//       bottom: 0;
//       z-index: 3;
//       color: #efefef;
//       font-size: $font-size-lg;
//       line-height: 1.9;
//       -webkit-line-clamp: 6;
//       -webkit-box-orient: vertical;
//       display: -webkit-box;
//       overflow: hidden;
//       opacity: 0;
//       transform: scale(0);
//       transition: 0.4s;

//       @include pad {
//         font-size: $font-size-sm;
//         line-height: 2;
//       }

//       @include mobile {
//         -webkit-line-clamp: 5;
//         line-height: 2.15;
//       }
//     }
//   }

//   .card_body {
//     padding: 18px 26px 32px;
//     color: $color-dark-50;
//     line-height: 1.2;
//   }

//   .card_header {
//     font-weight: 700;
//     font-size: $font-size-md;

//     @include mobile {
//       font-size: $font-size-xs;
//     }
//   }

//   .card_header_location .fa-map-marker-alt {
//     color: $color-danger;
//     margin-right: 12px;
//   }

//   .card_header_title {
//     margin-top: 15px;

//     @include mobile {
//       margin-top: 7px;
//     }
//   }

//   .card_openTime {
//     h5 {
//       margin-top: 13px;
//       margin-bottom: 7px;

//       @include mobile {
//         margin-top: 5px;
//       }
//     }

//     .card_openTime_details {
//       line-height: 1.5;
//       text-overflow: ellipsis;
//       overflow: hidden;
//       white-space: nowrap;
//     }

//     @include mobile {
//       font-size: $font-size-xxs;
//     }
//   }

//   .card_moreInfoBtn {
//     @include btn-reset;
//     @include btn-rectangle;
//     @include btn-hover;
//     font-size: $font-size-lg;
//     display: block;
//     margin: auto auto 27px;
//     width: 59%;

//     @include pad {
//       border-radius: 10px;
//     }

//     @include mobile {
//       font-size: $font-size-xs;
//       width: 85%;
//     }
//   }
// }
</style>
