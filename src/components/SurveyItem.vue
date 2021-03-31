<template>
  <div class="survey w-full sm:w-1/2 flex sm:p-3 h-56 mb-5">
    <div
      class="bg-white w-full flex flex-row p-2 rounded-lg shadow-xl h-56 relative overflow-hidden"
    >
      <router-link :to="`/editsurvey/${survey._id}`">
        <button
          class="absolute w-8 h-8 sm:w-10 sm:h-10 focus:outline-none outline-none bg-indigo-200 rounded-bl-lg top-0 right-0 sm:-right-1 sm:-top-1 flex justify-center cursor-pointer shadow-lg hover:shadow-none transition-all"
        >
          <i-fa
            class="text-indigo-600 text-xl mt-auto mr-auto ml-1.5 mb-1.5 sm:ml-2 sm:mb-2"
            icon="edit"
          />
        </button>
      </router-link>
      <div
        class="user sm:flex w-28 hidden mb-auto rounded-full overflow-hidden shadow-md sm:mx-5"
      >
        <img
          class="w-28 h-28 overflow-hidden rounded-full"
          v-if="survey.organization"
          :src="url_host + survey.organization.logo_url"
          alt="user img"
        />
        <img
          class="w-28 h-28 p-3 border border-gray-100 overflow-hidden rounded-full"
          v-else
          :src="logo1337"
          alt="user img"
        />
      </div>
      <div class="flex-1 flex flex-col">
        <div class="flex mb-2 sm:mb-0 justify-start">
          <div
            class="flex sm:hidden w-16 mb-auto rounded-full overflow-hidden shadow-md mr-2 sm:mx-5"
          >
            <img
              class="w-28 h-28 overflow-hidden rounded-full"
              v-if="survey.organization"
              :src="url_host + survey.organization.logo_url"
              alt="logo img"
            />
            <img
              class="w-16 h-16 p-3 border border-gray-100 overflow-hidden rounded-full"
              v-else
              :src="logo1337"
              alt="logo img"
            />
          </div>
          <div class="flex flex-1 flex-col my-auto">
            <div
              class="text-sm sm:text-xl uppercase font-bold tracking-wider break-words mr-8"
            >
              {{ survey.name }}
            </div>
            <div class="subtitle flex mb-1">
              <h6 class="username mr-1 text-sm text-gray-500">
                {{ survey.user.username }}
              </h6>
              <h6 class="date text-sm text-gray-600">
                {{ formatDate(survey.createdAt) }}
              </h6>
            </div>
          </div>
        </div>
        <div class="flex mb-2.5" v-if="user && user._id == survey.user._id">
          <span
            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 mr-2"
            v-if="survey.campus != 'Benguerir'"
          >
            Khouribga
          </span>
          <span
            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 mr-2"
            v-if="survey.campus != 'Khouribga'"
          >
            Benguerir
          </span>
          <span
            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 mr-2"
          >
            {{ survey.answers }} answers
          </span>
        </div>
        <div class="text-sm sm:text-base break-words mb-2">
          {{ survey.description }}
        </div>
        <div class="flex justify-center mt-auto mx-auto mb-4">
          <router-link :to="`/survey/${survey._id}`">
            <button
              class="bg-green-500 text-white sm:w-40 rounded-lg sm:text-xl px-5 py-1 shadow-md hover:shadow-none focus:outline-none transition-all"
            >
              Start Survey
            </button>
          </router-link>
          <router-link :to="`/stats/${survey._id}`">
            <button
              class="bg-indigo-500 text-white sm:w-40 ml-3 rounded-lg sm:text-xl px-5 py-1 shadow-md hover:shadow-none focus:outline-none transition-all"
            >
              Answers
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import logo from "@/assets/1337.svg";

export default {
  props: ["survey"],
  data() {
    return {
      logo1337: logo,
      url_host: import.meta.env.VITE_API_HOST,
    };
  },
  methods: {
    formatDate(val) {
      return moment(String(val)).format("DD/MM/YYYY");
    },
    
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.survey {
  &:first-child {
    margin-left: 0px !important;
  }
  .date {
    &::before {
      content: "at ";
    }
  }
}
</style>