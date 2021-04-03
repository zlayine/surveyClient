<template>
  <div class="container mx-auto py-5 px-3 sm:px-10 mb-32">
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
      <transition name="fade">
        <survey-question
          :question="question"
          @select="setAnswer"
          :answer="selectedAnswer"
        />
      </transition>
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
    <transition name="fade">
      <survey-shared-start-dialog
        v-show="share"
        @cancel="share = false"
        :survey="survey"
      />
    </transition>
  </div>
</template>

<script>
import SurveyQuestion from "@/components/SurveyQuestion.vue";
import SurveySharedStartDialog from "@/components/SurveySharedStartDialog.vue";

export default {
  data() {
    return {
      current: 0,
      answers: [],
      share: false,
    };
  },
  mounted() {
    if (this.$route.query.share) this.share = true;
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
    answered() {
      if (
        this.answers[this.current] &&
        this.answers[this.current].selected.length
      )
        return true;
      return false;
    },
    next() {
      if (this.answered()) {
        if (++this.current == this.survey.questions.length) this.current = 0;
      } else
        this.$store.commit("SET_NOTIFICATION", {
          msg: "Please answer this question..",
          error: 1,
        });
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
    selectedAnswer() {
      if (
        this.answers[this.current] &&
        this.answers[this.current].selected.length
      )
        return this.answers[this.current].selected;
      return [];
    },
    question() {
      return this.survey.questions[this.current];
    },
  },
  components: { SurveyQuestion, SurveySharedStartDialog },
};
</script>

<style lang="scss" scoped>
</style>