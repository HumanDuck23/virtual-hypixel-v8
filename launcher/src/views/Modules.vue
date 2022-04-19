<template>
  <div>
    <v-snackbar absolute bottom left v-model="pathSnack" color="error darken-2" :timeout="20000">
      <v-icon class="mr-2">
        mdi-alert-decagram-outline
      </v-icon>
      Please set the module folder in the settings!
      <v-btn text class="ml-2" to="/settings">
        <v-icon class="mr-2">mdi-open-in-new</v-icon>
        Open
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Modules",

  data: () => ({
    modules: [],
    moduleConfigs: {},

    pathSnack: false
  }),

  mounted() {
    this.moduleConfigs = JSON.parse(localStorage.getItem("moduleConfigs")) || {}
    const modulePath = JSON.parse(localStorage.getItem("settings"))?.modules?.path || ""
    if (!modulePath) {
      this.pathSnack = true
    }
  }
}
</script>

<style scoped>

</style>