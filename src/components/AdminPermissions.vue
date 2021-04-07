<template>
  <div class="text-gray-900">
    <div class="p-4 flex">
      <h1 class="text-3xl">Permissions</h1>
    </div>
    <div class="px-3 py-4 flex justify-center">
      <table class="w-full text-md bg-white shadow-md rounded mb-4">
        <tbody>
          <tr class="border-b">
            <th class="text-left p-3 px-5"></th>
            <th class="text-left p-3 px-5">Username</th>
            <th class="text-left p-3 px-5">Description</th>
            <th class="text-left p-3 px-5">Created At</th>
            <th></th>
          </tr>
          <tr
            class="border-b hover:bg-orange-100 bg-gray-100"
            v-for="perm in perms"
            :key="perm._id"
          >
            <td class="p-3 px-5">
              <img
                class="w-12 h-12 overflow-hidden rounded-full"
                :src="perm.user.image_url"
                alt="user img"
              />
            </td>
            <td class="p-3 px-5">{{ perm.user.username }}</td>
            <td class="p-3 px-5">{{ perm.description }}</td>
            <td class="p-3 px-5">{{ formatDate(perm.createdAt) }}</td>
            <td class="p-3 px-5">
              <div class="flex justify-end">
                <button
                  type="button"
                  @click="approvePerm(perm._id)"
                  class="text-sm mr-2 bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-all"
                >
                  Approve
                </button>
                <button
                  type="button"
                  @click="selected = perm._id"
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
        @delete="deletePerm"
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
    if (!this.perms.length) this.fetchPerms();
  },
  methods: {
    formatDate(val) {
      return moment(String(val)).format("DD/MM/YYYY");
    },
    fetchPerms() {
      this.$store.dispatch("getPermissions", {
        page: this.page,
        campus: this.campus,
        role: this.role,
      });
    },
    changePage(page) {
      this.page = page;
      this.$router.replace({ query: { page: this.page } });
      window.scrollTo(0, 0);
      this.fetchPerms();
    },
    async deletePerm() {
      await this.$store.dispatch("adminRemovePermission", this.selected);
      this.selected = null;
    },
    async approvePerm(id) {
      await this.$store.dispatch("adminApprovePermission", id);
    },
  },
  computed: {
    perms() {
      return this.$store.getters.adminPerms;
    },
    pages() {
      return this.$store.getters.adminTotalPerms;
    },
  },
  components: {
    ConfirmDialog,
  },
};
</script>

<style>
</style>