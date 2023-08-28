<template>
    rights page
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
                this.$getData(this.$URL_GROUP_LIST, '').then(data => {
                    this.groupList = data
                    console.log('refreshed group list');
                    this.isLoaded = true;
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
    
    <style>
    </style>