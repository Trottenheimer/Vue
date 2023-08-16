<template>
<select class="form-select" :v-model="selectedSort" @change="changeOption">
    <option selected value="none">Сортировка</option>
    <option class="dropdown-item"
        v-for="option in options"
            :key="option.value"
            :value="option.value"
    >
        {{option.name}}
    </option>
</select>
</template>
<script>
export default {
    name: 'my-select',
    props:{
        selectedSort:{
            type: String
        },
        options:{
            type: Array,
            default: () => []
        }
    },
    methods:{
        changeOption(event){
            this.$emit('update:selectedSort', event.target.value)
        }
    }
}
</script>
<style scoped>

</style>