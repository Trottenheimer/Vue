<template>
  <div class="board" v-if="auth.status">
    <a href="/emp">
      <div class="plate">
          <el-icon class="plate_icon"><UserFilled/></el-icon>
          ПОЛЬЗОВАТЕЛИ
      </div>
    </a>
    <a href="/groups">
      <div class="plate">
          <el-icon class="plate_icon"><Grid/></el-icon>
          ГРУППЫ
      </div>
    </a>
    <a href="/rights">
      <div class="plate">
          <el-icon class="plate_icon"><Select/></el-icon>
          ПРАВА
      </div>
    </a>
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
.board{
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  min-width: 50%;
  max-width: 80%
}
@media only screen and (max-width: 920px) {
  .board {
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
  }
}
.plate{
  display: flex;
  flex-direction: column;
  margin: 20px;
  max-height: 280px;
  border: 4px solid black;
  border-radius: 15px;
  min-width: 180px;
  max-width: 360px;
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