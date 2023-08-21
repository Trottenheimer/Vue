<template>
    <form-page
        :data="groupList"
        :isLoaded="isLoaded"
    >
    </form-page>
</template>
<script>
const serverURL = 'http://192.168.0.102:4000/';
const empGroupsList = serverURL + 'group_list'
import axios from 'axios';
export default{
    name: "emp-data-edit-groups",
    data(){
        return{
            groupList: [{}],
            groupDataSet: Array,
            isLoaded: true
        }
    },
    props:{
        id: Number,
        groupData: Array,
    },
    methods:{
        async fetchData(url){
            try {
                const response = await axios.get(url)
                this.groupDataSet = response.data
                //console.log('ALL GROUPS: ', this.groupDataSet);
                //console.log('GROUP 1: ', this.groupDataSet[0]);
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    mounted(){
        this.fetchData(empGroupsList)
        this.groupList = Object.assign({}, this.groupData)
        console.log(this.groupList);
    }
}
</script>