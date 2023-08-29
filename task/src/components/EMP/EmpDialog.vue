<template>
<el-dialog width="80%" draggable style="margin-top: 30px;"
    :modelValue="dialogVisible"
    @closed="closeDialog"
>
    <template #header>
        <h2>{{dialogName()}} {{emp ? emp.surname : 'пользователя'}}</h2><br>
        <el-button-group>
            <el-button type="primary" :disabled="currentPage === 1" @click="currentPage = 1">Основные данные</el-button>
            <el-button type="primary" :disabled="currentPage === 2" @click="currentPage = 2">Группы</el-button>
            <el-button type="primary" :disabled="currentPage === 3" @click="currentPage = 3">Пользователи</el-button>
        </el-button-group>
    </template>

    <emp-dialog-main
        :dialogType="dialogType"
        :getOptions="options"
        :item="emp"
        @refresh="refresh()"
        @close="closeDialog()"
    />
</el-dialog>
</template>
<script>
import EmpDialogMain from "@/components/EMP/EmpDialogMain.vue"
import {ref} from 'vue'

export default{
    name: "emp-dialog",
    components:{EmpDialogMain},
    setup(){
        const currentPage = ref(1);
        const options = ref({
            sex: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
            ],
            post: [],
            dept: [],
        })
        return {currentPage, options};
    },
    data(){
        return{
            emp: (this.dialogType? this.item : {})
        }
    },
    props:{
        dialogVisible: Boolean,
        dialogType: Number,
        item: {},
        postList: [],
        deptList: [],
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
    },
    mounted(){
        this.options.post = this.postList.map(obj =>{
            return {value: obj.id, name: obj.name};
        })
        this.options.dept = this.deptList.map(obj =>{
            return {value: obj.id, name: obj.name};
        })
    }
}
</script>