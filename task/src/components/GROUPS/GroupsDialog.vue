<template>
    <div>
        <el-dialog width="80%" draggable style="margin-top: 60px;"
            :modelValue="dialogVisible"
            @closed="onClose"
        >
            <template #header="{}">
                {{ dialogName() }} <br><br>
                <el-button-group>
                    <el-button type="primary" :disabled="currentPage === 1" @click="currentPage = 1">Основные данные</el-button>
                    <el-button type="primary" :disabled="currentPage === 2" @click="currentPage = 2">Права</el-button>
                    <el-button type="primary" :disabled="currentPage === 3" @click="currentPage = 3">Пользователи</el-button>
                </el-button-group>
            </template>
    
            <div v-if="currentPage === 1"><!--СТРАНИЦА 1-->
                <el-form v-if="groupItem" :model="groupItem">
                    <el-form-item>
                        <span>Название</span>
                        <el-input v-model="groupItem.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span>Описание</span>
                        <el-input v-model="groupItem.rem"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else-if="currentPage === 2"><!--СТРАНИЦА 2-->
                <el-input v-model="searchRights" placeholder="Поиск по названию..."></el-input>
                <el-table border stripe style="width: 100%;" height="700"
                    :data="filteredRightList" v-loading="loading"
                    :default-sort="{ prop: 'checked', order: 'descending' }"
                >
                    <el-table-column prop="name" label="Название" sortable></el-table-column>
                    <el-table-column prop="rem" label="Описание"></el-table-column>
                    <el-table-column prop="checked" label="Состояние" sortable>
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.checked"></el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else-if="currentPage === 3"><!--СТРАНИЦА 3-->
                <el-input v-model="searchEmp" placeholder="Поиск..."></el-input>
                <el-table border stripe style="width: 100%;" height="700"
                    :data="filteredEmpList" v-loading="loading"
                    :default-sort="{ prop: 'checked', order: 'descending' }"
                >
                    <el-table-column prop="surname" label="Фамилия"></el-table-column>
                    <el-table-column prop="name" label="Имя"></el-table-column>
                    <el-table-column prop="patron" label="Отчество"></el-table-column>
                    <el-table-column prop="birth" label="Дата рождения"></el-table-column>
                    <el-table-column  label="Пол">
                        <template #default="scope">
                            <span v-if="scope.row.sex === 1">Мужчина</span>
                            <span v-else-if="scope.row.sex === 2">Женщина</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dept" label="Отделение"></el-table-column>
                    <el-table-column prop="post" label="Должность"></el-table-column>
                    <el-table-column prop="inn" label="ИНН"></el-table-column>
                    <el-table-column prop="snils" label="СНИЛС"></el-table-column>
                    <el-table-column prop="checked" label="Состояние" sortable>
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.checked"></el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <template v-if="createMode">
                        <el-button type="primary" @click=" handleDialog();"
                        >Создать</el-button>
                    </template>
                    <template v-else-if="!rightEditMode">
                        <el-button type="primary" @click="editMode = true; handleDialog();"
                        >Сохранить</el-button>
                        <el-button type="danger" @click="deleteMode = true; handleDialog();">Удалить</el-button>
                    </template>
                    <template v-else-if="editMode">
                        <el-button type="primary" @click="handleDialog();">Сохранить права</el-button>
                    </template>
                    <el-button type="info" @click="onClose()">Закрыть</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { ref } from 'vue';
