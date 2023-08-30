<template>
<el-dialog width="50%" draggable style="margin-top: 30px;"
    :modelValue="dialogVisible"
    @closed="closeDialog"
>
    <template #header>
        <h2>{{dialogName()}} {{group ? group.surname : 'группы'}}</h2><br>
        <el-button-group>
            <el-button type="primary" :disabled="currentPage === 1" @click="currentPage = 1">Основные данные</el-button>
            <el-button type="primary" :disabled="currentPage === 2" @click="currentPage = 2">Права</el-button>
            <el-button type="primary" :disabled="currentPage === 3" @click="currentPage = 3">Пользователи</el-button>
        </el-button-group>
    </template>
    <div>sadasd</div>
</el-dialog>
</template>

<script>
import { ref } from 'vue'
export default{
    name: "groups-dialog",
    setup(){
        const currentPage = ref(1);
        return {currentPage}
    },
    data(){
        return{
            group: (this.dialogType? this.item : {})
        }
    },
    props:{
        dialogViisble: Boolean,
        dialogType: Number,
        item: {}
    },
    methods:{
        closeDialog(){
            this.$emit('update:dialogVisible', false)
        },
        dialogName(){
            return this.dialogType ? 'Редактирование' : 'Добавление'
        },
        refresh(){
            this.$emit('refresh')
        }
    }
}
</script>