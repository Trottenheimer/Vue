<template>
    
<tr>
    <td
        v-for="(value, key) in data"
        :key="key"
        :id="key"
        >
        <template 
        v-if="key !== 'del' && key !== 'id' && key !== 'people_id'
        && key !== 'emp_id' && key !== 'dept_id' && key !== 'post_id'"
        >
            <template v-if="key === 'sex' && value === 1">Мужской</template>
            <template v-else-if="key === 'sex' && value === 2">Женский</template>
            <template v-else-if="key === 'allow'"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" :checked="value"></template>
            <template v-else-if="key === 'dept_id'">{{value}}</template>
            <template v-else>{{ value || '–' }}</template>
        </template>
    </td>
</tr>
</template>
<script>
export default{
    name: "emp-data-item",
    data(){
        return{
        }
    },
    props:{
        data: {},
    },
}
</script>
<style>
td:empty{
    visibility: hidden;
    display: none;
}
</style>