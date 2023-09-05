<template>
<el-form :model="emp">
    <el-form-item>
        <span>Фамилия</span>
        <el-input v-model="emp.surname"></el-input>
    </el-form-item>
    <el-form-item>
        <span>Имя</span>
        <el-input v-model="emp.name"></el-input>
    </el-form-item>
    <el-form-item>
        <span>Отчество</span>
        <el-input v-model="emp.patron"></el-input>
    </el-form-item>
    <el-form-item>
        <span>ИНН</span>
        <el-input v-model="emp.inn"></el-input>
    </el-form-item>
    <el-form-item>
        <span>СНИЛС</span>
        <el-input v-model="emp.snils"></el-input>
        </el-form-item>
    <el-row>
        <el-col :span="10">
            <span>Пол</span><br>
            <el-select placeholder="Укажите пол..."
                v-model="emp.sex"
            >
            <el-option
                v-for="sex in options.sex"
                :key="sex.value"
                :label="sex.name"
                :value="sex.value"
            />
            </el-select>
        </el-col>
        <el-col :span="10">
            <span>Дата рождения</span><br>
            <el-form-item>
                <el-date-picker type="date" v-model="emp.birth"
                    format="YYYY/MM/DD" placeholder="Укажите дату рождения"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="10">
            <span>Должность</span>
            <el-form-item>
                <el-select placeholder="Укажите должность..."
                    v-model="emp.post_id"
                >
                    <el-option
                        v-for="post in options.post"
                        :key="post.value"
                        :label="post.name"
                        :value="post.value"
                    />
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="10">
            <span>Отделение</span>
            <el-form-item>
                <el-select placeholder="Укажите отделение..."
                    v-model="emp.dept_id"
                >
                    <el-option
                        v-for="dept in options.dept"
                        :key="dept.value"
                        :label="dept.name"
                        :value="dept.value"
                    />
                </el-select>
            </el-form-item>
        </el-col>
    </el-row>
</el-form>
<div style="display: flex; justify-content: flex-end">
    <template v-if="dialogType === 0">
        <el-button type="primary" @click="handleDialogCreate()">Создать</el-button>
    </template>
    <template v-else-if="dialogType === 1">
        <el-button type="primary" @click="handleDialogEdit()">Сохранить</el-button>
        <el-button type="danger" @click="handleDialogDelete()">Удалить</el-button>
    </template>
    <el-button type="info" @click="this.$emit('close')">Закрыть</el-button>
</div>
</template>
<script>
import { ElNotification } from 'element-plus'
export default{
    name: "emp-dialog-main",
    data(){
        return{
            emp: this.item,
            options: this.getOptions,
        }
    },
    props:{
        item: {},
        dialogType: Boolean,
        getOptions: {},
    },
    methods:{
        handleDialogCreate(){//ДОБАВЛЕНИЕ
            this.$postData(this.$URL_EMP_UPSERT, '', {"p_emp_data": this.emp}).then(response => {
                if (response && response.status === 200)
                    ElNotification({title:'Редактирование пользователей', message: 'Пользователь успешно добавлен!', type:'success'})
                else
                    ElNotification({title:'Редактирование пользователей', message: 'Что-то пошло не так!', type:'error'})
                this.$emit('refresh');
            });
        },
        handleDialogEdit(){//РЕДАКТИРОВАНИЕ
            const request = Object.assign({}, this.emp);
            delete request.dept;
            delete request.post;
            delete request.dept;
            delete request.people_id;
            this.$postData(this.$URL_EMP_UPSERT, '', {p_emp_data: request}).then( response => {
                this.$emit('refresh');
                if (response && response.status === 200)
                    ElNotification({title:'Редактирование пользователей', message: 'Пользователь успешно обновлен!', type:'success'});
                else
                    ElNotification({title:'Редактирование пользователей', message: 'Что-то пошло не так!', type:'error'});
            });
        },
        handleDialogDelete(){//УДАЛЕНИЕ
            if (this.emp.id === 1) {//Надеюсь, это сработает и админ не удалится
                ElNotification({title:'Редактирование пользователей', message: 'Удаление администратора запрещено!', type:'warning'});
            }
            else
                this.$postData(this.$URL_EMP_DELETE, '', {"p_emp_id": this.emp.id}).then(response => {
                    this.$emit('refresh');
                    if (response && response.status === 204)
                        ElNotification({title:'Редактирование пользователей', message: 'Пользователь успешно удален!', type:'success'});
                    else
                        ElNotification({title:'Редактирование пользователей', message: 'Что-то пошло не так!', type:'error'});
                    this.$emit('close');
                });
        },
    }
}
</script>
<style scoped>
.el-row{
    justify-content: space-between;
}
.el-select{
    width: 100%;
}
.el-date-picker{
    width: 100%;
}
*{
    font-weight: bold;
    font-size: 18px;
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>