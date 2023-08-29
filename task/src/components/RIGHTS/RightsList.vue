<template>
<el-container>
    <el-header>
        <div>
            <h1>Страница прав</h1>
            <el-button type="primary" @click="rightItem = {}; dialogType = 0; dialogVisible = true">Создать право</el-button>
        </div>
    </el-header>
    <el-main>
        <div v-if="rightList.length > 0">
            <el-text>Найдено: {{rightList.length}}</el-text>
            <el-table border stripe :data="rightList" highlight-current-row height="800"
                :default-sort="{prop: 'name', order: 'ascending'}"
                @row-click="handleRowClick"
            >
                <el-table-column prop="name" label="Название" sortable></el-table-column>
                <el-table-column prop="rem" label="Описание"></el-table-column>
            </el-table>
        </div>
        <div v-else>
            <h1 type="danger">Тут пусто</h1>
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
        const dialogType = ref()
        return {dialogVisible, dialogType}
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
            this.$emit('refresh')
        }
    }
}
</script>
<style></style>