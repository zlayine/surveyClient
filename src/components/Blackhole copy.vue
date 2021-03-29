<template>
  <div class="b1337">
    <div class="space"></div>
    <div class="ct">
      <div class="wp">
        <div class="blackhole" :class="{ explode: finish }">
          <transition name="fade">
            <div
              class="planet mercury"
              :class="{ disappear: finish }"
              v-if="fStack[0]"
            >
              <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
            </div>
          </transition>
					<transition name="fade">
          <div
            class="planet venus"
            :class="{ disappear: finish }"
            v-if="sStack[0]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
          </transition>
					<transition name="fade">
          <div
            class="planet earth"
            :class="{ disappear: finish }"
            v-if="fStack[1]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
					</transition>
					<transition name="fade">
          <div
            class="planet mars"
            :class="{ disappear: finish }"
            v-if="sStack[1]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
					</transition>
					<transition name="fade">
          <div
            class="planet jupiter"
            :class="{ disappear: finish }"
            v-if="sStack[2]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
					</transition>
					<transition name="fade">
          <div
            class="planet saturn"
            :class="{ disappear: finish }"
            v-if="fStack[2]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
					</transition>
					<transition name="fade">
          <div
            class="planet uranus"
            :class="{ disappear: finish }"
            v-if="sStack[3]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
					</transition>
					<transition name="fade">
          <div
            class="planet neptune"
            :class="{ disappear: finish }"
            v-if="fStack[3]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
					</transition>
					<transition name="fade">
          <div
            class="planet pluto"
            :class="{ disappear: finish }"
            v-if="sStack[4]"
          >
            <!-- <img
              class="rounded-full"
              src="https://cdn.intra.42.fr/users/zlayine.jpg"
              alt="img user"
            /> -->
          </div>
					</transition>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      users: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      sStack: [],
      fStack: [],
      sintrval: null,
      fintrval: null,
      finish: false,
    };
  },
  mounted() {
    this.finish = false;
    this.users = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    this.startHole();
  },
  created() {
    // f = 4
    // s = 5
    this.finish = false;
    this.users = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  },
  methods: {
    startHole() {
      this.sStack = this.users.splice(0, 4);
      this.fStack = this.users.splice(0, 4);
      this.sintrval = setInterval(() => {
        if (!this.users.length) {
          this.finishScene();
          clearInterval(this.sintrval);
        }
        if (this.users.length) this.sStack = this.users.splice(0, 4);
      }, 8000);
      this.fintrval = setInterval(() => {
        if (!this.users.length) {
          clearInterval(this.fintrval);
        }
        if (this.users.length) this.fStack = this.users.splice(0, 4);
      }, 5000);
    },
    finishScene() {
      setTimeout(() => {
        this.finish = true;
      }, 5000);
      setTimeout(() => {
        this.$emit("done");
      }, 10000);
    },
  },
};
</script>

<style lang="css">
.b1337 {
  position: absolute;
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
}

.blackhole {
  position: relative;
  display: inline-block;
  width: 70px;
  height: 70px;
  margin: 0 auto;
  border-radius: 50%;
  animation: spin 3s infinite linear;
  background: #000;
  box-shadow: 4px 0 3vh 1vh #f50;
  transition: 0.2s all linear;
}

.blackhole.explode {
  transition: 9s all linear;
  width: 170px;
  height: 170px;
  box-shadow: 4px 0 3vh 100vh rgb(252, 181, 146);
}

.planet {
  position: absolute;
  top: 160%;
  left: 100%;
  width: 40px;
  height: 40px;
  margin: -5px 0 0 -5px;
  opacity: 1;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  animation: drain 4s infinite ease-in;
}

.planet.disappear {
  animation: drain 4s unset ease-in;
  transition: 7s all;
  opacity: 0;
  width: 0px;
  height: 0px;
  /* animation: disappear 4s normal ease-in; */
  /* animation-iteration-count: 1; */
}

.venus {
  left: -100%;
  animation-delay: 800ms;
  transform: scale(1);
  animation-duration: 7s;
}

.earth {
  top: 0%;
  left: 185%;
  animation-delay: 500ms;
  transform: scale(1);
  animation-duration: 4s;
}

.mars {
  top: -200%;
  left: 250%;
  animation-delay: 700ms;
  transform: scale(1);
  animation-duration: 7s;
}

.jupiter {
  top: 150%;
  left: 330%;
  animation-delay: 200ms;
  transform: scale(1);
  animation-duration: 7s;
}

.satrurn {
  top: -380%;
  left: -300%;
  animation-delay: 700ms;
  transform: scale(1);
  animation-duration: 4s;
}

.uranus {
  top: -400%;
  left: 200%;
  animation-delay: 300ms;
  transform: scale(1);
  animation-duration: 7s;
}

.neptune {
  top: 500%;
  left: 180%;
  animation-delay: 700ms;
  transform: scale(1.2);
  animation-duration: 4s;
}

.pluto {
  top: -700%;
  left: 330%;
  animation-delay: 600ms;
  transform: scale(1.4);
  animation-duration: 7s;
}

@keyframes drain {
  95% {
    opacity: 1;
  }
  to {
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: scale(0.3);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes disappear {
  95% {
    opacity: 1;
  }
  to {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 0;
    transform: scale(0.3);
  }
}
</style>