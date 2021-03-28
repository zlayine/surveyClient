<template>
  <div class="main bg-gray-100 flex flex-col relative min-h-screen">
    <navbar />
    <notification />
    <loader />
    <router-view v-slot="{ Component }">
      <transition name="fade-out">
        <component :is="Component" />
      </transition>
    </router-view>
    <footer-layout />
  </div>
</template>

<script>
import Loader from "./components/Loader.vue";
import Navbar from "./components/Navbar.vue";
import Notification from "./components/Notification.vue";
import FooterLayout from "./components/Footer.vue";

export default {
  async mounted() {
    if (this.currentUser) {
      if (!this.user)
        await this.$store.dispatch("getUser", this.currentUser.id);
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  components: { Navbar, Notification, Loader, FooterLayout },
};
</script>

<style>
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

* {
  font-family: "Open Sans", sans-serif;
  letter-spacing: 0px;
}
.fade-enter-active {
  transition: opacity 0.2s;
}
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s;
  max-height: 230px;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
  max-height: 0px;
}

.fade-out-enter-active {
  transition: opacity 0.2s;
}
.fade-out-leave-active {
  display: none;
}
.fade-out-enter,
.fade-out-leave-to {
  opacity: 0;
}
</style>