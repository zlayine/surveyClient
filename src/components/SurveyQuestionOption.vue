<template>
  <template v-if="type == 'choice'">
    <div class="w-full sm:w-1/2">
      <div
        class="w-auto ring ring-indigo-300 ring-opacity-50 rounded-xl bg-white text-center text-xl px-2 py-4 sm:px-5 sm:py-10 m-3 cursor-pointer hover:bg-indigo-100 hover:text-indigo-400 transition-all"
        :class="{
          'bg-indigo-100': selected,
          'text-indigo-400': selected,
          'pointer-events-none': disabled,
        }"
        @click="$emit('click', item)"
      >
        {{ item.name }}
      </div>
    </div>
  </template>
  <template v-else-if="type == 'multiple'">
    <div class="w-1/2">
      <div
        class="w-auto ring ring-indigo-300 ring-opacity-50 rounded-xl bg-white text-center text-xl px-5 py-10 m-3 cursor-pointer hover:bg-indigo-100 hover:text-indigo-400 transition-all"
        :class="{
          'bg-indigo-100': selected,
          'text-indigo-400': selected,
          'pointer-events-none': disabled,
        }"
        @click="$emit('click', item)"
      >
        {{ item.name }}
      </div>
    </div>
  </template>
  <template v-else-if="type == 'rate'">
    <div
      class="py-4 px-5 bg-white ring-2 ring-indigo-300 ring-opacity-50 rounded-lg text-center m-2 cursor-pointer hover:bg-indigo-100 hover:text-indigo-400 transition-all"
      :class="{
        'bg-indigo-100': selected,
        'text-indigo-400': selected,
        'pointer-events-none': disabled,
      }"
      @click="$emit('click', item)"
    >
      {{ item.name }}
    </div>
  </template>
  <template v-else-if="type == 'text' && !disabled">
    <textarea
      class="block w-full mt-3 rounded-lg text-xl border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mx-3 sm:mx-0"
      :disabled="disabled"
      rows="6"
      v-model="input"
      @input="$emit('input', { id: item._id, input: input })"
      :placeholder="item.name"
    ></textarea>
  </template>
  <template v-else-if="type == 'image'">
    <div class="sm:w-1/3 p-3 relative flex">
      <img
        class="w-auto m-auto object-contain max-h-80 overflow-hidden rounded-lg ring ring-indigo-300 ring-opacity-50 cursor-pointer transition-all"
        :class="{ 'filter-blur': selected, 'pointer-events-none': disabled }"
        :src="url_host + item.name"
        @click="$emit('click', item)"
        alt="image survey"
      />
      <i-fa
        v-show="selected"
        class="text-5xl ring-2 ring-indigo-300 text-indigo-500 bg-white rounded-full absolute top-1/2 left-1/2 transition-all -ml-5 -mt-5"
        icon="check-circle"
      />
    </div>
  </template>
  <!-- <template v-else-if="type == 'slider'">
		<input class="focus:outline-none w-2/3" type="range" name="rangeInput" min="0" max="5" value="0">  
	</template> -->
</template>

<script>
export default {
  props: ["type", "item", "select", "disabled"],
  emits: ["click", "input"],
  data() {
    return {
      input: null,
      url_host: import.meta.env.VITE_API_HOST,
    };
  },
  methods: {},
  computed: {
    selected() {
      if (this.disabled) return false;
      if (this.type != "multiple") return this.item == this.select[0];
      else return this.select.filter((s) => s == this.item).length;
    },
  },
};
</script>
