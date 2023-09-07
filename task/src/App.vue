<template>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IBIS</title>
  </head>
  <body>
    <el-container>
      <el-header>
        <div class="nav-bar" v-if="auth.status">
          <div class="nav-items">
            <el-link href="/" :underline="false">
              <el-icon><HomeFilled/></el-icon>
              <span>Главная</span>
            </el-link>
            <el-link href="/emp" :underline="false">
              <el-icon><UserFilled/></el-icon>
              <span>Пользователи</span>
            </el-link>
            <el-link href="/groups" :underline="false">
              <el-icon><Grid /></el-icon>
              <span>Группы</span>
            </el-link>
            <el-link href="/rights" :underline="false">
              <el-icon><Select /></el-icon>
              <span>Права</span>
            </el-link>
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
                    <el-dropdown-item divided @click="logOut">Выйти</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </body>
</html>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      auth: this.$store.state.auth
    }
  },
  methods:{
    checkAuth(){
      let status = false;
      console.log('Token: ', this.$cookies.get('token'));
      this.$cookies.get('token') ? status = true : status = false;
      this.$store.dispatch('setAuthStatus', status);
    },
    logOut(){
      this.$store.dispatch('setAuthStatus', false);
      this.$cookies.remove('token');
      this.$router.push('/')
    }
  },
  mounted(){
    this.checkAuth();
  }
}
</script>
  
<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
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
.el-link span {
  font-size: 18px;
}
.el-link:hover{
  background: #409EFF;
  color: white;
  transition: 0.1s linear;
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
</style>
<style scoped>
.el-link{
  padding: 20px;
  font-weight: bold;
  border-left: 1px solid gray;
  transition: 0.1s linear;
}
</style>