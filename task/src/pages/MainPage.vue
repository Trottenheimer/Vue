<template>
  <div v-if="auth.status">
    <el-container style="width: 100%;">
      <el-row class="row">
        <el-col :span="7">
          <a href="/emp">
            <div class="plate">
                <el-icon class="plate_icon"><UserFilled/></el-icon>
                ПОЛЬЗОВАТЕЛИ
            </div>
          </a>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="7">
          <a href="/groups">
            <div class="plate">
                <el-icon class="plate_icon"><Grid/></el-icon>
                ГРУППЫ
            </div>
          </a>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="7">
          <a href="/rights">
            <div class="plate">
                <el-icon class="plate_icon"><Select/></el-icon>
                ПРАВА
            </div>
          </a>
        </el-col>
      </el-row>
    </el-container>
  </div>
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
  max-height: 280px;
  border: 4px solid black;
  border-radius: 15px;
  max-width: 100%;
  font-size: 20px;
  align-items: center;
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
.plate_icon{
  font-size: 50px;
  transform: scale(5);
  margin: 100px;
}
</style>