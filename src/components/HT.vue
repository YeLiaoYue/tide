<template>
  <div class="HT-box" :class="[$route.path == '/' ? 'home' : 'other']">
    <div class="special" v-if="item?.sleep_stories">
      <section class="title" @click="setListData(item)">
        <h3>{{ item?.name?.['zh-Hans'] }}</h3>
        <div class="more">更多</div>
      </section>
      <section class="msg">{{ item?.sub_title?.['zh-Hans'] }}</section>
      <section class="img-HT">
        <div
          class="img-ct"
          v-for="item in item?.sleep_stories"
          @click="changeMsg(item)"
          :key="item?.id"
          :style="{backgroundColor:'rgba('+item?.primary_color+')'}"
        >
          <div class="img-box">
            <img
              v-view-lazy="item?.image+'?imageView2/1/w/200/h/200/q/99/format/webp'"
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
    <div class="common" v-else>
      <section class="title" @click="setListData(item)">
        <h3>{{ item?.name?.['zh-Hans'] }}</h3>
        <div class="more">更多</div>
      </section>
      <section class="msg">{{ item?.sub_title?.['zh-Hans'] }}</section>
      <section class="img-HT">
        <div
          class="img-ct"
          v-for="item in item?.meditations "
          :key="item?.id"
          @click="changeMsg(item)"
        >
          <div class="img-box">
            <img
              v-view-lazy="item?.image+'?imageView2/1/w/300/h/300/q/99/format/webp'"
              class="auto-img"
            />
          </div>
          <section class="msg-box">
            <h4>{{ item?.name?.['zh-Hans'] }}</h4>
            <div class="img-msg" v-if="item?.sections.length >= 4">{{ item?.sections.length }}章 · 系列</div>
            <div class="img-msg" v-else>{{ item?.duration_description?.['zh-Hans'] }} · 时刻</div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import store from "../store";
export default {
  props: ["item"],
  methods: {
    setListData(item) {
      store.commit("changeShowList", true);
      store.commit("changeListData", item);
    },
    changeMsg(data) {
      store.commit("changMsg", [this.item.type,data]);
      store.commit("changeShowMsg", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.HT-box {
  margin-bottom: 30rem;
  .title {
    padding: 3rem 25rem;
    display: flex;
    justify-content: space-between;
    h3 {
      font-size: 20rem;
    }
    .more {
      align-self: end;
      font-size: 14rem;
    }
  }
  .msg {
    padding: 0 25rem;
  }
  .img-HT {
    margin-top: 15rem;
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    padding: 0 15rem 0 25rem;

    &::-webkit-scrollbar {
      display: none;
    }
    .img-ct {
      margin-right: 10rem;
      .img-box {
        width: 150rem;
        height: 150rem;
        overflow: hidden;
      }
      .msg-box {
        padding-top: 10rem;
        h4 {
          font-size: 15rem;
          margin-bottom: 3rem;
        }
      }
    }
  }
}
.common {
  .img-box {
    border-radius: 8rem;
  }
}
.special {
  .img-HT {
    .img-ct {
      position: relative;
      height: 175rem;
      flex-shrink: 0;
      border-radius: 10rem;
      overflow: hidden;
      .img-box {
        width: 130rem;
        height: 130rem;
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
.home {
  h3,
  h4 {
    color: #eee;
  }
  .msg,
  .more,
  .img-msg {
    color: #c0b5b1;
  }
}
.other {
  h3,
  h4 {
    color: #000;
  }
  .msg,
  .img-msg {
    color: #dddddd;
  }
  .more {
    color: #fa5959;
  }
}
</style>