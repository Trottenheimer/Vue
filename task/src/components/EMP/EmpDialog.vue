<template>
<el-dialog width="50%" draggable style="margin-top: 30px;"
    :modelValue="dialogVisible"
    @closed="closeDialog"
>
    <template #header>
        <h2>{{dialogName()}} пользователя «{{emp ? emp.surname : ''}}»</h2><br>
        <el-button-group>
            <el-button type="primary" :disabled="currentPage === 1" @click="currentPage = 1">Основные данные</el-button>
            <template v-if="dialogType == 1">
                <el-button type="primary" :disabled="currentPage === 2" @click="currentPage = 2">Группы</el-button>
                <el-button type="primary" :disabled="currentPage === 3" @click="currentPage = 3">Прямые права</el-button>
                <el-button type="primary" :disabled="currentPage === 4" @click="currentPage = 4">Все права</el-button>
            </template>
        </el-button-group>
    </template>

    <emp-dialog-main v-if="currentPage === 1" :key="componentKey"
        :dialogType="dialogType"
        :getOptions="options"
        :item="emp"
        @refresh="refresh"
        @close="closeDialog()"
    />
    <emp-dialog-groups v-if="currentPage === 2" :key="componentKey"
        :emp="emp"
        @refresh="refresh"
        @close="closeDialog()"
    />
    <emp-dialog-rights v-if="currentPage === 3" :key="componentKey"
        :emp="emp"
        @refresh="refresh"
        @close="closeDialog()"
    />
    <emp-dialog-all-rights v-if="currentPage === 4" :key="componentKey"
        :emp="emp"
        @close="closeDialog()"
    />
</el-dialog>
</template>
<script>
import EmpDialogMain from "@/components/EMP/dialog/EmpDialogMain"
import EmpDialogGroups from "@/components/EMP/dialog/EmpDialogGroups"
import EmpDialogRights from "@/components/EMP/dialog/EmpDialogRights"
import EmpDialogAllRights from "@/components/EMP/dialog/EmpDialogAllRights"
import {ref} from 'vue'

export default{
    name: "emp-dialog",
    components:{EmpDialogMain, EmpDialogGroups, EmpDialogRights, EmpDialogAllRights},
    setup(){
        const currentPage = ref(1);
        const componentKey = 0;
        const options = ref({
            sex: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
            ],
            post: [],
            dept: [],
        })
        return {currentPage, componentKey, options};
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
            this.componentKey += 1;
        },
        rerender(){
            this.componentKey += 1;
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