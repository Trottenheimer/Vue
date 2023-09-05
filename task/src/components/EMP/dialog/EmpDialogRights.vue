<template>
<div>
    <div style="margin-bottom: 20px;">
        <el-button @click="addRight" size="large"><el-icon color="green"><Plus/></el-icon></el-button>
        <el-button @click="removeRight" size="large"
            :disabled="!currentRow && this.selectedRows?.length === 0"
        >
            <el-icon color="red"><Minus/></el-icon>
        </el-button>
    </div>
    <el-table v-loading="loading" border stripe style="width: 100%" height="700"
        :data="empRights" :default-sort="{prop: 'name', order: 'descending'}"
        highlight-current-row empty-text="<нет данных>"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="name" label="Название"></el-table-column>
        <el-table-column prop="rem" label="Описание"></el-table-column>
        <el-table-column label="Разрешено" width="100">
            <template #default>
                <el-icon color="green" size="large" style="margin: 0 35%;"><Select/></el-icon>
            </template>
        </el-table-column>
    </el-table>
</div>
<dialog-data v-if="dialogVisible"
    v-model="dialogVisible"
    :data="rightList"
    :dialogType="'E_R'"
    :id="emp.id"
    @refresh="this.$emit('refresh')"
/>
</template>
<script>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
export default{
    name: "emp-dialog-rights",
    setup(){
        const rightList = ref([]);
        const rightListCompare = ref([]);
        const empRights = ref([]);
        const dialogVisible = ref(false);
        const currentRow = ref();
        const selectedRows= ref([]);
        return {rightList, rightListCompare, empRights, dialogVisible, currentRow, selectedRows};
    },
    props:{
        emp:{
            type: Object,
            required: true
        }
    },
    methods:{
        handleSelectionChange(val){
            val.length !== 0 ? this.selectedRows = val : this.selectedRows = [];
        },
        addRight(){
            this.dialogVisible = true
        },
        removeRight(){
            let promises = [];
            if(this.selectedRows.length !== 0){
                promises = this.selectedRows.map(row => {
                    return new Promise((resolve) => {
                        this.$postData(this.$URL_EMP_DEL_R, '', {p_emp_id: this.emp.id, p_right_id: row.right_id})
                        .then(resolve());
                    });
                });
                Promise.all(promises).then(() => {
                    this.$emit('refresh');
                    ElNotification({title: 'Редактирование пользователя', message: 'Права пользователя успешно отозваны', type: 'success'});
                })
            }
        },
        fetchData(){
            this.loading = true
            const promises = [
                this.$getData(this.$URL_RIGHT_LIST, '').then(data => {
                    this.rightList = data;
                }),
                this.$getData(this.$URL_EMP_DIR_RIGHTS, this.emp.id).then(data => {
                    this.empRights = data;
                }),
            ];
            Promise.all(promises).then(() => {
                this.rightList = this.rightList.filter((r) => !this.empRights.some((e) => e.right_id === r.id));
            });
            this.loading = false
        },
    },
    mounted(){
        this.fetchData();
    }
}
</script>
<style>
.example-showcase .el-loading-mask {
    z-index: 9;
  }
</style>