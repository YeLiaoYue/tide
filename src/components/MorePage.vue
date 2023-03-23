<template>
  <div>
    <section class="maskList" :class="listData?.sleep_stories? 'special':''">
      <div class="header-box">
        <div class="iconfont" @click="changeShowList">&#xe601;</div>
        <span class="title">{{listData?.name?.["zh-Hans"]}}</span>
      </div>
      <h3 class="title">{{listData?.name?.["zh-Hans"]}}</h3>
      <div v-show="listData?.sub_title?.['zh-Hans']" class="msg">{{ listData?.sub_title?.["zh-Hans"] }}</div>
      <VTC :data="listData?.meditations" v-if="listData?.meditations" />
      <SVT v-else :data="listData?.sleep_stories" />
    </section>
  </div>
</template>

<script>
import VTC from "@/components/VTC.vue";
import SVT from "@/components/SVT.vue";
import store from "../store";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["listData"])
  },
  components: { VTC,SVT },
  methods: {
    changeShowList() {
      store.commit("changeShowList", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.maskList {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  z-index: 99999;
  .header-box {
    position: sticky;
    top: -1rem;
    display: flex;
    height: 40rem;
    margin: 10rem 0 0 25rem;
    align-items: center;
    background-color: #fff;
    .iconfont {
      width: 30rem;
      height: 30rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14rem;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.2);
    }
    .title {
      margin-left: 10rem;
      font-size: 16rem;
      color: #000;
    }
  }
  h3.title{
    margin: 10rem 0 10rem 25rem;
    font-size: 26rem;
    font-weight: bold;
  }
  .msg{
    margin-left: 25rem;
    font-size: 16px;
    color: #d8d8d8;
  }
}
.special {
  .header-box {
    position: sticky;
    top: 0;
    display: flex;
    height: 40rem;
    padding-left: 20rem;
    margin: 10rem 0 20rem 0;
    align-items: center;
    background-color: #fff;
    z-index: 9999;
    .iconfont {
      width: 30rem;
      height: 30rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.2);
    }
    .title {
      margin-left: 10rem;
      font-size: 16rem;
      color: #000;
    }
  }
}
</style>