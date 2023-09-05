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
        <div class="nav-bar">
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
          <div>
            <div>
              <el-link v-if="!isAuth" href="/auth" :underline="false" class="menu-link">
                <span>Войти</span>
              </el-link>
              <el-dropdown v-else>
                <span class="el-dropdown-link">
                  <el-icon><More/></el-icon>
                  Меню
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item disabled>Action 4</el-dropdown-item>
                    <el-dropdown-item divided>Action 5</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
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
      isAuth: false
    }
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
  padding: 0 40px 0 20px;
}
.nav-items{
  display: flex;
}
.el-menu span{
  font-size: 20px;
  font-weight: bold;
}
.el-link{
  padding: 20px;
  font-weight: bold;
  border-left: 1px solid gray;
  transition: 0.1s linear;
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
  border: 2px solid black;
  border-radius: 5px; 
  padding: 6px;
  transition: 0.1s linear;
}
.menu-link:hover{
  border-color: #409EFF;
  transition: 0.1s linear;
}
</style>