<template>
<div>
    <div style="margin-bottom: 20px;">
        <el-button @click="addEmp" size="large"><el-icon color="green"><Plus/></el-icon></el-button>
        <el-button @click="removeEmp" size="large"
            :disabled="!currentRow && this.selectedRows?.length === 0"
        >
            <el-icon color="red"><Minus/></el-icon>
        </el-button>
    </div>
    <el-table v-loading="loading" border stripe style="width: 100%" height="700"
        :data="groupEmps" :default-sort="{prop: 'surname', order: 'ascending'}"
        highlight-current-row
        @row-click="handleRowClick" 
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="surname" label="Фамилия" sortable></el-table-column>
        <el-table-column prop="name" label="Имя" sortable></el-table-column>
        <el-table-column prop="patron" label="Отчество" sortable></el-table-column>
        <el-table-column prop="post" label="Должность" sortable></el-table-column>
        <el-table-column prop="dept" label="Отделение" sortable></el-table-column>
        <el-table-column label="Входит" width="100">
            <template #default>
                <el-icon color="green" size="large" style="margin: 0 35%;"><Select/></el-icon>
            </template>
        </el-table-column>
    </el-table>
</div>
<dialog-data v-if="dialogVisible"
    v-model="dialogVisible"
    :data="empList"
    :dialogType="'G_E'"
    :id="group.id"
    @refresh="this.$emit('refresh')"
/>
</template>
<script>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
export default{
    name: "groups-dialog-emps",
    setup(){
        const dialogVisible = ref(false);
        const currentRow = ref();
        const selectedRows = ref([]);
        const groupEmps = ref([]);
        const empList = ref([]);
        const postList = ref([]);
        const deptList = ref([]);
        return {dialogVisible, currentRow, selectedRows, groupEmps, empList, postList, deptList};
    },
    props:{
        group :{}
    },
    methods:{
        fetchData(){
            const promises = [
                this.$getData(this.$URL_GET_GROUP_EMPS, this.group.id).then( data => {
                    this.groupEmps = data;
                }),
                this.$getData(this.$URL_EMP_LIST, '').then( data => {
                    this.empList = data;
                }),
                this.$getData(this.$URL_POST_LIST, '').then(data => {
                    this.postList = data;
                }),
                this.$getData(this.$URL_DEPT_LIST, '').then(data => {
                    this.deptList = data;
                })
            ];
            Promise.all(promises).then(() => {
                this.empList = this.empList.filter((e) => !this.groupEmps.some((g) => g.emp_id === e.id));
                this.empList.forEach(emp => {
                    this.postList.forEach(post => {
                        if (emp.post_id === post.id) emp.post = post.name
                    })
                    this.deptList.forEach(dept => {
                        if (emp.dept_id === dept.id) emp.dept = dept.name
                    })
                });
            })
        },
        handleRowClick(row){
            this.currentRow = Object.assign({}, row);
        },
        handleSelectionChange(val){
            val.length !== 0 ? this.selectedRows = val : this.selectedRows = [];
        },
        addEmp(){
            this.dialogVisible = true
        },
        removeEmp(){
            if(this.selectedRows.length > 0){
                this.selectedRows.forEach(row => {
                    this.$postData(this.$URL_EMP_DEL_G, '', {p_emp_id: row.emp_id, p_group_id: this.group.id})
                    .then(() => {
                            this.$emit('refresh');
                            ElNotification({title: 'Редактирование групп', message: 'Пользователи группы успешно удалены.', type: 'success'});
                        });
                });
            }
            /*else if(this.currentRow)
                this.$postData(this.$URL_EMP_DEL_G, '', {p_emp_id: this.currentRow.emp_id, p_group_id: this.group.id})
                    .then(this.$emit('refresh'));*/
        }
    },
    mounted(){
        this.fetchData();
    }
}
</script>