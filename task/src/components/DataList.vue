<template>
    <div v-if="dataSet.length > 0">
        <h1>Список</h1>
        <!--<transition-group name="data-list">-->
        <table border="1" class="table">
            <thead>
                <tr class="data__container">
                    <th scope="col"
                        v-for="(value, key) in dataSet[0]"
                        :key="value"
                        class="data__item"
                    >
                        {{ key }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <data-item
                    v-for="data in dataSet"
                    :data="data"
                    :key="data.id"
                    :class="{'table-secondary': data.del == 1}"
                    @click="this.$emit('showDialog', data)"
                ></data-item>
            </tbody>
        </table>
        <!--</transition-group>// я делал этот кусочек 4 часа))0-->
    </div>
    <div v-else style="color: red;">
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
    data(){
        return{
        }
    },
    props:{
        dataSet:{
            type: Object,
            required: true
        }
    },
}
</script>


<style scoped>
/*
.data-list {
    display: flex;
    margin-right: 10px;
  }
.data-list-enter-active,
  .data-list-leave-active {
    transition: all 0.3s ease;
  }
.data-list-enter-from,
.data-list-leave-to {
    opacity: 0;
    transform: translateX(130px);
  }
.data-list-move {
    transition: transform 0.5s ease;
  }
  */
</style>