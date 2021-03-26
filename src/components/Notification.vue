<template>
  <div class="flex justify-center items-center absolute left-0 right-0 w-full">
    <div
      v-if="notification"
      class="text-white px-6 w-96 py-4 mt-2 shadow-xl border-0 rounded relative mb-4 bg-red-500"
      :class="{ 'bg-green-500': notification == 1 }"
    >
      <span class="text-xl inline-block mr-5 align-middle">
				<i-fa class="text-white" icon="bell" />
      </span>
      <span class="inline-block align-middle mr-8">
        {{ notification_msg }}
      </span>
      <!-- <button
        class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
      >
        <span>×</span> -->
      <!-- </button> -->
    </div>
  </div>
</template>

<script>
export default {
  // watch: {
  //   notification(val) {
  //     if (val == 1)
  //       setTimeout(() => {
  //         this.$store.commit("CLOSE_NOTIFICATION");
  //       }, 3000);
  //   },
  // },
  computed: {
    notification() {
      return this.$store.getters.notification;
    },
    notification_msg() {
      return this.$store.getters.notification_msg;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>