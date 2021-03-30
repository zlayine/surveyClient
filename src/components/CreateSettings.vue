<template>
  <div
    class="w-full bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
  >
    <h1 class="text-2xl mb-5">Settings</h1>
    <label class="block sm:w-1/2 mb-3">
      <span class="text-gray-700">Survey name</span>
      <input
        type="text"
        v-model="survey.name"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </label>
    <label class="block sm:w-1/2 mb-3">
      <span class="text-gray-700">Description</span>
      <textarea
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        rows="3"
        v-model="survey.description"
      ></textarea>
    </label>
    <label class="block sm:w-1/2 mb-3">
      <span class="text-gray-700">Organization</span>
      <div class="flex w-full sm:w-2/3 relative" v-if="!edit">
        <div
          class="flex justify-center items-center text-black text-xl w-1/2 h-full rounded-xl mt-1 cursor-pointer shadow-md bg-white border border-gray-100 hover:shadow-none transition-all ring-indigo-300"
          :class="{ ring: survey.organization == '1337' }"
          @click="survey.organization = defaultOrg"
        >
          <div class="w-20 bg-white m-1">
            <img class="m-auto h-9" :src="logo1337" alt="img 1337" />
          </div>
        </div>

        <div
          v-if="!createOrg"
          class="flex justify-center items-center text-sm text-black w-1/2 h-full rounded-xl mt-1 ml-2 cursor-pointer shadow-md bg-white border border-gray-100 hover:shadow-none transition-all ring-indigo-300 max-h-11 relative z-10"
          :class="{ ring: survey.organization == user.organization._id }"
          @click="survey.organization = user.organization._id"
        >
          <div class="w-10 bg-white m-1">
            <img
              class="my-auto h-9"
              :src="url_host + user.organization.logo_url"
              alt="img 1337"
            />
          </div>
          {{ user.organization.name }}
        </div>
        <div
          v-if="!createOrg"
          @click="deleteOrganization"
          class="bg-red-500 z-0 h-11 w-11 mt-1 -right-9 absolute rounded-r-xl flex justify-center items-center cursor-pointer hover:bg-opacity-80 transition-all"
        >
          <i-fa class="text-xl text-white ml-1 shadow-md" icon="trash" />
        </div>

        <div
          @click="show = true"
          v-if="createOrg"
          class="flex justify-center items-center text-white text-xl border border-gray-200 w-1/2 h-full p-2 rounded-xl mt-1 ml-2 cursor-pointer shadow-md bg-indigo-400 hover:shadow-none transition-all"
        >
          <i-fa
            class="block h-full border-gray-300 text-xl my-auto mr-3 text-white"
            icon="plus"
          />
          Add
        </div>
      </div>
      <div class="flex w-full sm:w-2/3 relative" v-else>
        <div
          v-if="!survey.organization"
          class="flex justify-center ring items-center text-black text-xl w-1/2 h-full rounded-xl mt-1 cursor-pointer shadow-md bg-white border border-gray-100 hover:shadow-none transition-all ring-indigo-300"
        >
          <div class="w-20 bg-white m-1">
            <img class="m-auto h-9" :src="logo1337" alt="img 1337" />
          </div>
        </div>

        <div
          v-else-if="survey.organization.logo_url"
          class="flex justify-center ring items-center text-sm text-black w-1/2 h-full rounded-xl mt-1 cursor-pointer shadow-md bg-white border border-gray-100 hover:shadow-none transition-all ring-indigo-300 max-h-11 relative z-10"
        >
          <div class="w-10 bg-white m-1">
            <img
              class="my-auto h-9"
              :src="url_host + survey.organization.logo_url"
              alt="img org"
            />
          </div>
          {{ survey.organization.name }}
        </div>
      </div>
    </label>
    <label class="block sm:w-1/2 mb-5">
      <span class="text-gray-700">Campus</span>
      <div class="flex w-full">
        <div
          class="flex justify-center items-center text-lg text-black w-1/3 h-full p-2 rounded-xl mt-1 cursor-pointer shadow-md bg-white border border-gray-100 hover:shadow-none transition-all ring-indigo-300 max-h-11 overflow-hidden"
          :class="{ ring: survey.campus == 'All' }"
          @click="survey.campus = 'All'"
        >
          All
        </div>
        <div
          class="flex justify-center items-center text-lg text-black w-1/3 h-full p-2 rounded-xl mt-1 ml-2 cursor-pointer shadow-md bg-white border border-gray-100 hover:shadow-none transition-all ring-indigo-300 max-h-11 overflow-hidden"
          :class="{ ring: survey.campus == 'Khouribga' }"
          @click="survey.campus = 'Khouribga'"
        >
          Khouribga
        </div>
        <div
          class="flex justify-center items-center text-lg text-black w-1/3 h-full p-2 rounded-xl mt-1 ml-2 cursor-pointer shadow-md bg-white border border-gray-100 hover:shadow-none transition-all ring-indigo-300 max-h-11 overflow-hidden"
          :class="{ ring: survey.campus == 'Benguerir' }"
          @click="survey.campus = 'Benguerir'"
        >
          Benguerir
        </div>
      </div>
    </label>
    <div class="w-1/2 flex justify-between">
      <button
        @click="$emit('save', survey)"
        v-if="!edit"
        class="bg-green-400 rounded-xl mt-auto px-6 py-2 text-white shadow-md focus:outline-none hover:shadow-none transition-all"
      >
        Save
      </button>
      <div class="flex flex-col justify-center items-center mt-5" v-if="!edit">
        <span class="mb-2">Ready to publish ?</span>
        <button
          @click="$emit('publish')"
          class="bg-indigo-400 rounded-xl px-6 py-1 text-white shadow-md text-lg focus:outline-none hover:shadow-none transition-all"
        >
          Publish
        </button>
      </div>
      <button
        @click="$emit('update', survey)"
        v-if="edit"
        class="bg-green-400 rounded-xl px-6 py-2 text-white shadow-md focus:outline-none hover:shadow-none transition-all"
      >
        Update
      </button>
      <button
        @click="$emit('delete')"
        v-if="surveyEdit || edit"
        class="bg-red-500 rounded-xl px-6 py-2 text-white shadow-md focus:outline-none hover:shadow-none transition-all"
      >
        Delete
      </button>
    </div>

    <create-organization
      v-show="show"
      @save="saveOrganization"
      @cancel="show = false"
    />
  </div>
