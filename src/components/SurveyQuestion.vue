<template>
  <div class="w-full flex flex-col">
    <div
      class="mx-2 sm:mx-5 ring ring-indigo-600 ring-opacity-50 rounded-xl bg-white text-center px-2 sm:px-32 py-4 pt-10 sm:py-8 sm:pt-14 text-xl sm:text-2xl relative"
    >
      {{ question.name }}
      <div
        class="absolute left-0 right-0 bottom-0 text-xs font-bold text-gray-600"
      >
        {{
          question.question_type.type == "multiple"
            ? "You can select mutiple answers"
            : ""
        }}
      </div>
    </div>
    <div class="flex flex-row justify-center flex-wrap mt-5 sm:mx-5">
      <survey-question-option
        v-for="(item, index) in question.options"
        :key="index"
        :type="question.question_type.type"
        :item="item"
        @click="selectOption(item)"
        @input="setInput"
        :select="selected"
        ref="option"
      />
    </div>
  </div>
</template>

<script>
import SurveyQuestionOption from "./SurveyQuestionOption.vue";
export default {
  props: ["question", "answer"],
  emits: ["select"],
  data() {
    return {
      selected: [],
      type: this.type,
    };
  },
  watch: {
    question() {
      this.selected = [];
      this.$refs.option.input = null;
    },
    answer() {
      if (!this.selected.length && this.answer.length) {
        this.selected = this.answer;
        if (this.question.question_type.type == "text")
          this.$refs.option.input = this.selected[0].name;
      }
    },
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
    setInput({ id, input }) {
      this.selected = [{ _id: id, name: input }];
      this.$emit("select", this.selected);
    },
  },
  components: { SurveyQuestionOption },
};
</script>

<style lang="scss" scoped>
</style>