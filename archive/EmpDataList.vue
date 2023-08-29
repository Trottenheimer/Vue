<template>
    <div v-if="empDataSet.length > 0">
        <div class="container" style="min-width: 100%; margin: 20px auto">
            <strong>Таблица пользователей. <br>Результатов: {{empDataSet.length}}</strong>
            
            <el-table :data="empDataSet" height="850" style="width: 100%;" border
                ref="singleTableRef" highlight-current-row @current-change="handleCurrentChange"
                @row-click="handleRowClick" :row-class-name="classDanger"
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
            </el-table>
        </div>
    </div>

    <div v-else class="text-danger">
        <h1>Ничего не найдено!</h1>
    </div>
</template>


<script>
import { ref } from 'vue'
const currentRow = ref()
export default{
    name: 'emp-data-list',
    props:{
        empDataSet: {},
    },
    methods:{
        handleRowClick(row){
            this.$emit('showDialog', row)
            },
        handleCurrentChange(val){
            currentRow.value = val;//И то, и роу-клик может получить данные из таблицы
            },
        classDanger({row}){
            return row.del ? 'row-red' : '';
        }
    },
    
}
</script>


<style>
th:empty{
    visibility: hidden;
    display: none;
}
td:empty{
    visibility: hidden;
    display: none;
}
.row-red{
    --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>