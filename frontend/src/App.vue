<template>
  <NavigatorComponent/>
  <LibraryComponent/>
  <WriterComponent/>
</template>

<script>
import NavigatorComponent from './components/Navigator.vue'
import WriterComponent from './components/Writer.vue'
import LibraryComponent from './components/Library.vue'

export default {
  name: 'App',
  components: {
    NavigatorComponent,
    WriterComponent,
    LibraryComponent,
  }
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: LXGW WenKai Screen R;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
