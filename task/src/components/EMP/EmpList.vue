<template>
<el-header>
    Страница пользователей<br>
    <el-button type="primary"
        @click=" item = {}; dialogType = 0; dialogVisible = true"
    >Добавить</el-button>
</el-header>
<el-main>
    <div v-if="empList.length > 0">
        <el-text>Найдено: {{empList.length}}</el-text>
        <el-table border stripe height="800"
        :data="empList" :default-sort="{prop: 'surname', order: 'ascending'}"
        highlight-current-row
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
        const dialogVisible = ref(false)
        const dialogType = ref(0)
        return{item, dialogVisible, dialogType}
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
        }
    }
}
</script>
<style scoped>
*{
    font-weight: bold;
    font-size: 16px;
}
</style>