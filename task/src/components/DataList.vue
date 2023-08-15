<template>
    <div v-if="empDataSet.length > 0">
        <div class="container" style="min-width: 90%; margin: 20px auto">
            <table class="table table-hover table-bordered gx-5">
                <thead>
                    <tr>
                        <th scope="col"
                            v-for="(value, key) in empDataSet[0]"
                            :key="key"
                            :id="key"
                            >
                            <template v-if="key !== 'del' && key !== 'id' && key !== 'people_id'">
                                <template v-if="key === 'surname'">Фамилия</template>
                                <template v-else-if="key === 'name'">Имя</template>
                                <template v-else-if="key === 'patron'">Отчество</template>
                                <template v-else-if="key === 'birth'">Дата рожения</template>
                                <template v-else-if="key === 'sex'">Пол</template>
                                <template v-else-if="key === 'post'">Должность</template>
                                <template v-else-if="key === 'dept'">Отделение</template>
                                <template v-else-if="key === 'inn'">ИНН</template>
                                <template v-else-if="key === 'snils'">СНИЛС</template>
                                <template v-else>{{ key || '–' }}</template>
                            </template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <data-item
                        v-for="data in empDataSet"
                        :data="data"
                        :dept="deptDataSet"
                        :post="postDataSet"
                        :key="data.id"
                        :class="{'table-danger': data.del == 1}"
                        @click="this.$emit('showDialog', data)"
                    ></data-item>
                </tbody>
            </table>
        </div>
    </div>

    <div v-else class="text-danger">
        <h1>Ничего не найдено!</h1>
    </div>
</template>


<script>
import DataItem from "@/components/DataItem.vue"
export default{
    components:{
        DataItem,
    },
    name: 'data-list',
    props:{
        empDataSet:{
            type: Object,
            required: true
        },
        deptDataSet:{
            type: Object,
            required: true
        },
        postDataSet:{
            type: Object,
            required: true
        },
    },
    data(){
        return{
            del: ''
        }
    },
    mounted(){
    }
}
</script>


<style scoped>
th:empty{
    visibility: hidden;
    display: none;
}
td:empty{
    visibility: hidden;
    display: none;
}
</style>