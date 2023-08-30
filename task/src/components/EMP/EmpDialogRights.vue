<template>
<div>
    <el-table v-loading="loading" border stripe style="width: 100%" height="700"
        :data="rightList" :default-sort="{prop: 'checked', order: 'descending'}"
    >
        <el-table-column prop="name" label="Название"></el-table-column>
        <el-table-column prop="rem" label="Описание"></el-table-column>
        <el-table-column prop="checked" label="Состояние" sortable>
            <template #default="scope">
                <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
        </el-table-column>
    </el-table>
</div>
<div style="display: flex; justify-content: flex-end; margin-top: 20px">
    <el-button type="primary" @click="handleDialog()">Сохранить</el-button>
    <el-button type="info" @click="closeDialog">Закрыть</el-button>
</div>
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
        const loading = ref(false)
        return {rightList, rightListCompare, empRights, loading};
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
                this.$getData(this.$URL_RIGHT_LIST, '').then(data => {
                    this.rightList = data;
                }),
                this.$getData(this.$URL_EMP_DIR_RIGHTS, this.emp.id).then(data => {
                    this.empRights = data;
                }),
            ];
            Promise.all(promises).then(() => {
                this.rightList.forEach(right => right.checked = false);
                this.empRights.forEach(emp => {
                    this.rightList.forEach(list => {
                        if (list.id === emp.right_id) list.checked = true
                    });
                });
                this.rightListCompare = JSON.parse(JSON.stringify(this.rightList))
            });
            this.loading = false
        },
        handleDialog(){
            try {
                for (let i = 0; i < this.rightList.length; i++) {
                    if (this.rightList[i].checked !== this.rightListCompare[i].checked)
                        this.rightList[i].checked
                            ? this.$postData(this.$URL_EMP_ADD_R, '', {p_emp_id: this.emp.id, p_right_id: this.rightList[i].id})
                            : this.$postData(this.$URL_EMP_DEL_R, '', {p_emp_id: this.emp.id, p_right_id: this.rightList[i].id})
                }
                ElNotification({title: 'Редактирование пользователя', message: 'Состав прав успешно изменен!', type: 'success'})
            } catch (error) {
                ElNotification({title: 'Редактирование пользователя', message: 'Что-то пошло не так!', type: 'error'});
                console.log(error);
            }
            
            this.$emit('refresh')
        }
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