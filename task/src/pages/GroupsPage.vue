<template>
<group-data-list v-loading="isLoaded" v-model:groupList="groupList"
@refresh="refresh"
>
</group-data-list>
</template>

<script>
import { ref } from 'vue';
export default{
    name: 'groups-page',
    setup(){
        const groupList = ref([])
        let isLoaded = ref(false)
        return{groupList, isLoaded}
    },
    methods:{
        refresh(){
            this.isLoaded = false;
            this.$fetchData(this.$URL_GROUP_LIST, '').then(data => {
                this.groupList = data
                console.log(this.groupList);
                this.isLoaded = true;
            })
        }
    },
    mounted(){
        this.refresh();
    }       
}
</script>

<style>
</style>