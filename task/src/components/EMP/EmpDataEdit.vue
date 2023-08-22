<template>
    <div class="container" id="data-edit">
        <div>
            <h3 @click="showAdmin = true">Редактирование пользователя</h3>
            <div class="btn-group" role="group" arial-label="Switch" style="width: 100%;">
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 1}" @click="currentPage=1">Основные данные</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 2}" @click="currentPage=2">Группы</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 3}" @click="currentPage=3">Прямые права</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 4}" @click="currentPage=4">Все права</button>
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

        <div v-else-if="currentPage == 2"><!--Отображение страницы группы-->
            <!--<my-select-string class="form-control" v-model:select="selectedSort" :options="options.groups">Сортировка</my-select-string>-->
            <template v-if="selectedSort == 'checked'">
                <form-page
                    v-model:data="sortedGroupsReversed"
                    v-model:select="selectedSort"
                    :isLoaded="isLoaded"
                />
            </template>
            <template v-else>
                <form-page
                    v-model:data="sortedGroups"
                    v-model:select="selectedSort"
                    :isLoaded="isLoaded"
                />
            </template>
            <div class="input-group">
                <button type="button" class="btn btn-primary col" @click="updateGroups">Сохранить</button>
                <button type="button" class="btn btn-secondary col" @click="updateGroups">Закрыть</button>
            </div>
        </div>

        <div v-else-if="currentPage == 3"><!--Отображение страницы прямых прав-->
            <div>
                <my-input class="form-control" placeholder="Поиск по названию..."
                    v-model="searchQuery" ></my-input>
                <template v-if="selectedSort == 'checked'" >
                    <form-page style="max-height: 600px; overflow-y: scroll;"
                        v-model:data="sortedAndSearchedRightsReversed"
                        v-model:select="selectedSort"
                        :isLoaded="isLoaded"
                    />
                </template>
                <template v-else >
                    <form-page style="max-height: 600px; overflow-y: scroll;"
                        v-model:data="sortedAndSearchedRights"
                        v-model:select="selectedSort"
                        :isLoaded="isLoaded"
                    />
                </template>
                <div class="input-group">
                    <button type="button" class="btn btn-primary col" @click="updateRights">Сохранить</button>
                    <button type="button" class="btn btn-secondary col" @click="updateGroups">Закрыть</button>
                </div>
            </div>
        </div>

        <div v-else-if="currentPage == 4"><!--Отображение страницы всех прав-->
            <form-page
            :data="allRightsList"
            :isLoaded="isLoaded"
            />
        </div>

        
    </div>
</template>


<script>
import axios from 'axios'

const serverURL = 'http://192.168.0.102:4000/';
const empList = serverURL + 'emp_list?id=eq.';
const empGroupURL = serverURL + 'rpc/get_emp_groups?p_emp_id=';
const directRightsURL = serverURL + 'rpc/get_emp_direct_right?p_emp_id=';
const allRightsURL = serverURL + 'rpc/get_emp_all_rights?p_emp_id=';
const groupsURL = serverURL + 'group_list';
const addGroupURL = serverURL + 'rpc/emp_add_group';
const deleteGroupURL = serverURL + 'rpc/emp_delete_group';
const addRightURL = serverURL + 'rpc/emp_add_right';
const deleteRightURL = serverURL + 'rpc/emp_delete_right';

export default{
    name: "emp-data-edit",
    data(){
        return{
            currentPage: 1,
            isLoaded: false,
            tempURL: '',
            tempQuery: '',
            searchQuery: '',
            selectedSort: 'checked',
            editedRightDataset: [],
            editedGroupDataSet: [],
            groupList: [ {} ],
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
                    this.tempURL = empList
                }
                else if (page == 2){
                    this.tempURL = empGroupURL
                    this.fetchData
                }
                else if (page == 3){
                    this.tempURL = directRightsURL
                }
                else if (page == 4){
                    this.tempURL = allRightsURL
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
                    case empGroupURL:{
                        this.groupList = response.data;
                        this.refreshGroups();
                        break;
                    }
                    case groupsURL: {
                        this.empGroupList = response.data;
                        break;
                    }
                    case directRightsURL: {
                        this.directRightsList = response.data;
                        console.log('direct', this.directRightsList);
                        break;
                    }
                    case allRightsURL: this.allRightsList = response.data;
                        break;
                }
                this.refreshGroups();
                this.refreshRights();
            }
            catch (error) {
                console.log('ошибка' + error)
            }
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
                    const respone = axios.post(addGroupURL, {p_emp_id:this.dialogData.id, p_group_id: item.id})
                    console.log(respone);
                })
                requestDelete.forEach(item => {
                    const respone = axios.post(deleteGroupURL, {p_emp_id:this.dialogData.id, p_group_id: item.id})
                    console.log(respone);
                })
                this.refresh(serverURL + 'emp_list');
            }
            catch (error) {console.log(error);}
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
                    const respone = axios.post(addRightURL, {p_emp_id:this.dialogData.id, p_right_id: item.id})
                    console.log(respone);
                })
                requestDelete.forEach(item => {
                    const respone = axios.post(deleteRightURL, {p_emp_id:this.dialogData.id, p_right_id: item.id})
                    console.log(respone);
                })
                this.refresh(serverURL + 'emp_list');
            }
            catch (error) {console.log(error);}
        },
        refresh(data){
            this.$emit('refresh', data)
        },
        hideDialog(val){
            this.$emit('update:show', val)
        },
        refreshGroups(){
            let activeGroups = Object.assign({}, this.groupList)
            this.editedGroupDataSet.forEach(el =>{
                el.checked = false;
                delete el["grp"];
            });
            console.log(this.editedRightDataset);
                //Обнуление массива для смены пользователя или обновления
            for (let i=0; i < this.groupList.length; i++){
                for (let k = 0; k < this.editedGroupDataSet.length; k++){
                    if(activeGroups[i].name  === this.editedGroupDataSet[k].name){
                        this.editedGroupDataSet[k].checked = true
                    }
                }
            }
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
        sortedGroups(){
            return [...this.editedGroupDataSet]?.sort((item1, item2) => String(item1[this.selectedSort])?.localeCompare(String(item2[this.selectedSort])))
        },
        sortedGroupsReversed(){
            return [...this.editedGroupDataSet]?.sort((item1, item2) => String(item1[this.selectedSort])?.localeCompare(String(item2[this.selectedSort]))).reverse()
        },
        sortedDirectRights(){
            return [...this.editedRightDataset]?.sort((item1, item2) => String(item1[this.selectedSort])?.localeCompare(String(item2[this.selectedSort])))
        },
        sortedDirectRightsReversed(){
            return [...this.editedRightDataset]?.sort((item1, item2) => String(item1[this.selectedSort])?.localeCompare(String(item2[this.selectedSort]))).reverse()
        },
        sortedAndSearchedRights: function(data){
            return data.filter((item) =>
                item.name?.toLowerCase()
                .includes(this.searchQuery?.toLocaleLowerCase())
            );
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
        console.log(this.editedRightDataset);
        
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