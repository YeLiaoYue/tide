<template>
    <div>
        <TVT :data="data?.scenes" />
    </div>
</template>

<script>
import TVT from "@/components/TVT.vue";
import { mapState } from "vuex";

export default {
  computed: { ...mapState(["data"]) },
  components: { TVT }
};
</script>

<style lang="scss" scoped>

</style>