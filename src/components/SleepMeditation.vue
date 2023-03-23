<template>
    <div>
        <VTC :data="data?.albums" />
    </div>
</template>

<script>
import VTC from "@/components/VTC.vue";
import { mapState } from "vuex";

export default {
  computed: { ...mapState(["data"]) },
  components: { VTC },
}
</script>

<style lang="scss" scoped>

</style>