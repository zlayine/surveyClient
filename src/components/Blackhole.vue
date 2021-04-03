<template>
  <div class="b1337">
    <div class="space" :class="{ finish: finish }"></div>
    <div class="ct">
      <div class="wp" :class="{ start: start }">
        <div class="blackhole" :class="{ explode: finish, start: start }"></div>
        <div class="planet" :class="{ start: start }" v-if="user">
          <img class="rounded-full" :src="user.image_url" alt="img user" />
        </div>
      </div>
      <p
        class="text-blackhole mx-auto w-2/3 text-center text-3xl"
        :class="{ appear: finish }"
      >
        You have been blackholed
      </p>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      sintrval: null,
      fintrval: null,
      finish: false,
      start: false,
    };
  },
  mounted() {
    this.finish = false;
    setTimeout(() => {
      this.start = true;
    }, 5000);
    setTimeout(() => {
      this.finish = true;
    }, 19000);
    setTimeout(() => {
      this.$emit("done");
    }, 24000);
  },
  created() {
    this.finish = false;
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style lang="css">
.b1337 {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
}

.b1337 {
  background-image: -webkit-radial-gradient(
    circle,
    rgba(0, 0, 5, 1),
    rgba(0, 0, 0, 1)
  );
  overflow: hidden;
}

.space {
  position: absolute;
  top: 0;
  left: 0;
  background-image: radial-gradient(
      white,
      rgba(255, 255, 255, 0.2) 2px,
      transparent 10px
    ),
    radial-gradient(white, rgba(255, 255, 255, 0.15) 1px, transparent 10px),
    radial-gradient(white, rgba(255, 255, 255, 0.1) 2px, transparent 10px),
    radial-gradient(
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.1) 2px,
      transparent 10px
    );
  background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
  background-position: 0 0, 40px 30px, 130px 270px, 70px 100px;
  animation: spin 25s linear infinite;
  width: 200%;
  height: 400%;
  margin: -100% 0 0 -50%;
  opacity: 0.6;
}

.space.finish {
  animation: spin unset;
}

.ct {
  display: inline-block;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  text-align: center;
}

.ct:before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  margin-right: -0.25em;
}

.wp {
  position: relative;
  display: inline-block;
  height: auto;
  vertical-align: middle;
  margin: 0 auto;
  text-align: center;
  background: transparent;
  border-radius: 50%;
  animation: tease 5s normal forwards ease-in-out;
}

.wp.start {
  animation: spin 3s infinite 2s normal linear;
}

.blackhole {
  position: relative;
  display: inline-block;
  width: 70px;
  height: 70px;
  margin: 0 auto;
  border-radius: 50%;
  background: #000;
  transition: 1s all linear;
  box-shadow: 0px 0 1vh 0vh #f50;
}

.blackhole.start {
  box-shadow: 4px 0 3vh 1vh #f50;
}

.blackhole.explode {
  transition: 9s all linear;
  width: 170px;
  height: 170px;
  box-shadow: 4px 0 3vh 100vh rgb(252, 181, 146);
}

.planet {
  position: absolute;
  top: -45vh;
  left: 45vw;
  width: 4rem;
  height: 4rem;
  margin: -5px 0 0 -5px;
  opacity: 0;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  transition: 1s all;
}

.text-blackhole {
  position: absolute;
  top: 30vh;
  left: 0;
  right: 0;
  opacity: 0;
  color: #fff;
  transition: 1s all;
}

.text-blackhole.appear {
  opacity: 1;
}

.planet.start {
  opacity: 1;
  animation: drain 12s normal 2s forwards ease-in;
}

@keyframes drain {
  95% {
    opacity: 1;
  }
  to {
    top: 0%;
    left: 0%;
    opacity: 0;
    transform: scale(0.1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes tease {
  0% {
    bottom: -60%;
  }
  to {
    bottom: 0;
  }
}

@media (max-width: 900px) {
  .planet {
    position: absolute;
    top: -40vh;
    left: 0vw;
    width: 4rem;
    height: 4rem;
    margin: -5px 0 0 -5px;
    opacity: 0;
    background: rgba(255, 255, 255, 1);
    border-radius: 50%;
    transition: 1s all;
  }

  .blackhole {
    width: 40px;
    height: 40px;
  }
}
</style>