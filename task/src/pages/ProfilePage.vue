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
                min="1900-01-01" max="2023-01-01"
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
            <el-button type="primary" @click="showExtraMenu" class="profile__footer__btn">Дополнительные настройки</el-button>
            <el-button type="primary" @click="selectProfile" class="profile__footer__btn">Сменить профиль</el-button>
        </div>
    </div>
    <div class="extra">
        <div class="extra__row">
            <div class="extra__plate">
                <div class="plate__header">Группы:</div>

                <div class="plate__body">
                    <el-scrollbar class="list" height="400px">
                        <div class="list__start"></div>
                        <div class="list__item" v-for="(group) in groupList" :key="group.group_id">
                            {{group.name}}
                        </div>
                        <div class="list__end"></div>
                    </el-scrollbar>
                </div>
            </div>
            <div class="extra__plate">
                <div class="plate__header">Права:</div>

                <div class="plate__body">
                    <el-scrollbar class="list" height="400px">
                        <div class="list__start"></div>
                        <div class="list__item" v-for="(right) in rightList" :key="right.right_id">
                            {{right.name}}
                        </div>
                        <div class="list__end"></div>
                    </el-scrollbar>
                </div>
            </div>
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
            groupList: [],
            rightList: [],
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
                    }),
                    this.$getData(this.$URL_EMP_GROUPS, this.userData.id).then(data => {
                        this.groupList = data;
                    }),
                    this.$getData(this.$URL_EMP_RIGHTS, this.userData.id).then(data => {
                        this.rightList = data;
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
                    console.error('Ошибка при запросе данных профиля:', e);
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
<style scoped lang="scss">
@import "@/assets/variables.scss";
h1{
    font-size: 32px;
}
.profile{
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 2% auto;
    justify-content: space-between;
    background-color: aliceblue;
    border-radius: 10px;
    padding: 20px;

    &__main{
        display: flex;
        flex-direction: row;
    }
    &__second{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }
    &__footer{
        display: flex;
        margin-top: 20px;
    }
}
.main{
    &__info{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 50%;
        margin-left: 20px;
    }
    &__image{
        border: 1px solid gray;
        border-radius: 4px;
        width:20%;
    }
}
.avatar{
    width: 100%;
}
.second__row{
    display: flex;
    margin-top: 20px;
}
.extra{
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
    &__row{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    };
    &__plate{
        width: 49%;
        min-height: 400px;
        padding: 20px;
        border-radius: 20px;
        background: aliceblue;
        .plate__header{
            font-size: 24px;
            font-weight: bold;
        }
        .plate__body{
            .list{
                display: flex;
                flex-direction: column;
                &__item{
                    width: 100%;
                    background: white;
                    border: 1px solid black;
                    border-radius: 4px;
                    margin-top: 10px;
                    padding: 5px 5px;
                    font-size: 20px;
                    min-height: 40px;
                    text-align: center;
                    color: $main
                }
                &__end, &__start{
                    margin-top: 10px;
                    display: block;
                    height: 2px;
                    width: 100%;
                    background: black
                }
            }
        }
    };
}
.el-select-v2{
    width: 100%;
}
@media screen and (max-width: 760px) {
    .profile{
        width: 100%;
        padding: 10px;

        &__main{
            flex-direction: column;
            justify-content: center;
        }
        &__footer{
            justify-content: center;
            flex-direction: column;
            &__btn{
                margin-top: 20px;
            }
        }
    }
    .main__info{
        margin: 0;
        width: 100%;
    }
    .extra{
        &__row{
            flex-direction: column;   
        }
        &__plate{
            margin-top: 20px;
            width: 100%;
        }

    }
}
</style>