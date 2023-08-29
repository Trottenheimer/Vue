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
            <el-button type="danger" @click="handleDialogDelete(); delMode = true">Удалить</el-button>
        </template>
        <el-button type="info" @click="closeDialog">Закрыть</el-button>
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
        handleDialogCreate(){
            this.$postData(this.$URL_EMP_UPSERT, '', {"p_emp_data": this.emp}).then(response => {
                if (response && response.status === 200)
                    ElNotification({title:'Добавление', message: 'Пользователь успешно добавлен!', type:'success'})
                else
                    ElNotification({title:'Добавление', message: 'Что-то пошло не так!', type:'error'})
            });
            this.refresh()
        },
        handleDialogEdit(){
            console.log(this.emp);
            this.refresh()
        },
        handleDialogDelete(){
            this.$postData(this.$URL_EMP_DELETE, '', {"p_emp_id": this.emp.id}).then(response => {
                console.log(response);
                if (response && response.status === 204)
                    ElNotification({title:'Удаление', message: 'Пользователь успешно удален!', type:'success'})
                else
                    ElNotification({title:'Удаление', message: 'Что-то пошло не так!', type:'error'})
            });
            this.$emit('close');
            this.refresh()
        },
        refresh(){
            this.$emit('refresh')
        }
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