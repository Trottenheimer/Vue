<template>
    <div class="container">
        
        <div>
            <h1 @click="showAdmin = true">Редактирование пользователя</h1>
            <div class="btn-group" role="group" arial-label="Switch" style="width: 100%;">
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 1}" @click="currentPage=1">Основные данные</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 2}" @click="currentPage=2">Группы</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 3}" @click="currentPage=3">Прямые права</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 4}" @click="currentPage=4">Все права</button>
            </div>
        </div>

        <div v-if="currentPage == 1"><!--Отображение страницы основных данных-->
            <div class="row" 
                v-for="(val, key) in editedDialogData"
                :key="key"
                style="margin: 15px 0 0 0; align-items:center;"
            >
                <div class="col-2 align-middle"
                    v-if="(
                        key !== 'id' && key !== 'people_id' && key !== 'del'
                        && key !== 'dept_id' && key !== 'post_id'
                    )"
                >
                    <strong>
                        <template v-if="key === 'surname'">Фамилия: </template>
                        <template v-else-if="key === 'name'">Имя: </template>
                        <template v-else-if="key === 'patron'">Отчество: </template>
                        <template v-else-if="key === 'birth'">Дата рожения: </template>
                        <template v-else-if="key === 'sex'">Пол: </template>
                        <template v-else-if="key === 'post'">Должность: </template>
                        <template v-else-if="key === 'dept'">Отделение: </template>
                        <template v-else-if="key === 'inn'">ИНН: </template>
                        <template v-else-if="key === 'snils'">СНИЛС: </template>
                        <template v-else>{{ key || '–' }}</template>
                    </strong>
                </div>
                <div class="col-10"
                    v-if="(
                        key !== 'id' && key !== 'people_id' && key !== 'del'
                        && key !== 'dept_id' && key !== 'post_id' && key !== 'sex'
                        && key !== 'dept' && key !== 'post'
                        )"
                    >   
                        <my-input class="form-control"  v-model="editedDialogData[key]" style="width: 100%; align-items:center;"/>
                </div>
                <div class="col-10" v-else-if="key === 'sex'">
                    <my-select
                        v-model:select="editedDialogData.sex"
                        :options="sexOptions"
                    >
                        <template v-if="(
                            editedDialogData.sex !== null 
                            && editedDialogData.sex !== undefined
                            )"
                        >
                            {{sexOptions[Number(editedDialogData[key]-1)].name}}
                        </template>
                        <template v-else>
                            не указано
                        </template>
                    </my-select>
                </div>
                <div class="col-10" v-else-if="key === 'post'">
                    <my-select v-model:select="editedDialogData.post_id"
                    :options="postOptions"
                    >
                        <template v-if="editedDialogData.post_id">
                            {{editedDialogData.post}}
                        </template>
                        <template v-else>
                            не указано
                        </template>
                    </my-select>
                </div>
                <div class="col-10" v-else-if="key === 'dept'">
                    <my-select v-model:select="editedDialogData.dept_id" 
                        :options="deptOptions"
                    >
                        <template v-if="editedDialogData.dept_id">
                            {{editedDialogData.dept}}
                        </template>
                        <template v-else></template>
                    </my-select>
                </div>
            </div>
        </div>

        <div v-else-if="currentPage == 2"><!--Отображение страницы группы-->
            <form-page
            :data="groupList"
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

        <div class="row" role="group" aria-label="Primer" style="margin-top: 20px; padding: 0 5%">
            <template v-if="!updateSuccess">
                <button type="button" class="btn btn-primary col-3" @click="updateData">Сохранить</button>
            </template>
            <template v-else>
                <button type="button" class="btn btn-success col-3" @click="updateData">Сохранено</button>
            </template>
            <div class="col-6"></div>
            <button type="button" class="btn btn-secondary col-3" @click="this.$emit('update:show', false)">Закрыть</button>
        </div>
    </div>
</template>


<script>
import axios from 'axios'

const serverURL = 'http://192.168.0.102:4000/';
const empGroupURL = serverURL + 'rpc/get_emp_groups?p_emp_id=';
const directRightsURL = serverURL + 'rpc/get_emp_direct_right?p_emp_id=';
const allRightsURL = serverURL + 'rpc/get_emp_all_rights?p_emp_id=';

export default{
    name: "emp-data-edit",
    data(){
        return{
            currentPage: 1,
            editedDialogData: {},
            showAdmin: false,
            groupList: [ {} ],
            directRightsList: [{}],
            allRightsList:[{}],
            deptList:[{}],
            postList:[{}],
            isLoaded: false,
            tempURL: '',
            tempQuery: '',
            updateSuccess: false,
            showStatus: false,
            responsePost: {},
            deptOptions: [
            ],
            postOptions: [
            ],
            sexOptions: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
            ],
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
    },
    watch:{
        currentPage(page){
            if (page == 2){
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
                    case empGroupURL:
                        this.groupList = response.data;
                        break;
                    case directRightsURL:
                        this.directRightsList = response.data;
                        break;
                    case allRightsURL:
                        this.allRightsList = response.data;
                        break;
                }
            }
            catch (error) {
                console.log('ошибка' + error)
            }
        },
        async updateData(){
            try {
                if(this.editedDialogData == Object.assign({}, this.dialogData)){
                    console.log('nothing changed');
                }
                this.isLoaded = false;

                const request = this.editedDialogData;
                delete request.post;
                delete request.dept;
                request.sex = Number(request.sex);
                console.log('Отправляемый JSON: ', request)
                const response = await axios.post(serverURL+ 'rpc/emp_upsert', {"p_emp_data": request})
                console.log(response);
                if (response.status === 200){
                    this.updateSuccess = true;
                }
                this.showStatus = true
                this.$emit('refresh', serverURL + 'emp_list')
                this.isLoaded = true;
            } catch (error) {
                console.log(error);
            }
            
        }
    },
    mounted(){
        this.editedDialogData = Object.assign({}, this.dialogData);//копия для редактирования в форме
        this.postOptions = this.postDataSet.map(obj =>{
            return {value: obj.id, name: obj.name};
        })
        this.deptOptions = this.deptDataSet.map(obj =>{
            return {value: obj.id, name: obj.name};
        })
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
</style>