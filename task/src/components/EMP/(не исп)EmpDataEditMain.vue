<template>
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
            <my-input
                class="form-control" style="width: 100%; align-items:center;"
                v-model="editedDialogData[key]"/>
    </div>
    <div class="col-10" v-else-if="key === 'sex'">
        <my-select
            v-model:select="editedDialogData.sex"
            :options="sexOptions"
        >
            {{sexOptions[Number(editedDialogData[key]-1)].name}}
        </my-select>
    </div>
    <div class="col-10" v-else-if="key === 'post'">
        <my-select 
            v-model:select="editedDialogData.post_id"
            :options="postOptions"
        >
            {{editedDialogData.post}}
        </my-select>
    </div>
    <div class="col-10" v-else-if="key === 'dept'">
        <my-select 
            v-model:select="editedDialogData.dept_id"
            :options="deptOptions"
        >
            {{editedDialogData.dept}}
        </my-select>
    </div>
</div>
<div class="row" role="group" style="margin-top: 20px; padding: 0 5%">
    <template v-if="!updateSuccess">
        <button type="button" class="btn btn-primary col-3" @click="updateData">Сохранить</button>
    </template>
    <template v-else>
        <button type="button" class="btn btn-success col-3" @click="updateData">Сохранено</button>
    </template>
    <div class="col-6"></div>
    <button type="button" class="btn btn-secondary col-3" @click="this.$emit('update:show', false)">Закрыть</button>
</div>
</template>


<script>
const SERVER_URL = 'http://192.168.0.102:4000/';
import axios from 'axios';
export default{
    name: "emp-data-edit-main",
    data(){
        return{
            editedDialogData: {},
            sexOptions: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
            ],
        }
    },
    props:{
        dialogData: {
            type: Object,
            required: true,
        },
        deptOptions: Array,
        postOptions: Array,
    },
    methods:{
        async updateData(){
            try {
                this.isLoaded = false;

                const request = this.editedDialogData;
                delete request.post;
                delete request.dept;
                console.log('Отправляемый JSON: ', request)
                const response = await axios.post(SERVER_URL+ 'rpc/emp_upsert', {"p_emp_data": request})
                console.log(response);
                if (response.status === 200){
                    this.updateSuccess = true;
                }
                this.showStatus = true
                this.$emit('refresh', SERVER_URL, 'emp_list');
                this.isLoaded = true;
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    mounted(){
            this.editedDialogData = this.dialogData
    }
}
</script>