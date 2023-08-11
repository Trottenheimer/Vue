<template>
    
<tr>
    <td
        v-for="(value, key) in data"
        :key="key"
        class="data__item"
    >
        {{ value }}
    </td>
</tr>
</template>
<script>
export default{
    name: "data-item",
    props:{
        data: {
            type: Object,
            required: true
        },
    },
    methods:{
    }
}
</script>
<style>
/*
.data__container{
    display: flex;
    width: 98vw;
}

.data__item{
    flex: 1;
    border: 1px solid black;
    padding: 0 4px;
    max-width: 100vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: medium;
}
.data__container:hover{
    background: green;
    color: white;
    cursor: pointer;
}
*/
</style>