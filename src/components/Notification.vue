<template>
  <div
    class="flex justify-center z-50 items-center fixed left-0 right-0 w-full"
    v-if="notification"
  >
    <div
      class="text-white px-6 w-96 py-4 mt-2 shadow-xl border-0 rounded relative flex mb-4 bg-red-500"
      :class="{ 'bg-green-500': notification == 1 }"
    >
      <span class="text-xl mr-5 align-middle my-auto">
        <i-fa class="text-white" icon="bell" />
      </span>
      <span class="align-middle break-words">
        {{ notification_msg }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
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