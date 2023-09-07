<template>
<el-container>
    <div class="form">
        <el-link href="/auth">
            <span>Пожалуйста, авторизируйтесь.</span>
        </el-link>
    </div>
</el-container>
</template>
<script>
export default{
    name: 'non-auth'
}
</script>
<style scoped>
.el-container{
    display: flex;
    width: 100%;
    height: 100%;
}
.form{
    margin: 20% auto;
    text-align: center;
    justify-content: center;
}
@keyframes pulsate{
    50%{color:#409EFF; 
        text-shadow:0 -1px rgba(0,0,0,.3)}
}
.el-link span {
    color: rgb(245,245,245);
    text-shadow: 0 -1px rgba(0,0,0,.1);
    font-size: 48px;
    font-weight: 600;
    text-decoration: none;
    -webkit-animation: pulsate 3.2s linear infinite;
    animation: pulsate 3.2s linear infinite;
}
</style>