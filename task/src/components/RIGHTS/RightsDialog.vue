<template>
<el-dialog width="80%" draggable style="margin-top: 60px;"
    :modelValue="dialogVisible"
    @closed="closeDialog"
>
<template #header>
    <h2>{{dialogName()}} {{right.name}}</h2><br>
    <el-button-group>
        <el-button type="primary" :disabled="currentPage === 1" @click="currentPage = 1">Основные данные</el-button>
        <el-button type="primary" :disabled="currentPage === 2" @click="currentPage = 2">Группы</el-button>
        <el-button type="primary" :disabled="currentPage === 3" @click="currentPage = 3">Пользователи</el-button>
    </el-button-group>
</template>

<template v-if="currentPage === 1">
    <el-form :model="right">
        <el-form-item>
            <span>Название</span>
            <el-input v-model="right.name"></el-input>
        </el-form-item>
        <el-form-item>
            <span>Описание</span>
            <el-input v-model="right.rem"></el-input>
        </el-form-item>
    </el-form>
</template>

<template #footer>
    <template v-if="dialogType === 0">
        <el-button type="primary" @click="handleDialogCreate()">Создать</el-button>
    </template>
    <template v-else-if="dialogType === 1">
        <el-button type="primary" @click="handleDialogEdit()">Сохранить</el-button>
        <el-button type="danger" @click="handleDialogDelete(); delMode = true">Удалить</el-button>
    </template>
    <el-button type="info" @click="closeDialog">Закрыть</el-button>
</template>
</el-dialog>
</template>
<script>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
export default{
    name: "rights-dialog",
    setup(){
        const currentPage = ref(1);
        const delMode = ref(false)
        return {currentPage, delMode}
    },
    data(){
        return{
            right: (this.dialogType? this.item : {})
        }
    },
    props:{
        item:{
            type: Object,
            required: true
        },
        dialogVisible: Boolean,
        dialogType: Number,
    },
    methods:{
        closeDialog(){
            this.$emit('update:dialogVisible', false)
        },
        dialogName(){
            return this.dialogType ? 'Редактирование' : 'Создание'
        },
        refresh(){
            this.$emit('refresh')
        },
        handleDialogCreate(){
            let request = Object.assign({}, this.right);
            delete request.id;
            this.$postData(this.$URL_RIGHT_LIST, '', request).then(response => {
                if(response && response.status === 201)
                    ElNotification({title: 'Создание', message: 'Запись успешно создана.', type: 'success'})
                else
                    ElNotification({title: 'Создание', message: 'Что-то пошло не так!', type: 'error'})
                this.refresh();
            });
        },
        handleDialogEdit(){
            switch(this.currentPage){
                case 1:{
                    let request = Object.assign({}, this.right);
                    delete request.id;
                    this.$updateData(this.$URL_RIGHT_LIST + '?id=eq.', this.right.id , request).then(response => {
                        if (response && response.status === 204)
                            ElNotification({title: 'Редактирование', message: 'Запись успешно обновлена.', type: 'success'})
                        else
                            ElNotification({title: 'Редактирование', message: 'Что-то пошло не так!', type: 'error'})
                        this.refresh();
                    });
                    break;
                }
                case 2:{
                    console.log('редакт 2 стр');
                    break;
                }
                case 3:{
                    console.log('редакт 3 стр');
                    break;
                }
            }
        },
        handleDialogDelete(){
            this.$deleteData(this.$URL_RIGHT_LIST + '?id=eq.', this.right.id).then(response => {
                console.log(response);
                if (response && response.status === 204)
                    ElNotification({title: 'Удаление', message: 'Запись успешно удалена!', type: 'success'});
                else
                    ElNotification({title: 'Удаление', message: 'Что-то пошло не так!', type: 'error'})
                this.refresh();
                this.closeDialog();
            });
            
        },
    },
}
</script>