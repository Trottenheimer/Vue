<template>
    <div class="row-align-items-start" v-if="data.length > 0">
        <div v-if="isLoaded">
            <table class="table table-hover table-bordered gx-5">
                <thead>
                    <tr>
                        <th scope="col"
                            v-for="(value, key) in data[0]"
                            :key="key"
                            :id="key"
                            >
                            <template v-if="
                                key !== 'emp_id' && key !== 'group_id' && key !== 'id'
                                && key !== 'right_id' && key !== 'grp'&& key !== 'allow'
                                && key !== 'type'
                            ">
                                <span v-if="key === 'name'" @click="this.$emit('update:select', key)">Название</span>
                                <span v-else-if="key === 'rem'" @click="this.$emit('update:select', key)">Описание</span>
                                <span v-else-if="key === 'checked'" @click="this.$emit('update:select', key)">Состояние</span>
                                <span v-else @click="this.$emit('update:select', key)">{{ key }}</span>
                                <!--<div v-show="select==='checked'">тут</div>-->
                            </template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(value, key) in data" :key="key" @input="changeInput"
                    >
                        <td>{{ value.name }}</td>
                        <td>{{value.rem || '<нет данных>'}}</td>
                        <template v-if="value.checked !== undefined">
                            <td>
                                <input type="checkbox" class="form-check-input"
                                    v-model="value.checked" @change="changeInput">
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <div class="" style="margin: 50vh 50%; width: 500px; height: 500px">
              <div class="spinner-border d-flex justify-content-center" role="status ">
                <div class="visually-hidden">Загрузка...</div>
              </div>
            </div>
          </div>
    </div>
    <span class="text-secondary" v-else><h1>Данные отсутствуют</h1></span>
</template>
<script>

export default{
    name: 'form-page',
    props:{
        isLoaded: Boolean,
        data: Object, //хз почему, работает)
        select: String
    },
    methods:{
        changeInput(){
            this.$emit('update:data', this.data)
        }
    },
}
</script>
<style>
th:empty{
    display: none;
}
span:hover{
    cursor: pointer;
}
</style>