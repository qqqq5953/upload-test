<template>
  <nav class="nav">
    <h1>
      <!--改成 :to="{ name: 'RouteTest', params: { id: 'routetest' } }"-->
      <router-link :to="{ name: 'HomeTest' }" class="logo">
        <img src="@/assets/images/logo.png" alt="logo" />
        <span class="websiteName">TaiFun旅遊網</span>
      </router-link>
    </h1>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/navbar.scss';
</style>
