<template>
<el-container>
    <el-form style="width: 460px"
        label-position="top"
        label-width="100px"
        :model="user"
        ref="form"
    >
        <el-form-item label="Логин">
            <el-input type="login" v-model="user.login" @keydown.enter="submitAuth" placeholder="Введите логин" clearable
            :minlength="4" :maxlength="16" show-word-limit/>
            <div v-if="warningMessage.login" class="warning-list">
                <div class="warning-item" v-for="(msg, index) in warningMessage.login" :key="index">
                    <template v-if="msg">
                        <el-icon><Close/></el-icon>
                        {{msg}}
                    </template>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="Пароль">
            <el-input type="password" v-model="user.password" @keydown.enter="submitAuth" placeholder="Введите пароль" clearable/>
            <div v-if="warningMessage.password" class="warning-list">
                <span class="warning-item" v-for="(msg, index) in warningMessage.password" :key="index">
                    <template v-if="msg">
                        <el-icon><Close/></el-icon>
                        {{msg}}
                    </template>
                </span>
            </div>
        </el-form-item>
  </el-form>
  <el-button type="primary" @click="submitAuth">Войти</el-button>
</el-container>
</template>
<script>
import { ref } from 'vue';
export default{
    name: "auth-page",
    setup(){
        //VARIABLES
        let user = ref({login: '', password: ''})
        let warningMessage = ref({login: [], password: []});


        //FUNCTIONS
        const submitAuth = () => {
            warningMessage.value.login = validateLogin(user.value.login);
            warningMessage.value.password = validatePassword(user.value.password);

            if (!warningMessage.value.login.length && !warningMessage.value.password.length)
                console.log('Login accepted');
        }
        const validateLogin = (login) => {//Login validation
            
            
            let msg = [];
            if(login.length === 0) msg.push('Необходимо ввести логин.');
            if(!/^[a-zA-Z0-9]+$/.test(login) && login.length > 0) msg.push('Разрешено вводить только буквы латиницы и цифры.');
            if( login.length < 4 || login.length > 16) msg.push('Логин должен быть длинной 4-16 символов.');
            return msg;
        };

        const validatePassword = (password) => {//Password validation
            let msg = [];
            if(password.length === 0) msg.push('Необходимо ввести пароль.');
            if(!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password) && password.length > 0) msg.push('Разрешено вводить только буквы латиницы, цифры и спец. символы (!@#$%^&*).');
            if( password.length < 8 || password.length > 16) msg.push('Пароль должен быть длинной 8-16 символов.');
            return msg;

        };
        //RETURN
        return{
            user, warningMessage,
            submitAuth,
        };
    }
}
</script>
<style scoped>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
.el-container{
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
.el-text{
    justify-content: flex-start;
    align-items: start;
    text-align: start;
}
</style>