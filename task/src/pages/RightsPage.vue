<template>
    <rights-list v-if="auth.status"
    :rightList="rightListComputed"
    @refresh="refresh"
    />
    <non-auth v-else/>
</template>
<script>
import RightsList from "@/components/RIGHTS/RightsList.vue"

import { onErrorCaptured, ref } from 'vue';
import { ElLoading, ElNotification } from 'element-plus'
import { useStore } from "vuex";
export default{
    name: 'rights-page',
    components:{
        RightsList,
    },
    setup(){
        const store = useStore();
        const auth = store.state.auth;
        const rightList = ref([]);
        const isLoaded = ref(false);
        onErrorCaptured(() => {
            ElNotification({title: 'Модуль ползователей', message: 'Произошла ошибка!', type: 'error'});
        })
        return{rightList, isLoaded, auth};
    },
    methods:{
        refresh(){
            const loading = ElLoading.service({
                lock: true,
                text: 'Загрузка',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$getData(this.$URL_RIGHT_LIST, '').then(data => {
                this.rightList = data
                loading.close()
            })
        },
    },
    computed:{
        rightListComputed(){
            return this.rightList
        }
    },
    mounted(){
        if(this.auth.status)
            this.refresh();
    }       
}
</script>