<template>
    <div class="container" id="data-edit">
        <div>
            <h3 @click="showAdmin = true">Редактирование пользователя</h3>
            <div class="el-button-group" role="group" arial-label="Switch" style="width: 100%;">
                <el-button type="primary" class="btn btn-primary" :class="{'active': currentPage == 1}" @click="currentPage=1">Основные данные</el-button>
                <el-button type="primary" class="btn btn-primary" :class="{'active': currentPage == 2}" @click="currentPage=2">Группы</el-button>
                <el-button type="primary" class="btn btn-primary" :class="{'active': currentPage == 3}" @click="currentPage=3">Прямые права</el-button>
                <el-button type="primary" class="btn btn-primary" :class="{'active': currentPage == 4}" @click="currentPage=4">Все права</el-button>
            </div>
        </div>

        <div id="page1" v-if="currentPage == 1"><!--Отображение страницы основных данных-->
            <emp-data-edit-main
                :dialogData="dialogData"
                :getOptions="options"
                :deptDataSet="deptDataSet"
                :postDataSet="postDataSet"
                @hideDialog="hideDialog"
                @refresh="refresh"
            />
        </div>

        <div v-else-if="currentPage == 2"><!--Отображение страницы групп-->
            <emp-data-edit-groups
                :emp_id="dialogData.id"
                :groupDataSet="groupDataSet"
                @hideDialog="hideDialog"
                @refresh="refresh"
            >
            </emp-data-edit-groups>
        </div>

        <div v-else-if="currentPage == 3"><!--Отображение страницы прямых прав-->
            <el-input placeholder="Поиск по названию..."
                    v-model="searchQuery" ></el-input>
            <el-table :data="sortedAndSearchedRightsReversed" height="650" style="width: 1000px;">
                <el-table-column prop="name" label="Название"></el-table-column>
                <el-table-column prop="rem" label="Описание"></el-table-column>
                <el-table-column label="Владеет">
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.checked"></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
                <el-button type="primary" class="btn btn-primary col" @click="updateRights">Сохранить</el-button>
                <el-button type="info" class="btn btn-secondary col" @click="hideDialog">Закрыть</el-button>
            </div>
        </div>

        <div v-else-if="currentPage == 4"><!--Отображение страницы всех прав-->
            <el-table :data="allRightsList" border stripe style="width: 100%">
                <el-table-column prop="name" label="Название"></el-table-column>
                <el-table-column prop="rem" label="Описание"></el-table-column>
            </el-table>
        </div>

        
    </div>
</template>


<script>
import axios from 'axios'



