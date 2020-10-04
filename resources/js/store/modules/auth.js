import axios from "axios";

const state = {
    token: localStorage.getItem("user-token") || "",
    status: "",
    isLoading: false,
    isAuthenticated: false
};

const actions = {
    loginUser({ commit }, form) {
        commit("authRequest");
        return new Promise((resolve, reject) => {
            axios.post("http://127.0.0.1:8000/api/login", {
                email: form.email,
                password: form.password
            }).then(response => {
                setTimeout(() => {
                    resolve(response);
                    const token = response.data.auth_token;
                    // store the token in localstorage
                    localStorage.setItem("user-token", token);
                    commit("authSuccess", token);
                }, 3000);
            })
            .catch(error => {
                // if the request fails, remove any possible user token if possible
                console.log('The error is', error.message);
                commit("authError", error);

                reject(error);
                localStorage.removeItem("user-token");
            });
        })

    },
    logOutUser({commit}) {
        return new Promise((resolve, reject) => {
            commit('authLogOut');
            localStorage.removeItem('user-token') // clear your user's token from localstorage
            resolve()
        })
    }
};

const getters = {
    isAuthenticated: state => state.isAuthenticated,
    authStatus: state => state.status,
    getToken: state => state.token
};

const mutations = {
    authRequest: state => {
        state.isLoading = true;
    },
    authSuccess: (state, token) => {
        (state.token = token),
            (state.isLoading = false),
            (state.isAuthenticated = true);
    },
    authError: state => {
        state.isLoading = false;
    },
    authLogOut: state => {
        state.isAuthenticated = false;
        state.token = '';
    }
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};
