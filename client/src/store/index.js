import {createStore} from "vuex";

export default createStore({
    state: () => ({//global storage $store.state.VAR
        user: {name: ''}
    }),
    getters:{//computed property
    },
    mutations:{//allowed mutations
        SET_USERNAME: (state, name) => {
            state.user.name = name;
        }
    },
    actions:{//functions. on input ALWAYS require object-context:{state, rootState, commit, dispatch, getters, rootGetters}
        setUsername: async(ctx, name) => {
            ctx.commit ('SET_USERNAME', name);
        }
    },
    modules:{//register modules
    },
})