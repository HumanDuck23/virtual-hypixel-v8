<template>
  <div>
    <v-card class="ma-5" color="primary">
      <v-card-title>Modules</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="module in modules" :key="module.manifest.id">
              <v-card color="primary">
                <v-card-title>
                  <v-icon class="mr-2">{{ module.manifest.icon || "mdi-package-variant-closed" }}</v-icon>
                  {{ module.manifest.name }}
                </v-card-title>
                <v-card-subtitle>By {{ module.manifest.author }}</v-card-subtitle>
                <v-card-text>
                  {{ module.manifest.description }}
                </v-card-text>
                <v-card-actions>
                  <v-switch class="mb-n4 ml-2" color="accent" v-model="moduleConfigs[module.manifest.id].enabled"></v-switch>
                  <v-spacer />
                  <v-btn icon color="accent" class="mb-n3" :to="`/module/${module.manifest.id}`">
                    <v-icon>mdi-cog-outline</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

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
    const modulePath = JSON.parse(localStorage.getItem("settings"))?.modulePath || ""
    if (!modulePath) {
      this.pathSnack = true
    } else {
      if (window.moduleAPI) {
        window.moduleAPI.getModules(modulePath)
            .then(modules => {
              this.modules = modules
              for (const module of this.modules) {
                if (!this.moduleConfigs[module.manifest.id]) {
                  this.moduleConfigs[module.manifest.id] = {
                    enabled: true
                  }
                }
                const defaultVal = (type) => {
                  switch (type) {
                    case "text":
                      return ""
                    case "number":
                      return 0
                    case "choice":
                      return ""
                    case "list":
                      return []
                    case "bool":
                      return true
                    case "range":
                      return [0,5]
                  }
                }
                for (const option of Object.keys(module.config)) {
                  if (this.moduleConfigs[module.manifest.id][option] === undefined) {
                    this.moduleConfigs[module.manifest.id][option] = defaultVal(module.config[option].type)
                  }
                }
              }
              localStorage.setItem("moduleConfigs", JSON.stringify(this.moduleConfigs))
            })
      }
    }
  },

  watch: {
    moduleConfigs: {
      handler: function (moduleConfigs) {
        localStorage.setItem("moduleConfigs", JSON.stringify(moduleConfigs))
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>