<template>
  <el-container>
    <el-header class="header">
      <NavBar v-if="auth.status"
        @logOut="logOut"
        @test="testSomething"
      />
    </el-header>
    <el-main style="padding: 0">
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
import { ElLoading, ElNotification } from 'element-plus';
import NavBar from '@/components/NAVIGATION/NavBar';

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
        ElNotification({title: 'Система', message: 'Время сессии истекло. Пожалуйста, перезайдите', type: 'warning'});
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
      let empId = this.$cookies.get('emp_id');
      token ? status = true : this.logOut();
      this.$store.dispatch('setAuthStatus', status);
      if (status)
        this.$store.dispatch('setUserData', {id: this.$getCookie('emp_id')});
      if(!empId)
          this.logOut()
    },
    async logOut(){
      const loading = ElLoading.service({
          lock: true, text: 'Загрузка',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$store.dispatch('setAuthStatus', false);
      this.$store.dispatch('setUserData', {});
      this.$cookies.remove('token');
      this.$cookies.remove('emp_id');
      this.$router.push('/auth');
      loading.close();
    },
    testSomething(){
      console.log('test');
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
<style lang="scss">
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