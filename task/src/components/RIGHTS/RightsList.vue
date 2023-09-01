<template>
<el-container>
    <el-header>
        <div>
            <h1>Страница прав</h1>
            <el-row>
                <el-col :span="3">
                    <el-button type="primary"
                        @click="rightItem = {}; dialogType = 0; dialogVisible = true"
                        >Создать право
                    </el-button>
                </el-col>
                <el-col :span="9">
                    <el-input placeholder="поиск по названию..."
                        v-model="searchQuery" clearable
                        ><template #append>
                            <el-icon><Search/></el-icon>
                        </template>
                    </el-input>
                </el-col>
            </el-row>
        </div>
    </el-header>
    <el-main>
        <div v-if="rightList.length > 0">
            <el-text>Найдено: {{rightList.length}}</el-text>
            <el-table border stripe :data="rightListComputed" highlight-current-row height="800"
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
<style></style>