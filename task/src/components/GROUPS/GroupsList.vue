<template>
<el-container>
    <el-header>
        <div>
            <h1>Модуль групп</h1><br>
            <el-button-group>
                <el-button type="primary" @click=" item = {}; dialogType = 0; dialogVisible = true" icon="Plus">Добавить группу</el-button>
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
        <div v-if="groupListComputed.length > 0">
            <el-text>Найдено: {{groupList.length}}</el-text>
            <el-table border stripe highlight-current-row
                :data="groupListComputed" empty-text="<нет данных>"
                @row-click="handleRowClick"
                :default-sort="{prop: 'name', order: 'ascending'}"
            >
                <el-table-column prop="name" label="Название" sortable></el-table-column>
                <el-table-column prop="rem" label="Описание"></el-table-column>
            </el-table>
        </div>
        <div v-else-if="groupList.length == 0">
            <h1>Не удалось загрузить данные! Возможно таблица пуста или ссылка недействительна</h1>
        </div>
        <div v-else>
            <h1>По запросу ничего не найдено.</h1>
        </div>
    </el-main>
</el-container>
<groups-dialog v-if="dialogVisible"
    v-model:dialogVisible="dialogVisible"
    :dialogType="dialogType"
    :item="groupItem"
    @refresh="this.$emit('refresh')"
/>
</template>
<script>
import GroupsDialog from "@/components/GROUPS/GroupsDialog"
import { ref } from 'vue';
export default{
    name: "groups-list",
    components: {GroupsDialog},
    setup(){
        const dialogVisible = ref(false);
        const dialogType = ref(1);
        const groupItem = ref({});
        const searchQuery = ref('');
        return{dialogVisible, dialogType, groupItem, searchQuery}
    },
    props:{
        groupList: []
    },
    methods:{
        handleRowClick(row){
            this.groupItem = Object.assign({}, row)
            console.log(this.groupItem)
            this.dialogType = 1;
            this.dialogVisible = true;
        }
    },
    computed:{
        groupListComputed(){
            return this.groupList.filter(group => {
                return group.name?.toLowerCase().includes(this.searchQuery?.toLowerCase())
            });
        }
    }
}
</script>