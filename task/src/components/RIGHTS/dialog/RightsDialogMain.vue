<template>
<el-form :model="right">
    <el-form-item>
        <span>Название</span>
        <el-input v-model="right.name" @keydown.enter="dialogType ? handleDialogEdit() : handleDialogCreate()"></el-input>
    </el-form-item>
    <el-form-item>
        <span>Описание</span>
        <el-input v-model="right.rem" @keydown.enter="dialogType ? handleDialogEdit() : handleDialogCreate()"></el-input>
    </el-form-item>
</el-form>
<div style="display: flex; justify-content: flex-end">
    <template v-if="dialogType == 0">
        <el-button type="primary" @click="handleDialogCreate()">Создать</el-button>
    </template>
    <template v-else-if="dialogType == 1">
        <el-button type="primary" @click="handleDialogEdit()">Сохранить</el-button>
        <el-button type="danger" @click="handleDialogDelete()">Удалить</el-button>
    </template>
    <el-button type="info" @click="this.$emit('close')">Закрыть</el-button>
</div>
</template>
<script>
import { ElNotification } from 'element-plus'
export default{
    name: "right-dialog-main",
    data(){
        return{
            right: (this.dialogType? this.item : {})
        }
    },
    props:{
        item: {},
        dialogType: Boolean
    },
    methods:{
        handleDialogCreate(){
            let request = Object.assign({}, this.right);
            delete request.id;
            this.$postData(this.$URL_RIGHT_LIST, '', request).then(response => {
                if(response && response.status === 201)
                    ElNotification({title: 'Создание', message: 'Право успешно создано.', type: 'success'})
                else
                    ElNotification({title: 'Создание', message: 'Что-то пошло не так!', type: 'error'})
                this.$emit('refresh')
            });
        },
        handleDialogEdit(){
            let request = Object.assign({}, this.right);
            delete request.id;
            this.$updateData(this.$URL_RIGHT_LIST + '?id=eq.', this.right.id , request).then(response => {
                if (response && response.status === 204)
                    ElNotification({title: 'Редактирование', message: 'Запись успешно обновлена.', type: 'success'})
                else
                    ElNotification({title: 'Редактирование', message: 'Что-то пошло не так!', type: 'error'})
                this.$emit('refresh')
            });
        },
        handleDialogDelete(){
            this.$deleteData(this.$URL_RIGHT_LIST + '?id=eq.', this.right.id).then(response => {
                console.log(response);
                if (response && response.status === 204)
                    ElNotification({title: 'Удаление', message: 'Запись успешно удалена!', type: 'success'});
                else
                    ElNotification({title: 'Удаление', message: 'Что-то пошло не так!', type: 'error'})
                this.$emit('refresh')
                this.$emit('close')
            });
        },
    },
    mounted(){
        console.log(this.item)
    }
}
</script>