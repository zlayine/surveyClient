<template>
  <div class="container mx-auto pt-5 px-3 sm:px-10 mb-32">
    <!-- <transition name="fade"> -->
    <admin-users v-if="page == 'users'" />
    <admin-surveys v-else-if="page == 'surveys'" />
    <admin-permissions v-else-if="page == 'permissions'" />
    <admin-organizations v-else-if="page == 'organizations'" />
    <!-- </transition> -->
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
  created() {
    // if (this.user.role != "admin") this.$router.push("/");
  },
  mounted() {},
  computed: {
    page() {
      if (!this.$route.params.path) return "users";
      return this.$route.params.path;
    },
    user() {
      return this.$store.getters.currentUser;
    },
  },
};
</script>

<style>
</style>