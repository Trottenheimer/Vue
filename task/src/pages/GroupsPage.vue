<template>
<groups-list v-if="auth.status"
    :groupList="groupListComputed"
    @refresh="refreshData"
/>
<non-auth v-else/>
</template>
<script>
import GroupsList from "@/components/GROUPS/GroupsList.vue"
import { onErrorCaptured, ref } from "vue";
import { ElLoading, ElNotification } from "element-plus";
import { useStore } from "vuex";

export default{
    name: "emp-page",
    components:{GroupsList},
    setup(){
        const store = useStore();
        const auth = store.state.auth;
        const groupList = ref([]);
        const loading = ElLoading.service({
            lock: true, text: 'Загрузка',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        onErrorCaptured(() => {
            ElNotification({title: 'Модуль групп', message: 'Произошла ошибка!', type: 'error'});
        })
        return{groupList, loading, auth};
    },
    methods:{
        refreshData(){
            this.loading
            this.$getData(this.$URL_GROUP_LIST, '').then(data => {
                this.groupList = data
                this.loading.close();
                console.log('Data fetched');
            })
        },
    },
    computed:{
        groupListComputed(){
            return this.groupList
        }
    },
    mounted(){
        if(this.auth.status)
            this.refreshData();
    }
}
</script>
<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
</style>