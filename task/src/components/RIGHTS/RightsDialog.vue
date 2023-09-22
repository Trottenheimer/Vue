<template>
<el-dialog width="80%" draggable style="margin-top: 60px;"
    :modelValue="dialogVisible"
    @closed="closeDialog"
    class="dialog"
>
<template #header>
    <h2>{{dialogName()}} права «{{item.name}}»</h2><br>
    <el-button-group>
        <el-button type="primary" :disabled="currentPage === 1" @click="currentPage = 1">Основные данные</el-button>
        <template v-if="dialogType !== 0">
            <el-button type="primary" :disabled="currentPage === 2" @click="currentPage = 2">Группы</el-button>
            <el-button type="primary" :disabled="currentPage === 3" @click="currentPage = 3">Пользователи</el-button>
        </template>
    </el-button-group>
</template>

<rights-dialog-main v-if="currentPage === 1"
    :key="currentKey"
    :item="item"
    :dialogType="dialogType"
    @close="closeDialog"
    @refresh="refresh"
/>
<rights-dialog-groups v-if="currentPage === 2"
    :key="currentKey"
    :right="item"
    @close="closeDialog"
    @refresh="refresh"
/>
<rights-dialog-emps v-if="currentPage === 3"
    :key="currentKey"
    :right="item"
    @close="closeDialog"
    @refresh="refresh"
/>
</el-dialog>
</template>
<script>
import RightsDialogMain from "@/components/RIGHTS/dialog/RightsDialogMain"
import RightsDialogGroups from "@/components/RIGHTS/dialog/RightsDialogGroups"
import RightsDialogEmps from "@/components/RIGHTS/dialog/RightsDialogEmps"
import { ref } from 'vue';
export default{
    name: "rights-dialog",
    components: {RightsDialogMain, RightsDialogGroups, RightsDialogEmps},
    setup(){
        const currentPage = ref(1);
        const currentKey = ref(0);
        return {currentPage, currentKey}
    },
    props:{
        item:{
            type: Object,
            required: true
        },
        dialogVisible: Boolean,
        dialogType: Number,
    },
    methods:{
        closeDialog(){
            this.$emit('update:dialogVisible', false)
        },
        dialogName(){
            return this.dialogType ? 'Редактирование' : 'Создание'
        },
        refresh(){
            this.$emit('refresh');
            this.currentKey += 1;
        },
    },
}
</script>