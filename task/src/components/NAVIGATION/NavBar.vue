<template>
<div class="nav__bar">
    <div class="nav__items">
        <router-link to="/" class="nav__item" :class="{'nav__item__active' : currentPath === '/'}"
        >
        <el-icon><HomeFilled/></el-icon>
        <span>Главная</span>
        </router-link>
        <router-link to="/emp" class="nav__item" :class="{'nav__item__active' : currentPath === '/emp'}"
        >
        <el-icon><UserFilled/></el-icon>
        <span>Пользователи</span>
        </router-link>
        <router-link to="/groups" class="nav__item" :class="{'nav__item__active' : currentPath === '/groups'}"
        >
        <el-icon><Grid /></el-icon>
        <span>Группы</span>
        </router-link>
        <router-link to="/rights" class="nav__item" :class="{'nav__item__active' : currentPath === '/rights'}"
        >
        <el-icon><Select /></el-icon>
        <span>Права</span>
        </router-link>
    </div>
    <div class="nav__items__mini">
        <el-icon @click="drawer = true" class="nav__icon" size="large"><Expand/></el-icon>
        <el-drawer
            v-model="drawer"
            title="Навигация"
            :direction="'ltr'"
            :before-close="handleClose"
            size="60%"
            >
            <span>Hi, there!</span>
        </el-drawer>
    </div>
    <div class="nav__menu">
        <el-dropdown>
            <span class="menu-link">
            <el-icon color="black" size="18" style="border: 2px solid gray; border-radius: 2px;"><More/></el-icon>
            <span class="menu__button">Меню</span>
            </span>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/profile')">Профиль</el-dropdown-item>
                <el-dropdown-item @click="testSomething">тест</el-dropdown-item>
                <el-dropdown-item divided @click="this.$emit('logOut')">Выйти</el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</div>
</template>
<script>
export default{
    name: "nav-links",
    data(){
        return{
            drawer: false
        }
    },
  computed:{
    currentPath(){
      return this.$route.path;
    },
  },
}
</script>
<style scoped lang="scss">
.nav__bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: aliceblue;
    padding: 0 0px 0 20px;
  }
.nav__items__mini{
display: none;
}
.nav__menu{
justify-content: flex-end;
}
.nav__items{
display: flex;
}
.el-menu span{
font-size: 20px;
font-weight: bold;
}
.el-dropdown{
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
.nav__item{
display: flex;
padding: 20px;
text-decoration: none;
color: black;
align-items: center;
border-left: 1px solid gray;
}
.nav__item:hover{
background: #409EFF;
}
.nav__item__active{/*active navbar item*/
background: #409EFF;
color: white;
}
.nav__icon{
    display: flex;
    justify-content: flex-start;
    border: 2px solid gray;
    border-radius: 2px;
}
.icon{
    font-size: 40px;
}

@media only screen and (max-width: 760px) {
    .nav__items{
      display: none;
    }
    .nav__items__mini{
      display: block;
    }
    .menu__button{
        display: none;
    }
    .menu-link{
        border: none;
    }
  }
</style>