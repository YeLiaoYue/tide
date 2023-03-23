<template>
  <div class="sleep-box">
    <nav class="nav-box">
      <router-link to="/discover/sleep" exact>
        <span class="iconfont">&#xe764;</span>睡眠故事
      </router-link>
      <router-link to="/discover/sleep/sleepMeditation">助眠冥想</router-link>
      <router-link to="/discover/sleep/sleepScene">助眠声音</router-link>
    </nav>
    <transition>
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.sleep-box {
  width: 100vw;
}
.nav-box {
  width: 100vw;
  height: 30rem;
  display: flex;
  padding-left: 15rem;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  a {
    font-size: 16px;
    display: flex;
    justify-content: center;
    line-height: 30px;
    padding: 0rem 10rem;
    font-weight: normal;
    color: #999;
    flex-shrink: 0;
    .iconfont {
      color: #727ee2;
      font-size: 16rem;
      margin-right: 5rem;
    }
  }
  a.router-link-exact-active {
    color: #fff;
    border-radius: 20rem;
    background-color: #727ee2;
    .iconfont {
      color: #ffffff;
    }
  }
}
</style>