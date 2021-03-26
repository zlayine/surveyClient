<template>
  <div
    class="bg-white flex ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
  >
    <label class="block flex-1">
      <select
        v-model="selected"
        @change="setQuestion"
        class="block w-2/3 mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option v-for="(q, index) in questions" :key="index" :value="index">
          {{ q.title }}
        </option>
      </select>
    </label>
    <div class="w-32 flex justify-between my-auto">
      <div
        @click="changeQuestion(null)"
        class="hover:bg-indigo-300 hover:bg-opacity-50 rounded-full h-8 w-8 flex cursor-pointer"
      >
        <i-fa class="text-xl m-auto" icon="chevron-left" />
      </div>
      <div class="my-auto">{{ selected + 1 }} of {{ questions.length }}</div>
      <div
        @click="changeQuestion('right')"
        class="hover:bg-indigo-300 hover:bg-opacity-50 rounded-full h-8 w-8 flex cursor-pointer"
      >
        <i-fa class="text-xl m-auto" icon="chevron-right" />
      </div>
    </div>
  </div>
  <div
    v-if="question"
    class="bg-white flex flex-col ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
  >
    <div class="text-2xl">{{ question.title }}</div>
    <div class="flex flex-row justify-center flex-wrap mt-5 mx-5">
      <survey-question-option
        v-for="item in question.options"
        :key="item"
        :type="question.type"
        :item="item"
        :disabled="true"
      />
    </div>
  </div>
  <div
    class="w-full divide-y-4 bg-white flex flex-col ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
  >
    <div class="pb-3 text-2xl font-light">eqr</div>
    <div class="pt-3">2 answers</div>
  </div>
  <div class="answer"></div>
</template>

<script>
import SurveyQuestionOption from "./SurveyQuestionOption.vue";
export default {
  data() {
    return {
      question: null,
      selected: null,
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
    setQuestion() {
      this.question = this.questions[this.selected];
    },
    changeQuestion(direction) {
      if (direction && this.selected < this.questions.length - 1)
        this.selected++;
      else if (!direction && this.selected > 0) this.selected--;
      this.question = this.questions[this.selected];
    },
  },
  components: { SurveyQuestionOption },
};
</script>

<style>
</style>