<template>
  <div class="container mx-auto pt-5 px-3 sm:px-10 mb-32">
    <transition name="fade">
      <admin-users v-if="page == 'users'" />
      <admin-surveys v-else-if="page == 'surveys'" />
      <admin-permissions v-else-if="page == 'permissions'" />
    </transition>
  </div>
</template>

<script>
import AdminPermissions from "@/components/AdminPermissions.vue";
import AdminSurveys from "@/components/AdminSurveys.vue";
import AdminUsers from "@/components/AdminUsers.vue";
export default {
  components: { AdminUsers, AdminSurveys, AdminPermissions },
  data() {
    return {};
  },
  created() {},
  computed: {
    page() {
      if (!this.$route.params.path) return "users";
      return this.$route.params.path;
    },
  },
};
</script>

<style>
</style>