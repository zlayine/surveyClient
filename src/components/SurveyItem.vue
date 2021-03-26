<template>
  <div class="survey w-1/2 flex p-3 h-56 mb-5">
    <div class="bg-white w-full flex flex-row p-2 rounded-md shadow-xl h-56">
      <div
        class="user w-28 flex mb-auto rounded-full overflow-hidden shadow-md mx-5"
      >
        <img
          class="w-full"
          src="https://cdn.intra.42.fr/users/zlayine.jpg"
          alt="user img"
        />
      </div>
      <div class="info flex-1 flex flex-col">
        <div class="title text-xl uppercase font-bold tracking-wider l">
          title
        </div>
        <div class="subtitle flex mb-2.5">
          <h6 class="username mr-2 text-gray-500">username</h6>
          <h6 class="date text-gray-600">date</h6>
        </div>
        <div class="description break-words">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, ex. A
          blanditiis aut fugit, nostrum deserunt distinctio suscipit eaque illo
          consequuntur impedit perferendis, dolores rem qui velit doloremque
          illum commodi!
        </div>
        <div class="pt-1 mt-auto" v-if="start">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span
                class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200"
              >
                in progress
              </span>
            </div>
            <div class="text-right">
              <span class="text-md font-semibold inline-block text-green-600">
                50%
              </span>
            </div>
          </div>
          <div
            class="overflow-hidden h-3 mb-4 text-xs flex rounded bg-green-200"
          >
            <div
              :style="{ width: '25%' }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            ></div>
          </div>
        </div>
        <div class="flex justify-center m-auto" v-else>
          <router-link to="/survey/1">
            <button
              class="bg-green-500 text-white w-40 rounded-lg text-xl px-5 py-1 shadow-md hover:shadow-none focus:outline-none transition-all"
            >
              Start Survey
            </button>
          </router-link>
          <router-link to="/stats/1">
            <button
              class="bg-indigo-500 text-white w-40 ml-3 rounded-lg text-xl px-5 py-1 shadow-md hover:shadow-none focus:outline-none transition-all"
            >
              Answers
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      start: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.survey {
  &:first-child {
    margin-left: 0px !important;
  }
  .date {
    &::before {
      content: "at ";
    }
  }
}
</style>