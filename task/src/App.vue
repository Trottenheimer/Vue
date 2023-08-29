<template>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IBIS</title>
  </head>
  <body>
    <el-header style="padding: 10px; background: aliceblue; display: none;">
      <el-icon></el-icon><h2>Тестовое приложение</h2>
    </el-header>
    <el-container>
      <el-aside width="200">
        <div style="margin: 20px;">
          <el-menu 
            default-active="2"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item index="1">
              <template #title>
                <el-link href="/">
                  <el-icon><House/></el-icon>
                  <span>Главная</span>
                </el-link>
              </template>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon :size="large">
                    <List />
                </el-icon>
                <span>Таблицы</span>
              </template>
              <el-menu-item index="2-1"><el-link :underline="false" href="/emp">
                <el-icon><User/></el-icon>Пользователи</el-link></el-menu-item>
              <el-menu-item index="2-1"><el-link :underline="false" href="/groups">
                <el-icon><Grid /></el-icon>Группы</el-link></el-menu-item>
              <el-menu-item index="2-1"><el-link :underline="false" href="/rights">
                <el-icon><Select /></el-icon>Права</el-link></el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <router-view></router-view>
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
        isCollapse: false,
      }
    }
  }
  </script>
  
  <style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-menu span{
    font-size: 20px;
    font-weight: bold;
  }
  .el-link{
    font-size: 16px;
    font-weight: bold;
  }
  </style>