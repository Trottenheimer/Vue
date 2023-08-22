<template>
    <div v-if="empDataSet.length > 0">
        <div class="container" style="min-width: 100%; margin: 20px auto"><strong>Результатов: {{empDataSet.length}}</strong>
            <table class="table table-hover table-bordered gx-5">
                <thead>
                    <tr>
                        <th scope="col"
                            v-for="(value, key) in empDataSet[0]"
                            :key="key"
                            :id="key"                         >
                            <template
                                v-if="key !== 'del' && key !== 'id'
                                    && key !== 'people_id' && key !== 'dept'
                                    && key !== 'post'
                                ">
                                <template v-if="key === 'surname'">Фамилия</template>
                                <template v-else-if="key === 'name'">Имя</template>
                                <template v-else-if="key === 'patron'">Отчество</template>
                                <template v-else-if="key === 'birth'">Дата рожения</template>
                                <template v-else-if="key === 'sex'">Пол</template>
                                <template v-else-if="key === 'post_id'">Должность</template>
                                <template v-else-if="key === 'dept_id'">Отделение</template>
                                <template v-else-if="key === 'inn'">ИНН</template>
                                <template v-else-if="key === 'snils'">СНИЛС</template>
                                <template v-else>{{ key || '–' }}</template>
                            </template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <emp-data-item
                        v-for="data in empDataSet"
                        :data="data"
                        :key="data.id"
                        :class="{'table-danger': data.del == 1}"
                        @click="this.$emit('showDialog', data)"
                    />
                </tbody>
            </table>
        </div>
    </div>

    <div v-else class="text-danger">
        <h1>Ничего не найдено!</h1>
    </div>
</template>


<script>
export default{
    name: 'emp-data-list',
    props:{
        empDataSet: {},
    },
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