import {createStore} from "vuex";

export default createStore({
    state: () => ({//global storage $store.state.VAR
        auth: {status: false},
        user: {surname: '', name: '', patron: '', birth: '', sex: Number, dept: '', post: '', del: ''},
    }),
    getters:{//computed property
    },
    mutations:{//allowed mutations
        SET_AUTH_STATUS: (state, status) => {
            state.auth.status = status;
        },
        SET_USER_DATA: (state, data) => {
            state.user = data;
        }
    },
    actions:{//functions. on input ALWAYS require object-context:{state, rootState, commit, dispatch, getters, rootGetters}
        setAuthStatus: async(ctx, statusChange) => {
            ctx.commit('SET_AUTH_STATUS', statusChange);
        },
        setUserData: async(ctx, data) => {
            ctx.commit ('SET_USER_DATA', data);
        }
    },
    modules:{//register modules
    },
})