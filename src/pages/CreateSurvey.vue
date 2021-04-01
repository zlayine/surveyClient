<template>
  <div
    class="w-full sm:w-3/5 mx-auto py-5 px-3 sm:px-10 flex flex-col sm:flex-row mb-32"
  >
    <div
      class="flex sm:flex-col justify-center mx-auto p-2 mb-4 sm:mr-4 bg-white rounded-lg sm:mb-auto shadow-md"
    >
      <span class="relative inline-flex rounded-md">
        <div
          class="hover:bg-indigo-300 w-full hover:bg-opacity-50 rounded-lg py-3 px-4 sm:mb-2 text-xl transition-all text-gray-500 cursor-pointer"
          @click="page = 0"
          :class="{
            'bg-indigo-300': page == 0,
            'bg-opacity-50': page == 0,
            'sm:shadow-lg': page == 0,
            'shadow-md': page == 0,
          }"
        >
          <i-fa icon="list" />
        </div>
        <span
          class="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1"
          v-if="!questionsValid && !edit"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
          ></span>
        </span>
      </span>
      <span class="relative inline-flex rounded-md">
        <div
          class="hover:bg-indigo-300 w-full hover:bg-opacity-50 rounded-lg py-3 px-4 text-xl transition-all text-gray-500 cursor-pointer"
          @click="page = 1"
          :class="{
            'bg-indigo-300': page == 1,
            'bg-opacity-50': page == 1,
            'sm:shadow-lg': page == 1,
            'shadow-md': page == 1,
          }"
        >
          <i-fa icon="cogs" />
        </div>
        <span
          class="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1"
          v-if="!infoValid && !edit"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
          ></span>
        </span>
      </span>
    </div>
    <div class="main flex-1">
      <create-questions
        v-show="page == 0"
        @save="updateQuestions"
        @updated="checker"
        @update="updateSurveyQuestions"
        :edit="edit"
      />
      <create-settings
        v-show="page == 1"
        @save="updateInfo"
        @publish="publish"
        @updated="checker"
        @update="updateSurveyInfo"
        :edit="edit"
      />
    </div>
  </div>
</template>

<script>
import CreateQuestions from "../components/CreateQuestions.vue";
import CreateSettings from "../components/CreateSettings.vue";

export default {
  data() {
    return {
      page: 0,
      survey: { name: null, description: null },
      questions: [],
      questionsValid: false,
      infoValid: false,
      edit: false,
    };
  },
  created() {
    if (this.$route.name == "editsurvey") {
      this.edit = true;
      if (!this.surveyEdit || this.$route.params.id != this.surveyEdit._id)
        this.getSurvey();
    } else {
      this.$store.commit("CLEAR_SURVEY");
    }
  },
  // watch: {
  //   "$route.path": function (val, oldVal) {
  //     if (this.$route.name != "editsurvey") {
  //       this.edit = false;
  //       this.$store.commit("CLEAR_SURVEY");
  //     }
  //   },
  // },
  methods: {
    showNotif(message, error = 0) {
      this.$store.commit("SET_NOTIFICATION", { msg: message, error: error });
    },
    async getSurvey() {
      await this.$store.dispatch("getSurveyEdit", this.$route.params.id);
      if (!this.surveyEdit) this.$router.push("/");
    },
    updateQuestions(questions) {
      this.questions = questions;
      this.checker("save");
    },
    updateInfo(survey) {
      this.survey = survey;
      this.checker("info");
    },
    checker(type) {
      if (type == "updated") this.questionsValid = false;
      if (type == "save") {
        let valid = true;
        let BreakException = {};
        try {
          this.questions.forEach((q) => {
            if (!q.name || !q.options.length) valid = false;
            q.options.forEach((o) => {
              if (
                (!o.name && q.type != "image") ||
                (q.type == "image" && !o.file)
              )
                valid = false;
            });
            if (!valid) throw BreakException;
          });
        } catch (err) {}
        if (valid) this.questionsValid = true;
        else {
          this.showNotif("Survey questions are not complete to save..", 1);
          this.questionsValid = false;
        }
      } else if (type == "info") {
        if (this.survey.name && this.survey.description && this.survey.campus)
          this.infoValid = true;
        else {
          this.showNotif("Survey settings are not complete to save..", 1);
          this.infoValid = false;
        }
      }
    },
    async updateSurveyQuestions(questions) {
      this.questions = questions;
      this.checker("save");
      if (this.questionsValid)
        await this.$store.dispatch("updateQuestions", {
          id: this.surveyEdit._id,
          questions: this.questions,
        });
    },
    async updateSurveyInfo(survey) {
      this.survey = survey;
      this.checker("info");
      if (this.infoValid)
        await this.$store.dispatch("updateSurvey", this.survey);
    },
    async publish() {
      if (!this.infoValid)
        this.showNotif("Please save your survey settings..", 1);
      else if (!this.questionsValid)
        this.showNotif("Please save your survey questions..", 1);
      else if (this.infoValid && this.questionsValid) {
        this.questions = this.questions.map((q, index) => {
          q.step = index;
          return q;
        });
        this.survey.questions = this.questions;
        let obj = Object.assign({}, this.survey);
        let res = await this.$store.dispatch("createSurvey", obj);
        if (res) this.$router.push("/");
      }
    },
  },
  computed: {
    surveyEdit() {
      return this.$store.getters.survey;
    },
  },
  components: { CreateQuestions, CreateSettings },
};
</script>

<style>
</style>