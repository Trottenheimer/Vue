<template>
  <el-container>
    <el-header>
      <NavBar v-if="auth.status"
        @logOut="logOut"
      />
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
import NavBar from '@/components/NAVIGATION/NavBar'

export default {
  name: 'App',
  components:{NavBar,},
  data(){
    return{
      auth: this.$store.state.auth,
      logOutStatus: false,
      drawer: false,
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
    },
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
    getWidth(){
      let width = window.innerWidth;
      console.log(width);
      return width
    },
    testSomething(){
      console.log(this.$cookie.getCookie('token'));
    }
  },
  mounted(){
    this.checkAuth();
    window.addEventListener('resize', this.getWidth);
    
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
<style lang="scss">
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>