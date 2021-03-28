<template>
  <div class="survey w-full sm:w-1/2 flex p-3 h-56 mb-5">
    <div
      class="bg-white w-full flex flex-row p-2 rounded-lg shadow-xl h-56 relative overflow-hidden"
    >
      <div
        class="absolute w-10 h-10 bg-red-500 rounded-lg -right-1 -top-1 flex justify-center cursor-pointer shadow-lg hover:shadow-none transition-all"
        @click="deleteSurvey"
      >
        <i-fa
          class="text-white text-xl mt-auto mr-auto ml-2 mb-2"
          icon="trash"
        />
      </div>
      <div
        class="user w-28 flex mb-auto rounded-full overflow-hidden shadow-md mx-5"
      >
        <img
          class="w-full"
          v-if="survey.organization"
          :src="survey.organization.logo_url"
          alt="user img"
        />
				<img
          class="w-28 h-28 p-3 border border-gray-100 overflow-hidden rounded-full"
          v-else
          :src="logo1337"
          alt="user img"
        />
      </div>
      <div class="info flex-1 flex flex-col">
        <div class="title text-xl uppercase font-bold tracking-wider l">
          {{ survey.name }}
        </div>
        <div class="subtitle flex mb-2.5">
          <h6 class="username mr-1 text-gray-500">
            {{ survey.user.username }}
          </h6>
          <h6 class="date text-gray-600">{{ formatDate(survey.createdAt) }}</h6>
        </div>
        <div class="description break-words">
          {{ survey.description }}
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
                {{ progress }}
              </span>
            </div>
          </div>
          <div
            class="overflow-hidden h-3 mb-4 text-xs flex rounded bg-green-200"
          >
            <div
              :style="{ width: `${progress}%` }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            ></div>
          </div>
        </div>
        <div class="flex justify-center mt-auto mx-auto mb-4" v-else>
          <router-link :to="`/survey/${survey._id}`">
            <button
              class="bg-green-500 text-white w-40 rounded-lg text-xl px-5 py-1 shadow-md hover:shadow-none focus:outline-none transition-all"
            >
              Start Survey
            </button>
          </router-link>
          <router-link :to="`/stats/${survey._id}`">
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
import moment from "moment";
import logo from "@/assets/1337.svg";

export default {
  props: ["survey"],
  data() {
    return {
			logo1337: logo
		};
  },
  methods: {
    formatDate(val) {
      return moment(String(val)).format("DD/MM/YYYY");
    },
    deleteSurvey() {
      this.$store.dispatch("deleteSurvey", this.survey._id);
    },
  },
  computed: {
    answers() {
      return this.$store.getters.answers;
    },
    ASurvey() {
      return this.$store.getters.survey;
    },
    start() {
      if (!this.ASurvey) return false;
      if (this.ASurvey._id == this.survey._id && this.answers.length)
        return true;
      return false;
    },
    progress() {
      if (this.start)
        return parseInt(
          (this.answers.length / this.survey.totalQuestions) * 100
        );
      return 0;
    },
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