<template>
<div v-if="rights.length > 0">
    <el-table border stripe style="width: 100%;"
        :data="rights" v-loading="loading"
        highlight-current-row height="700"
    >
        <el-table-column prop="name" label="Название"></el-table-column>
        <el-table-column prop="rem" label="Описание"></el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 20px">
        <el-button type="info" @click="closeDialog">Закрыть</el-button>
    </div>
</div>
<div v-else>
    <h1>Результатов не найдено</h1>
</div>
</template>
<script>
export default{
    name: "emp-dialog-all-rights",
    data(){
        return{
            rights: []
        }
    },
    props:{emp: {}},
    methods:{
        fetchData(){
            this.$getData(this.$URL_EMP_RIGHTS, this.emp.id).then(data => {
                this.rights = data;
                console.log(this.rights);
            })
        }
    },
    mounted(){
        this.fetchData()
    }
}
</script>