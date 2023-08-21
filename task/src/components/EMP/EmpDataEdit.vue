<template>
    <div class="container" id="data-edit">
        
        <div>
            <h1 @click="showAdmin = true">Редактирование пользователя</h1>
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
                @refreshEmp="refreshData"
            />
        </div>

        <div v-else-if="currentPage == 2"><!--Отображение страницы группы-->
            <form-page
                :data="editedGroupDataSet"
                :isLoaded="isLoaded"
            />
        </div>

        <div v-else-if="currentPage == 3"><!--Отображение страницы прямых прав-->
            <form-page
            :data="directRightsList"
            :isLoaded="isLoaded"
            />
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
const groupsURL = serverURL + 'group_list'

export default{
    name: "emp-data-edit",
    data(){
        return{
            currentPage: 1,
            isLoaded: false,
            tempURL: '',
            tempQuery: '',
            groupList: [ {} ],
            editedGroupDataSet: [],
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
            type: Object,
            required: true
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
                console.log(url+query);
                const response = await axios.get(url + query);
                this.isLoaded = true;
                switch(url){
                    case empGroupURL: this.groupList = response.data;
                        break;
                    case groupsURL: {
                        this.empGroupList = response.data;
                        /*for (let index = 0; index < this.allGroups.length; index++) {
                            console.log(this.allGroups[index]);
                        }*/
                        break;
                    }
                    case directRightsURL: this.directRightsList = response.data;
                        break;
                    case allRightsURL: this.allRightsList = response.data;
                        break;
                }
            }
            catch (error) {
                console.log('ошибка' + error)
            }
        },
        refreshData(data){
            this.$emit('refresh', data)
        },
        hideDialog(val){
            this.$emit('update:show', val)
        }
    },
    mounted(){
        this.fetchData(groupsURL, '')
        this.editedDialogData = Object.assign({}, this.dialogData);//копия для редактирования в форме
        this.editedGroupDataSet = this.groupDataSet
        console.log('то что меняем', this.editedGroupDataSet);
        console.log('то, что нужно обработать', Object.assign(this.groupList));
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