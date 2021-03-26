<template>
  <div class="container mx-auto py-5 px-10 mb-32">
    <div class="survey flex flex-col justify-center items-center mb-20">
      <div
        class="bg-indigo-600 text-white shadow-xl text-xl rounded-3xl text-center px-10 py-3 -mb-6 z-10"
      >
        <span class="font-bold">Question</span> {{ current + 1 }} from
        {{ questions.length }}
      </div>
      <survey-question :question="questions[current]" />
      <button
        class="bg-indigo-600 w-auto text-white rounded-3xl text-xl px-10 py-2 mt-5 mx-auto shadow-lg focus:outline-none cursor-pointer"
        @click="prev"
      >
        Prev
      </button>
      <button
        class="bg-indigo-600 w-auto text-white rounded-3xl text-xl px-10 py-2 mt-5 mx-auto shadow-lg focus:outline-none cursor-pointer"
        @click="next"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import SurveyQuestion from "../components/SurveyQuestion.vue";
export default {
  data() {
    return {
      current: 0,
      questions: [
        {
          title: "Question with choices",
          type: "choice",
          options: [
            { name: "option 1" },
            { name: "option 2" },
            { name: "option 3" },
            { name: "option 4" },
          ],
        },
        {
          title: "Question with multiple choices",
          type: "multiple",
          options: [
            { name: "option 1" },
            { name: "option 2" },
            { name: "option 3" },
            { name: "option 4" },
          ],
        },
        {
          title: "Question with rating",
          type: "rate",
          options: [
            { name: "1" },
            { name: "2" },
            { name: "3" },
            { name: "4" },
            { name: "5" },
          ],
        },
        {
          title: "Question with open ended",
          type: "open",
          options: [{ name: "Enter your text here" }],
        },
        {
          title: "Question with images",
          type: "image",
          options: [
            { name: "https://source.unsplash.com/random" },
            { name: "https://source.unsplash.com/random" },
            { name: "https://source.unsplash.com/random" },
          ],
        },
      ],
    };
  },
  methods: {
    next() {
      if (++this.current == this.questions.length) this.current = 0;
    },
    prev() {
      if (--this.current < 0) this.current = 0;
    },
  },
  components: { SurveyQuestion },
};
</script>

<style lang="scss" scoped>
</style>