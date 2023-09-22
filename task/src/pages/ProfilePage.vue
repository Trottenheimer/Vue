<template>
<div style="flex-direction:column" v-if="auth.status">
    <h1>Профиль врача {{user.id}}</h1>
    <div class="profile">
        <div class="profile__main">
            <div class="main__image">
                <img src="../assets/default-avatar.jpg" class="avatar" />
            </div>
            <div class="main__info">
                <el-input v-model="userData.surname"/>
                <el-input v-model="userData.name"/>
                <el-input v-model="userData.patron"/>
            </div>
        </div>
        <div class="profile__second">
            <div class="second__row">
                <el-date-picker placeholder="Укажите дату рождения" style="width:240px"
                v-model="userData.birth" format="DD/MM/YYYY"
                type="date" value-format="YYYY-MM-DD"
                min="1900-01-01" max="2022-01-01"
                />
                <el-select-v2 placeholder="Укажите пол" style="width: 240px"
                    v-model="userData.sex"
                    :options="options.sex"
                />
            </div>
            <div class="second__row">
                <el-select-v2 placeholder="Укажите должность" style="width: 240px"
                    v-model="userData.post_id"
                    :options="options.post"
                    filterable
                />
                <el-select-v2 placeholder="Укажите отделение" style="width: 240px"
                    v-model="userData.dept_id"
                    :options="options.dept"
                    filterable
                />
            </div>
        </div>
        <div class="profile__footer">
            <el-button type="primary" @click="showExtraMenu" class="footer__btn">Дополнительные настройки</el-button>
            <el-button type="primary" @click="selectProfile" class="footer__btn">Сменить профиль</el-button>
        </div>
    </div>
    <select-profile v-if="dialogVisible"
        v-model="dialogVisible"
        :profileList="profileList"
        @refresh="fetchData"
    />
    <auth-dialog-extra v-if="dialogExtraVisible"
        v-model="dialogExtraVisible"
    />
</div>
<non-auth v-else/>
</template>
<script>
import { ElLoading } from 'element-plus';
import AuthDialogExtra from '@/components/AUTH/AuthDialogExtra'

export default{
    name: "profile__page",
    components: {AuthDialogExtra},
    data(){
        return{
            dialogVisible: false,
            dialogExtraVisible: false,
            auth: this.$store.state.auth,
            user: this.$store.state.user,
            userData: {},
            postList: [],
            deptList: [],
            profileList: [],
            options: {
                sex:[{value: 1, label: 'Мужской'}, {value: 2, label: 'Женский'}],
                post: [],
                dept: []
            },
        }
    },
    methods:{
        fetchData(){
            const loading = ElLoading.service({
                lock: true, text: 'Загрузка',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.options.post = []; this.options.dept = [];
            this.$getData(this.$URL_EMP_LIST, '?id=eq.'+ this.user.id).then(data => {
                this.userData = data[0];
                const promises = [//СБОР ПРОМИСА ДЛЯ ОТСЛЕЖИВАНИЯ ВСЕХ АСИНХ ФУНКЦИЙ
                    this.$getData(this.$URL_POST_LIST, '').then(data => {
                        this.postList = data;
                    }),
                    this.$getData(this.$URL_DEPT_LIST, '').then(data => {
                        this.deptList = data;
                    })
                ]
                Promise.all(promises).then(() => {
                    loading.close();
                    this.options.post = this.postList.map(post => {
                        return {value: post.id, label: post.name}
                    })
                    this.options.dept = this.deptList.map(dept => {
                        return {value: dept.id, label: dept.name}
                    })
                }).catch((e) => {
                    console.log('Error occured during promise processing:', e);
                })
            });
        },
        selectProfile(){
            this.$getData('http://pgrest.oblteh:4000/rpc/emp_get_profiles', '?p_people_id=' + this.$decodeToken().people_id).then(data => {
                this.profileList = data.filter(profile => {
                    if(Number(profile.emp_id) !== Number(this.$getCookie('emp_id'))){
                        return profile;
                    }
                });
                this.dialogVisible = true;
            });
        },
        updateProfile(){
            const request = this.userData;
            console.log(request);
        },
        showExtraMenu(){
            this.dialogExtraVisible = true;
        }
    },
    mounted(){
        this.fetchData();
    }
}
</script>
<style scoped>
h1{
    font-size: 32px;
}
.profile{
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 2% auto;
    justify-content: space-between;
    background-color: aliceblue;
    border-radius: 15px;
}
.main__info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 50%;
    margin-left: 20px;
}
.profile{
    padding: 20px;
}
.profile__main{
    display: flex;
    flex-direction: row;
    
}
.profile__second{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}
.profile__footer{
    display: flex;
    margin-top: 20px;
}
.main__image{
    border: 1px solid gray;
    border-radius: 4px;
    width:20%;
}
.avatar{
    width: 100%;
}
.second__row{
    display: flex;
    margin-top: 20px;
}
.el-select-v2{
    width: 100%;
}
@media screen and (max-width: 760px) {
    .profile__main{
        flex-direction: column;
        justify-content: center;
    }
    .profile__footer{
        justify-content: center;
        flex-direction: column;
    }
    .footer__btn{
        margin-top: 20px;
    }
    .profile{
        width: 100%;
        padding: 0px;
    }
    .main__info{
        margin: 0;
        width: 100%;
    }
}
</style>