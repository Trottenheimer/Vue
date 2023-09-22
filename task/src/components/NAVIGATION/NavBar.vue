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
        </el-drawer>
    </div>
    <div class="nav__menu">
        <el-dropdown>
            <div class="menu__link">
                <el-icon color="black" size="18" class="nav__icon menu__icon"><More/></el-icon>
                <span class="menu__text">Меню</span>
            </div>
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
    height: 100%;
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
.menu__link{
display: flex;
flex-direction: row;
border-left: 1px solid gray;
transition: 0.1s linear;
align-items: center;
padding-left: 10px;
}
.menu__link:hover{
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
.menu__icon{
    border: 2px solid gray;
    border-radius: 4px;
}
@media only screen and (max-width: 760px) {
    .nav__items{
      display: none;
    }
    .nav__items__mini{
      display: block;
      padding: 20px;
      border: 2px solid gray;
      border-radius: 6px;
    }
    .menu__text{
        display: none;
    }
    .menu__link{
        border: none;
        padding: 20px;
        border: 2px groove gray;
        border-radius: 6px;
    }
    .menu__icon{
        border: none;
    }
  }
</style>