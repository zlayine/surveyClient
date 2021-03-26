<template>
  <div class="create flex flex-col">
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
              class="rounded-xl cursor-pointer text-lg font-bold text-white h-10 w-auto pl-5 pr-10 bg-green-400 border-none focus:outline-none appearance-none transition-all"
              :class="{ 'bg-indigo-300': this.question != index }"
            >
              <option value="0">Question type</option>
              <option>Choice</option>
              <option>Multiple</option>
              <option>Rate</option>
              <option>Paragraph</option>
              <option>Image</option>
            </select>
          </div>
        </div>
        <div class="actions flex">
          <div
            class="mr-1 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-300 transition-all cursor-pointer"
            @click="duplicateQuestion"
          >
            <i-fa icon="copy" class="m-auto" />
          </div>
          <div
            @click="removeQuestion(index)"
            class="mr-0 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-red-300 transition-all cursor-pointer"
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
          v-model="question.title"
          class="block w-full rounded-lg text-xl resize-none bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows="3"
        ></textarea>
      </div>
      <transition name="expand" appear mode="out-in">
        <div
          class="answers mt-3 relative"
          :class="{ 'pointer-events-none': this.question != index }"
          v-show="this.question == index && question.type != 0"
        >
          <span
            class="text-sm font-bold text-gray-300"
            v-if="question.answers.length"
            >Options</span
          >
          <div
            class="mb-2 mt-2 flex flex-row"
            v-for="(answer, index) in question.answers"
            :key="index"
          >
            <input
              class="flex-1 py-3 block w-full rounded-md bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              type="text"
              v-if="question.type != 'Image'"
              v-model="answer.name"
              placeholder="name"
            />
            <div class="flex-1 flex" v-else>
              <div
                class="w-full flex rounded-md bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-pointer"
                @click="launchFilePicker(index)"
              >
                <div class="p-2 ml-3 h-12 flex" v-if="!answer.url">
                  <i-fa icon="plus" class="my-auto mr-2" />
                  <span class="my-auto"> Add Image </span>
                </div>
                <img
                  v-if="answer.url"
                  class="h-12 w-20 object-contain"
                  :src="answer.url"
                  alt=""
                />
                <div
                  class="flex flex-1 p-2 justify-between m-auto"
                  v-if="answer.url"
                >
                  <div>{{ answer.name.name }}</div>
                  <div class="">{{ sizeFilter(answer.size) }}</div>
                </div>
              </div>
              <input
                type="file"
                ref="file"
                @change="onFileChange($event.target.files)"
                style="display: none"
              />
            </div>
            <div class="ml-2 flex flex-row my-auto">
              <div
                class="mr-1 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-300 transition-all cursor-pointer"
                @click="moveAnswer(index, 'up')"
              >
                <i-fa icon="chevron-up" class="m-auto" />
              </div>
              <div
                class="mr-1 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-300 transition-all cursor-pointer"
                @click="moveAnswer(index)"
              >
                <i-fa icon="chevron-down" class="m-auto" />
              </div>
              <div
                @click="removeAnswer(index)"
                class="mr-0 h-8 p-2 flex rounded-xl focus:outline-none text-gray-400 hover:text-white hover:bg-red-300 transition-all cursor-pointer"
              >
                <i-fa icon="trash" class="m-auto" />
              </div>
            </div>
          </div>
          <button
            v-show="typeChecker(question)"
            @click="addAnswer(question)"
            class="mt-2 ring ring-green-400 ring-opacity-30 border-green-400 border-opacity-50 focus:outline-none w-full rounded-xl p-2 text-lg text-green-400 transition-all"
          >
            <i-fa icon="plus" class="mr-1" />Add Option
          </button>
        </div>
      </transition>
    </div>
    <div
      @click="newQuestion"
      class="bg-green-400 text-xl rounded-full text-white w-12 h-12 shadow-xl mt-3 flex cursor-pointer hover:shadow-none transition-all"
    >
      <i-fa icon="plus" class="m-auto" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: 0,
      answer: null,
      questions: [
        {
          type: "Choice",
          answers: [
            {
              name: null,
            },
          ],
        },
      ],
    };
  },
  methods: {
    newQuestion() {
      this.questions.push({ type: "Choice", title: null, answers: [] });
      this.question++;
    },
    selectQuestion(index) {
      this.question = index;
    },
    typeChecker(question) {
      if (question.type == "Paragraph" && question.answers.length > 0)
        return false;
      else if (question.type == "Image" && question.answers.length > 2)
        return false;
      else if (question.type == "Rate" && question.answers.length > 9)
        return false;
      return true;
    },
    addAnswer(question) {
      if (this.typeChecker(question)) question.answers.push({ name: null });
    },
    launchFilePicker(index) {
      this.answer = index;
      this.$refs.file.click();
    },
    onFileChange(file) {
      let answer = this.questions[this.question].answers[this.answer];
      const maxSize = 1024;
      let imageFile = file[0];
      if (file.length > 0) {
        answer.size = imageFile.size / maxSize / maxSize;
        if (imageFile.type.match("image.*")) {
          answer.name = imageFile;
          answer.url = URL.createObjectURL(imageFile);
        }
        if (typeof FileReader === "function") {
          const reader = new FileReader();
          reader.onload = (event) => {
            answer.url = event.target.result;
          };
          reader.readAsDataURL(answer.name);
        } else {
          console.log("FileReader API not supported");
        }
      }
    },
    removeQuestion(i) {
      this.questions = this.questions.filter((q, index) => index != i);
    },
    removeAnswer(i) {
      this.questions[this.question].answers = this.questions[
        this.question
      ].answers.filter((q, index) => index != i);
    },
    duplicateQuestion() {
      var obj = Object.assign({}, this.questions[this.question]);
      this.questions.splice(this.question, 0, obj);
    },
    moveAnswer(index, direction) {
      if (!this.questions[this.question].answers.length) return;
      let answer = this.questions[this.question].answers[index];
      if (direction && index != 0) {
        let tmp = this.questions[this.question].answers[index - 1];
        this.questions[this.question].answers[index - 1] = answer;
        this.questions[this.question].answers[index] = tmp;
      } else if (!direction && index != this.questions[this.question].answers.length - 1) {
        let tmp = this.questions[this.question].answers[index + 1];
        this.questions[this.question].answers[index + 1] = answer;
        this.questions[this.question].answers[index] = tmp;
      }
    },
    sizeFilter(val) {
      if (val < 1) return parseInt(val * 1000) + "KB";
      return parseFloat(val).toFixed(1) + "MB";
    },
  },
  computed: {},
};
</script>


<style>
.create .answers {
  will-change: height;
}
</style>