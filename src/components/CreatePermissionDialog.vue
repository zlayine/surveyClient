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
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3
                class="text-xl leading-6 font-medium text-gray-900 text-center"
                id="modal-title"
              >
                Ask permission
              </h3>
              <label class="block w-full mt-4 mb-3 mx-auto" v-if="enabled">
                <span class="text-gray-700"
                  >Describe your need to create a survey ?</span
                >
                <textarea
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows="6"
                  v-model="description"
                ></textarea>
              </label>
              <div class="py-10" v-else>
                Your permission is already created and waiting for approval
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="createPermission"
						v-if="enabled"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Create
          </button>
          <button
            @click="$emit('cancel')"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["cancel"],
  data() {
    return {
      description: null,
      enabled: true,
    };
  },
  async mounted() {
    let perm = await this.getPermission();
    if (perm) this.enabled = false;
  },
  methods: {
    async getPermission() {
      return await this.$store.dispatch("getUserPermission");
    },
    async createPermission() {
      let res = await this.$store.dispatch(
        "createPermission",
        this.description
      );
      if (res) this.$emit("cancel");
    },
  },
  computed: {},
};
</script>

<style>
</style>