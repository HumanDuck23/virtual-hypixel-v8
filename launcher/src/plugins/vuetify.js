import Vue from "vue"
import Vuetify from "vuetify/lib/framework"

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: "#4464AD",
                secondary: "#5BC0EB",
                accent: "#FFD166",
                background: "#FFFFFF",
            },
            dark: {
                primary: "#4464AD",
                secondary: "#5BC0EB",
                accent: "#FFD166",
                background: "#161925",
            }
        }
    }
})
