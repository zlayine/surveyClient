<template>
  <div class="main bg-gray-100 flex flex-col relative min-h-screen">
    <transition name="blackhole">
      <blackhole v-if="blackhole" @done="blackhole = false" />
    </transition>
    <navbar />
    <transition name="slide">
      <notification />
    </transition>
    <transition name="fade">
      <loader />
    </transition>
    <router-view v-slot="{ Component }">
      <transition name="fade-out">
        <component :is="Component" />
      </transition>
    </router-view>
    <footer-layout @start="start" />
  </div>
</template>

<script>
import Loader from "./components/Loader.vue";
import Navbar from "./components/Navbar.vue";
import Notification from "./components/Notification.vue";
import FooterLayout from "./components/Footer.vue";
import Blackhole from "./components/Blackhole.vue";

export default {
  data() {
    return {
      blackhole: false,
    };
  },
  async mounted() {
    if (this.currentUser) {
      if (!this.user)
        await this.$store.dispatch("getUser", this.currentUser.id);
    }
  },
  methods: {
    start() {
      if (this.user) this.blackhole = true;
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  components: { Navbar, Notification, Loader, FooterLayout, Blackhole },
};
</script>

<style>
</style>

<style>
html {
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

* {
  font-family: "Open Sans", sans-serif;
  letter-spacing: 0px;
}
.fade-enter-active,
fade-leave-active {
  transition: opacity 0.2s;
	opacity: 1;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s;
  max-height: 230px;
}

.expand-enter-from,
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
.fade-out-enter-from,
.fade-out-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
	top: 0;
}
.slide-enter-from,
.slide-leave-to {
  top: -100px;
}

.blackhole-enter-active {
  transition: opacity 0.5s ease;
}
.blackhole-leave-active {
  transition: opacity 3s ease;
}

.blackhole-enter-from {
  opacity: 0;
}
.blackhole-leave-to {
  opacity: 0;
}
</style>