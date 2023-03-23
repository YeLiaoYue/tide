<template>
  <div>
    <div class="special">
      <section class="img-SVT" >
        <div
          class="img-ct"
          v-for="item in data"
          :key="item?.id"
          :style="{backgroundColor:'rgba('+item?.primary_color+')'}"
          @click="changeMsg(item)"
        >
          <div class="img-box">
            <img
              v-view-lazy="item?.image+'?imageView2/1/w/300/h/300/q/99/format/webp'"
              class="auto-img"
            />
          </div>
          <section
            class="msg-box"
            :style="{boxShadow:'0 -5rem 20rem 20rem rgba('+item?.primary_color+')'}"
          >
            <h4>{{ item?.name?.['zh-Hans'] }}</h4>
            <div class="img-msg">{{ item?.resources_v2?.[0]?.duration }}分钟</div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import store from '../store';
export default {
  props: ["data"],
  methods:{
    changeMsg(item) {
      store.commit("changMsg", ['sleep_story',item]);
      store.commit("changeShowMsg", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.special {
  margin-top: 25rem;
  .img-SVT {
    display: flex;
    flex-wrap: wrap;
    padding: 0 25rem;
    justify-content: space-between;
    .img-ct {
      position: relative;
      height: 200rem;
      flex-shrink: 0;
      border-radius: 10rem;
      overflow: hidden;
      margin-bottom: 15rem;
      flex-shrink: 0;
      .img-box {
        width: 150rem;
        height: 150rem;
      }
      .msg-box {
        position: relative;
        z-index: 99;
        h4 {
          position: absolute;
          left: 10rem;
          bottom: -2rem;
          font-size: 16rem;
          color: #fff;
        }
        .img-msg {
          position: absolute;
          left: 10rem;
          bottom: -22rem;
          color: #c0b5b1;
        }
      }
    }
  }
}
</style>