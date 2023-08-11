<template>
<div class="page__bar">
    <my-button 
        v-for="page in pages.total"
        :value="page"
        :key="page"
        :class="{
            'page__item_active': page === pages.now
        }"
        @click="switchPage"
        class="page__item"
    >
        {{page}}
    </my-button>
</div>
</template>
<script>
export default {
    name: 'post-pagination',
    props: {
        pages: {
            type: Object
        }
    },
    methods:{
        switchPage(event){
            this.pageNumber = parseInt(event.target.value)
            this.$emit('change', this.pageNumber)
            console.log(event.target.value)
        }
    }
}
</script>
<style scoped>
.page__bar{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 60%;
    margin: 20px auto;
}
.page__item{
    background: rgb(228,228,228);
    color: teal;
    transition: 0.3s ease;
}
.page__item:hover{
    background: white;
    transition: 0.3s ease;
}
.page__item_active{
    background: teal;
    color: white;
}
</style>