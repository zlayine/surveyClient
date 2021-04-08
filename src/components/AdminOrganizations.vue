<template>
  <div class="text-gray-900">
    <div class="p-4 flex">
      <h1 class="text-3xl">Organizations</h1>
    </div>
    <div class="px-3 py-4 overflow-x-auto">
      <table class="w-full text-md bg-white shadow-md rounded mb-4">
        <tbody>
          <tr class="border-b">
            <th class="text-left p-3 px-5"></th>
            <th class="text-left p-3 px-5">Name</th>
            <th class="text-left p-3 px-5">User</th>
            <th class="text-left p-3 px-5">Created At</th>
            <th></th>
          </tr>
          <tr
            class="border-b hover:bg-orange-100 bg-gray-100"
            v-for="org in orgs"
            :key="org._id"
          >
            <td class="p-3 px-5">
              <img
                class="w-12 h-12 overflow-hidden rounded-full"
                :src="url_host + org.logo_url"
                alt="user img"
              />
            </td>
            <td class="p-3 px-5">{{ org.name }}</td>
            <td class="p-3 px-5">{{ org.user.username }}</td>
            <td class="p-3 px-5">{{ formatDate(org.createdAt) }}</td>
            <td class="p-3 px-5">
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="selected = org._id"
                  class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-all"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="py-2 mt-10" v-if="pages > 1">
      <nav class="block">
        <ul class="flex pl-0 rounded list-none justify-center flex-wrap">
          <div
            v-show="page > 1"
            @click="changePage(page - 1)"
            class="first:ml-0 text-lg font-semibold flex w-10 h-10 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-indigo-500 text-white cursor-pointer transition-all bg-indigo-500 shadow-md hover:shadow-none"
          >
            <i-fa class="" icon="chevron-left" />
          </div>
          <li v-for="p in pages" :key="p">
            <div
              @click="changePage(p)"
              v-if="page - p < 3 && p - page < 3"
              class="first:ml-0 text-lg font-semibold flex w-10 h-10 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-indigo-500 bg-white text-white cursor-pointer transition-all shadow-md hover:shadow-none"
              :class="{
                'bg-indigo-500': page == p,
                'text-indigo-500': page != p,
              }"
            >
              {{ p }}
            </div>
          </li>
          <div
            v-show="page < pages"
            @click="changePage(page + 1)"
            class="first:ml-0 text-lg font-semibold flex w-10 h-10 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-indigo-500 text-white cursor-pointer transition-all bg-indigo-500 shadow-md hover:shadow-none"
          >
            <i-fa class="" icon="chevron-right" />
          </div>
        </ul>
      </nav>
    </div>
    <transition name="fade">
      <confirm-dialog
        v-show="selected != null"
        @delete="deleteOrg"
        @cancel="selected = null"
        title="Delete Organization"
        message="Are you sure you want to delete this organization ?"
      />
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import ConfirmDialog from "./ConfirmDialog.vue";

export default {
  data() {
    return {
      page: 1,
      url_host: import.meta.env.VITE_API_HOST,
      selected: null,
    };
  },
  created() {
    let page = this.$route.query.page;
    if (page) this.page = page;

    this.$router.replace({
      query: { page: this.page },
    });
    if (!this.orgs.length) this.fetchOrgs();
  },
  methods: {
    formatDate(val) {
      return moment(String(val)).format("DD/MM/YYYY");
    },
    fetchOrgs() {
      this.$store.dispatch("getAdminOrganizations", {
        page: this.page,
        campus: this.campus,
        role: this.role,
      });
    },
    changePage(page) {
      this.page = page;
      this.$router.replace({ query: { page: this.page } });
      window.scrollTo(0, 0);
      this.fetchOrgs();
    },
    async deleteOrg() {
      await this.$store.dispatch("adminDeleteOrganization", this.selected);
      this.selected = null;
    },
  },
  computed: {
    orgs() {
      return this.$store.getters.adminOrgs;
    },
    pages() {
      return this.$store.getters.adminTotalOrgs;
    },
  },
  components: {
    ConfirmDialog,
  },
};
</script>

<style>
</style>