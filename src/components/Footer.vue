<template>
  <footer class="footer font-medium text-lg">
    Made with
    <i-fa
      @click="$emit('start')"
      icon="heart"
      class="text-red-500 text-2xl cursor-pointer"
    />
    for 1337
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer {
  padding: 20px;
  box-shadow: 0 0 5px #0202021a;
  background-color: #fff;
  width: 100%;
  position: absolute;
  clear: both;
  bottom: 0;
  left: 0;
  text-align: center;
}
</style>