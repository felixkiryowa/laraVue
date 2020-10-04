/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

window.Vue = require("vue");
import moment from "moment";
import VueRouter from "vue-router";
import VueProgressBar from "vue-progressbar";
import { Form, HasError, AlertError } from "vform";
import Gate from './Gate';
import Swal from "sweetalert2";
import {VTable,VPagination} from 'vue-easytable';
import store from './store/store';


Vue.use(VueRouter);
import DashboardComponent from "./components/Dashboard.vue";
import ProfileComponent from "./components/Profile.vue";
import UsersComponent from "./components/Users.vue";
import NotFoundComponent from './components/NotFound.vue';
import TableComponent from './components/Tables.vue';
import LoginComponent from './components/Login.vue';


Vue.prototype.$gate = new Gate(window.user);
window.Form = Form;
window.Swal = Swal;
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});
window.Toast = Toast;
window.Fire = new Vue();
//Instantiate these components
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component('pagination', require('laravel-vue-pagination'));
Vue.use(VueProgressBar, {
    color: "rgb(143, 255, 199)",
    failedColor: "red",
    height: "2px"
});
//FILTERS IN VUE JS
Vue.filter("upText", function(text) {
    return text.toUpperCase();
});

Vue.filter("customDate", function(created_at) {
    return moment(created_at).format("MMMM Do YYYY");
});
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

let routes = [
    { path: "/dashboard", component: DashboardComponent },
    { path: "/profile", component: ProfileComponent },
    { path: "/users", component: UsersComponent },
    { path: "/table", component: TableComponent },
    { path: "/login-user", component: LoginComponent },
    { path: "*", component: NotFoundComponent },
];

const router = new VueRouter({
    mode: "history",
    routes // short for `routes: routes`
});

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

Vue.component(
    'not-found',
    require('./components/NotFound.vue').default
);
Vue.component(
    "example-component",
    require("./components/ExampleComponent.vue").default
);


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: "#app",
    router,
    store,
    data: {
        search: ''
    },
    methods : {
        //SEND REQUEST EVERY AFTER 1 SECOND
        searchIt: _.debounce(() => {
            Fire.$emit('searching');
        }, 1000),
        printme() {
            window.print();
        }
    }
});
