<template>
    <el-table :data="groupDataSet">
        <el-column></el-column>
    </el-table>
</template>
<script>
export default{
    name: 'group-data-list',
    props:{
        groupDataSet: [],
    },
}
</script>
<style>
</style>