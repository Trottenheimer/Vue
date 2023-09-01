<template>
<el-dialog width="50%" draggable style="margin-top: 80px;" :title="title"
    :modelValue="dialogVisible"
    @closed="closeDialog"
>
    <el-row style="margin-bottom: 20px; background: aliceblue">
        <el-col :span="4">
            <el-button type="primary" @click="handleAddition">Добавить</el-button>
        </el-col>
        <el-col :span="4"></el-col>
        <el-col :span="16">
            <el-input v-model="searchQuery" placeholder="Поиск по фамилии..." clearable></el-input>
        </el-col>
    </el-row>
    <template v-if="dialogType == 'G_E'">
        <el-table height="700" border stripe
            :data="dataEditComputedEmp" ref="multipleTableRef"
            :default-sort="{prop: 'surname', order: 'ascending'}"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="40" />
            <el-table-column prop="surname" label="Фамилия" sortable></el-table-column>
            <el-table-column prop="name" label="Имя" sortable></el-table-column>
            <el-table-column prop="patron" label="Отчество" sortable></el-table-column>
            <el-table-column prop="post" label="Должность" sortable></el-table-column>
            <el-table-column prop="dept" label="Отделение" sortable></el-table-column>
        </el-table>
    </template>
    <template v-else>
        <el-table height="700" border stripe
            :data="dataEditComputed" ref="multipleTableRef"
            :default-sort="{prop: 'name', order: 'ascending'}"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="Название" sortable></el-table-column>
            <el-table-column prop="rem" label="rem"></el-table-column>
        </el-table>
    </template>
</el-dialog>
</template>
<script>
import { ElNotification } from 'element-plus';

export default{
    name: "dialog-data",
    data(){
        return{
            dataEdit: this.data,
            searchQuery: '',
            selectedRows: [],
            title: '',
            tempURL: '',
            tempReq: '',
        }
    },
    props:{
        dialogVisible: Boolean,
        loading: Boolean,
        data: [],
        dialogType: String,
        id: Number,
    },
    methods:{
        closeDialog(){
            this.$emit('update:dialogVisible', false)
        },
        prepareData(){
            switch(this.dialogType){
                case 'E_R':{
                    this.title = 'Выбор прав для пользователя';
                    this.tempURL = this.$URL_EMP_ADD_R;
                    break;
                }
                case 'E_G':{
                    this.title = 'Выбор групп для пользователя';
                    this.tempURL = this.$URL_EMP_ADD_G
                    break;
                }
                case 'G_R':{
                    this.title = 'Выбор прав для группы';
                    this.tempURL = this.$URL_GROUP_ADD_R
                    break;
                }
                case 'G_E':{
                    this.title = 'Выбор пользователей для группы';
                    this.tempURL = this.$URL_EMP_ADD_G
                    break;
                }
                case 'R_G':{
                    this.title = 'Выбор групп для прав';
                    this.tempURL = this.$URL_GROUP_ADD_G
                    break;
                }
                case 'R_E':{
                    this.title = 'Выбор пользователей для прав';
                    this.tempURL = this.$URL_EMP_ADD_R
                    break;
                }
            }
        },
        handleSelectionChange(val){
            this.selectedRows = val;
        },
        handleAddition(){
            switch(this.dialogType){
                case 'E_R'://Добавляет право пользователю
                    this.selectedRows.forEach(row => {
                        this.$postData(this.tempURL, '', {p_emp_id: this.id, p_right_id: row.id}).then(() => {
                            this.$emit('refresh');
                            ElNotification({title: 'Редактирование пользователей', message: 'Права успешно добавлены', type: 'success'});
                    })});
                    break;
                case 'E_G'://Добавляет группу пользователю
                    this.selectedRows.forEach(row => {
                        this.$postData(this.tempURL, '', {p_emp_id: this.id, p_group_id: row.id}).then(()=> {
                            this.$emit('refresh');
                            ElNotification({title: 'Редактирование пользователей', message: 'Группы успешно добавлены', type: 'success'});
                    })});
                    break;
                case 'G_R'://Добавляет право группе
                    this.selectedRows.forEach(row => {
                        this.$postData(this.$URL_GROUP_ADD_R, '', {p_group_id: this.id, p_right_id: row.id}).then(() => {
                            this.$emit('refresh');
                            ElNotification({title: 'Редактирование пользователей', message: 'Группы успешно добавлены', type: 'success'});
                    })});
                    break;
                case 'G_E'://Добавляет пользователя группе
                    this.selectedRows.forEach(row => {
                        this.$postData(this.$URL_EMP_ADD_G, '', {p_group_id: this.id, p_emp_id: row.id}).then(() => {
                            this.$emit('refresh');
                            ElNotification({title: 'Редактирование пользователей', message: 'Пользователи успешно добавлены', type: 'success'});
                    })});
                    break;
                case 'R_G'://Добавляет группам право
                    this.selectedRows.forEach(row => {
                        this.$postData(this.$URL_GROUP_ADD_R, '', {p_group_id: row.id, p_right_id: this.id}).then(() => {
                            this.$emit('refresh');
                            ElNotification({title: 'Редактирование прав', message: 'Группы успешно добавлены', type: 'success'});
                    })});
                    break;
                case 'R_E':
                    this.selectedRows.forEach(row => {
                        this.$postData(this.tempURL, '', {p_emp_id: row.id, p_right_id: this.id}).then(() => {
                            this.$emit('refresh');
                            ElNotification({title: 'Редактирование прав', message: 'Пользователи успешно добавлены', type: 'success'});
                    })});
                    break;
            }
            this.closeDialog();
        },
    },
    computed:{
        dataEditComputed(){
            return this.dataEdit.filter(data => data.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        },
        dataEditComputedEmp(){
            return this.dataEdit.filter(data => data.surname.toLowerCase().includes(this.searchQuery.toLowerCase()))
        }
    },
    mounted(){
        this.prepareData();
    }
}
</script>