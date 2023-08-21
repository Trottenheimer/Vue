<template>
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
<div class="input-group mt-5" id="control-bar" role="group" aria-label="Primer" style="margin: 0 auto; padding: 0 5%;">
    <template v-if="!updateSuccess">
        <button type="button" class="btn btn-primary col" @click="updateData">Сохранить</button>
    </template>
    <template v-else>
        <button type="button" class="btn btn-success col" @click="updateData">Сохранено</button>
    </template>
    <button type="button" class="btn btn-danger col" @click="deleteData(editedDialogData.id)">Удалить</button>
    <button type="button" class="btn btn-secondary col" @click="hideDialog">Закрыть</button>
</div>
</template>


<script>
const serverURL = 'http://192.168.0.102:4000/';
import axios from 'axios';
export default{
    name: "emp-data-edit-main",
    data(){
        return{
            toDelete: false,
            updateSuccess: false,
            editedDialogData: {},
            sexOptions: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
            ],
            options: this.getOptions,
        }
    },
    props:{
        dialogData: {
            type: Object,
            required: true,
        },
        getOptions:{
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
    methods:{
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
                if (response.status === 200) this.updateSuccess = true;
                this.showStatus = true
                this.$emit('refresh', serverURL + 'emp_list')
                this.isLoaded = true;
            } catch (error) {
                console.log(error);
                alert('ошибка при сохранении!')
            }
        },
        async deleteData(id){
            try {
                await axios.post(serverURL + 'rpc/emp_delete', {"p_emp_id": id})
                this.showDelete = false;
                this.readyToDelete = false;
                this.$emit('refreshEmp', serverURL + 'emp_list');
                this.$emit('hideDialog', false)
            }
            catch (error) {console.log(error); alert('Ошибка при удалении!')}
            
        },
    },
    mounted(){
        this.editedDialogData = Object.assign({}, this.dialogData);//копия для редактирования в форме
        this.options.post = this.postDataSet.map(obj =>{
            return {value: obj.id, name: obj.name};
        })
        this.options.dept = this.deptDataSet.map(obj =>{
            return {value: obj.id, name: obj.name};
        })
    }
}
</script>