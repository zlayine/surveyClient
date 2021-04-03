<template>
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex flex-col sm:items-start" v-if="survey">
            <!-- <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              
            </div> -->
            <div class="flex mb-3">
              <div
                class="w-16 flex mb-auto rounded-full overflow-hidden shadow-md mr-3 sm:mr-5"
              >
                <img
                  class="w-16 h-16 overflow-hidden rounded-full"
                  v-if="survey.organization"
                  :src="url_host + survey.organization.logo_url"
                  alt="user img"
                />
                <img
                  class="w-16 h-16 p-3 border border-gray-100 overflow-hidden rounded-full"
                  v-else
                  :src="logo1337"
                  alt="user img"
                />
              </div>
              <div class="flex flex-1 flex-col my-auto">
                <div
                  class="text-sm sm:text-xl uppercase font-bold tracking-wider break-words"
                >
                  {{ survey.name }}
                </div>
                <div class="subtitle flex mb-1">
                  <h6 class="username mr-1 text-gray-500">
                    {{ survey.user.username }}
                  </h6>
                  <h6 class="date text-gray-600">
                    at {{ formatDate(survey.createdAt) }}
                  </h6>
                </div>
              </div>
            </div>
            <div class="flex mb-2.5">
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
            </div>
            <div class="text-sm sm:text-base break-words mb-2">
              {{ survey.description }}
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-auto mx-auto mb-4">
          <button
            type="button"
            @click="$emit('cancel')"
            class="bg-green-500 text-white sm:w-40 rounded-lg sm:text-xl px-5 py-1 shadow-md hover:shadow-none focus:outline-none transition-all"
          >
            Start Survey
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/1337.svg";
import moment from "moment";

export default {
  props: ["survey"],
  emits: ["cancel"],
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
};
</script>

<style lang="scss" scoped>
</style>