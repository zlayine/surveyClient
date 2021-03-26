<template>
  <div class="w-full flex flex-col">
    <div
      class="mx-5 ring ring-indigo-600 ring-opacity-50 rounded-xl bg-white text-center px-32 py-8 pt-14 text-2xl"
    >
      {{ question.title }}
    </div>
    <div class="flex flex-row justify-center flex-wrap mt-5 mx-5">
      <survey-question-option
        v-for="item in question.options"
        :key="item"
        :type="question.type"
        :item="item"
        @click="selectOption(item)"
        @input="setInput"
        :selected="selected == item"
      />
    </div>
  </div>
</template>

<script>
import SurveyQuestionOption from "./SurveyQuestionOption.vue";
export default {
  props: ["question"],
  data() {
    return {
      selected: null,
      input: null,
    };
  },
  methods: {
    selectOption(item) {
      console.log(item);
      this.selected = item;
    },
    setInput(input) {
      this.input = input;
    },
  },
  components: { SurveyQuestionOption },
};
</script>

<style lang="scss" scoped>
</style>