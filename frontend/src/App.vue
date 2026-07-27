<template>
  <v-app>
    <PosView />
  </v-app>
</template>

<script>
import PosView from "./views/PosView.vue";

export default {
  name: "App",

  components: {
    PosView
  }
};
</script>