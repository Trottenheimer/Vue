<template>
<el-dialog width="50%" draggable style="margin-top: 80px;" :title="title"
    :modelValue="dialogExtraVisible"
    @closed="closeDialog"
    >
    <el-form style="max-width: 100%"
        label-position="top"
        >
        <el-form-item label="Новый логин">
            <el-input v-model="userData.p_login" placeholder="Введите новый логин"
                type="login" @keyup.enter="validateData"/>
            <div v-if="warningMessage.login" class="warning-list">
                <div class="warning-item" v-for="msg in warningMessage.login" :key="msg">
                    <template v-if="msg">
                        <el-icon><Close/></el-icon>
                        {{msg}}
                    </template>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="Новый пароль">
            <el-input v-model="userData.p_password" placeholder="Введите новый пароль"
                type="password" @keyup.enter="validateData"/>
            <div v-if="warningMessage.password" class="warning-list">
                <span class="warning-item" v-for="msg in warningMessage.password" :key="msg">
                    <template v-if="msg">
                        <el-icon><Close/></el-icon>
                        {{msg}}
                    </template>
                </span>
            </div>
        </el-form-item>
        <el-form-item label="Повторите новый пароль">
            <el-input v-model="passwordSecond" placeholder="Введите новый пароль повторно"
                type="password" @keyup.enter="validateData"/>
        </el-form-item>
    </el-form>
    <template #footer>
        <el-button type="primary" @click="validateData">Сохранить</el-button>
    </template>
</el-dialog>
</template>

<script>
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
import { decodeToken, postData } from '@/components/globalFunctions'
import global from '@/components/globalVariables'
//import { postData } from '@/components/globalFunctions'
export default {
    name: "auth-dialog-extra",
    setup (props, {emit}) {
        console.log(decodeToken().people_id)
        const dialogExtraVisible = ref(props.modelValue);
        let userData = ref({p_login: '', p_password: ''});
        let passwordSecond = ref('');
        let warningMessage = ref({login: [], password: []});

        //ФУНКЦИИ
        const closeDialog = async () => {
            emit('update:modelValue', false);
        }

        const validateData = () => {
            warningMessage.value.login = validateLogin(userData.value.p_login);
            warningMessage.value.password = validatePassword(userData.value.p_password);
            (!warningMessage.value.login.length && !warningMessage.value.password.length)
                ? updateData()
                : ElNotification({title: 'Редактирование профиля', message: 'Некорректно введены данные', type: 'warning'});
        }

        const updateData = async () => {
            userData.value.p_people_id = decodeToken().people_id;
            userData.value.p_login = userData.value.p_login.toUpperCase()
            console.log(userData.value);
            postData(global.URL_EMP_CHANGE_LOGPASS, '', userData.value).then(response => {
                console.log(response);
                if (response && response.status === 204){
                    ElNotification({title: 'Редактирование профиля', message: 'Данные профиля успешно сохранены', type: 'success'});
                    closeDialog();
                }
                else if (response && response.status === 403)
                    ElNotification({title: 'Редактирование профиля', message: 'Введенный логин уже занят!', type: 'error'});
                else
                    ElNotification({title: 'Редактирование профиля', message: 'Что-то пошло не так!', type: 'error'});
            })
        }
        
        const validateLogin = (login) => {//Login validation
            let msg = [];
            if(login.length === 0) msg.push('Необходимо ввести логин.');
            if(!/^[a-zA-Zа-яА-Я0-9]+$/.test(login) && login.length > 0) msg.push('Разрешено вводить только буквы латиницы и цифры.');
            if(login.length < 4 || login.length > 16) msg.push('Логин должен быть длинной 4-16 символов.');
            return msg;
        };

        const validatePassword = (password) => {//Password validation
            let msg = [];
            if(password.length === 0) msg.push('Необходимо ввести пароль.');
            if(!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password) && password.length > 0) msg.push('Разрешено вводить только буквы латиницы, цифры и спец. символы (!@#$%^&*).');
            if(password.length < 1 || password.length > 16) msg.push('Пароль должен быть длинной 1-16 символов.');
            if(password !== passwordSecond.value) msg.push('Пароли должны совпадать')
            return msg;

        };
        //postData('http://pgrest.oblteh:4000/rpc/authenticate', '', {})
        return {
            dialogExtraVisible, userData, warningMessage, passwordSecond,
            closeDialog, validateData,
        }
    }
}
</script>

<style scoped>
.warning-item{
    color: red;
}

</style>