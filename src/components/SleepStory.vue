<template>
  <div class="sleep-story-box">
    <SVT :data="data?.sleep_stories" />
  </div>
</template>
  
<script>
import SVT from "@/components/SVT.vue";
import { mapState } from "vuex";

export default {
  computed: { ...mapState(["data"]) },
  components: { SVT },
};
</script>
  
<style lang="scss" scoped>
</style>