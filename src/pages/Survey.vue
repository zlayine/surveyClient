<template>
  <div class="container mx-auto py-5 px-10 mb-32">
    <div
      class="survey flex flex-col justify-center items-center mb-20"
      v-if="survey"
    >
      <div
        class="bg-indigo-600 text-white shadow-xl text-xl rounded-3xl text-center px-10 py-3 -mb-6 z-10"
      >
        <span class="font-bold">Question</span> {{ current + 1 }} from
        {{ survey.totalQuestions }}
      </div>
      <survey-question
        :question="survey.questions[current]"
        @select="setAnswer"
      />
      <div class="flex justify-center">
        <button
          class="bg-indigo-600 hover:shadow-none transition-all w-auto mr-5 text-white rounded-3xl text-xl px-10 py-2 mt-5 mx-auto shadow-lg focus:outline-none cursor-pointer"
          @click="prev"
          v-if="!first"
        >
          Prev
        </button>
        <button
          class="bg-indigo-600 hover:shadow-none transition-all w-auto text-white rounded-3xl text-xl px-10 py-2 mt-5 mx-auto shadow-lg focus:outline-none cursor-pointer"
          @click="next"
          v-if="!last"
        >
          Next
        </button>
        <button
          class="bg-green-500 hover:shadow-none transition-all w-auto text-white rounded-3xl text-xl px-10 py-2 mt-5 mx-auto shadow-lg focus:outline-none cursor-pointer"
          @click="submit"
          v-if="last"
        >
          Finish
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SurveyQuestion from "../components/SurveyQuestion.vue";
export default {
  data() {
    return {
      current: 0,
      answers: [],
    };
  },
  methods: {
    setAnswer(selected) {
      let answer = Object.assign([], selected);
      let question = this.survey.questions[this.current]._id;
      let check = this.answers.filter((a) => a.question == question).length;
      if (!check)
        this.answers.push({
          question: question,
          selected: answer,
        });
      else
        this.answers = this.answers.map((a) => {
          if (a.question == question) a.selected = answer;
          return a;
        });
    },
    next() {
      if (++this.current == this.survey.questions.length) this.current = 0;
    },
    prev() {
      if (--this.current < 0) this.current = 0;
    },
    async getSurvey() {
      await this.$store.dispatch("getSurvey", this.$route.params.id);
      if (!this.survey) this.$router.push("/");
    },
    submit() {
      this.$store.dispatch("submitAnswers", this.answers);
      this.$router.push("/");
    },
  },
  async created() {
    if (!this.survey || this.$route.params.id != this.survey._id)
      await this.getSurvey();
  },
  computed: {
    survey() {
      return this.$store.getters.survey;
    },
    first() {
      if (this.current == 0) return true;
      return false;
    },
    last() {
      if (this.current == this.survey.questions.length - 1) return true;
      return false;
    },
  },
  components: { SurveyQuestion },
};
</script>

<style lang="scss" scoped>
</style>