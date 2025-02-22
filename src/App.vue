<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "App",

  data() {
    return {
      //
    }
  },
})
</script>

<style scoped>
* {
  padding: 0 !important;
}
</style>
