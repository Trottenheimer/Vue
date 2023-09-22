<template>
<el-dialog width="50%" draggable style="margin-top: 80px;" :title="title"
    :modelValue="dialogVisible"
    @closed="closeDialog"
    class="dialog"
>
    <el-row style="margin-bottom: 20px; background: aliceblue">
        <el-col :span="4">
            <el-button type="primary" @click="handleAddition">Добавить</el-button>
        </el-col>
        <el-col :span="4"></el-col>
        <el-col :span="16">
            <el-input v-model="searchQuery" placeholder="Поиск..." clearable></el-input>
        </el-col>
    </el-row>
    <template v-if="dialogType == 'G_E' || dialogType == 'R_E'">
        <el-text>Пользователи: {{dataEditComputedEmp.length}}</el-text>
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
        <el-text>Доступно: {{dataEditComputed.length}}</el-text>
        <el-table height="700" border stripe
            :data="dataEditComputed" ref="multipleTableRef"
            :default-sort="{prop: 'name', order: 'ascending'}"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="Название" sortable></el-table-column>
            <el-table-column prop="rem" label="Описание"></el-table-column>
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
            search: {surname: '', name: '', patron: ''}
        }
    },
    props:{
        dialogVisible: Boolean,
        loading: Boolean,
        data: [],
        dialogType: String,
        id: Number,
    },
    watch:{
        searchQuery(){
            this.parseSearch();
        }
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
                    this.tempURL = this.$URL_GROUP_ADD_R
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
            let promises = [];
            let elTitle = '';
            let elMsg = '';
            let elType = '';
            switch(this.dialogType){
                case 'E_R'://Добавляет права пользователю
                    promises = this.selectedRows.map(row => {
                        return new Promise((resolve) => {
                            this.$postData(this.tempURL, '', {p_emp_id: this.id, p_right_id: row.id}).then(() => {
                                elTitle = 'Редактирование пользователя'; elMsg = 'Права успешно добавлены';
                                elType = 'success'; resolve();
                            })
                        })
                    });
                    break;
                case 'E_G'://Добавляет группы пользователю
                    promises = this.selectedRows.map(row => {
                        return new Promise((resolve) => {
                            this.$postData(this.tempURL, '', {p_emp_id: this.id, p_group_id: row.id}).then(()=> {
                                elTitle = 'Редактирование пользователя'; elMsg = 'Группы успешно добавлены';
                                elType = 'success'; resolve();
                            })
                        })
                    });
                    break;
                case 'G_R'://Добавляет права группе
                    promises = this.selectedRows.map(row => {
                        return new Promise((resolve) => {
                            this.$postData(this.tempURL, '', {p_group_id: this.id, p_right_id: row.id}).then(() => {
                                elTitle = 'Редактирование группы'; elMsg = 'Права успешно добавлены группе';
                                elType = 'success'; resolve();
                            })
                        })
                    });
                    break;
                case 'G_E'://Добавляет пользователей в группы
                    promises = this.selectedRows.map(row => {
                        return new Promise((resolve) => {
                            this.$postData(this.tempURL, '', {p_group_id: this.id, p_emp_id: row.id}).then(() => {
                                elTitle = 'Редактирование группы'; elMsg = 'Пользователи успешно добавлены в группу';
                                elType = 'success'; resolve();
                            })
                        })
                    });
                    break;
                case 'R_G'://Добавляет группам права
                    promises = this.selectedRows.map(row => {
                        return new Promise((resolve) => {
                            this.$postData(this.tempURL, '', {p_group_id: row.id, p_right_id: this.id}).then(() => {
                                elTitle = 'Редактирование права'; elMsg = 'Право успешно добавлено группам';
                                elType = 'success'; resolve();
                            })
                        })
                    });
                    break;
                case 'R_E'://Добавляет пользователям права
                    promises = this.selectedRows.map(row => {
                        return new Promise((resolve) => {
                            this.$postData(this.tempURL, '', {p_emp_id: row.id, p_right_id: this.id}).then(() => {
                                elTitle = 'Редактирование права'; elMsg = 'Право успешно добавлено пользователям';
                                elType = 'success'; resolve();
                            })
                        })
                    });
                    break;
            }
            if (promises.length > 0) {
                Promise.all(promises).then(() => {//ОБРАБОТКА ПРОМИСОВ ВЫШЕ
                        this.$emit('refresh');
                        ElNotification({title: elTitle, message: elMsg, type: elType});
                    });
                this.closeDialog();
            }
            else {
                ElNotification({title: elTitle, message: 'Вы ничего не добавили.', type: 'warning'})
            }
        },
        parseSearch(){
            const query = this.searchQuery.split(' ');
            this.search.surname = query[0];
            this.search.name = query[1];
            this.search.patron = query[2];
        },
    },
    computed:{
        dataEditComputed(){
            return this.dataEdit.filter(data => data.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        },
        dataEditComputedEmp(){
            let surname = this.dataEdit.filter(emp => {
                return emp.surname?.toLowerCase().includes(this.search.surname?.toLowerCase());
            });
            let name = this.dataEdit.filter(emp => {
                return emp.name?.toLowerCase().includes(this.search.name?.toLowerCase());
            });
            let patron = this.dataEdit.filter(emp => {
                return emp.patron?.toLowerCase().includes(this.search.patron?.toLowerCase());
            });
            let filteredBySN = surname.filter(item => {//Фильтрация по фамилии и имени
                return this.search.name ? name.includes(item) : true;
            });
            return filteredBySN.filter(item => {//Фильтрация по отчеству
                return this.search.patron ? patron.includes(item): true;
            })//УРРРАА РАБОТАЕТ
        }
    },
    mounted(){
        this.prepareData();
    }
}
</script>