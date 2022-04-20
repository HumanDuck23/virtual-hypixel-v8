<template>
  <div>
    <v-card class="ma-5" color="primary" v-if="module.manifest">
      <v-card-title>
        <div>
          <v-btn icon color="accent" class="mr-2" to="/modules">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </div>
        {{ module.manifest.name }}
      </v-card-title>
      <v-card-subtitle class="ml-11">
        By {{ module.manifest.author }}
      </v-card-subtitle>
      <v-card-text>
        <v-container fluid v-if="module.config">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="c in Object.keys(config).filter((c) => c !== 'enabled')"
                   :key="c">
              <v-text-field outlined v-if="module.config[c].type === 'text' || module.config[c].type === 'number'"
                            v-model="config[c]" :label="module.config[c].label" :type="module.config[c].type"
                            color="accent"></v-text-field>
              <v-select outlined v-else-if="module.config[c].type === 'choice'" :items="module.config[c].options"
                        v-model="config[c]" :label="module.config[c].label" color="accent" item-color="accent"></v-select>
              <v-switch v-else-if="module.config[c].type === 'bool'" v-model="config[c]" :label="module.config[c].label" color="accent"></v-switch>
              <div v-else-if="module.config[c].type === 'range'">
                <span>{{ module.config[c].label }}</span>
                <v-range-slider v-model="config[c]" color="accent" :min="module.config[c].min !== undefined ? module.config[c].min : 0" :max="module.config[c].max !== undefined ? module.config[c].max : 10">
                  <template v-slot:prepend>
                    <span>{{ config[c][0] }}</span>
                  </template>
                  <template v-slot:append>
                    <span>{{ config[c][1] }}</span>
                  </template>
                </v-range-slider>
              </div>
              <!--<div v-else-if="module.config[c].type === 'list'">
                {{ module.config[c].label }}
                <ul>
                  <li v-for="item in config[c].slice(0, 2)">
                    {{ item }}
                  </li>
                </ul>
                <v-btn icon color="accent">
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
              </div>-->

            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ModuleSettings",

  data: () => ({
    module: {},
    config: {}
  }),

  mounted() {
    const modulePath = JSON.parse(localStorage.getItem("settings"))?.modulePath || ""
    if (modulePath) {
      if (window.moduleAPI) {
        window.moduleAPI.getModules(modulePath)
            .then(modules => {
              this.modules = modules
              for (const module of this.modules) {
                if (module.manifest.id === this.$route.params.id) {
                  this.module = module
                  const moduleConfigs = JSON.parse(localStorage.getItem("moduleConfigs"))
                  for (const moduleID of Object.keys(moduleConfigs)) {
                    if (moduleID === module.manifest.id) {
                      this.config = moduleConfigs[moduleID]
                    }
                  }
                  break
                }
              }
            })
      }
    }
  },

  methods: {
    saveModuleConfig() {
      const moduleConfigs = JSON.parse(localStorage.getItem("moduleConfigs"))
      moduleConfigs[this.module.manifest.id] = this.config
      localStorage.setItem("moduleConfigs", JSON.stringify(moduleConfigs))
    }
  },

  watch: {
    config: {
      handler() {
        this.saveModuleConfig()
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>