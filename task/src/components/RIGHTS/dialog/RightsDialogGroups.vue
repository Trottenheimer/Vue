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
        :data="rightGroups" :default-sort="{prop: 'name', order: 'ascending'}"
        highlight-current-row empty-text="<нет данных>"
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
    <dialog-data v-if="dialogVisible"
        v-model="dialogVisible"
        v-model:loading="loading"
        :data="groupList"
        :dialogType="'R_G'"
        :id="right.id"
        @refresh="this.$emit('refresh')"
    />
</template>
<script>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
export default{
    name: "rights-dialog-groups",
    setup(){
        const groupList = ref([]);
        const rightGroups = ref([]);
        const loading = ref(false)
        const currentRow = ref();
        const selectedRows= ref([]);
        const dialogVisible = ref(false);
        return {groupList, rightGroups, loading, currentRow, selectedRows, dialogVisible};
    },
    props:{
        right:{
            type: Object,
            required: true
        }
    },
    methods:{
        handleSelectionChange(val){
            val.length !== 0 ? this.selectedRows = val : this.selectedRows = [];
        },
        addGroup(){
            this.dialogVisible = true
        },
        removeGroup(){
            let promises = [];
            if(this.selectedRows.length !== 0){
                promises = this.selectedRows.map(row => {
                    return new Promise((resolve) => {
                        this.$postData(this.$URL_GROUP_DEL_R, '', {p_group_id: row.group_id, p_right_id: this.right.id})
                        .then(resolve());
                    })
                });
                Promise.all(promises).then(() => {
                    this.$emit('refresh');
                    ElNotification({title: 'Редактирование права', message: 'Право успешно отозвано у групп', type: 'success'});1
                })
            }
            /*else if(this.currentRow)
                this.$postData(this.$URL_EMP_DEL_G, '', {p_emp_id: this.emp.id, p_group_id: this.currentRow.group_id}).then(this.$emit('refresh'));*/
        },
        fetchData(){
            this.loading = true
            const promises = [
                this.$getData(this.$URL_GROUP_LIST, '').then(data => {
                    this.groupList = data;
                }),
                this.$getData(this.$URL_GET_RIGHT_GROUPS, this.right.id).then(data => {
                    this.rightGroups = data;
                }),
            ];
            Promise.all(promises).then(() => {
                this.groupList = this.groupList.filter((group) => !this.rightGroups.some((emp) => emp.group_id === group.id));
            });
            this.loading = false;
        }
    },
    mounted(){
        this.fetchData()
    }
}
</script>