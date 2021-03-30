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
          {{ q.name }}
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
    <div class="text-2xl">
      {{ question.name }}
      <span class="text-sm cursor-pointer" @click="show = !show"
        >{{ !show ? "Show" : "Hide" }} options

        <i-fa icon="chevron-up" v-if="show" />
        <i-fa icon="chevron-down" v-else />
      </span>
    </div>
    <transition name="expand">
      <div
        class="flex flex-row justify-center flex-wrap mt-5 mx-5"
        v-show="show"
      >
        <survey-question-option
          v-for="item in question.options"
          :key="item"
          :type="question.question_type.type"
          :item="item"
          :disabled="true"
        />
      </div>
    </transition>
  </div>

  <div v-if="question">
    <div
      class="w-full divide-y-4 bg-white flex flex-col ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
      v-for="(answer, index) in question.answers"
      :key="index"
    >
      <div
        class="pb-3 text-2xl font-light"
        v-if="question.question_type.type == 'text'"
      >
        {{ answer[0].answer_text }}
      </div>
      <div
        class="pb-3 text-2xl font-light"
        v-else-if="question.question_type.type == 'image'"
      >
        <img
          class="w-auto object-contain max-h-40 overflow-hidden rounded-lg ring ring-indigo-300 ring-opacity-50 cursor-pointer transition-all"
          :src="url_host + answer[0].question_option.name"
          alt="image survey"
        />
      </div>

      <div class="pb-3 text-2xl font-light" v-else>
        {{ answer[0].question_option.name }}
      </div>
      <div class="pt-3">{{ answer.length }} answers</div>
    </div>
  </div>
</template>

<script>
import SurveyQuestionOption from "./SurveyQuestionOption.vue";
export default {
  data() {
    return {
      question: null,
      selected: 0,
      show: false,
      url_host: import.meta.env.VITE_API_HOST,
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
  computed: {
    questions() {
      let answers = this.$store.getters.answers;
      if (answers.length) this.question = answers[0];
      return this.$store.getters.answers;
    },
    // groupedAnswers() {
    //   if (!this.question) return [];
    //   let answers = this.question.answers;
    //   let grouped = answers.reduce((obj, i) => {
    //     if (this.question.question_type.type == "text")
    //       (obj[i["answer_text"]] = obj[i["answer_text"]] || []).push(i);
    //     else
    //       (obj[i["question_option"]["_id"]] =
    //         obj[i["question_option"]["_id"]] || []).push(i);
    //     return obj;
    //   }, {});
    //   let sort = Object.entries(grouped)
    //     .reduce((arr, [k, v]) => {
    //       arr.push(v);
    //       return arr;
    //     }, [])
    //     .sort((a, b) => {
    //       return b.length - a.length;
    //     });
    //   return sort;
    // },
  },
  components: { SurveyQuestionOption },
};
</script>

<style>
</style>