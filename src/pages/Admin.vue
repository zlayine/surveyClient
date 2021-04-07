<template>
  <div class="container mx-auto pt-5 px-3 sm:px-10 mb-32">
    <transition name="fade">
      <admin-users v-if="page == 'users'" />
    </transition>
    <transition name="fade">
      <admin-surveys v-if="page == 'surveys'" />
    </transition>
    <transition name="fade">
      <admin-permissions v-if="page == 'permissions'" />
    </transition>
    <transition name="fade">
      <admin-organizations v-if="page == 'organizations'" />
    </transition>
  </div>
</template>

<script>
import AdminPermissions from "@/components/AdminPermissions.vue";
import AdminSurveys from "@/components/AdminSurveys.vue";
import AdminUsers from "@/components/AdminUsers.vue";
import AdminOrganizations from "@/components/AdminOrganizations.vue";
export default {
  components: {
    AdminUsers,
    AdminSurveys,
    AdminPermissions,
    AdminOrganizations,
  },
  data() {
    return {};
  },
  mounted() {
    if (this.user && this.user.role != "admin") {
      this.$router.push({ name: "home" });
    }
  },
  computed: {
    page() {
      if (!this.$route.params.path) return "users";
      return this.$route.params.path;
    },
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style>
</style>