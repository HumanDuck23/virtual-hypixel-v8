<template>
  <div>
    <v-card class="ma-5" color="primary">
      <v-card-title>Accounts</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="(account, index) in accounts" :key="index">
              <v-card color="primary">
                <v-card-text>
                  <v-text-field outlined label="Username" v-model="account.username" prepend-inner-icon="mdi-minecraft" color="accent" dense/>
                  <v-text-field outlined class="mt-n3" label="Email" v-model="account.email" prepend-inner-icon="mdi-at" color="accent" dense />
                  <v-text-field outlined class="mt-n3" label="Password" v-model="account.password" prepend-inner-icon="mdi-key-outline" color="accent" :type="typePassword ? 'password' : 'text'" :append-icon="typePassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" @click:append="typePassword = !typePassword" dense />
                </v-card-text>
                <v-card-actions class="mt-n5">
                  <v-btn @click="toDelete = index; deleteConfirm = true" block color="error" outlined>
                    Remove
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn block outlined color="accent" @click="addAccount">Add Account</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="deleteConfirm" max-width="300">
      <v-card color="primary">
        <v-card-title>Remove Account</v-card-title>
        <v-card-text>
          Are you sure you want to remove the account <b v-if="toDelete >= 0">{{ accounts[toDelete].username }}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="deleteConfirm = false">Cancel</v-btn>
          <v-btn color="primary" @click="deleteAccount">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Accounts",

  data: () => ({
    accounts: [
      {
        username: "",
        email: "",
        password: ""
      }
    ],
    typePassword: true,

    deleteConfirm: false,
    toDelete: -1
  }),

  mounted() {
    if (localStorage.getItem("accounts")) {
      this.accounts = JSON.parse(localStorage.getItem("accounts"))
    }
  },

  methods: {
    addAccount() {
      this.accounts.push({
        username: "",
        email: "",
        password: ""
      })
    },

    deleteAccount() {
      if (this.toDelete >= 0) {
        this.accounts.splice(this.toDelete, 1)
        this.toDelete = -1
        this.deleteConfirm = false
      }
    }
  },

  watch: {
    accounts: {
      handler() {
        localStorage.setItem("accounts", JSON.stringify(this.accounts))
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>