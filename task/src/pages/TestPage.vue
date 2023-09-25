<template>
    <div class="layout">
        <div class="window">
            <div class="player"
                :style="{position: 'relative',top: currentPos.y + 'px', right: currentPos.x + 'px'}"
                >
                <div class="player__body">
                    <span class="player__name">Pl</span>
                </div>
            </div>
            <div class="test__box"></div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';

export default{
    name: "test-page",
    setup(){
        const currentPos = ref({x: 0, y: 0});
        const speed = 20;
        const playerSize = 40;
        const wallAmount = 40;
        const mapSize = {x: 1280-playerSize, y: 720-playerSize}
        const handleKeyPress = (event) => {
            event.preventDefault()
            switch (event.key) {
                case 'ArrowRight':
                    if(currentPos.value.x + mapSize.x >= speed)
                        currentPos.value.x -= speed;
                    break
                case 'ArrowLeft':
                    if(currentPos.value.x * -1 >= speed)
                        currentPos.value.x += speed;
                    break
                case 'ArrowUp':
                    if(currentPos.value.y >= speed)
                        currentPos.value.y -= speed;
                    break
                case 'ArrowDown':
                    if(mapSize.y - currentPos.value.y >= speed)
                        currentPos.value.y += speed;
                    break
                case 'Enter':
                    console.log('enter');
            }
            console.log(currentPos.value);
        };
        const generateMap = () => {
            console.log(mapSize.x / playerSize);
        }
        onMounted(() => {
            window.addEventListener('keydown', handleKeyPress);
            console.log(wallAmount);

            generateMap();
        })
        return{
            currentPos,
            handleKeyPress
        }
    }
}

</script>
<style scoped>
.layout{
    display: flex;
    width: 100%;
    height: 88vh;
    background: dimgray;
    justify-content: center;
}
.window{
    display: flex;
    margin: auto;
    width: 1280px;
    height: 720px;
    background: white;
}
.player{
    display: flex;
    flex-direction: column;
    width: 40px;
    height: 40px;
}
.player__body{
    display: flex;
    border: 4px solid black;
    border-radius: 100px;
    margin: 0 auto;
    width: 40px;
    height: 40px;
}
.player__name{
    position: relative;
    bottom: 20px;
    width: 100%;
    color: red;
    text-align: center;
}
</style>