<template>
  <div class="create flex flex-col">
    <transition-group name="expand" appear>
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="w-full bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-3"
        @click="selectQuestion(index)"
      >
        <div
          class="header flex flex-row justify-between mb-3"
          :class="{ 'pointer-events-none': this.question != index }"
        >
          <div class="info flex flex-row">
            <div
              class="number h-10 w-10 rounded-xl mr-1 flex justify-center bg-green-400 text-white text-lg font-bold transition-all"
              :class="{ 'bg-indigo-300': this.question != index }"
            >
              <div class="m-auto">{{ index + 1 }}</div>
            </div>
            <div class="relative inline-flex">
              <i-fa
                icon="chevron-down"
                class="w-4 h-4 absolute top-0 right-0 m-3 pointer-events-none text-white text-xl"
              />
              <select
                v-model="question.type"
                @change="emptyOptions(question)"
                class="rounded-xl cursor-pointer text-lg font-bold text-white h-10 w-auto pl-5 pr-10 bg-green-400 border-none outline-none focus:outline-none appearance-none transition-all"
                :class="{
                  'bg-indigo-300': this.question != index,
                  'pointer-events-none': edit,
                }"
              >
                <option value="0">Question type</option>
                <option value="choice">Choice</option>
                <option value="multiple">Multiple</option>
                <option value="rate">Rate</option>
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>
          </div>
          <div class="flex" v-if="!edit">
            <div
              class="mr-1 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-300 transition-all cursor-pointer"
              @click="duplicateQuestion"
            >
              <i-fa icon="copy" class="m-auto" />
            </div>
            <div
              @click="removeQuestion(index)"
              class="mr-0 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-red-500 transition-all cursor-pointer"
            >
              <i-fa icon="trash" class="m-auto" />
            </div>
          </div>
        </div>
        <div
          class="question"
          :class="{ 'pointer-events-none': this.question != index }"
        >
          <span class="text-sm font-bold text-gray-300">Question</span>
          <textarea
            v-model="question.name"
            class="block w-full rounded-lg text-xl resize-none bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="3"
          ></textarea>
        </div>
        <transition name="expand" appear mode="out-in">
          <div
            class="options mt-3 relative"
            :class="{ 'pointer-events-none': this.question != index }"
            v-show="this.question == index && question.type != 0"
          >
            <span
              class="text-sm font-bold text-gray-300"
              v-if="question.options.length"
              >Options</span
            >
            <transition-group name="expand" appear>
              <div
                class="mb-2 mt-2 flex flex-row"
                v-for="(option, index) in question.options"
                :key="index"
              >
                <input
                  class="flex-1 py-3 block w-full rounded-md bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  type="text"
                  v-if="question.type != 'image'"
                  v-model="option.name"
                  placeholder="name"
                />
                <div class="flex-1 flex" v-else>
                  <div
                    v-if="!option.name"
                    class="w-full flex rounded-md bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-pointer"
                    @click="launchFilePicker(index)"
                  >
                    <div class="p-2 ml-3 h-12 flex" v-if="!option.url">
                      <i-fa icon="plus" class="my-auto mr-2" />
                      <span class="my-auto"> Add Image </span>
                    </div>
                    <img
                      v-if="option.url"
                      class="ml-2 h-12 w-20 object-contain"
                      :src="option.url"
                      alt="image option"
                    />

                    <div
                      class="flex flex-1 p-2 justify-between m-auto"
                      v-if="option.url"
                    >
                      <div>{{ option.file.name }}</div>
                      <div class="">{{ sizeFilter(option.size) }}</div>
                    </div>
                  </div>
                  <div
                    class="w-full flex rounded-md bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-pointer"
                    v-else-if="edit"
                  >
                    <img
                      class="ml-2 h-12 w-20 object-contain"
                      :src="url_host + option.name"
                      alt="image option"
                    />
                  </div>
                  <input
                    type="file"
                    ref="file"
                    @change="onFileChange($event.target.files)"
                    style="display: none"
                  />
                </div>
                <div class="ml-2 flex flex-row my-auto" v-if="!edit">
                  <div
                    class="mr-1 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-300 transition-all cursor-pointer"
                    @click="moveOption(index, 'up')"
                  >
                    <i-fa icon="chevron-up" class="m-auto" />
                  </div>
                  <div
                    class="mr-1 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-300 transition-all cursor-pointer"
                    @click="moveOption(index)"
                  >
                    <i-fa icon="chevron-down" class="m-auto" />
                  </div>
                  <div
                    @click="removeOption(index)"
                    class="mr-0 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-red-500 transition-all cursor-pointer"
                  >
                    <i-fa icon="trash" class="m-auto" />
                  </div>
                </div>
              </div>
            </transition-group>
            <button
              v-show="typeChecker(question) && !edit"
              @click="addOption(question)"
              class="mt-2 ring ring-green-400 ring-opacity-30 border-green-400 border-opacity-50 focus:outline-none w-full rounded-xl p-2 text-lg text-green-400 transition-all"
            >
              <i-fa icon="plus" class="mr-1" />Add Option
            </button>
          </div>
        </transition>
      </div>
    </transition-group>
    <div class="flex justify-between">
      <div
        v-if="!edit"
        @click="newQuestion"
        class="bg-green-400 text-xl rounded-full text-white w-12 h-12 shadow-xl mt-3 flex cursor-pointer hover:shadow-none transition-all"
      >
        <i-fa icon="plus" class="m-auto" />
      </div>
      <div
        @click="saveQuestions"
        v-if="!edit"
        class="bg-indigo-400 text-xl rounded-xl px-3 justify-center items-center text-white shadow-xl mt-3 flex cursor-pointer hover:shadow-none transition-all"
      >
        Save
      </div>
      <div
        @click="updateQuestions"
        v-else-if="surveyEdit || edit"
        class="bg-green-400 text-xl rounded-xl py-2 px-5 justify-center items-center text-white shadow-xl mt-3 flex cursor-pointer hover:shadow-none transition-all"
      >
        Update
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["edit"],
  emits: ["save", "updated", "update"],
  data() {
    return {
      question: 0,
      option: null,
      url_host: import.meta.env.VITE_API_HOST,
      changed: true,
      questions: [
        {
          type: "choice",
          options: [
            {
              name: null,
            },
          ],
        },
      ],
    };
  },
  watch: {
    questions: {
      deep: true,
      handler: "updatedQuestions",
    },
  },
  methods: {
    newQuestion() {
      this.questions.push({
        type: "choice",
        name: "",
        options: [{ name: null }],
      });
      this.question++;
    },
    updatedQuestions() {
      if (!this.changed) this.$emit("updated", "updated");
      this.changed = true;
    },
    saveQuestions() {
      this.changed = false;
      this.$emit("save", this.questions);
    },
    updateQuestions() {
      this.changed = false;
      this.$emit("update", this.questions);
    },
    selectQuestion(index) {
      this.question = index;
    },
    emptyOptions(question) {
      question.options = [{ name: null }];
    },
    typeChecker(question) {
      if (question.type == "text" && question.options.length > 0) return false;
      else if (question.type == "image" && question.options.length > 2)
        return false;
      else if (question.type == "rate" && question.options.length > 9)
        return false;
      return true;
    },
    addOption(question) {
      if (this.typeChecker(question)) question.options.push({ name: null });
    },
    launchFilePicker(index) {
      this.option = index;
      this.$refs.file.click();
    },
    onFileChange(file) {
      let option = this.questions[this.question].options[this.option];
      const maxSize = 1024;
      let imageFile = file[0];
      if (file.length > 0) {
        option.size = imageFile.size / maxSize / maxSize;
        if (imageFile.type.match("image.*")) {
          option.file = imageFile;
          option.url = URL.createObjectURL(imageFile);
        }
        if (typeof FileReader === "function") {
          const reader = new FileReader();
          reader.onload = (event) => {
            option.url = event.target.result;
          };
          reader.readAsDataURL(option.file);
        } else {
          console.log("FileReader API not supported");
        }
      }
    },
    removeQuestion(i) {
      this.questions = this.questions.filter((q, index) => index != i);
    },
    removeOption(i) {
      this.questions[this.question].options = this.questions[
        this.question
      ].options.filter((q, index) => index != i);
    },
    duplicateQuestion() {
      var obj = Object.assign({}, this.questions[this.question]);
      this.questions.splice(this.question, 0, obj);
    },
    moveOption(index, direction) {
      if (!this.questions[this.question].options.length) return;
      let option = this.questions[this.question].options[index];
      if (direction && index != 0) {
        let tmp = this.questions[this.question].options[index - 1];
        this.questions[this.question].options[index - 1] = option;
        this.questions[this.question].options[index] = tmp;
      } else if (
        !direction &&
        index != this.questions[this.question].options.length - 1
      ) {
        let tmp = this.questions[this.question].options[index + 1];
        this.questions[this.question].options[index + 1] = option;
        this.questions[this.question].options[index] = tmp;
      }
    },
    sizeFilter(val) {
      if (val < 1) return parseInt(val * 1000) + "KB";
      return parseFloat(val).toFixed(1) + "MB";
    },
  },
  computed: {
    surveyEdit() {
      let survey = this.$store.getters.survey;
      if (this.edit && this.$store.getters.survey) {
        this.questions = survey.questions.map((q) => {
          q.type = q.question_type.type;
          return q;
        });
      } else {
        this.questions = [
          {
            type: "choice",
            options: [
              {
                name: null,
              },
            ],
          },
        ];
      }
      return null;
    },
  },
};
</script>


<style>
</style>