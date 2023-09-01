<template>
<el-dialog width="50%" draggable style="margin-top: 30px;"
    :modelValue="dialogVisible"
    @closed="closeDialog"
>
    <template #header>
        <h2>{{dialogName()}} группы «{{group ? group.name : ''}}»</h2><br>
        <el-button-group>
            <el-button type="primary" :disabled="currentPage === 1" @click="currentPage = 1">Основные данные</el-button>
            <template v-if="dialogType == 1">
                <el-button type="primary" :disabled="currentPage === 2" @click="currentPage = 2">Права</el-button>
                <el-button type="primary" :disabled="currentPage === 3" @click="currentPage = 3">Пользователи</el-button>
            </template>
        </el-button-group>
    </template>

    <groups-dialog-main v-if="currentPage === 1" :key="currentKey"
        :dialogType="dialogType"
        :item="group"
        @refresh="refresh"
        @close="closeDialog()"
    />
    <groups-dialog-rights v-if="currentPage === 2" :key="currentKey"
        :group="group"
        @refresh="refresh"
        @close="closeDialog()"
    />
    <groups-dialog-emps v-if="currentPage === 3" :key="currentKey"
        :group="group"
        @refresh="refresh"
        @close="closeDialog()"
    />
</el-dialog>
</template>

<script>
import GroupsDialogMain from "@/components/GROUPS/dialog/GroupsDialogMain"
import GroupsDialogRights from "@/components/GROUPS/dialog/GroupsDialogRights"
import GroupsDialogEmps from "@/components/GROUPS/dialog/GroupsDialogEmps"
import { ref } from 'vue'
export default{
    name: "groups-dialog",
    components:{GroupsDialogMain, GroupsDialogRights, GroupsDialogEmps},
    setup(){
        const currentPage = ref(1);
        const currentKey = ref(0);
        return {currentPage, currentKey}
    },
    data(){
        return{
            group: (this.dialogType? this.item : {})
        }
    },
    props:{
        dialogVisible: Boolean,
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
            setTimeout(() => {//Задержка чтобы не терялся контент
                this.currentKey += 1;
                this.$emit('refresh');
            }, 500);
        }
    }
}
</script>