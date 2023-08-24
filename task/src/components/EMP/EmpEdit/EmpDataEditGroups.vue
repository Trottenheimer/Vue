<template>
    <!--<form-page
        v-model:data="sortedGroups"
        :isLoaded="isLoaded"
    >
    </form-page>-->
    <el-table :data="sortedGroups" border stripe height="700">
        <el-table-column prop="name" label="Название"></el-table-column>
        <el-table-column prop="rem" label="Описание"></el-table-column>
        <el-table-column label="Является: ">
            <template #default="scope">
                <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
        </el-table-column>
    </el-table>
    <div style="margin-top: 10px;">
        <el-button type="primary" @click="updateGroups">Сохранить</el-button>
        <el-button type="info" @click="this.$emit('hideDialog', false)">Закрыть</el-button>
    </div>
</template>

<script>
const serverURL = 'http://192.168.0.102:4000/';
const empGroupURL = serverURL + 'rpc/get_emp_groups?p_emp_id=';
const addGroupURL = serverURL + 'rpc/emp_add_group';
const deleteGroupURL = serverURL + 'rpc/emp_delete_group';

import axios from 'axios';
export default{
    name: "emp-data-edit-groups",
    data(){
        return{
            selectedSort: '',
            editedGroupDataSet: [],
            groupList: [],
            isLoaded: false,
        }
    },
    props:{
        groupListGetter: {
            type: Array
        },
        groupDataSet: {
            type: Object,
        },
        emp_id: Number,
    },
    methods:{
        async fetchData(){
            this.isLoaded = false;
            await axios.get(empGroupURL + this.emp_id).then(response =>{
                this.groupList = response.data;
            })
            this.refreshGroups();
            this.isLoaded = true;
        },
        async updateGroups(){
            try {
                const requestAdd = this.editedGroupDataSet.filter(obj =>{
                    return obj.checked === true
                })
                const requestDelete = this.editedGroupDataSet.filter(obj =>{
                    return obj.checked === false
                })
                requestAdd.forEach(item => {
                    axios.post(addGroupURL, {p_emp_id:this.emp_id, p_group_id: item.id})
                })
                requestDelete.forEach(item => {
                    axios.post(deleteGroupURL, {p_emp_id:this.emp_id, p_group_id: item.id})
                })
                this.$emit('refresh', serverURL + 'emp_list');
            }
            catch (error) {console.log(error);}
        },
        refreshGroups(){
            let activeGroups = Object.assign({}, this.groupList)
            this.editedGroupDataSet.forEach(el =>{
                el.checked = false;
                delete el["grp"];
            });//Обнуление массива для смены пользователя или обновления
            for (let i=0; i < this.groupList.length; i++){
                for (let k = 0; k < this.editedGroupDataSet.length; k++){
                    if(activeGroups[i].name  === this.editedGroupDataSet[k].name){
                        this.editedGroupDataSet[k].checked = true
                    }
                }
            }
        },
    },
    computed:{
        sortedGroups(){
            return [...this.editedGroupDataSet]?.sort((item1, item2) => String(item1[this.selectedSort])?.localeCompare(String(item2[this.selectedSort]))).reverse()
        }
    },
    mounted(){
        this.fetchData()
        this.editedGroupDataSet = this.groupDataSet;
        
    }
}
</script>