<template>
<div class="form">
    <span class="form__title">Авторизация</span>
    <el-form style="max-width: 460px"
        label-position="top"
        label-width="100px"
        :model="user"
        ref="form"
    >
        <el-form-item label="Логин">
            <el-input type="login" v-model="user.login" @keydown.enter="validateAuth" placeholder="Введите логин" clearable
            :minlength="4" :maxlength="16" show-word-limit/>
            <div v-if="warningMessage.login" class="warning-list">
                <div class="warning-item" v-for="msg in warningMessage.login" :key="msg">
                    <template v-if="msg">
                        <el-icon><Close/></el-icon>
                        {{msg}}
                    </template>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="Пароль">
            <el-input type="password" v-model="user.password" @keydown.enter="validateAuth" placeholder="Введите пароль" clearable/>
            <div v-if="warningMessage.password" class="warning-list">
                <span class="warning-item" v-for="msg in warningMessage.password" :key="msg">
                    <template v-if="msg">
                        <el-icon><Close/></el-icon>
                        {{msg}}
                    </template>
                </span>
            </div>
        </el-form-item>
  </el-form>
  <el-button type="primary" @click="validateAuth">Войти</el-button>
</div>

<select-profile v-if="dialogVisible"
    v-model="dialogVisible"
    :profileList="profileList"
    @removeToken="removeToken"
    style="width: 50%; min-width: 300px"
/>
</template>

<script>
import { ref } from 'vue';
import { useCookie } from 'vue-cookie-next'
import { ElLoading, ElNotification } from 'element-plus';
import { getData, postData, decodeToken } from '@/components/globalFunctions';
export default{
    name: "auth-page",
    setup(){
        //VARIABLES
        const { setCookie } = useCookie();

        let user = ref({login: '', password: ''})
        let warningMessage = ref({login: [], password: []});
        let dialogVisible = ref(false);
        let profileList = ref([]);
        let expirationTime = 60*60;//seconds

        //FUNCTIONS
        const validateAuth = () => {
            warningMessage.value.login = validateLogin(user.value.login);
            warningMessage.value.password = validatePassword(user.value.password);
            (!warningMessage.value.login.length && !warningMessage.value.password.length)
                ? startAuth()
                : ElNotification({title: 'Авторизация', message: 'Некорректно введены данные', type: 'warning'});
        }
        
        const startAuth = async () => {
            console.log('proceeding auth...');
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            postData('http://pgrest.oblteh:4000/rpc/authenticate', '', {
                p_login: user.value.login.toUpperCase(),
                p_pass: user.value.password
            }).then(response => {
                if (response.status === 200){
                    let token = response.data.token;
                    setCookie('token', token, {expire: expirationTime.value});
                    console.log(`Token expiration time: ${expirationTime} seconds`);
                    chooseProfile();
                }
                else if (response.status === 403)
                    warningMessage.value.password.push('Логин или пароль неверен');
                loading.close()
            })
        }

        const chooseProfile = async () => {
            getData('http://pgrest.oblteh:4000/rpc/emp_get_profiles', '?p_people_id=' + decodeToken().people_id).then(data => {
                profileList.value = data;
                dialogVisible.value = true;
            });
        }

        const removeToken = async () => {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }

        const validateLogin = (login) => {//Login validation
            let msg = [];
            if(login.length === 0) msg.push('Необходимо ввести логин.');
            if(!/^[a-zA-Zа-яА-Я0-9]+$/.test(login) && login.length > 0) msg.push('Разрешено вводить только буквы латиницы и цифры.');
            if( login.length < 2 || login.length > 16) msg.push('Логин должен быть длинной 2-16 символов.');
            return msg;
        };

        const validatePassword = (password) => {//Password validation
            let msg = [];
            if(password.length === 0) msg.push('Необходимо ввести пароль.');
            if(!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password) && password.length > 0) msg.push('Разрешено вводить только буквы латиницы, цифры и спец. символы (!@#$%^&*).');
            if( password.length < 1 || password.length > 16) msg.push('Пароль должен быть длинной 1-16 символов.');
            return msg;

        };
        //RETURN
        return{
            user, warningMessage, dialogVisible, profileList,
            validateAuth, chooseProfile, removeToken,
        };
    }
}
</script>
<style scoped lang="scss">
.form{
    display: flex;
    flex-direction: column;
    margin: 50px auto;
    padding: 40px;
    width: 40%;
    background: aliceblue;
    border-radius: px;
}
.el-form{
    margin: 0 auto;
}
.el-button{
    margin: 20px auto;
    width: 50%;
}
.warning-list{
    display: flex;
    flex-direction: column;
    
}
.warning-item{
    color: red;
}
.form__title{
    display: flex;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 20px;
}
@media only screen and (max-width: 760px) {
    .form{
        width: 100%;
    }
}
</style>