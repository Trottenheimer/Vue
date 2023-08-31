<template>
<groups-list
    :groupList="groupListComputed"
    @refresh="refreshData"
/>
</template>
<script>
import GroupsList from "@/components/GROUPS/GroupsList.vue"
import { ref } from "vue";
import { ElLoading } from "element-plus";

export default{
    name: "emp-page",
    components:{GroupsList},
    setup(){
        const groupList = ref([]);
        const loading = ElLoading.service({
            lock: true, text: 'Загрузка',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        return{groupList, loading};
    },
    methods:{
        refreshData(){
            this.loading
            const promises = [//СБОР ПРОМИСА ДЛЯ ОТСЛЕЖИВАНИЯ ВСЕХ АСИНХ ФУНКЦИЙ
                this.$getData(this.$URL_GROUP_LIST, '').then(data => {
                    this.groupList = data
                }),
            ]
            Promise.all(promises).then(() => {
                this.loading.close();
                console.log('All promises completed successfully.');
            }).catch((e) => {
                console.log('Error occured during promise processing:', e);
            })
        },
    },
    computed:{
        groupListComputed(){
            return this.groupList
        }
    },
    mounted(){
        this.refreshData();
    }
}
</script>