export default{
    name: "emp-data-edit",
    setup(){
        const serverURL = this.$URL_SERVER;
        const empList = serverURL + 'emp_list?id=eq.';
        const empGroupURL = serverURL + 'rpc/get_emp_groups?p_emp_id=';
        const directRightsURL = serverURL + 'rpc/get_emp_direct_right?p_emp_id=';
        const allRightsURL = serverURL + 'rpc/get_emp_all_rights?p_emp_id=';
        const groupsURL = serverURL + 'group_list';
        const addRightURL = serverURL + 'rpc/emp_add_right';
        const deleteRightURL = serverURL + 'rpc/emp_delete_right';
        return{serverURL, empList, empGroupURL, directRightsURL, allRightsURL, groupsURL, addRightURL, deleteRightURL}
    },
    data(){
        return{
            currentPage: 1,
            isLoaded: false,
            tempURL: '',
            tempQuery: '',
            searchQuery: '',
            selectedSort: '',
            editedRightDataset: [],
            editedGroupDataSet: [],
            groupList: Array,
            directRightsList: [{}],
            allRightsList:[{}],
            editedDialogData: {},
            options: {
                sex: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
                ],
                dept: [],
                post: [],
                groups: [
                    {value: "none", name: "по умолчанию"},
                    {value: "name", name: "по названию"},
                    {value: "rem", name: "по описанию"},
                    {value: "checked", name: "по состоянию"},
                ],
            },
        }
    },
    props:{
        dialogData: {
            type: Object,
            required: true
        },
        deptDataSet: {
            type: Object,
            required: true
        },
        postDataSet: {
            type: Object,
            required: true
        },
        groupDataSet:{
            type: Object
        },
        rightDataSet: {
            type: Object
        }
    },
    watch:{
        currentPage(page){
            if (page !== 0){
                if (page == 1){
                    this.tempURL = this.empList
                }
                else if (page == 2){
                    this.tempURL = this.empGroupURL
                }
                else if (page == 3){
                    this.tempURL = this.directRightsURL
                }
                else if (page == 4){
                    this.tempURL = this.allRightsURL
                }
                this.tempQuery = this.dialogData.id
                this.fetchData(this.tempURL, this.tempQuery)
            }
        },
    },
    methods:{
        async fetchData(url,query){
            try {
                this.isLoaded = false;
                console.log('GET REQUEST HEADED TO: ', url+query);
                const response = await axios.get(url + query);
                this.isLoaded = true;
                switch(url){
                    case this.empGroupURL:{
                        this.groupList = response.data;
                        console.log(this.groupList);
                        break;
                    }
                    case this.groupsURL: {
                        this.empGroupList = response.data;
                        break;
                    }
                    case this.directRightsURL: {
                        this.directRightsList = response.data;
                        break;
                    }
                    case this.allRightsURL: this.allRightsList = response.data;
                        break;
                }
                this.refreshRights();
            }
            catch (error) {
                console.log('ошибка' + error)
            }
        },
        async updateRights(){
            try {
                const requestAdd = this.editedRightDataset.filter(obj =>{
                    return obj.checked === true
                })
                const requestDelete = this.editedRightDataset.filter(obj =>{
                    return obj.checked === false
                })
                requestAdd.forEach(item => {
                    axios.post(this.addRightURL, {p_emp_id:this.dialogData.id, p_right_id: item.id})
                })
                requestDelete.forEach(item => {
                    axios.post(this.deleteRightURL, {p_emp_id:this.dialogData.id, p_right_id: item.id})
                })
                this.refresh(this.serverURL + 'emp_list');
            }
            catch (error) {console.log(error);}
        },
        refresh(data){
            this.$emit('refresh', data)
        },
        hideDialog(val){
            this.$emit('update:show', val)
        },
        refreshRights(){
            let activeRights = Object.assign({}, this.directRightsList);
            this.editedRightDataset.forEach(el => {el.checked = false});
                //Обнуление массива для смены пользователя или обновления
            for (let i=0; i < this.directRightsList.length; i++){
                for (let k = 0; k < this.editedRightDataset.length; k++){
                    if(activeRights[i].name  === this.editedRightDataset[k].name){
                        this.editedRightDataset[k].checked = true
                    }
                }
            }
        }
    },
    computed:{
        sortedDirectRights(){
            return [...this.editedRightDataset]?.sort((item1, item2) => String(item1[this.selectedSort])?.localeCompare(String(item2[this.selectedSort])))
        },
        sortedDirectRightsReversed(){
            return [...this.editedRightDataset]?.sort((item1, item2) => String(item1[this.selectedSort])?.localeCompare(String(item2[this.selectedSort]))).reverse()
        },
        sortedAndSearchedRights: function(){
            return this.editedRightDataset.filter((item) =>
                item.name?.toLowerCase()
                .includes(this.searchQuery?.toLocaleLowerCase()));
        },
        sortedAndSearchedRightsReversed: function(){
            return this.editedRightDataset.filter((item) =>
                item.name?.toLowerCase()
                .includes(this.searchQuery?.toLocaleLowerCase())).reverse();
        }
    },
    mounted(){
        this.editedDialogData = Object.assign({}, this.dialogData);
        this.editedGroupDataSet = this.groupDataSet;
        this.editedRightDataset = this.rightDataSet;
            //копии для редактирования
        this.currentPage = 1;
    },
}
</script>
<style>
th:empty{
    display: none;
}
.row:empty{
    display: none;
}
#data-edit{
    background-color: aliceblue;
    border-radius: 15px;
}
</style>
