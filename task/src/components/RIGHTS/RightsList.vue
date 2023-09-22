<template>
<el-container>
    <el-header>
        <div>
            <h1>Модуль прав</h1><br>
            <el-button-group>
                <el-button type="primary" @click=" rightItem = {}; dialogType = 0; dialogVisible = true" icon="Plus">
                    Добавить право
                </el-button>
                <el-button type="primary" @click="this.$emit('refresh')" icon="Refresh">Обновить</el-button>
            </el-button-group>
            <br>
            <el-input placeholder="поиск по названию..." class="search__input"
                v-model="searchQuery" clearable
                ><template #append>
                    <el-icon><Search/></el-icon>
                </template>
            </el-input>
        </div>
    </el-header>
    <el-main>
        <div v-if="rightListComputed.length > 0">
            <el-text>Найдено: {{rightListComputed.length}}</el-text>
            <el-table border stripe :data="rightListComputed" highlight-current-row height="800"
                :default-sort="{prop: 'name', order: 'ascending'}"
                @row-click="handleRowClick" empty-text="<нет данных>"
            >
                <el-table-column prop="name" label="Название" sortable></el-table-column>
                <el-table-column prop="rem" label="Описание"></el-table-column>
            </el-table>
        </div>
        <div v-else-if="rightList.length == 0">
            <h1>Не удалось загрузить данные! Возможно таблица пуста или ссылка недействительна</h1>
        </div>
        <div v-else>
            <h1>По запросу ничего не найдено.</h1>
        </div>
    </el-main>
</el-container>
<rights-dialog v-if="dialogVisible"
    :item="rightItem"
    v-model:dialogVisible="dialogVisible"
    :dialogType="dialogType"
    @refresh="refresh"
/>
</template>
<script>
import RightsDialog from "@/components/RIGHTS/RightsDialog"
import { ref } from "vue";
export default{
    name: "rights-list",
    components:{
        RightsDialog,
    },
    setup(){
        const dialogVisible = ref(false);
        const dialogType = ref();
        const searchQuery = ref('');
        return {dialogVisible, dialogType, searchQuery}
    },
    props: {
        rightList: {}
    },
    methods:{
        handleRowClick(row){
            this.rightItem = Object.assign({}, row);
            console.log(this.rightItem);
            this.dialogVisible = true;
            this.dialogType = 1;

        },
        refresh(){
            this.$emit('refresh');
        }
    },
    computed:{
        rightListComputed(){
            return this.rightList.filter(right => {
                return right.name?.toLowerCase().includes(this.searchQuery?.toLowerCase())
            });
        }
    }
}
</script>
<style>
.el-header{
    height: 10%;
}
.el-row, .el-button-group{
    margin-bottom: 20px;
}
</style>