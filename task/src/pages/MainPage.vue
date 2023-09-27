<template>
  <div class="board" v-if="auth.status">
    <router-link to="/emp">
      <div class="plate">
          <el-icon class="plate__icon"><UserFilled/></el-icon>
          ПОЛЬЗОВАТЕЛИ
      </div>
    </router-link>
    <a href="/groups">
      <div class="plate">
          <el-icon class="plate__icon"><Grid/></el-icon>
          ГРУППЫ
      </div>
    </a>
    <a href="/rights">
      <div class="plate">
          <el-icon class="plate__icon"><Select/></el-icon>
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
  max-width: 300px;
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
  max-width: 300px;
}
.el-link span{
  font-size: 24px;
}
.plate__icon{
  transform: scale(10);
  margin: 100px;
}
</style>