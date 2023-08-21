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
                            <template v-if="key === 'emp_id' || key === 'group_id' || key === 'id'"></template>
                            <template v-else-if="key === 'name'">Название</template>
                            <template v-else-if="key === 'rem'">Описание</template>
                            <template v-else-if="key === 'checked'">Входит в:</template>
                            <template v-else>{{ key }}</template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <emp-data-item v-for="item in data"
                        :data="item"
                        :key="item.id"
                    >
                    </emp-data-item>
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
    <span class="text-secondary"
        v-else
        
        >
        <h1>Данные отсутствуют</h1>
    </span>
</template>
<script>

export default{
    name: 'form-page',
    props:{
        isLoaded: Boolean,
        data: Object //хз почему, работает)
    },
}
</script>
<style>
th:empty{
    display: none;
}
</style>