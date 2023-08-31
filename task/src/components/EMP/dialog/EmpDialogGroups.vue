<template>
<div style="margin-bottom: 20px;">
    <el-button @click="addGroup" size="large"><el-icon color="green"><Plus/></el-icon></el-button>
    <el-button @click="removeGroup" size="large"
        :disabled="!currentRow && this.selectedRows?.length === 0"
    >
        <el-icon color="red"><Minus/></el-icon>
    </el-button>
</div>
<el-table v-loading="loading" border stripe style="width: 100%" height="700"
    :data="empGroups" :default-sort="{prop: 'checked', order: 'descending'}"
    highlight-current-row
    @row-click="handleRowClick" 
    @selection-change="handleSelectionChange"
>
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="name" label="Название"></el-table-column>
    <el-table-column prop="rem" label="Описание"></el-table-column>
    <el-table-column  label="Входит" width="100">
        <template #default>
            <el-icon color="green" size="large" style="margin: 0 35%;"><Select/></el-icon>
        </template>
    </el-table-column>
</el-table>
<div style="display: flex; justify-content: flex-end; margin-top: 20px">
    <el-button type="primary" @click="handleDialog()">Сохранить</el-button>
    <el-button type="info" @click="closeDialog">Закрыть</el-button>
</div>
<dialog-data v-if="dialogVisible"
    v-model="dialogVisible"
    v-model:loading="loading"
    :data="groupList"
    :dialogType="'E_G'"
    :id="emp.id"
    @refresh="this.$emit('refresh')"
/>
</template>
<script>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
export default{
    name: "emp-dialog-groups",
    setup(){
        const groupList = ref([]);
        const groupListCompare = ref([]);
        const empGroups = ref([]);
        const loading = ref(false)
        const currentRow = ref();
        const selectedRows= ref([]);
        const dialogVisible = ref(false);
        return {groupList, groupListCompare, empGroups, loading, currentRow, selectedRows, dialogVisible};
    },
    props:{
        emp:{
            type: Object,
            required: true
        }
    },
    methods:{
        handleRowClick(row){
            this.currentRow = Object.assign({}, row);
        },
        handleSelectionChange(val){
            this.selectedRows = val;
        },
        addGroup(){
            this.dialogVisible = true
        },
        removeGroup(){
            if(this.selectedRows.length !== 0){
                this.selectedRows.forEach(row => {
                    this.$postData(this.$URL_EMP_DEL_G, '', {p_emp_id: this.emp.id, p_group_id: row.group_id}).then(this.$emit('refresh'));
                });
            }
            else if(this.currentRow)
                this.$postData(this.$URL_EMP_DEL_G, '', {p_emp_id: this.emp.id, p_group_id: this.currentRow.group_id}).then(this.$emit('refresh'));
        },
        fetchData(){
            this.loading = true
            const promises = [
                this.$getData(this.$URL_GROUP_LIST, '').then(data => {
                    this.groupList = data;
                }),
                this.$getData(this.$URL_EMP_GROUPS, this.emp.id).then(data => {
                    this.empGroups = data;
                }),
            ];
            Promise.all(promises).then(() => {
                this.groupList = this.groupList.filter((group) => !this.empGroups.some((emp) => emp.group_id === group.id));
            });
            this.loading = false;
        },
        handleDialog(){
            try {
                for (let i = 0; i < this.groupList.length; i++) {
                    if (this.groupList[i].checked !== this.groupListCompare[i].checked){
                        this.groupList[i].checked
                            ? this.$postData(this.$URL_EMP_ADD_G, '', {p_emp_id: this.emp.id, p_group_id: this.groupList[i].id})
                            : this.$postData(this.$URL_EMP_DEL_G, '', {p_emp_id: this.emp.id, p_group_id: this.groupList[i].id})
                    }
                }
                ElNotification({title: 'Редактирование пользователя', message: 'Состав групп успешно изменен!', type: 'success'})
            } catch (error) {
                ElNotification({title: 'Редактирование пользователя', message: 'Что-то пошло не так', type: 'error'});
                console.log(error);
            }
            
            this.$emit('refresh')
        }
    },
    mounted(){
        this.fetchData()
    }
}
</script>