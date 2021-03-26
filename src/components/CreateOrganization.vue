<template>
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
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
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3
                class="text-lg leading-6 font-medium text-gray-900 text-center"
                id="modal-title"
              >
                Create Organization
              </h3>
              <div class="mt-5">
                <label class="block w-2/3 mb-3">
                  <span class="text-gray-700">Name</span>
                  <input
                    type="text"
                    v-model="name"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder=""
                  />
                </label>
                <div
                  class="w-2/3 flex rounded-md bg-gray-200 bg-opacity-40 border-0 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 cursor-pointer"
                  @click="launchFilePicker()"
                >
                  <div class="p-2 ml-3 h-12 flex" v-if="!url">
                    <i-fa icon="plus" class="my-auto mr-2" />
                    <span class="my-auto"> Add Image </span>
                  </div>
                  <img
                    v-if="url"
                    class="h-12 w-20 object-contain"
                    :src="url"
                    alt=""
                  />
                  <div
                    class="flex flex-1 p-2 justify-between m-auto"
                    v-if="url"
                  >
                    <div class="">{{ sizeFilter(size) }}</div>
                  </div>
                </div>
                <input
                  type="file"
                  ref="file"
                  @change="onFileChange($event.target.files)"
                  style="display: none"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
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
  data() {
    return {
      name: null,
      file: null,
      url: null,
      size: null,
    };
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    sizeFilter(val) {
      if (val < 1) return parseInt(val * 1000) + "KB";
      return parseFloat(val).toFixed(1) + "MB";
    },
    onFileChange(file) {
      const maxSize = 1024;
      let imageFile = file[0];
      if (file.length > 0) {
        this.size = imageFile.size / maxSize / maxSize;
        if (imageFile.type.match("image.*")) {
          this.file = imageFile;
          this.url = URL.createObjectURL(imageFile);
        }
        if (typeof FileReader === "function") {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.url = event.target.result;
          };
          reader.readAsDataURL(this.file);
        } else {
          console.log("FileReader API not supported");
        }
      }
    },
  },
};
</script>

<style>
</style>