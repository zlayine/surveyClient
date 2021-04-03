<template>
  <div class="nav bg-white">
    <div class="flex">
      <div class="nav_logo" @click="goToHome">
        <div class="logo">
          <img :src="logo" alt="1337 logo" />
        </div>
        <div class="text">
          <h1>PEER</h1>
          <span>SURVEY</span>
        </div>
      </div>
      <div
        class="hidden sm:flex ml-2 pl-5 border-l-2 items-center"
        v-if="$route.name == 'admin'"
      >
        <router-link class="mr-5 text-center" to="/admin/users">
          <div class="">Users</div>
          <div
            class="w-16 h-1 rounded-t-lg mt-1 mx-auto bg-white transition-all"
            :class="{ 'bg-indigo-500': $route.params.path == 'users' }"
          ></div>
        </router-link>
        <router-link class="mr-5 text-center" to="/admin/surveys">
          <div class="">Surveys</div>
          <div
            class="w-16 h-1 rounded-t-lg mt-1 mx-auto bg-white transition-all"
            :class="{ 'bg-indigo-500': $route.params.path == 'surveys' }"
          ></div>
        </router-link>
        <router-link class="mr-5 text-center" to="/admin/permissions">
          <div class="">Permisions</div>
          <div
            class="w-16 h-1 rounded-t-lg mt-1 mx-auto bg-white transition-all"
            :class="{ 'bg-indigo-500': $route.params.path == 'permissions' }"
          ></div>
        </router-link>
      </div>
    </div>
    <div class="nav_actions">
      <div class="action flex flex-row" v-if="user">
        <!-- <router-link
          v-if="$route.name != 'admin'"
          class="link border-white flex my-auto mr-2 w-10 h-10 sm:h-auto sm:w-auto sm:p-2 rounded-full sm:rounded-xl text-white bg-black shadow-lg hover:shadow-none transition-all"
          to="/admin"
        >
          <i-fa class="text-white m-auto sm:mr-2" icon="user-shield" />
          <span class="hidden sm:block"> Admin</span>
        </router-link> -->
        <div class="w-14 sm:w-16 rounded-full shadow-md overflow-hidden">
          <img
            class="w-full object-fill"
            :src="user.image_url"
            alt="avatar-img"
          />
        </div>
        <div
          class="ml-2 text-2xl sm:text-4xl my-auto cursor-pointer text-gray-800 hover:text-gray-600 transition-all"
          @click="logout"
        >
          <i-fa icon="sign-out-alt" />
        </div>
      </div>
      <div v-else-if="$route.name != 'auth'">
        <router-link class="link" to="/auth">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/1337.svg";

export default {
  data() {
    return {
      logo: logo,
      dialog: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    logout() {
      this.$store.commit("LOGOUT");
      this.$store.commit("SET_NOTIFICATION", { msg: "Logged out!", error: 0 });
      this.$router.push("/auth");
    },
    goToHome() {
      this.$router.push({ name: "home", query: { filter: "new", page: 1 } });
    },
  },
};
</script>

<style lang="scss" scoped>
*::selection {
  outline: none;
}
.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  height: 80px;
  box-shadow: 0 0 5px #02020270;
  outline: none;

  .nav_logo {
    margin-left: 25px;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    cursor: pointer;

    .logo {
      // height: 80%;
      width: 100px;
      margin-right: 15px;
    }
    .text {
      display: flex;
      color: #000;
      margin-top: 30px;

      h1 {
        font-size: 17px;
        font-weight: 500;
        margin-right: 5px;

        span {
          margin-top: 1px;
        }
      }
    }
  }

  .nav_items {
    .link {
      text-decoration: none;
      margin-left: 40px;
      font-size: 22px;
      line-height: 25px;
      transition: 200ms all;
    }
  }

  .nav_actions {
    display: flex;
    // padding: 0 10px;

    .action {
      display: flex;
      flex-direction: row;

      .avatar {
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .link {
      font-weight: 600;
      text-decoration: none;
      // margin-right: 20px;
      font-size: 19px;
      cursor: pointer;
    }
  }
}

@media (max-width: 768px) {
  .nav {
    .nav_logo {
      margin-left: 10px;

      .logo {
        width: 70px;
        img {
          width: 70px;
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        margin-top: 5px;
      }
    }
  }
}
</style>