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
        :data="groupRights" :default-sort="{prop: 'name', order: 'ascending'}"
        highlight-current-row empty-text="<нет данных>"
        @row-click="handleRowClick" 
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="name" label="Название" sortable></el-table-column>
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
    v-model:loading="loading"
    :data="rightList"
    :dialogType="'G_R'"
    :id="group.id"
    @refresh="this.$emit('refresh')"
/>
</template>
<script>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
export default{
    name: "groups-dialog-rights",
    setup(){
        const dialogVisible = ref(false);
        const groupRights = ref([]);
        const rightList = ref([]);
        const selectedRows = ref([]);
        const currentRow = ref();
        return {dialogVisible, groupRights, rightList, selectedRows, currentRow}
    },
    props:{
        group :{}
    },
    methods:{
        fetchData(){
            const promises = [
                this.$getData(this.$URL_GET_GROUP_RIGHTS, this.group.id).then( data => {
                    this.groupRights = data;
                }),
                this.$getData(this.$URL_RIGHT_LIST, '').then( data => {
                    this.rightList = data;
                })
            ];
            Promise.all(promises).then(() => {
                this.rightList = this.rightList.filter((r) => !this.groupRights.some((g) => g.right_id === r.id));
            })
        },
        handleRowClick(row){
            this.currentRow = Object.assign({}, row);
        },
        handleSelectionChange(val){
            val.length !== 0 ? this.selectedRows = val : this.selectedRows = [];
        },
        addRight(){
            this.dialogVisible = true
        },
        removeRight(){
            let promises = [];
            if(this.selectedRows.length > 0){
                promises = this.selectedRows.map(row => {
                    return new Promise((resolve) => {
                        this.$postData(this.$URL_GROUP_DEL_R, '', {p_group_id: this.group.id, p_right_id: row.right_id})
                        .then(resolve());
                    })
                });
                Promise.all(promises).then(() => {
                    this.$emit('refresh');
                    ElNotification({title: 'Редактирование групп', message: 'Права группы успешно отозваны.', type: 'success'});
                })
                
            }
            /*else if(this.currentRow)
                this.$postData(this.$URL_GROUP_DEL_R, '', {p_group_id: this.group.id, p_right_id: this.currentRow.right_id})
                    .then(this.$emit('refresh'));*/
        }
    },
    mounted(){
        this.fetchData();
    }
}
</script>