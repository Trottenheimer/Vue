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
            <div class="row" id="data-bar" style="margin: 15px 0 0 0; align-items:center;"
                v-for="(val, key) in editedDialogData"
                :key="key"
            >
                <div class="col-2 align-middle"
                    v-if="(
                        key !== 'id' && key !== 'people_id' && key !== 'del'
                        && key !== 'dept' && key !== 'post'
                    )"
                >
                    <strong>
                        <template v-if="key === 'surname'">Фамилия: </template>
                        <template v-else-if="key === 'name'">Имя: </template>
                        <template v-else-if="key === 'patron'">Отчество: </template>
                        <template v-else-if="key === 'birth'">Дата рожения*: </template>
                        <template v-else-if="key === 'sex'">Пол: </template>
                        <template v-else-if="key === 'post_id'">Должность: </template>
                        <template v-else-if="key === 'dept_id'">Отделение: </template>
                        <template v-else-if="key === 'inn'">ИНН: </template>
                        <template v-else-if="key === 'snils'">СНИЛС: </template>
                        <template v-else>{{ key || '–' }}</template>
                    </strong>
                </div>
                <div class="col-10"
                    v-if="(
                        key !== 'id' && key !== 'people_id' && key !== 'del'
                        && key !== 'dept_id' && key !== 'post_id' && key !== 'sex'
                        && key !== 'dept' && key !== 'post' && key !== 'birth'
                        )"
                    >   
                        <my-input class="form-control" style="width: 100%; align-items:center;"
                            v-model="editedDialogData[key]"
                        />
                </div>
                <div class="col-10" v-else-if="key === 'birth'">
                    <template v-if="key === 'birth'">
                        <my-input type="date" class="form-control" v-model="this.editedDialogData[key]"/>
                    </template>
                </div>
                <div class="col-10" v-else-if="key === 'sex'">
                    <my-select
                        v-model:select="editedDialogData.sex"
                        :options="options.sex"
                    >
                        <template v-if="(editedDialogData.sex === 1)">Мужской</template>
                        <template v-else-if="(editedDialogData.sex === 2)">Женский</template>
                        <template v-else><strong>Укажите пол</strong></template>
                    </my-select>
                </div>
                <div class="col-10" v-else-if="key === 'post_id'">
                    <my-select v-model:select="editedDialogData.post_id"
                    :options="options.post"
                    >
                        <template v-if="editedDialogData.post_id">
                            {{editedDialogData.post}}
                        </template>
                        <template v-else><strong>Укажите должность</strong></template>
                    </my-select>
                </div>
                <div class="col-10" v-else-if="key === 'dept_id'">
                    <my-select v-model:select="editedDialogData.dept_id" 
                        :options="options.dept"
                    >
                        <template v-if="editedDialogData.dept_id">
                            {{editedDialogData.dept}}
                        </template>
                        <template v-else><strong>Укажите отделение</strong></template>
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

        <div class="input-group mt-5" id="control-bar" role="group" aria-label="Primer" style="margin: 0 auto; padding: 0 5%;">
            <template v-if="toDelete">
                    <button type="button" class="btn btn-success col-8" @click="currentPage=1; toDelete = false">Восстановить</button>
                    <button type="button" class="btn btn-secondary col" @click="this.$emit('update:show', false)">Закрыть</button>
            </template>

            <template v-else>
                <template v-if="!updateSuccess">
                    <button type="button" class="btn btn-primary col" @click="updateData">Сохранить</button>
                </template>
                <template v-else>
                    <button type="button" class="btn btn-success col" @click="updateData">Сохранено</button>
                </template>
                <button type="button" class="btn btn-danger col" @click="prepareDelete(editedDialogData.id)">Удалить</button>
                <button type="button" class="btn btn-secondary col" @click="this.$emit('update:show', false)">Закрыть</button>
            </template>
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
            toDelete: false,
            currentPage: 1,
            showAdmin: false,
            isLoaded: false,
            tempURL: '',
            tempQuery: '',
            updateSuccess: false,
            showStatus: false,
            groupList: [ {} ],
            directRightsList: [{}],
            allRightsList:[{}],
            deptList:[{}],
            postList:[{}],
            responsePost: {},
            editedDialogData: {},
            options: {
                sex: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
                ],
                dept: [],
                post: [],
            },
            showDelete: false,
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
                delete request.del;
                delete request.people_id;
                console.log('Отправляемый JSON: ', request)
                const response = await axios.post(serverURL + 'rpc/emp_upsert', {"p_emp_data": request})
                console.log(response);
                if (response.status === 200){
                    this.updateSuccess = true;
                }
                this.showStatus = true
                this.$emit('refresh', serverURL + 'emp_list')
                this.isLoaded = true;
            } catch (error) {
                console.log(error);
                alert('ошибка при сохранении!')
            }
        },
        prepareDelete(id){
            this.toDelete = confirm('Вы уверены что хотите удалить ' + this.editedDialogData.post + ' ' + this.editedDialogData.name + '?')
            console.log(id);
            this.currentPage = 0;
        },
        async deleteData(){
            /*try {
                await axios.post(serverURL + 'rpc/emp_delete', {"p_emp_id": id})
                this.$emit('refresh', serverURL + 'emp_list')
            }
            catch (error) {console.log(error); alert('Ошибка при удалении!')}*/
        }
    },
    mounted(){
        this.editedDialogData = Object.assign({}, this.dialogData);//копия для редактирования в форме
        this.options.post = this.postDataSet.map(obj =>{
            return {value: obj.id, name: obj.name};
        })
        this.options.dept = this.deptDataSet.map(obj =>{
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
#data-edit{
    background-color: aliceblue;
    border-radius: 15px;
}
</style>