<template>
<el-dialog width="50%" draggable style="margin-top: 80px;" :title="title"
    :modelValue="dialogExtraVisible"
    @closed="closeDialog"
    >
    <el-input/>
</el-dialog>
</template>

<script>
import { ref } from 'vue';
//import { postData } from '@/components/globalFunctions'
export default {
    name: "auth-dialog-extra",
    setup (props, {emit}) {
        const dialogExtraVisible = ref(props.modelValue)
        const userData = ref({login: '', password: ''})

        //ФУНКЦИИ
        const closeDialog = async () => {
            emit('update:modelValue', false)
        }
        
        //postData('http://pgrest.oblteh:4000/rpc/authenticate', '', {})
        return {
            dialogExtraVisible, userData,
            closeDialog
        }
    }
}
</script>

<style scoped>

</style>