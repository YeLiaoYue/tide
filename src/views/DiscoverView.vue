<template>
  <div class="discover-box">
    <nav class="nav-box">
      <router-link to="/discover" exact>
        探索
        <span :style="{backgroundColor: '#fa5858'}"></span>
      </router-link>
      <router-link to="/discover/meditation">
        冥想
        <span :style="{backgroundColor: '#60c8e0'}"></span>
      </router-link>
      <router-link to="/discover/sleep">
        睡眠
        <span :style="{backgroundColor: '#4050d8'}"></span>
      </router-link>
      <router-link to="/discover/scene">
        声音
        <span :style="{backgroundColor: '#48c879'}"></span>
      </router-link>
      <router-link to="/search" class="search iconfont">&#xe8d6;</router-link>
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
.discover-box{
  padding-top: 59rem;
}
.nav-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  padding: 10rem 25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22rem;
  background-color: #fff;
  z-index: 999;
  box-sizing: border-box;

  a {
    color: #e5e5e5;
    padding: 5px;
    position: relative;
  }
  a.router-link-active {
    color: black;
    span {
      position: absolute;
      bottom: -5rem;
      left: calc(50% - 8rem);
      width: 16rem;
      height: 3rem;
    }
  }
  .search {
    margin-left: 28rem;
    font-size: 18rem;
    font-weight: bold;
    color: #000;
  }
}
</style>
