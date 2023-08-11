<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>
<script>
export default {
    name: 'my-button'
}
</script>
<style>
/*
.btn{
    align-self: flex-end;
    padding: 10px 15px;
    background: none;
    color: green;
    border: 2px solid green;
    transition: 0.3s ease;
}
.btn:hover{
    color: white;
    background: green;
    transition: 0.3s ease;
}*/
</style>