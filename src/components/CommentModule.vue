<template>
  <div class="comment-box">
    <section class="user">
      <div class="img-box">
        <img class="auto-img" v-view-lazy="item?.avatar?.['zh-Hans']+'?imageView2/1/w/300/h/300/q/99/format/webp'" alt />
      </div>
      <div class="name">{{ item?.author_nickname?.['zh-Hans'] }}</div>
    </section>
    <p class="comment">{{ item?.recommend_content?.['zh-Hans'] }}</p>
    <section class="recommend">
      <div class="img-box">
        <img class="auto-img" v-view-lazy="item?.[item.type]?.image+'?imageView2/1/w/300/h/300/q/99/format/webp'" />
      </div>
      <div class="msg">
        <h6>{{ item?.[item.type]?.name?.['zh-Hans'] || item.article.tags_v2?.[0]?.name?.["zh-Hans"] }}</h6>
        <h3 :style="{color:type?.[item?.type]?.[1]}">{{ type?.[item?.type]?.[0] }}</h3>
      </div>
      <div class="play-button iconfont">&#xe66e;</div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: {
        scene: ["声音", "#59cd85"],
        meditation: ["冥想", "#6ccce2"],
        article:["冥想", "#6ccce2"]
      }
    };
  },
  props: ["item"]
};
</script>

<style lang="scss" scoped>
.comment-box {
  margin: 0 25rem 20rem;
  padding: 20rem;
  box-sizing: border-box;
  color: #8b8b8b;
  border: 1rem solid #e3e3e3;
  border-radius: 20rem;
  h2{
    color: #000;
    font-weight: bold;
  }
  .user {
    display: flex;
    .img-box {
      width: 15rem;
      height: 15rem;
      margin-right: 7rem;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .comment {
    margin: 10rem 0 15rem;
    font-size: 15rem;
    font-weight: bold;
    color: #000;
  }
  .recommend {
    display: flex;
    border-top: 1rem solid #e3e3e3;
    align-items: center;
    padding-top: 10rem;
    .img-box {
      width: 30rem;
      height: 30rem;
      margin-right: 10rem;
      border-radius: 5rem;
      overflow: hidden;
    }
    .play-button{
      margin-left: auto;
      width: 25rem;
      height: 25rem;
      padding-left: 2rem;
      border-radius: 50%;
      background-color: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12rem;
      color: #000;
      box-sizing: border-box;
    }
  }
}
</style>