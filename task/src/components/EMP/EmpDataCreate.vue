<template>
    <div class="container p-4" id="data-edit">
        <h2>Создать пользователя</h2>
        <div class="" style="align-items:center;"
            v-for="(value, key) in dataKeys"
                :key="key"
            >
            <div class="row mt-2">
                <div class="col-3 mt-3">
                    <template v-if="key === 'surname'"><strong>Фамилия: </strong></template>
                    <template v-else-if="key === 'name'"><strong>Имя: </strong></template>
                    <template v-else-if="key === 'patron'"><strong>Отчество: </strong></template>
                    <template v-else-if="key === 'birth'"><strong>Дата рожения*: </strong></template>
                    <template v-else-if="key === 'sex'"><strong>Пол: </strong></template>
                    <template v-else-if="key === 'post_id'"><strong>Должность: </strong></template>
                    <template v-else-if="key === 'dept_id'"><strong>Отделение: </strong></template>
                    <template v-else-if="key === 'inn'"><strong>ИНН: </strong></template>
                    <template v-else-if="key === 'snils'"><strong>СНИЛС: </strong></template>
                    <template v-else><strong>{{ key || '–' }}</strong></template>
                </div>
                <div class="col-9 mt-3">
                    <template v-if="key !== 'sex' && key !== 'post_id' && key !== 'dept_id' && key !== 'birth'">
                        <my-input class="form-control" v-model="this.data[key]"></my-input>
                    </template>
                    <template v-else>
                        <template v-if="key === 'birth'">
                            <my-input type="date" class="form-control" v-model="this.data[key]"/>
                        </template>
                        <template v-if="key === 'sex'">
                            <my-select
                                v-model:select="data.sex"
                                :options="options.sex"
                            >
                            </my-select>
                        </template>
                        <template v-if="key === 'post_id'">
                            <my-select
                                v-model:select="data.post_id"
                                :options="options.post"
                            >
                            </my-select>
                        </template>
                        <template v-if="key === 'dept_id'">
                            <my-select
                                v-model:select="data.dept_id"
                                :options="options.dept"
                            >
                            </my-select>
                        </template>
                    </template>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-lg btn-primary col-md-auto" @click="createData">Создать</button>
            <div class="col-7"></div>
            <button class="btn btn-lg btn-secondary col-md-auto">Закрыть</button>
        </div>
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