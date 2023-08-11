<template>
    <div class="container">
        <input type="text" v-for="(val, i) in dialogData" :key="i" value=val>
            
    />
    </div>
</template>
<script>
export default{
    name: "data-edit",
    props:{
        dialogData: {
            type: Object,
            required: true
        }
    }
}
</script>