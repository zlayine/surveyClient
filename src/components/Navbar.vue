<template>
  <div class="nav bg-white">
    <div class="nav_logo" @click="goToHome">
      <div class="logo">
        <img :src="logo" alt="1337 logo" />
      </div>
      <!-- <div class="text">
        <h1>RATE MY</h1>
        <span>PLATE</span>
      </div> -->
    </div>
    <!-- <div
      class="nav_items flex flex-row justify-between"
      v-if="$route.name != 'auth'"
    >
      <router-link class="link border-b-4 border-white hover:border-indigo-500" to="/">Surveys</router-link>
      <router-link class="link border-b-4 border-white hover:border-indigo-500" to="/admin">Admin panel</router-link>
    </div> -->
    <div class="nav_actions">
      <router-link class="link border-b-4 border-white hover:border-indigo-500" to="/addsurvey">Create survey</router-link>
      <div class="action flex flex-row" v-if="user">
        <div class="w-16 rounded-full shadow-md overflow-hidden">
          <img class="w-full" :src="user.image_url" alt="avatar-img" />
        </div>
        <div class="ml-5 text-4xl my-auto cursor-pointer hover:text-gray-600 transition-all" @click="logout">
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
      this.$router.push("/");
      // this.$router.go();
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
    padding: 0 10px;

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
      margin-right: 20px;
      font-size: 19px;
      margin: auto;
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