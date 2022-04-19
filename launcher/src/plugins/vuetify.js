import Vue from "vue"
import Vuetify from "vuetify/lib/framework"

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: "#3a3d55",
                secondary: "#5BC0EB",
                accent: "#FFD166",
                background: "#FFFFFF",
            },
            dark: {
                primary: "#3a3d55",
                secondary: "#5BC0EB",
                accent: "#FFD166",
                background: "#272b3e",
            }
        }
    }
})
