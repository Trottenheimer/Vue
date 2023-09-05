<template>
    <el-form :model="group">
        <el-form-item>
            <span>Название</span>
            <el-input v-model="group.name" @keydown.enter="dialogType ? handleDialogEdit() : handleDialogCreate()"></el-input>
        </el-form-item>
        <el-form-item>
            <span>Описание</span>
            <el-input v-model="group.rem" @keydown.enter="dialogType ? handleDialogEdit() : handleDialogCreate()"></el-input>
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
import {ref} from 'vue'
export default{
    name: "groups-dialog-main",
    setup(){
        const a = ref()
        return {a}
    },
    data(){return{group: this.item,}},
    props:{
        item: {},
        dialogType: Boolean,
    },
    methods:{
        handleDialogCreate(){//ДОБАВЛЕНИЕ
            this.$postData(this.$URL_GROUP_LIST, '', this.group).then(response => {
                this.$emit('refresh');
                if (response && response.status === 201)
                    ElNotification({title:'Редактирование групп', message: 'Группа успешно добавлена!', type:'success'});
                else if (response && response.response.status === 409)
                    ElNotification({title:'Редактирование групп', message: 'Группа с таким названием уже существует!', type:'warning'});
                else
                    ElNotification({title:'Редактирование групп', message: 'Что-то пошло не так!', type:'error'});
            });
        },
        handleDialogEdit(){//РЕДАКТИРОВАНИЕ
            const request = Object.assign({}, this.group);
            delete request.id;
            this.$updateData(this.$URL_GROUP_LIST, '?id=eq.' + this.group.id, request).then( response => {
                this.$emit('refresh');
                if (response && response.status === 204)
                    ElNotification({title:'Редактирование групп', message: 'Группа успешно обновлена!', type:'success'})
                else
                    ElNotification({title:'Редактирование групп', message: 'Что-то пошло не так!', type:'error'})
            });
        },
        handleDialogDelete(){//УДАЛЕНИЕ
            this.$deleteData(this.$URL_GROUP_LIST, '?id=eq.' + this.group.id).then(response => {
                this.$emit('refresh');
                if (response && response.status === 204)
                    ElNotification({title:'Редактирование групп', message: 'Группа успешно удалена!', type:'success'})
                else
                    ElNotification({title:'Редактирование групп', message: 'Что-то пошло не так!', type:'error'})    
                this.$emit('close');
            });
        },
    }
}

</script>