<template>
  <div class="w-3/5 mx-auto py-5 px-10 flex flex-col mb-32">
    <div
      class="flex flex-col w-full bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5 overflow-hidden"
    >
      <div class="flex justify-between relative" v-if="survey">
        <div class="text-2xl capitalize">{{ survey.answers }} answers</div>
        <div
          class="absolute w-10 h-10 bg-indigo-200 rounded-lg -right-6 -top-6 flex justify-center cursor-pointer shadow-lg hover:shadow-none transition-all"
        >
          <i-fa
            class="text-indigo-600 text-xl mt-auto mr-auto ml-2 mb-2"
            icon="edit"
          />
        </div>
      </div>
      <div class="owner">
        <!-- <div
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
        </div> -->
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

export default {
  data() {
    return {
      selected: null,
    };
  },
  methods: {
    async getStats() {
      if (!this.survey)
        await this.$store.dispatch("getSurveyAnswers", this.$route.params.id);
      // if (!this.survey) this.$router.push("/");
    },
  },
  async created() {
    if (!this.survey || this.$route.params.id != this.survey._id)
      await this.getStats();
  },
  computed: {
    survey() {
      let survey = this.$store.getters.surveyStats;
      if (survey) this.selected = 0;
      return this.$store.getters.surveyStats;
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