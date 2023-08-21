import {createStore} from "vuex";

export default createStore({
    state: () => ({//global storage $store.state.SERVER_URL
        SERVER_URL: 'http://192.168.0.102:4000/'
    }),
    getters:{//computed property
        
    },
    mutations:{//allowed mutations
        changeURL(state){//to use: $store.commit('changeURL')
            state.SERVER_URL += 'URL';
        }
    },
    actions:{//functions. on input ALWAYS require object-context:{state, rootState, commit, dispatch, getters, rootGetters}
        updateEmp(){

        }
    },
    modules:{//register modules

    }
})