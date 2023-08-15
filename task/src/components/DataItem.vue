<template>
    
<tr>
    <td
        v-for="(value, key) in data"
        :key="key"
        class="data__item"
        :id="key"
        >
        <template v-if="key !== 'del' && key !== 'id' && key !== 'people_id' && key !== 'emp_id'">
            
            <template v-if="key === 'sex' && value === 1">Мужской</template>
            <template v-else-if="key === 'sex' && value === 2">Женский</template>
            <template v-else-if="key === 'allow'"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" :checked="value"></template>
            <template v-else-if="key === 'dept_id'">
                {{
                    
                }}
            </template>
            <template v-else>{{ value || '–' }}</template>
        </template>
    </td>
</tr>
</template>
<script>
export default{
    name: "data-item",
    data(){
        return{
            copyDept: [{}],
            test: 2,
        }
    },
    props:{
        data: {
            type: Object,
        },
        dept: Object,
        post: {
            type: Object,
        },
    },
    methods:{
    },
    computed:{
        deptNameById(){
            return this.copyDept.filter(obj =>{
                return obj.id.includes(this.test);
            })
        }
    },
    mounted(){
        console.log('ARRAY: ', this.dept);
        //console.log(this.deptNameById());
    }
}
</script>
<style>
td:empty{
    visibility: hidden;
    display: none;
}
</style>