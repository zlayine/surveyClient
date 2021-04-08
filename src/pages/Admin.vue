<template>
  <div class="container mx-auto pt-5 px-3 sm:px-10 mb-32">
    <div class="justify-between overflow-x-auto flex sm:hidden">
      <router-link class="mr-5 text-center text-smr" to="/admin/users">
        <div class="">Users</div>
        <div
          class="w-16 h-1 rounded-t-lg mt-1 mx-auto bg-gray-100 transition-all"
          :class="{ 'bg-indigo-500': $route.params.path == 'users' }"
        ></div>
      </router-link>
      <router-link class="mr-5 text-center text-sm" to="/admin/surveys">
        <div class="">Surveys</div>
        <div
          class="w-16 h-1 rounded-t-lg mt-1 mx-auto bg-gray-100 transition-all"
          :class="{ 'bg-indigo-500': $route.params.path == 'surveys' }"
        ></div>
      </router-link>
      <router-link class="mr-5 text-center text-sm" to="/admin/permissions">
        <div class="">Permisions</div>
        <div
          class="w-16 h-1 rounded-t-lg mt-1 mx-auto bg-gray-100 transition-all"
          :class="{ 'bg-indigo-500': $route.params.path == 'permissions' }"
        ></div>
      </router-link>
      <router-link class="mr-5 text-center text-sm" to="/admin/organizations">
        <div class="">Organizations</div>
        <div
          class="w-16 h-1 rounded-t-lg mt-1 mx-auto bg-gray-100 transition-all"
          :class="{ 'bg-indigo-500': $route.params.path == 'organizations' }"
        ></div>
      </router-link>
    </div>
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