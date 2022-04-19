<template>
  <div>
    <v-card class="ma-5" color="primary">
      <v-card-title>Settings</v-card-title>
      <v-card-text>
        <v-text-field outlined @click:prepend-inner="pickFolder" label="Module Folder" prepend-inner-icon="mdi-folder-open-outline" v-model="settings.modulePath" color="accent"/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Settings",

  data: () => ({
    settings: {
      modulePath: ""
    }
  }),

  mounted() {
    if (localStorage.getItem("settings")) {
      this.settings = JSON.parse(localStorage.getItem("settings"))
    }
  },

  methods: {
    pickFolder() {
      if (window.windowAPI) {
        window.windowAPI.folderDialog()
          .then(folder => {
            this.settings.modulePath = folder[0]
          })
      }
    }
  },

  watch: {
    settings: {
      handler: function(val) {
        localStorage.setItem("settings", JSON.stringify(val))
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>