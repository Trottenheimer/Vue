<template>
    <rights-list
    :rightList="rightListComputed"
    @refresh="refresh"
    />
</template>
    
<script>
import RightsList from "@/components/RIGHTS/RightsList.vue"

import { ref } from 'vue';
import { ElLoading } from 'element-plus'
export default{
    name: 'rights-page',
    components:{
        RightsList,
    },
    setup(){
        const rightList = ref([]);
        const isLoaded = ref(false);
        return{rightList, isLoaded};
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
        this.refresh();
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