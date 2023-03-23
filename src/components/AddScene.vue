<template>
  <div>
    <div class="iconfont" @click="$router.push('/')">&#xe601;</div>
    <h1>添加声音</h1>
    <p>和大自然一起平静</p>
    <AddScenePage />
  </div>
</template>

<script>
import AddScenePage from "@/components/AddScenePage.vue";

export default {
  components: { AddScenePage }
};
</script>

<style lang="scss" scoped>
.iconfont{
    padding: 10rem 0 20rem 25rem;
    color: #000000;
    font-weight: bold;
    box-sizing: border-box;
}
h1{
    padding-left: 25rem;
    font-size: 34rem;
    font-weight: bold;
    box-sizing: border-box;
}
p{
    padding-left: 25rem;
    margin: 10rem 0;
    font-size: 18rem;
    box-sizing: border-box;
    color: rgba(0,0,0,.3);
}
</style>