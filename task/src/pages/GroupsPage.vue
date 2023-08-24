<template>
    <group-data-list :groupDataSet="groupDataSet"
    ></group-data-list>
</template>

<script>
import axios from 'axios';

export default{
    name: 'groups-page',
    methods: {
        async fetchData(){
            await axios.get()
        }
    }
}
</script>

<style>
</style>