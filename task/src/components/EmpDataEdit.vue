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
                        && key !== 'dept_id' && key !== 'post_id'
                        )"
                    >
                        <my-input class="form-control"  v-model:modelValue="editedDialogData[key]" style="width: 100%; align-items:center;"/>
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

        <h3 class="text-success"
            :class="{'text-danger': !updateSuccess}"
            v-show="showStatus"
        >
            {{updateSuccess ? 'Изменения сохранены.' : 'Ошибка!'}}
        </h3>

        <div class="row" role="group" aria-label="Primer" style="margin-top: 20px; padding: 0 5%">
            <button type="button" class="btn btn-primary col-3" @click="updateData">Сохранить</button>
            <div class="col-6"></div>
            <button type="button" class="btn btn-secondary col-3" @click="this.$emit('update:dialogVisible', false)">Закрыть</button>
        </div>
    </div>
</template>


<script>
import axios from 'axios'

const serverURL = 'http://192.168.0.102:4000/';

export default{
    name: "emp-data-edit",
    components:{
    },
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
            empGroupURL: serverURL + 'rpc/get_emp_groups?p_emp_id=',
            directRightsURL: serverURL + 'rpc/get_emp_direct_right?p_emp_id=',
            allRightsURL: serverURL + 'rpc/get_emp_all_rights?p_emp_id=',
            deptListURL: serverURL + 'dept_list',
            postListURL: serverURL + 'post_list',
            tempURL: '',
            tempQuery: '',
            updateSuccess: false,
            showStatus: false,
            responsePost: {},
        }
    },
    props:{
        dialogData: {
            type: Object,
            required: true
        }
    },
    watch:{
        currentPage(page){
            if (page == 2){
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
    methods:{
        async fetchData(url,query){
            try {
                this.isLoaded = false;
                console.log(url+query);
                const response = await axios.get(url + query);
                this.isLoaded = true;
                switch(url){
                    case this.empGroupURL:
                        this.groupList = response.data;
                        break;
                    case this.directRightsURL:
                        this.directRightsList = response.data;
                        break;
                    case this.allRightsURL:
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
                this.isLoaded = false;

            const request = this.editedDialogData;
            delete request.post;
            delete request.dept;
            console.log('Отправляемый JSON: ', request)
            const response = await axios.post('http://192.168.0.102:4000/rpc/emp_upsert', {"p_emp_data": request})
            console.log(response);
            
            /* 
            const responsePost = await axios.get('http://192.168.0.102:4000/right_list?id=eq.2')
            console.log(responsePost.data);*/
            if (response.status === 200){
                this.updateSuccess = true;
            }
            this.showStatus = true
            this.$emit('refresh', null)
            this.isLoaded = true;
            } catch (error) {
                console.log(error);
            }
            
        }
    },
    mounted(){
        this.editedDialogData = Object.assign({}, this.dialogData);
        //Создаем нон-реактивную копию полученного объекта
        //Запрашиваем данные о должностях и отделениях
    }
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