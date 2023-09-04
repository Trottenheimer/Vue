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
            :data="rightEmps" :default-sort="{prop: 'surname', order: 'ascending'}"
            highlight-current-row empty-text="<нет данных>"
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
        :dialogType="'R_E'"
        :id="right.id"
        @refresh="this.$emit('refresh')"
    />
    </template>
    <script>
    import { ElNotification } from 'element-plus';
    import { ref } from 'vue';
    export default{
        name: "rightss-dialog-emps",
        setup(){
            const dialogVisible = ref(false);
            const currentRow = ref();
            const selectedRows = ref([]);
            const rightEmps = ref([]);
            const empList = ref([]);
            const postList = ref([]);
            const deptList = ref([]);
            return {dialogVisible, currentRow, selectedRows, rightEmps, empList, postList, deptList};
        },
        props:{
            right :{}
        },
        methods:{
            fetchData(){
                const promises = [
                    this.$getData(this.$URL_GET_RIGHT_EMPS, this.right.id).then( data => {
                        this.rightEmps = data;
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
                    this.empList = this.empList.filter((e) => !this.rightEmps.some((r) => r.id === e.id));
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
                console.log(this.selectedRows);
            },
            addEmp(){
                this.dialogVisible = true
            },
            removeEmp(){
                let promises = [];
                if(this.selectedRows.length > 0){
                    promises = this.selectedRows.map(row => {
                        return new Promise((resolve) => {
                            this.$postData(this.$URL_EMP_DEL_R, '', {p_emp_id: row.id, p_right_id: this.right.id})
                            .then(resolve());
                        })
                    });
                    Promise.all(promises).then(() => {
                        this.$emit('refresh');
                        ElNotification({title: 'Редактирование групп', message: 'Право пользователей успешно отозвано', type: 'success'});
                    })
                }
            }
        },
        mounted(){
            this.fetchData();
        }
    }
    </script>