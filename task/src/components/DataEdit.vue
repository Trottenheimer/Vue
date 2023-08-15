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
            <div class="row align-items-start"
                v-for="(val, key) in editedDialogData"
                :key="key"
                style="margin: 15px 0 0 0"
            >
                <div class="col-2" v-if="(key == 'id' || key == 'people_id')" v-show="showAdmin">
                    <strong>{{key}}:</strong>
                </div>
                <div class="col-2" v-else>
                    <strong>
                        <template v-if="key !== 'del'">
                            <template v-if="key === 'surname'">Фамилия</template>
                            <template v-else-if="key === 'name'">Имя</template>
                            <template v-else-if="key === 'patron'">Отчество</template>
                            <template v-else-if="key === 'birth'">Дата рожения</template>
                            <template v-else-if="key === 'sex'">Пол</template>
                            <template v-else-if="key === 'post'">Должность</template>
                            <template v-else-if="key === 'dept'">Отделение</template>
                            <template v-else-if="key === 'inn'">ИНН</template>
                            <template v-else-if="key === 'snils'">СНИЛС</template>
                            <template v-else>{{ key || '–' }}</template>
                        </template>
                    </strong>
                </div>
                <div class="col-10">
                    <div v-if="(key == 'id' || key == 'people_id')" v-show="showAdmin">
                        <strong>{{val}}</strong>
                    </div>
                    <div v-else-if="key !== 'del'">
                        <my-input v-model:modelValue="editedDialogData[key]" style="width: 100%;"/>
                    </div>
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
            <button type="button" class="btn btn-primary col-3" @click="saveChanges">Сохранить</button>
            <div class="col-6"></div>
            <button type="button" class="btn btn-secondary col-3" @click="this.$emit('update:dialogVisible', false)">Закрыть</button>
        </div>
    </div>
</template>


<script>
import axios from 'axios'

const serverURL = 'http://192.168.0.102:4000/';

export default{
    name: "data-edit",
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
        async saveChanges(){
            this.isLoaded = false;
            console.log('Запрос на сервер: ', this.editedDialogData)

            /* 
            const responsePost = await axios.get('http://192.168.0.102:4000/right_list?id=eq.2')
            console.log(responsePost.data);*/

            let a = 1
            if (a == 1){
                this.updateSuccess = true;
            }
            this.showStatus = true
            this.$emit('refresh', null)
            this.isLoaded = true;
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
</style>