<template>
<el-header>
    <h1>Модуль групп</h1><br>
    <el-row>
        <el-col :span="3">
            <el-button type="primary" @click=" item = {}; dialogType = 0; dialogVisible = true" style="width: 100%;"
            >
                Добавить
            </el-button>
        </el-col>
        <el-col :span="9">
            <el-input placeholder="поиск по названию..."
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
    <el-table border stripe highlight-current-row
        :data="groupList"
        @row-click="handleRowClick"
    >
        <el-table-column prop="name" label="Название"></el-table-column>
        <el-table-column prop="rem" label="Описание"></el-table-column>
    </el-table>
</el-main>
<groups-dialog v-if="dialogVisible"
    v-model:dialogVisible="dialogVisible"
    :dialogType="dialogType"
    :item="groupItem"
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
        return{dialogVisible, dialogType, groupItem}
    },
    watch:{
        dialogVisible(){
            console.log(this.dialogVisible);
        }
    },
    props:{
        groupList: []
    },
    methods:{
        handleRowClick(row){
            this.groupItem = Object.assign({}, row)
            console.log(this.groupItem)
            this.dialogVisible = true;
        }
    }
}
</script>