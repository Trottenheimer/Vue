<template>
    <div class="container">
        
        <div>
            <h1 @click="showAdmin = true">Карточка</h1>
            <div class="btn-group" role="group" arial-label="Switch" style="width: 100%;">
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 1}" @click="currentPage=1">Основные данные</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 2}" @click="currentPage=2">Группы</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 3}" @click="currentPage=3">Прямые права</button>
                <button type="button" class="btn btn-primary" :class="{'active': currentPage == 4}" @click="currentPage=4">Все права</button>
            </div>
        </div>
        <div v-if="currentPage == 1"><!--Отображение страницы основных данных-->
            <div class="row align-items-start"
                v-for="(val, key) in editedDialogData"
                :key="key"
                style="margin: 15px 0 0 0"
            >
                <div class="col-2" v-if="(key == 'id' || key == 'people_id')" v-show="showAdmin">
                    <strong>{{key}}:</strong>
                </div>
                <div class="col-2" v-else>
                    <strong>{{key}}:</strong>
                </div>
                

                <div class="col-10" v-if="(key == 'id' || key == 'people_id')" v-show="showAdmin">
                    <div><strong>{{val}}</strong></div>
                </div>
                <div class="col-10" v-else>
                    <my-input
                        v-model:modelValue="editedDialogData[key]"
                        style="width: 100%;"
                    />
                </div>
            </div>
        </div>
        <div v-else-if="currentPage == 2"><!--Отображение страницы группы-->
        </div>
        <div v-else-if="currentPage == 3"><!--Отображение страницы прямых прав-->
        </div>
        <div v-else-if="currentPage == 4"><!--Отображение страницы всех прав-->
        </div>
        

        <div class="row" role="group" aria-label="Primer" style="margin-top: 20px; padding: 0 5%">
            <button type="button" class="btn btn-primary col-3">Сохранить</button>
            <div class="col-6"></div>
            <button type="button" class="btn btn-secondary col-3" @click="this.$emit('update:dialogVisible', false)">Закрыть</button>
        </div>
    </div>
</template>
<script>
export default{
    name: "data-edit",
    data(){
        return{
            currentPage: 1,
            editedDialogData: {},
            showAdmin: false
        }
    },
    props:{
        dialogData: {
            type: Object,
            required: true
        }
    },
    mounted(){
        this.editedDialogData = Object.assign({}, this.dialogData);
        //Создаем нон-реактивную копию полученного объекта
    }
}
</script>