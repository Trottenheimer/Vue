<template>
  <el-container v-if="auth.status">
    <el-main>
      <el-container style="width: 100%;">
        <el-row class="row">
          <el-col :span="7">
            <a href="/emp">
              <div class="plate">
                  <el-icon size="200"><UserFilled/></el-icon>
                  ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ
              </div>
            </a>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="7">
            <a href="/groups">
              <div class="plate">
                  <el-icon size="200"><Grid/></el-icon>
                  ТАБЛИЦА ГРУПП
              </div>
            </a>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="7">
            <a href="/rights">
              <div class="plate">
                  <el-icon size="200"><Select/></el-icon>
                  ТАБЛИЦА ПРАВ
              </div>
            </a>
          </el-col>
        </el-row>
      </el-container>
    </el-main>
  </el-container>
  <non-auth v-else/>
</template>
<script>
export default{
  name: 'main-page',
  data(){
    return{
      auth: this.$store.state.auth
    }
  }
}
</script>
<style scoped>
.row{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.plate{
  display: flex;
  flex-direction: column;
  height: 280px;
  border: 4px solid black;
  border-radius: 15px;
  width: 100%;
  font-size: 20px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  align-items: center;
  text-align: center;
  transition: 0.1s ease;
  background: aliceblue;
}
.plate:hover{
  background: #409EFF;
}
a{
  text-decoration: none;
  color: black;
  transition: 0.1s ease;
}
a:hover{
  color: white;
}
.el-link span{
  font-size: 24px;
}
</style>