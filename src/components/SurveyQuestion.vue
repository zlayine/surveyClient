<template>
  <div class="w-full flex flex-col">
    <div
      class="mx-5 ring ring-indigo-600 ring-opacity-50 rounded-xl bg-white text-center px-32 py-8 pt-14 text-2xl"
    >
      {{ question.name }}
    </div>
    <div class="flex flex-row justify-center flex-wrap mt-5 mx-5">
      <survey-question-option
        v-for="(item, index) in question.options"
        :key="index"
        :type="question.question_type.type"
        :item="item"
        @click="selectOption(item)"
        @input="setInput"
        :select="selected"
      />
    </div>
  </div>
</template>

<script>
import SurveyQuestionOption from "./SurveyQuestionOption.vue";
export default {
  props: ["question"],
  emits: ["select"],
  data() {
    return {
      selected: [],
      input: null,
    };
  },
  methods: {
    selectOption(item) {
      if (this.question.question_type.type == "multiple") {
        let slct = this.selected.filter((s) => s == item).length;
        if (!slct) this.selected.push(item);
        else this.selected = this.selected.filter((s) => s != item);
      } else {
        if (this.selected[0] == item) this.selected = [];
        else this.selected = [item];
      }
      this.$emit("select", this.selected);
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