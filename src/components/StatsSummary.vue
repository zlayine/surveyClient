<template>
  <div
    class="bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
    v-for="question in questions"
    :key="question._id"
  >
    <div class="text-xl capitalize">{{ question.name }}</div>
    <div class="text-sm text-gray-700 capitalize">
      {{ question.totalAnswers }} answers
    </div>

    <bar-chart
      v-if="getTypeChart(question.question_type.type) == 'bar'"
      :data="getQuestionData(question.answers)"
      :names="getQuestionNames(question.answers, question.question_type.type)"
    />
    <pie-chart
      v-else-if="getTypeChart(question.question_type.type) == 'pie'"
      :data="getQuestionData(question.answers)"
      :names="getQuestionNames(question.answers, question.question_type.type)"
    />
    <image-chart
      v-else-if="getTypeChart(question.question_type.type) == 'image'"
      :data="getQuestionData(question.answers)"
      :names="getQuestionNames(question.answers, question.question_type.type)"
    />
  </div>
</template>

<script>
import BarChart from "@/components/Charts/BarChart.vue";
import PieChart from "../components/Charts/PieChart.vue";
import ImageChart from "../components/Charts/ImageChart.vue";

export default {
  methods: {
    getQuestionData(answers) {
      let data = answers.map((a) => a.length);
      return data;
    },
    getQuestionNames(answers, type) {
      if (type == "text") return answers.map((a) => a[0].answer_text);
      else return answers.map((a) => a[0].question_option.name);
    },
    getTypeChart(type) {
      if (type == "text" || type == "rate") return "bar";
      else if (type == "choice" || type == "multiple") return "pie";
      else return "image";
    },
  },
  computed: {
    questions() {
      if (this.$store.getters.statsQuestions)
        return this.$store.getters.statsQuestions;
      return [];
    },
  },
  components: {
    BarChart,
    PieChart,
    ImageChart,
  },
};
</script>

<style>
</style>