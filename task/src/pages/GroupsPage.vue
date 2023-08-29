<template>
<groups-data-list v-model:groupList="groupListComputed" v-loading="isLoaded"
    @refresh="refresh"
/>
</template>

<script>
import { ref } from 'vue';
import { ElLoading } from 'element-plus'
export default{
    name: 'groups-page',
    setup(){
        const groupList = ref([])
        let isLoaded = ref(false)
        return{groupList, isLoaded}
    },
    methods:{
        refresh(){
            const loading = ElLoading.service({
                lock: true,
                text: 'Загрузка',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            this.$getData(this.$URL_GROUP_LIST, '').then(data => {
                this.groupList = data
                console.log('refreshed group list');
                this.isLoaded = true;
                loading.close();
                
            })
        },
    },
    computed:{
        groupListComputed(){
            return this.groupList
        }
    },
    mounted(){
        this.refresh();
    }       
}
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>