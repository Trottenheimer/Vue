<template>
<div class="container">
    <div id="data-window" style="margin: 15px 0 0 0; align-items:center;"
        v-for="(val, key) in editedDialogData"
        :key="key"
    >
        <div class="" v-if="(
            key !== 'id' && key !== 'people_id' && key !== 'del'
            && key !== 'dept_id' && key !== 'post_id' && key !== 'sex'
            && key !== 'dept' && key !== 'post' && key !== 'birth')"
            >
            <el-form-item>
                <template v-if="key==='surname'"><span>Фамилия</span></template>
                <template v-else-if="key==='name'"><span>Имя</span></template>
                <template v-else-if="key==='patron'"><span>Отчество</span></template>
                <template v-else-if="key==='inn'"><span>ИНН</span></template>
                <template v-else-if="key==='snils'"><span>СНИЛС</span></template>
                <el-input v-model="editedDialogData[key]" />
            </el-form-item>
        </div>
    </div>
</div>
<el-row>
    <el-col :span="12">
        <span>Дата рождения</span>
        <el-date-picker type="date" v-model="this.editedDialogData.birth"
            format="YYYY/MM/DD" placeholder="Укажите дату рождения"
            value-format="YYYY-MM-DD"
        />
    </el-col>
    <el-col :span="12">
        <span>Пол</span>
        <el-select placeholder="Укажите пол..."
            v-model="editedDialogData.sex"
        >
        <el-option
            v-for="sex in options.sex"
            :key="sex.value"
            :label="sex.name"
            :value="sex.value"
        />
        </el-select>
    </el-col>
</el-row>
<el-row>
    <el-col :span="12">
        <span>Должность</span>
        <el-select placeholder="Укажите должность..."
            v-model="editedDialogData.post_id"
        >
            <el-option
                v-for="post in options.post"
                :key="post.value"
                :label="post.name"
                :value="post.value"
            />
        </el-select>
    </el-col>
    <el-col :span="12">
        <span>Отделение</span>
        <el-select placeholder="Укажите отделение..."
            v-model="editedDialogData.dept_id"
        >
            <el-option
                v-for="dept in options.dept"
                :key="dept.value"
                :label="dept.name"
                :value="dept.value"
            />
        </el-select>
    </el-col>
</el-row>
<div class="el-button-group mt-5" id="control-bar" role="group" aria-label="Primer" style="margin: 0 auto; padding: 0 5%;">
    <template v-if="!updateSuccess">
        <el-button type="primary" class="btn btn-primary col" @click="updateData">Сохранить</el-button>
    </template>
    <template v-else>
        <el-button type="success" class="btn btn-success col" @click="updateData">Сохранено</el-button>
    </template>
    <el-button type="danger" class="btn btn-danger col" @click="deleteData(editedDialogData.id)">Удалить</el-button>
    <el-button type="info" class="btn btn-secondary col" @click="this.$emit('hideDialog', false)">Закрыть</el-button>
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
            }
            catch (error){console.log(error);}
        },
        async deleteData(id){
            try {
                await axios.post(serverURL + 'rpc/emp_delete', {"p_emp_id": id})
                this.showDelete = false;
                this.readyToDelete = false;
                this.$emit('refresh', serverURL + 'emp_list');
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
<style>
*{
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-weight: bold;
}
.container{
    padding: 10px;
}
.el-row{
    margin-bottom: 20px;
    justify-content: space-between;
}
.el-select{
    width: 100%;
}
span{
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
}
</style>