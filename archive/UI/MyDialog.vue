<template>
<div class="dialog"
    v-if="show"
    @click.stop="hideDialog"
>
    <div class="dialog__content"
        @click.stop 
    >
        <slot></slot>
    </div>
</div>
</template>
<script>
export default{
    name: 'my-dialog',
    props:{
        show:{
            type: Boolean,
            default: false
        }
    },
    methods:{
        hideDialog(){
            this.$emit('update:show', false)
        }
    }
}
</script>
<style scoped>

.dialog{
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    position: fixed;
    display: flex;
    z-index: 5;
}
.dialog__content{
    margin: auto;
    background: white;
    border-radius: 12px;
    min-height: 50px;
    max-height: 90%;
    overflow-y: auto;
    min-width: 600px;
    padding: 20px;
}
</style>
<!--<table class="table table-hover table-bordered gx-5">
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
            </table>-->