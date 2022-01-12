<template>
  <HeaderSectionTest></HeaderSectionTest>
  <h1>404</h1>
  <p>Oops! Page not found!</p>
  <div class="back-to-home">
    <router-link :to="{ name: 'HomeTest' }"> Back to home page </router-link>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  font-size: 80px;
  text-align: center;
  color: $color-primary;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 50px;
}

p {
  font-size: $font-size-xxl;
  text-align: center;
  color: $color-primary;
}

.back-to-home {
  text-align: center;
  margin-top: 50px;

  a {
    display: inline-block;
    color: $color-primary;
    font-size: $font-size-xxl;
    background-color: $color-primary;
    border-radius: 100px;
    color: white;
    padding: 20px 40px;

    @include btn-hover;
  }
}
</style>
