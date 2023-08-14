<template>
    <div v-if="dataSet.length > 0">
        <div class="container" style="min-width: 90%; margin: 20px auto">
        <table border="1" class="table table-hover table-bordered gx-5">
            <thead>
                <tr class="data__container">
                    <th scope="col"
                        v-for="(value, key) in dataSet[0]"
                        :key="key"
                        class="data__item"
                        :id="key"
                    >
                        <span v-if="key !== 'del'">{{ key }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <data-item
                    v-for="data in dataSet"
                    :data="data"
                    :key="data.id"
                    :class="{'table-danger': data.del == 1}"
                    @click="this.$emit('showDialog', data)"
                ></data-item>
            </tbody>
        </table>
    </div>
        <data-item></data-item>
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
        dataSet:{
            type: Object,
            required: true
        }
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