</template>

<script>
import CreateOrganization from "../components/CreateOrganization.vue";
import logo from "@/assets/1337.svg";

export default {
  props: ["edit"],
  emits: ["save", "publish", "update"],
  data() {
    return {
      show: false,
      logo1337: logo,
      defaultOrg: "1337",
      url_host: import.meta.env.VITE_API_HOST,
      survey: {
        name: null,
        description: null,
        organization: !this.edit ? "1337" : null,
        campus: "All",
      },
    };
  },
  methods: {
    saveOrganization() {},
  },
  computed: {
    surveyEdit() {
      let survey = this.$store.getters.survey;
      if (this.edit && this.$store.getters.survey) {
        this.survey._id = survey._id;
        this.survey.name = survey.name;
        this.survey.description = survey.description;
        this.survey.campus = survey.campus;
        this.survey.organization = survey.organization;
      } else {
        this.survey = {
          name: null,
          description: null,
          organization: "1337",
          campus: "All",
        };
      }
      return null;
    },
    user() {
      return this.$store.getters.user;
    },
    createOrg() {
      if (this.user && this.user.organization) return false;
      return true;
    },
    deleteOrganization() {
      this.$store.dispatch("deleteOrganization");
    },
  },
  components: {
    CreateOrganization,
  },
};
</script>

<style>
</style>