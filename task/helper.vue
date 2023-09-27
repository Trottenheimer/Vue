<template>
<div>a</div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
let a = ref(123);
watch(() => [a.value], ([newVal], [oldVal]) =>{
    console.log(`Было: ${oldVal}. Стало: ${newVal}`);
});
let paramComp = computed(() => {
    return a.value
});
</script>

<style scoped lang="scss">
</style>