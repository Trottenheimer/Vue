<template>
    <el-container style="flex-direction:column" v-if="auth.status">
        <h1>Профиль</h1>
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
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                    </div>
                    <div class="main-info">
                        <span>Фамилия</span>
                        <span>Имя</span>
                        <span>Отчество</span>
                        <span>Дата рождения</span>
                        <span>Пол</span>
                    </div>
                </div>
                <span>Отделение</span>
                <span>Должность</span>
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
            auth: this.$store.state.auth
        }
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
</style>