<template>
<select class="form-select" :v-model="select" @change="changeOption">
    <option class="dropdown-item" selected value="none" disabled hidden><slot></slot></option>
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
        select: [Number, String],
        options:{
            type: Array,
            default: () => []
        }
    },
    methods:{
        changeOption(event){
            this.$emit('update:select', event.target.value)
            console.log(event.target.value);
        }
    }
}
</script>
<style scoped>

</style>