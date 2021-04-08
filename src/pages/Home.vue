<template>
  <div class="lg:container mx-auto pt-5 px-3 sm:px-10 mb-32">
    <filter-layout @change="changeFilter" :current="filter" />
    <div class="w-full sm:w-1/4 mx-auto" v-if="!surveys.length">
      <img class="w-full" :src="empty_img" alt="empty image" />
      <div class="text-center mt-2 text-xl">
        No surveys around this corner..
      </div>
    </div>
    <div class="flex flex-row justify-between mt-3 flex-wrap">
      <survey-item v-for="item in surveys" :key="item._id" :survey="item" />
    </div>
    <div class="py-2 mt-10" v-if="pages > 1">
      <nav class="block">
        <ul class="flex pl-0 rounded list-none justify-center flex-wrap">
          <div
            v-show="page > 1"
            @click="changePage(page - 1)"
            class="first:ml-0 text-lg font-semibold flex w-10 h-10 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-indigo-500 text-white cursor-pointer transition-all bg-indigo-500 shadow-md hover:shadow-none"
          >
            <i-fa class="" icon="chevron-left" />
          </div>
          <li v-for="p in pages" :key="p">
            <div
              @click="changePage(p)"
              v-if="page - p < 3 && p - page < 3"
              class="first:ml-0 text-lg font-semibold flex w-10 h-10 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-indigo-500 bg-white text-white cursor-pointer transition-all shadow-md hover:shadow-none"
              :class="{
                'bg-indigo-500': page == p,
                'text-indigo-500': page != p,
              }"
            >
              {{ p }}
            </div>
          </li>
          <div
            v-show="page < pages"
            @click="changePage(page + 1)"
            class="first:ml-0 text-lg font-semibold flex w-10 h-10 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-indigo-500 text-white cursor-pointer transition-all bg-indigo-500 shadow-md hover:shadow-none"
          >
            <i-fa class="" icon="chevron-right" />
          </div>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import FilterLayout from "@/components/Filter.vue";
import SurveyItem from "@/components/SurveyItem.vue";
import emptyImage from "@/assets/empty_img.svg";

export default {
  data() {
    return {
      empty_img: emptyImage,
      filter: "new",
      page: 1,
    };
  },
  async created() {
    let page = this.$route.query.page;
    let filter = this.$route.query.filter;
    if (page) this.page = page;
    if (filter) this.filter = filter;

    this.$router.replace({ query: { filter: this.filter, page: this.page } });
    this.fetchSurveys();
  },

  methods: {
    async fetchSurveys() {
      let args = { page: this.page, filter: this.filter };
      await this.$store.dispatch("getSurveys", args);
    },
    changePage(page) {
      this.page = page;
      this.$router.replace({ query: { filter: this.filter, page: this.page } });
      window.scrollTo(0, 0);
      this.fetchSurveys();
    },
    changeFilter(filter) {
      this.filter = filter;
      this.$router.replace({ query: { filter: this.filter, page: this.page } });
      this.fetchSurveys();
    },
  },
  computed: {
    surveys() {
      return this.$store.getters.surveys;
    },
    pages() {
      return this.$store.getters.totalSurveys;
    },
  },
  components: {
    FilterLayout,
    SurveyItem,
  },
};
</script>

<style>
</style>