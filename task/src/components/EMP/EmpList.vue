<template>
<el-header>
    <h1>Модуль пользователей</h1><br>
    <el-row>
        <el-col :span="3">
            <el-button type="primary" @click=" item = {}; dialogType = 0; dialogVisible = true" style="width: 100%;"
            >
                Добавить
            </el-button>
        </el-col>
        <el-col :span="9">
            <el-input placeholder="поиск по ФИО..."
                v-model="searchText" @input="parseSearch"
            >
                <template #append>
                    <el-icon><Search/></el-icon>
                </template>
            </el-input>
        </el-col>
    </el-row>
</el-header>
<el-main>
    <div v-if="empList.length > 0">
        <el-text>Найдено: {{empList.length}}</el-text>
        <el-table border stripe height="800"
        :data="empListComputed" :default-sort="{prop: 'surname', order: 'ascending'}"
        highlight-current-row
        :row-class-name="isDel"
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
            <el-table-column prop="del" label="Удален" sortable></el-table-column>
            <el-table-column prop="post" label="Должность" sortable></el-table-column>
            <el-table-column prop="dept" label="Отделение" sortable></el-table-column>
            <el-table-column prop="inn" label="ИНН" sortable></el-table-column>
            <el-table-column prop="snils" label="СНИЛС" sortable></el-table-column>
        </el-table>
    </div>
    <div v-else>
        <h1>Ничего не найдено!</h1>
    </div>
</el-main>
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
            this.dialogType = 1
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
            console.log(this.search);
            console.log(undefined);
        }
    },
    computed:{
        empListComputed(){
            console.log(this.search);
            let surname = this.empList.filter(emp => {
                return emp.surname?.toLowerCase().includes(this.search.surname?.toLowerCase())
            });
            let name = this.empList.filter(emp => {
                return emp.name?.toLowerCase().includes(this.search.name?.toLowerCase())
            });
            let patron = this.empList.filter(emp => {
                return emp.patron?.toLowerCase().includes(this.search.patron?.toLowerCase())
            });
            return surname.filter(item => {
                return this.search.name ? name.includes(item) : true && this.search.patron ? patron.includes(item): true;
            });
        }
    }
}
</script>
<style scoped>
*{
    font-weight: bold;
    font-size: 16px;
}
.row-danger{
    --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>