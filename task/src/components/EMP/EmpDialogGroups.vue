<template>
<el-table v-loading="loading" border stripe style="width: 100%" height="700"
    :data="groupList" :default-sort="{prop: 'checked', order: 'descending'}"
>
    <el-table-column prop="name" label="Название"></el-table-column>
    <el-table-column prop="rem" label="Описание"></el-table-column>
    <el-table-column prop="checked" label="Состояние" sortable>
        <template #default="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
        </template>
    </el-table-column>
</el-table>
<div style="display: flex; justify-content: flex-end; margin-top: 20px">
    <el-button type="primary" @click="handleDialog()">Сохранить</el-button>
    <el-button type="info" @click="closeDialog">Закрыть</el-button>
</div>
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
        return {groupList, groupListCompare, empGroups, loading};
    },
    props:{
        emp:{
            type: Object,
            required: true
        }
    },
    methods:{
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
                this.groupList.forEach(group => group.checked = false);
                this.empGroups.forEach(emp => {
                    this.groupList.forEach(list => {
                        if (list.id === emp.group_id) list.checked = true
                    });
                });
                this.groupListCompare = JSON.parse(JSON.stringify(this.groupList))
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