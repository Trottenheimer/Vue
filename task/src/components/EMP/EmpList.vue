<template>
<el-container>
    <el-header>
        <h1>Модуль пользователей</h1><br>
        <el-button-group>
            <el-button type="primary" @click=" item = {}; dialogType = 0; dialogVisible = true">
                Добавить пользователя
            </el-button>
            <el-button type="primary" @click="this.$emit('refresh')" icon="Refresh">Обновить</el-button>
        </el-button-group>
        <el-row>
            <el-col :span="12">
                <el-input placeholder="поиск по ФИО..."
                    v-model="searchText" @input="parseSearch" clearable
                    ><template #append>
                        <el-icon><Search/></el-icon>
                    </template>
                </el-input>
            </el-col>
        </el-row>
    </el-header>
    <el-main>
        <div v-if="empListFiltered.length > 0">
            <el-text>Найдено: {{empList.length}}</el-text>
            <el-table border height="800"
                :data="empListFiltered" :default-sort="{prop: 'surname', order: 'ascending'}"
                highlight-current-row empty-text="<нет данных>"
                :row-class-name="tableRowClassName"
                @row-click="handleRowClick"
            >
                <el-table-column prop="surname" label="Фамилия" sortable></el-table-column>
                <el-table-column prop="name" label="Имя" sortable></el-table-column>
                <el-table-column prop="patron" label="Отчество" sortable></el-table-column>
                <el-table-column prop="birth" label="Дата рождения" sortable></el-table-column>
                <el-table-column  label="Пол">
                    <template #default="scope">
                        <template v-if="scope.row.sex === 1">Мужчина</template>
                        <template v-else>Женщина</template>
                    </template>
                </el-table-column>
                <el-table-column prop="post" label="Должность" sortable></el-table-column>
                <el-table-column prop="dept" label="Отделение" sortable></el-table-column>
                <el-table-column prop="inn" label="ИНН" sortable></el-table-column>
                <el-table-column prop="snils" label="СНИЛС" sortable></el-table-column>
            </el-table>
        </div>
        <div v-else-if="empList.length == 0">
            <h1>Загрука...</h1>
        </div>
        <div v-else>
            <h1>По запросу ничего не найдено.</h1>
        </div>
    </el-main>
</el-container>
<emp-dialog v-if="dialogVisible"
    v-model:dialogVisible="dialogVisible"
    :dialogType="dialogType"
    :postList="postList"
    :deptList="deptList"
    :item="item"
    @refresh="refresh()"
/>
</template>
<script>
import EmpDialog from "@/components/EMP/EmpDialog"
import { ref } from 'vue';
export default{
    name: "emp-list",
    components:{
        EmpDialog
    },
    setup(){
        const item = ref({});
        const dialogVisible = ref(false);
        const dialogType = ref(0);
        const search =ref({surname: '', name: '', patron: ''})
        const searchText = ref('');
        return{item, dialogVisible, dialogType, search, searchText};
    },
    props:{
        empList: [],
        postList: [],
        deptList: [],
    },
    methods:{
        handleRowClick(row){
            this.item = Object.assign({}, row)
            console.log(this.item);
            this.dialogType = this.empListFiltered
            this.dialogVisible = true
        },
        refresh(){
            this.$emit('refresh')
        },
        parseSearch(){
            const query = this.searchText.split(' ');
            this.search.surname = query[0];
            this.search.name = query[1];
            this.search.patron = query[2];
        },
        tableRowClassName({row}){
            return row.del == 1 ? 'row-danger' : ''
        }
    },
    computed:{
        empListFiltered(){
            let surname = this.empList.filter(emp => {
                return emp.surname?.toLowerCase().includes(this.search.surname?.toLowerCase());
            });
            let name = this.empList.filter(emp => {
                return emp.name?.toLowerCase().includes(this.search.name?.toLowerCase());
            });
            let patron = this.empList.filter(emp => {
                return emp.patron?.toLowerCase().includes(this.search.patron?.toLowerCase());
            });
            let filteredBySN = surname.filter(item => {//Фильтрация по фамилии и имени
                return this.search.name ? name.includes(item) : true;
            });
            return filteredBySN.filter(item => {//Фильтрация по отчеству
                return this.search.patron ? patron.includes(item): true;
            })//УРРРАА РАБОТАЕТ
        }
    }
}
</script>
<style>
.row-danger{
    --el-table-tr-bg-color: var(--el-color-danger-light-9) ! important;
}
</style>