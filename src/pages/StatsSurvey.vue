<template>
  <div class="w-3/5 mx-auto py-5 px-10 flex flex-col mb-32">
    <div
      class="flex flex-col w-full bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
    >
      <div class="flex justify-between">
        <div class="text-2xl capitalize">{{ totalAnswers }} answers</div>
        <div class="actions">
          <i-fa class="" icon="ellipsis-v" />
        </div>
      </div>
      <nav class="flex flex-row w-full">
        <div class="flex-1 flex flex-col items-center justify-center">
          <button
            @click="selected = 0"
            class="py-1 px-3 mb-2 block hover:text-indigo-500 focus:outline-none text-indigo-500 font-bold"
          >
            Summary
          </button>
          <div
            class="bird w-14 h-1 rounded-t-lg bg-white"
            :class="{ 'bg-indigo-500': selected == 0 }"
          ></div>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center">
          <button
            @click="selected = 1"
            class="py-1 px-3 mb-2 block hover:text-indigo-500 focus:outline-none text-indigo-500 font-bold"
          >
            Individual
          </button>
          <div
            class="bird w-14 h-1 rounded-t-lg bg-white"
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
      selected: 0,
    };
  },
  methods: {
    async getAnswers() {
      if (!this.answers.length)
        await this.$store.dispatch("getSurveyAnswers", this.$route.params.id);
      if (!this.answers.length) this.$router.push("/");
    },
  },
  async created() {
    if (!this.answers.length) await this.getAnswers();
  },
  computed: {
    answers() {
      return this.$store.getters.answers;
    },
    totalAnswers() {
      if (this.answers.length)
        return this.answers.reduce((arr, i) => arr + i.answers.length, 0);
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