import { ElNotification } from 'element-plus'
export default{
    name: "groups-dialog",
    setup(){
        const loading = ref(false);
        const groupItem = ref();
        const createMode = ref(false);
        const editMode = ref(false);
        const deleteMode = ref(false);
        const rightEditMode = ref(false);
        const empEditMode = ref(false);
        const searchRights = ref('')
        let rightList = ref([]);
        let rightListCompare = ref([]);
        let groupRightList = ref([]);
        let currentPage = ref(1);
        return{
            loading, groupItem, createMode, editMode, deleteMode,
            currentPage, rightList, rightListCompare, groupRightList, rightEditMode,
            searchRights, empEditMode
        }
    },
    props:{
        dialogVisible: Boolean,
        groupItemProp: {
            type: Object,
            required: true,
        },
    },
    watch:{
        currentPage(){
            if (this.currentPage === 2) {
                this.getRights(this.groupItem.id);
                this.rightEditMode = true;
            }
            else if (this.currentPage === 3) {
                this.getEmp(this.groupItem.id);
                this.empEditMode = true;
            }
        }
    },
    methods:{
        handleDialog(){
            //Порядок объявления условий обязателен, поскольку editMode подразумевает под собой 
                //удаление, и редактирование, и работу с правами.
            if(this.deleteMode){//удаление
                this.$deleteData(this.$URL_GROUP_LIST + '?id=eq.', this.groupItem.id)
                .then(response =>{
                    console.log(response);
                    this.onClose();
                    ElNotification({ title: 'Основные данные', message: 'Запись успешно удалена',
                        type: 'success', icon: 'el-icon-delete',
                    })
                })
            }
            else if(this.rightEditMode){//права
                this.rightList.forEach(e => {
                    this.rightListCompare.forEach(i => {
                        if (e.id  ===  i.id && e.checked !== i.checked){
                            e.checked ? console.log('Добавление права ', e.name) : console.log('Удаление права ', e.name);
                            if (e.checked){
                                this.$postData(this.$URL_GROUP_ADD_R, '', {p_group_id: this.groupItem.id, p_right_id: e.id}).then(respone => {
                                    console.log(respone);
                                    ElNotification({title: 'Права', message: 'Права успешно обновлены.', type: 'success'})
                                })
                            }
                        }
                    })
                })
            }
            else if (this.editMode){//редактирование
                let id = this.groupItem.id;
                let data = Object.assign({},this.groupItem);
                delete data.id;
                this.$updateData(this.$URL_GROUP_LIST, '?id=eq.'+ id, data)
                .then(response =>{
                    console.log(response);
                    ElNotification({ title: 'Основные данные', message: 'Изменения успешно сохранены',
                        type: 'success',
                    })
                })
            }
            else if(this.createMode){//создание
                this.$postData(this.$URL_GROUP_LIST, '', this.groupItem)
                .then(response =>{
                    console.log(response);
                    ElNotification({ title: 'Основные данные', message: 'Запись успешно добавлена',
                        type: 'success',
                    });
                })
            }
            setTimeout(() => {
                this.refresh()
            }, 500);//Пока что костыль
        },
        refresh(){
            this.$emit('refresh');
        },
        onClose(){
            this.groupItem = {name: '', rem: ''};
            this.deleteMode = false
            this.createMode = false;
            this.editMode = false;
            this.rightEditMode = false;
            this.empEditMode = false;
            this.currentPage = 1;
            this.$emit('update:dialogVisible', false)
        },
        dialogName(){
            return (this.createMode ? 'Создание группы' : 'Редактирование группы')
        },
        getRights(id){
            this.loading = true
            this.$getData(this.$URL_RIGHT_LIST, '').then(data =>{
                this.rightList = data;
                this.rightList.forEach(right =>{
                    right.checked = false;
                });
                this.$getData(this.$URL_GET_GROUP_RIGHTS, id).then(data =>{
                    this.groupRightList = data;
                    this.rightList.forEach(right => {
                        this.groupRightList.forEach(groupRight =>{
                            if (right.id === groupRight.right_id) right.checked = true
                        })
                    });
                    this.rightListCompare = JSON.parse(JSON.stringify(this.rightList))
                    this.loading = false
                });
            });
        },
        getEmp(id){
            this.loading = true;
            this.loading = false;
            console.log(id);
        }
    },
    computed:{
        filteredRightList(){
            return this.rightList.filter((right) =>!this.searchRights
                || right.name.toLowerCase().includes(this.searchRights.toLowerCase()))
        }
    },
    mounted(){
        this.groupItem = Object.assign({}, this.groupItemProp);
        console.log(this.groupItem);
    }
}
</script>
<style></style>