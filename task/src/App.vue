<template>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task</title>
  </head>
  <body>
    <el-container>
      <el-aside>
        <div style="margin: 20px;">
          <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
            <el-radio-button :label="false">expand</el-radio-button>
            <el-radio-button :label="true">collapse</el-radio-button>
          </el-radio-group>
          <el-menu style="height: 94vh"
            default-active="2"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon :size="large">
                  <List />
                </el-icon>
                <span>Таблицы</span>
              </template>
              <el-menu-item index="1-1"><el-link :underline="false" href="/">ВРАЧИ</el-link></el-menu-item>
              <el-menu-item index="1-2"><el-link :underline="false" href="/groups">ГРУППЫ</el-link></el-menu-item>
              <el-menu-item index="1-3"><el-link :underline="false" href="/rights">ПРАВА</el-link></el-menu-item>
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
  </style>