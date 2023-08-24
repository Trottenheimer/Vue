<template>
    <div class="container" id="data-edit">
        <h2>Создать пользователя</h2>

        <div class="" style="align-items:center;"
            v-for="(value, key) in dataKeys"
                :key="key"
        >
            <div class="standart_input">
                <template v-if="key !== 'sex' && key !== 'post_id' && key !== 'dept_id' && key !== 'birth'">
                    <span v-if="key === 'surname'">Фамилия</span>
                    <span v-else-if="key === 'name'">Имя</span>
                    <span v-else-if="key === 'patron'">Отчество</span>
                    <span v-else-if="key === 'inn'">ИНН</span>
                    <span v-else-if="key === 'snils'">СНИЛС</span>
                    <el-input class="form-control" v-model="this.data[key]"></el-input>
                </template>
            </div>
        </div>
        <div class="special_input">
            <el-row>
                <el-col :span="12">
                    <span>Дата рождения</span>
                    <el-date-picker type="date" v-model="this.data.birth"
                        format="YYYY/MM/DD" placeholder="Укажите дату рождения"
                        value-format="YYYY-MM-DD"
                    />
                </el-col>
                <el-col :span="12">
                    <span>Пол</span>
                    <el-select v-model="data.sex" placeholder="Укажите пол">
                        <el-option
                            v-for="sex in options.sex"
                            :key="sex.value"
                            :label="sex.name"
                            :value="sex.value"
                        >
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <span>Должность</span>
                    <el-select v-model="data.post_id" placeholder="Укажите должность">
                        <el-option
                            v-for="post in options.post"
                            :key="post.value"
                            :label="post.name"
                            :value="post.value"
                        >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="12">
                    <span>Отделение</span>
                    <el-select v-model="data.dept_id" placeholder="Укажите отделение">
                        <el-option
                            v-for="dept in options.dept"
                            :key="dept.value"
                            :label="dept.name"
                            :value="dept.value"
                        >
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <el-row style="float: left; margin-top: 20px">
            <el-button type="primary" @click="createData">Создать</el-button>
            <el-button type="primary">Закрыть</el-button>
        </el-row>
    </div>
</template>
<script>
import axios from 'axios';

const serverURL = 'http://192.168.0.102:4000/';

export default{
    name: 'emp-data-create',
    data(){
        return{
            isFailed: Boolean,
            isSucceded: Boolean,
            data: {},
            options: {
                sex: [
                {value: 1, name: "Мужской"},
                {value: 2, name: "Женский"},
                ],
                dept: [],
                post: [],
            },
        }
    },
    props:{
        dataSet: {},
        deptDataSet: {
            type: Object,
            required: true
        },
        postDataSet: {
            type: Object,
            required: true
        },
    },
    computed:{
        dataKeys(){
            const obj = {...this.dataSet};
            delete obj.id;
            delete obj.people_id;
            delete obj.del;
            delete obj.post;
            delete obj.dept;
            return obj;
        },
      
    },
    methods:{
      async createData(){
        try {
            console.log('JSON create:', this.data);
            const response = await axios.post(serverURL+ 'rpc/emp_upsert', {"p_emp_data": this.data})
            response.status === 200 ? this.isSucceded = true : this.isFailed = true;
            console.log(response);
            this.$emit('refresh', serverURL + 'emp_list');
            console.log(this.data);
        }
        catch (error) {
            console.log(error);
        }
      }
    },
    mounted(){
        Object.keys(this.dataKeys).forEach(key =>{this.data[key] = null;});//получение ключей для динамического создания полей ввода
        this.options.dept = this.deptDataSet.map(obj =>{return {value: obj.id, name: obj.name};});
        this.options.post = this.postDataSet.map(obj =>{return {value: obj.id, name: obj.name};});
    }
}
</script>
<style scoped>
span{
    margin-top: 20px;
    margin-bottom: 4px;
}
.special_input{
    margin-top: 20px;
}
.container{
    background: aliceblue
}
</style>