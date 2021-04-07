<template>
  <div class="text-gray-900">
    <div class="p-4 flex justify-between">
      <h1 class="text-3xl">Users</h1>
      <div class="flex">
        <select
          v-model="role"
          @change="fetchUsers"
          class="block mt-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="0">Filter by role</option>
          <option value="user">User</option>
          <option value="client">Client</option>
        </select>
        <select
          v-model="campus"
          @change="fetchUsers"
          class="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="0">Filter by campus</option>
          <option>Khouribga</option>
          <option>Benguerir</option>
        </select>
      </div>
    </div>
    <div class="px-3 py-4 flex justify-center">
      <table class="w-full text-md bg-white shadow-md rounded mb-4">
        <tbody>
          <tr class="border-b">
            <th class="text-left p-3 px-5"></th>
            <th class="text-left p-3 px-5">Username</th>
            <th class="text-left p-3 px-5">Role</th>
            <th class="text-left p-3 px-5">Campus</th>
            <th class="text-left p-3 px-5">Join date</th>
            <th></th>
          </tr>
          <tr
            class="border-b hover:bg-orange-100 bg-gray-100"
            v-for="user in users"
            :key="user._id"
          >
            <td class="p-3 px-5">
              <img
                class="w-12 h-12 overflow-hidden rounded-full"
                :src="user.image_url"
                alt="user img"
              />
            </td>
            <td class="p-3 px-5">{{ user.username }}</td>
            <td class="p-3 px-5">{{ user.role }}</td>
            <td class="p-3 px-5">{{ user.campus }}</td>
            <td class="p-3 px-5">{{ formatDate(user.createdAt) }}</td>
            <td class="p-3 px-5">
              <div class="flex justify-end">
                <button
                  type="button"
                  v-if="user.role != 'admin'"
                  @click="updateRole(user._id)"
                  class="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline transition-all"
                >
                  Change to {{ user.role == "user" ? "client" : "user" }}
                </button>
                <button
                  type="button"
                  @click="selected = user._id"
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
        @delete="deleteUser"
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
      campus: 0,
      role: 0,
      selected: null,
      url_host: import.meta.env.VITE_API_HOST,
    };
  },
  created() {
    let page = this.$route.query.page;
    if (page) this.page = page;

    this.$router.replace({
      query: { page: this.page },
    });
    if (!this.users.length) this.fetchUsers();
  },
  methods: {
    formatDate(val) {
      return moment(String(val)).format("DD/MM/YYYY");
    },
    fetchUsers() {
      this.$store.dispatch("getAdminUsers", {
        page: this.page,
        campus: this.campus,
        role: this.role,
      });
    },
    changePage(page) {
      this.page = page;
      this.$router.replace({ query: { page: this.page } });
      window.scrollTo(0, 0);
      this.fetchUsers();
    },
    async deleteUser() {
			await this.$store.dispatch("adminDeleteUser", this.selected);
      this.selected = null;
    },
    async updateRole(id) {
      await this.$store.dispatch("updateUserRole", id);
    },
  },
  computed: {
    users() {
      return this.$store.getters.adminUsers;
    },
    pages() {
      return this.$store.getters.adminTotalUsers;
    },
  },
  components: {
    ConfirmDialog,
  },
};
</script>

<style>
</style>