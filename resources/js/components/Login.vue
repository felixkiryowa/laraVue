
<template>
  <div>
    <div>
      <button class="btn btn-primary float-right" @click="logOutLoggedUser()">Log Out</button>
    </div>
    <br>
    <br>
    <br>
    <br>
    <div class="loader" v-if="isLoading"></div>
    <div class="card card-primary">
      <div class="card-header"></div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4"></div>
          <div class="col-md-4">
            <form class="login" @submit.prevent="login">
              <h1>Sign in</h1>
              <hr />
              <div class="form-group">
                <label>Email</label>
                <input
                  required
                  class="form-control"
                  v-model="form.email"
                  type="email"
                  placeholder="Snoopy"
                />
              </div>
              <div class="form-group">
                <label>Password</label>
                <input
                  required
                  class="form-control"
                  v-model="form.password"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <hr />
              <div class="float-right">
                <button class="btn btn-primary" type="submit">Login</button>
              </div>
            </form>
          </div>
          <div class="col-md-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      form: new Form({
        email: "",
        password: "",
      }),
    };
  },
  computed: {
    ...mapState("auth", ["isLoading"]),
    ...mapGetters("auth", ["isAuthenticated", "authStatus"]),
  },
  methods: {
    ...mapActions("auth", ["loginUser", "logOutUser"]),
    logOutLoggedUser() {
      this.logOutUser()
        .then((response) => {
          this.$router.replace("/home");
        })
        .catch((error) => {
          console.log(error);
          this.$Progress.fail();
        });
    },
    login() {
      this.$Progress.start();
      this.loginUser(this.form)
        .then((response) => {
          console.log(response);
          this.$router.replace("/profile");
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$Progress.fail();
        });
    },
    logout: function () {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push("/login");
      });
    },
  },
  mounted() {
    console.log("Component mounted.");
  },
};
</script>
