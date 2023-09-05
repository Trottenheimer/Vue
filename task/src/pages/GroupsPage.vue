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