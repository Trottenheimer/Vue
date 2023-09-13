<template>
    <el-container style="flex-direction:column" v-if="auth.status">
        <h1>Профиль врача {{user.id}}</h1>
        <div class="profile-block">
            <div class="profile">
                <div class="profile-main">
                    <div class="main-image">
                        <el-upload
                            class="avatar-uploader"
                            action="https://..."
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="imageUrl" src="../assets/logo.png" class="avatar" />
                            <el-icon v-else><User/></el-icon>
                        </el-upload>
                    </div>
                    <div class="main-info">
                        <el-input v-model="userData.surname"/>
                        <el-input v-model="userData.name"/>
                        <el-input v-model="userData.patron"/>
                    </div>
                </div>
                <div class="profile-second">
                    <el-row style="margin-top: 40px;">
                        <el-col :span="12">
                            <el-date-picker placeholder="Укажите дату рождения" style="width:240px"
                            v-model="userData.birth" format="YYYY/MM/DD"
                            type="date" value-format="YYYY-MM-DD"
                            min="1900-01-01" max="2022-01-01"
                            />
                        </el-col>
                        <el-col :span="12">
                            <el-select-v2 placeholder="Укажите пол" style="width: 240px"
                                v-model="userData.sex"
                                :options="options.sex"
                            />
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-select-v2 placeholder="Укажите должность" style="width: 240px"
                                v-model="userData.post_id"
                                :options="options.post"
                                filterable
                            />
                        </el-col>
                        <el-col :span="12">
                            <el-select-v2 placeholder="Укажите отделение" style="width: 240px"
                                v-model="userData.dept_id"
                                :options="options.dept"
                                filterable
                            />
                        </el-col>
                    </el-row>
                </div>
                <div class="profile-footer">
                    <el-button type="primary">Сохранить изменения</el-button>
                    <el-button type="primary">Дополнительные настройки</el-button>
                </div>
            </div>
        </div>
    </el-container>
    <non-auth v-else/>
</template>
<script>
import { ElLoading } from 'element-plus';

export default{
    name: "profile-page",
    data(){
        return{
            auth: this.$store.state.auth,
            user: this.$store.state.user,
            userData: {},
            postList: [],
            deptList: [],
            options: {
                sex:[{value: 1, label: 'Мужской'}, {value: 2, label: 'Женский'}],
                post: [],
                dept: []
            }
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
        }
    },
    mounted(){
        console.log(this.user);
        this.fetchData();
    }
}
</script>
<style scoped>
h1{
    font-size: 32px;
}
.profile-block{
    display: flex;
    margin: 2% auto;
    width: 80%;
    max-height: 80vh;
    background: aliceblue;
    border-radius: 15px;
}
.profile, .main-info{
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 10px;
    background-color: white;
    justify-content: space-between;
}
.profile{
    padding: 20px;
}
.profile-main{
    display: flex;
    flex-direction: row;;
}
.profile-second{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 60px 0 60px;
}
.profile-footer{
    display: flex;
    justify-content: flex-end;
}
.profile span, .main-info span{
    margin-top: 10px;
    padding: 10px;
    font-size: 20px;
}
.main-image{
    border: 1px solid black;
    min-width: 20%;
    min-height: 20vh;
}
.el-col{
    display: flex;
    justify-content: center;
    width: 100%;
}
.el-select-v2{
    width: 100%;
}
</style>