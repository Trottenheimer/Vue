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
            <el-input v-model="searchQuery" placeholder="Поиск по названию..."></el-input>
        </el-col>
    </el-row>
    

    <el-table height="700" border stripe
        :data="dataEditComputed" ref="multipleTableRef"
        :default-sort="{prop: 'name', order: 'ascending'}"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="Название" sortable></el-table-column>
        <el-table-column prop="rem" label="rem"></el-table-column>
    </el-table>
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
                    this.title = 'Выбор прав';
                    this.tempURL = this.$URL_EMP_ADD_R;
                    break;
                }
                case 'E_G':{
                    this.title = 'Выбор групп';
                    this.tempURL = this.$URL_EMP_ADD_G
                    break;
                }
                case 'G_R':{
                    this.title = 'Выбор прав';
                    this.tempURL = this.$URL_GROUP_ADD_R
                    break;
                }
            }
        },
        handleSelectionChange(val){
            this.selectedRows = val;
        },
        handleAddition(){
            if (this.dialogType == 'E_R'){//Добавляет право пользователю
                this.selectedRows.forEach(row => {
                    this.$postData(this.tempURL, '', {p_emp_id: this.id, p_right_id: row.id}).then()
                });
                ElNotification({title: 'Редактирование пользователей', message: 'Права успешно добавлены', type: 'success'})
            }
            else if(this.dialogType == 'E_G'){//Добавляет группу пользователю
                this.selectedRows.forEach(row => {
                    this.$postData(this.tempURL, '', {p_emp_id: this.id, p_group_id: row.id}).then()
                });
                ElNotification({title: 'Редактирование пользователей', message: 'Группы успешно добавлены', type: 'success'})
            }
            else if(this.dialogType == 'G_R'){//Добавляет право группе
                this.selectedRows.forEach(row => {
                    this.$postData(this.$URL_GROUP_ADD_R, '', {p_group_id: this.id, p_right_id: row.id}).then()
                });
                ElNotification({title: 'Редактирование пользователей', message: 'Группы успешно добавлены', type: 'success'})
            }
            this.$emit('refresh')
            this.closeDialog();
        },
    },
    computed:{
        dataEditComputed(){
            return this.dataEdit.filter(data => data.name.includes(this.searchQuery))
        }
    },
    mounted(){
        this.prepareData();
    }
}
</script>