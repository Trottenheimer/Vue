<template>

<div v-if="groupList.length > 0">
    <el-header>
        <div>
            <el-button type="primary" @click="dialogVisible=true; createMode=true">Создать группу</el-button>
        </div>
    </el-header>
    <el-main>
        <strong>Найдено: {{groupList.length}}</strong>
        <el-table border stripe style="width: 100%;" v-loading="loading"
            :data="groupList"
            highlight-current-row
            @current-change="handleCurrentChange"
            @row-click="handleRowClick"
        >
            <el-table-column prop="name" label="Название" sortable></el-table-column>
            <el-table-column prop="rem" label="Описание"></el-table-column>
        </el-table>
    </el-main>
    <el-footer>ФУТЕР</el-footer>
</div>
<div v-else class="text-danger">
    <h1>Ничего не найдено</h1>
</div>
<!--ТАБЛИЦА-->



<!--ДИАЛОГ-->
<div>
    <el-dialog :title="dialogName()" width="50%" draggable
    v-model="dialogVisible"
    @closed="onClose"
    >
    <el-form :model="groupItem">
        <el-form-item>
            <span>Название</span>
            <el-input v-model="groupItem.name"></el-input>
        </el-form-item>
        <el-form-item>
            <span>Описание</span>
            <el-input v-model="groupItem.rem"></el-input>
        </el-form-item>

    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <template v-if="createMode">
                <el-button type="primary" @click="createMode = true; handleDialog();">Создать</el-button>
            </template>
            <template v-else>
                <el-button type="primary" @click="editMode = true; handleDialog();">Сохранить</el-button>
                <el-button type="danger" @click="deleteMode = true; handleDialog();">Удалить</el-button>
            </template>
            <el-button type="info" @click="dialogVisible = false;">Закрыть</el-button>
        </span>
    </template>
    </el-dialog>
</div>
</template>

<script>
import { ref } from 'vue';
import { ElNotification } from 'element-plus'

const currentRow = ref()

export default{
    name: 'group-data-list',
    setup(){
        const loading = ref(false);
        const dialogVisible = ref(false);
        const groupItem = ref({});
        const createMode = ref(false);
        const editMode = ref(false);
        const deleteMode = ref(false);
        return{loading, dialogVisible, groupItem, createMode, editMode, deleteMode}
    },
    props:{
        groupList: {
            type: Array,
            required: true
        },
    },
    watch:{
        dialogVisible()  {
            if (!this.dialogVisible){
                this.createMode = false;
            }
        }
    },
    methods:{
        handleRowClick(row){
            this.groupItem = row;
            console.log(this.groupItem);
            this.dialogVisible = true
        },
        handleCurrentChange(val){
            currentRow.value = val;//И то, и роу-клик может получить данные из таблицы
        },
        handleDialog(){
            if (this.editMode){//редатктирование
                let id = this.groupItem.id;
                let data = Object.assign({},this.groupItem);
                delete data.id;
                this.$updateData(this.$URL_GROUP_LIST, '?id=eq.'+ id, data)
                .then(response =>{
                    console.log(response);
                    ElNotification({ title: 'Успешно!',
                        message: 'Запись успешно удалена',
                        type: 'success',
                    })
                })
            }
            else if(this.createMode){//создание
                this.$postData(this.$URL_GROUP_LIST, '', this.groupItem)
                .then(response =>{
                    console.log(response);
                    ElNotification({ title: 'Успешно!',
                        message: 'Запись успешно добавлена',
                        type: 'success',
                    });
                })
            }
            else if(this.deleteMode){//удаление
                this.$deleteData(this.$URL_GROUP_LIST + '?id=eq.', this.groupItem.id)
                .then(response =>{
                    console.log(response);
                    this.dialogVisible = false;
                    ElNotification({ title: 'Успешно!',
                        message: 'Запись успешно удалена',
                        type: 'success',
                    })
                })
            }
            console.log('refresh');
            this.refresh()
        },
        refresh(){
            this.$emit('refresh');
        },
        onClose(){
            this.groupItem = {name: '', rem: ''};
            this.deleteMode = false
            this.createMode = false;
            this.editMode = false;
        },
        dialogName(){
            return (this.createMode ? 'Создание группы' : 'Редактирование группы')
        }
    }
}
</script>
<style>
.el-loading-mask{
    z-index: 9;
}
</style>