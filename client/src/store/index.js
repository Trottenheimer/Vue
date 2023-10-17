import {createStore} from "vuex";

export default createStore({
    state: () => ({//global storage $store.state.VAR
        user: {id: '', name: '', ip: ''},
    }),
    getters:{//computed property
        user(state) {
            return state.user;
        }
    },
    mutations:{//allowed mutations
        SET_USERDATA: (state, data) => {
            state.user = data;
        }
    },
    actions:{//functions. on input ALWAYS require object-context:{state, rootState, commit, dispatch, getters, rootGetters}
        setUserdata: async(ctx, data) => {
            ctx.commit ('SET_USERNAME', data);
        }
    },
    modules:{//register modules
    },
})