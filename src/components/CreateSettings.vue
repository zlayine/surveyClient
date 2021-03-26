<template>
  <div
    class="w-full bg-white ring-1 mb-5 ring-gray-300 ring-opacity-50 shadow-lg rounded-xl p-5"
  >
    <h1 class="text-2xl mb-5">Settings</h1>
    <label class="block w-1/2 mb-3">
      <span class="text-gray-700">Survey name</span>
      <input
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder=""
      />
    </label>
    <label class="block w-1/2 mb-3">
      <span class="text-gray-700">Description</span>
      <textarea
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        rows="3"
      ></textarea>
    </label>
    <label class="block w-1/2 mb-3">
      <span class="text-gray-700">Organization</span>
      <div class="flex w-full">
        <select
          class="block mt-1 flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option>1337</option>
          <option>Org 1</option>
          <option>Org 2</option>
        </select>
        <div
          @click="show = true"
          class="flex h-full p-2 rounded-md mt-1 ml-2 cursor-pointer shadow-sm bg-indigo-300"
        >
          <i-fa
            class="block h-full border-gray-300 text-2xl text-white"
            icon="plus"
          />
        </div>
      </div>
    </label>
    <label class="block w-1/2 mb-5">
      <span class="text-gray-700">Campus</span>
      <select
        class="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option>All</option>
        <option>Khouribga</option>
        <option>Benguerir</option>
      </select>
    </label>
    <label class="block w-1/2 mb-3">
      <div class="mt-2">
        <div>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span class="ml-2">Public statistics</span>
          </label>
        </div>
      </div>
    </label>
    <button
      class="bg-green-400 rounded-xl px-6 py-2 text-white shadow-md focus:outline-none hover:shadow-none transition-all"
    >
      Save
    </button>
    <div class="flex flex-col w-full justify-center items-center mt-5">
      <span class="mb-2">Ready to publish ?</span>
      <button
        class="bg-indigo-400 rounded-xl px-6 py-1 text-white shadow-md text-lg focus:outline-none hover:shadow-none transition-all"
      >
        Publish
      </button>
    </div>
    <create-organization v-show="show" @cancel="show = false" />
  </div>
</template>

<script>
import CreateOrganization from "../components/CreateOrganization.vue";

export default {
  data() {
    return {
      show: false,
    };
  },
  components: {
    CreateOrganization,
  },
};
</script>

<style>
</style>