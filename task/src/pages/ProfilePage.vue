<template>
    <el-container style="flex-direction:column" v-if="auth.status">
        <h1>Профиль врача {{user.id}}</h1>
        <div class="profile-block">
            <div class="profile">
                <div class="profile-main">
                    <div class="main-image">
                        <el-upload
                            class="avatar-uploader"
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon"><User/></el-icon>
                        </el-upload>
                    </div>
                    <div class="main-info">
                        <span>{{userData.surname}}</span>
                        <span>{{userData.name}}</span>
                        <span>{{userData.patron}}</span>
                        <span>{{userData.birth}}</span>
                        <span>{{userData.sex === 1 ? 'Мужской' : userData.sex === 2 ? 'Женский' : 'Не указан'}}</span>
                    </div>
                </div>
                <span>{{userData.post}}</span>
                <span>{{userData.dept}}</span>
            </div>
        </div>
    </el-container>
    <non-auth v-else/>
</template>
<script>
export default{
    name: "profile-page",
    data(){
        return{
            auth: this.$store.state.auth,
            user: this.$store.state.user,
            userData: {}
        }
    },
    methods:{
        fetchData(){
            this.loading
            this.$getData(this.$URL_EMP_LIST, '?id=eq.'+ this.user.id).then(data => {
                this.userData = data[0];
                const promises = [//СБОР ПРОМИСА ДЛЯ ОТСЛЕЖИВАНИЯ ВСЕХ АСИНХ ФУНКЦИЙ
                    this.$getData(this.$URL_POST_LIST, '?id=eq.' + this.userData.post_id).then(data => {
                        this.userData.post = data;
                    }),
                    this.$getData(this.$URL_DEPT_LIST, '?id=eq.' + this.userData.dept_id).then(data => {
                        this.userData.dept = data;
                    })
                ]
                Promise.all(promises).then(() => {
                    this.loading.close();
                    console.log('All promises completed successfully.');
                    this.empList.forEach(emp => {
                        this.postList.forEach(post => {
                            if (emp.post_id === post.id) emp.post = post.name
                        })
                        this.deptList.forEach(dept => {
                            if (emp.dept_id === dept.id) emp.dept = dept.name
                        })
                    });
                }).catch((e) => {
                    console.log('Error occured during promise processing:', e);
                })
            });
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
    margin: 20px;
    background-color: white;
}
.profile-main{
    display: flex;
    flex-direction: row;
}
.profile span, .main-info span{
    margin-top: 10px;
    padding: 10px;
    font-size: 20px;
}
.main-image{
    border: 1px solid black;
    min-width: 20%;
}
.el-icon{
    height: 100px;
    width: 100px;
}
</style>