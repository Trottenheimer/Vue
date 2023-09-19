<template>
  <!DOCTYPE html>
  <el-container>
    <el-header>
      <div class="nav-bar" v-if="auth.status">
        <div class="nav-items">
          <router-link to="/" class="nav__item" :class="{'nav__item__active' : currentPath === '/'}"
            >
            <el-icon><HomeFilled/></el-icon>
            <span>Главная</span>
          </router-link>
          <router-link to="/emp" class="nav__item" :class="{'nav__item__active' : currentPath === '/emp'}"
            >
            <el-icon><UserFilled/></el-icon>
            <span>Пользователи</span>
          </router-link>
          <router-link to="/groups" class="nav__item" :class="{'nav__item__active' : currentPath === '/groups'}"
            >
            <el-icon><Grid /></el-icon>
            <span>Группы</span>
          </router-link>
          <router-link to="/rights" class="nav__item" :class="{'nav__item__active' : currentPath === '/rights'}"
            >
            <el-icon><Select /></el-icon>
            <span>Права</span>
          </router-link>
        </div>
        <div class="nav-menu">
            <el-link v-if="!auth.status" href="/auth" :underline="false" class="menu-link">
              <span>Войти</span>
            </el-link>
            <el-dropdown v-else>
              <span class="menu-link">
                <el-icon color="black" size="18" style="border: 1px solid black; border-radius: 2px;"><More/></el-icon>
                <span>Меню</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/profile')">Профиль</el-dropdown-item>
                  <el-dropdown-item @click="testSomething">тест</el-dropdown-item>
                  <el-dropdown-item divided @click="logOut">Выйти</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';
import { ElNotification } from 'element-plus';

export default {
  name: 'App',
  data(){
    return{
      auth: this.$store.state.auth,
      logOutStatus: false,
    }
  },
  watch:{
    logOutStatus(value){
      if(value){
        ElNotification({title: 'Система', message: 'Время сессии истекло. Пожалуйста, перезайдите', type: 'warning', duration: 0});
        setTimeout(() => {
          this.logOut();
          this.logOutStatus = false;
        }, 300);
      }
    },
    error(message){
      if (message !== null) window.location.reload();
    }
  },
  methods:{
    checkAuth(){
      let status = false;
      let token = this.$cookies.get('token');
      if(!token)
        console.log('Non-authed.');
      token ? status = true : this.logOut();
      this.$store.dispatch('setAuthStatus', status);
      if (status)
        this.$store.dispatch('setUserData', {id: this.$getCookie('emp_id')});
    },
    async logOut(){
      this.$store.dispatch('setAuthStatus', false);
      this.$store.dispatch('setUserData', {});
      this.$cookies.remove('token');
      this.$cookies.remove('emp_id');
      this.$router.push('/auth');
    },
    testSomething(){
      console.log(this.$cookie.getCookie('token'));
    }
  },
  computed:{
    currentPath(){
      return this.$route.path;
    }
  },
  mounted(){
    this.checkAuth();

    //Интерсепт ошибки 401, если токен просрочится
    axios.interceptors.response.use( response => response,
      error => {
        if (error.response.status === 401) {
          console.error('Ошибка авторизации(401):', error.response.data);
          this.logOutStatus = true;
        }
        return Promise.reject(error);
      }
    );
  }
}
</script>
<style>
*{
  font-weight: bold;
  font-size: 16px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
</style>
<style scoped>
.el-header{
  padding: 0;
}
.nav-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: aliceblue;
  padding: 0 0px 0 20px;
}
.nav-menu{
  justify-content: flex-end;
}
.nav-items{
  display: flex;
}
.el-menu span{
  font-size: 20px;
  font-weight: bold;
}
.el-dropdown{
  border-left: 1px solid gray;
  margin: 0px 10px;
  transition: 0.1s linear;
}
.el-dropdown:hover{
  border: 1px solid #409EFF;
  background: #409EFF;
  color: white;
  transition: 0.1s linear;
}
.el-dropdown span{
  padding: 10px 10px;
  font-size: 18px;
  align-items: center;
}
.menu-link{
  display: flex;
  flex-direction: row;
  border-left: 1px solid gray;
  transition: 0.1s linear;
  text-align: center;
}
.menu-link:hover{
  border-color: #409EFF;
  transition: 0.1s linear;
}
.nav__item{
  display: flex;
  padding: 20px;
  text-decoration: none;
  color: black;
  align-items: center;
  border-left: 1px solid gray;
}
.nav__item:hover{
  background: #409EFF;
}
.nav__item__active{/*active navbar item*/
  background: #409EFF;
  color: white;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>