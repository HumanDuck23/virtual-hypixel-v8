<template>
  <v-app :style="{background: $vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].background}">
    <v-navigation-drawer permanent app color="primary">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="banner-text">
            Virtual<br>
            Hypixel
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list nav dense>
        <v-list-item v-for="(route, i) in routes" :key="i" color="accent" :to="route.path">
          <v-list-item-icon>
            <v-icon v-text="route.i"></v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="route.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    routes: [
      {
        i: "mdi-server-network",
        name: "Server",
        path: "/"
      },
      {
        i: "mdi-package-variant-closed",
        name: "Modules",
        path: "/modules"
      },
      {
        i: "mdi-account-box-multiple-outline",
        name: "Accounts",
        path: "/accounts"
      },
      {
        i: "mdi-cog-outline",
        name: "Other Settings",
        path: "/settings"
      },
    ]
  }),
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap');

.banner-text {
  font-size: 3.5rem !important;
  font-family: 'Shadows Into Light', cursive;
  text-align: center;
  vertical-align: center;
  color: #FFD166;
  padding: 15px;
  text-shadow: 0 0 9px #FFD166
}
</style>