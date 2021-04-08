<template>
  <div class="sm:w-3/5 mx-auto py-5 px-3 sm:px-10 flex flex-col mb-32">
    <div
      class="flex flex-col w-full bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-3 sm:p-5 overflow-hidden"
    >
      <div class="flex justify-between relative mb-4" v-if="survey">
        <div class="text-2xl capitalize">{{ survey.answers }} answers</div>
        <router-link :to="`/editsurvey/${survey._id}`">
          <button
            class="absolute w-10 h-10 bg-indigo-200 outline-none focus:outline-none rounded-bl-lg -right-4 -top-4 sm:-right-6 sm:-top-6 flex justify-center cursor-pointer shadow-lg hover:shadow-none transition-all"
          >
            <i-fa
              class="text-indigo-600 text-xl mt-auto mr-auto ml-2 mb-2"
              icon="edit"
            />
          </button>
        </router-link>
      </div>
      <div class="flex md:flex-row flex-col mb-3" v-if="survey">
        <div class="flex flex-1">
          <div
            class="w-16 flex mb-auto rounded-full overflow-hidden shadow-md mr-3 sm:mr-5"
          >
            <img
              class="w-16 h-16 overflow-hidden rounded-full"
              v-if="survey.organization"
              :src="url_host + survey.organization.logo_url"
              alt="user img"
            />
            <img
              class="w-16 h-16 p-3 border border-gray-100 overflow-hidden rounded-full"
              v-else
              :src="logo1337"
              alt="user img"
            />
          </div>
          <div class="flex flex-1 flex-col my-auto">
            <div
              class="text-sm sm:text-xl uppercase font-bold tracking-wider break-words"
            >
              {{ survey.name }}
            </div>
            <div class="subtitle flex mb-1">
              <h6 class="username mr-1 text-gray-500">
                {{ survey.user.username }}
              </h6>
              <h6 class="date text-gray-600">
                at {{ formatDate(survey.createdAt) }}
              </h6>
            </div>
          </div>
        </div>

        <div class="flex my-auto justify-center md:mt-2">
          <div
            class="bg-indigo-400 text-white px-3 py-2 rounded-xl shadow-md hover:shadow-none cursor-pointer mr-2"
            @click="exportSurvey"
          >
            <i-fa icon="download" />
            <span class=" ml-1 sm:inline-block">Export</span>
          </div>
          <div
            class="bg-indigo-400 text-white px-3 py-2 rounded-xl shadow-md hover:shadow-none cursor-pointer mr-2"
            @click="shareSurvey"
          >
            <i-fa icon="share-alt" />
            <span class=" ml-1 sm:inline-block">Share</span>
          </div>
        </div>
      </div>
      <nav class="flex flex-row w-full">
        <div class="flex-1 flex flex-col items-center justify-center">
          <button
            @click="selected = 0"
            class="py-1 px-3 block text-lg hover:text-indigo-500 focus:outline-none text-indigo-500 font-bold"
          >
            Summary
          </button>
          <div
            class="w-16 h-1 rounded-t-lg bg-white transition-all"
            :class="{ 'bg-indigo-500': selected == 0 }"
          ></div>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center">
          <button
            @click="selected = 1"
            class="py-1 px-3 block text-lg hover:text-indigo-500 focus:outline-none text-indigo-500 font-bold"
          >
            Individual
          </button>
          <div
            class="w-16 h-1 rounded-t-lg bg-white transition-all"
            :class="{ 'bg-indigo-500': selected == 1 }"
          ></div>
        </div>
      </nav>
    </div>
    <stats-summary v-if="selected == 0" />
    <stats-individual v-else-if="selected == 1" />
  </div>
</template>

<script>
import StatsIndividual from "../components/StatsIndividual.vue";
import StatsSummary from "../components/StatsSummary.vue";
import logo from "@/assets/1337.svg";
import moment from "moment";
import { toClipboard } from "@soerenmartius/vue3-clipboard";

export default {
  data() {
    return {
      selected: null,
      logo1337: logo,
      url_host: import.meta.env.VITE_API_HOST,
    };
  },
  methods: {
    async getStats() {
      await this.$store.dispatch("getSurveyAnswers", this.$route.params.id);
      if (!this.survey) this.$router.push("/");
    },
    formatDate(val) {
      return moment(String(val)).format("DD/MM/YYYY");
    },
    async shareSurvey() {
      await toClipboard(
        import.meta.env.VITE_URL +
          "survey/" +
          this.$route.params.id +
          "?share=true"
      );
      this.$store.commit("SET_NOTIFICATION", {
        msg: "Sharable link coppied to clipboard",
        error: 0,
      });
    },
    exportSurvey() {},
  },
  async mounted() {
    // if (!this.survey || this.$route.params.id != this.survey._id)
    this.$store.commit("CLEAR_STATS");
    await this.getStats();
    if (
      this.user &&
      this.user.role != "admin" &&
      this.user._id != this.survey.user._id
    )
      this.$router.push("/");
  },
  computed: {
    survey() {
      let survey = this.$store.getters.surveyStats;
      if (survey) this.selected = 0;
      return this.$store.getters.surveyStats;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  components: {
    StatsSummary,
    StatsIndividual,
  },
};
</script>

<style lang="scss" scoped>
</style>