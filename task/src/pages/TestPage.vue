<template>
    <div class="main">
        <div class="map" style="display: flex; flex-direction:column">
            <div class="vertical" v-for="y in mapSize.y" :key="'y:' + y">
                <div class="horizontal" v-for="x in mapSize.x" :key="'x:' + x">
                    <div class="tile"
                        :style="{background: `rgb(${generateColor()})`}"
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const mapSize = ref({x: 20, y: 20});
const generateColor = () => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `${r}, ${g}, ${b}`;
}
const generateMap = () => {
    console.log('ok');
}
onMounted(() => {
    generateMap();
})
</script>

<style scoped lang="scss">
.vertical{
    display: flex;
    flex-direction: row;
}
.horizontal{
    display: flex;
    flex-direction: column;
}
.map{
    max-width: 90%;
    max-height: 90%;
    border: 2px solid black;
    margin: auto;
}
.tile{
    display: block;
    width: 20px;
    height: 20px;
}
</style>