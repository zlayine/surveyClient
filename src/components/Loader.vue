<template>
  <div class="loader" v-if="loading">
    <div class="holder">
      <div class="percent" v-if="uploadPercent != null">
        {{ uploadPercent }}%
      </div>
			<i-fa class="text-indigo-500 " icon="circle-notch" spin />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    uploadPercent() {
      return this.$store.getters.uploadPercent;
    },
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 100;
  background-color: #ffffff93;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .holder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;

    .percent {
      position: absolute;
      font-weight: 500;
    }

    svg {
      font-size: 60px !important;
    }
  }
}
</style>