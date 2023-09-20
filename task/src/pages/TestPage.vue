<template>
    <div class="layout" @keydown="handleKeyPress($event)">
        <div class="window">
            <div class="player" :style="{margin: `${currentPos[0]} ${currentPos[1]}`}">
                <span class="player__name">CHECK</span>
                <div class="player__body" @click="check"></div>
            </div>
            <div class="test__box"></div>
        </div>
    </div>
</template>
<script setup>
const currentPos = [0,0]
const handleKeyPress = (event) => {
    if (event.key === 'ArrowDown'){
        currentPos[0] +=4;
    }
    else if (event.key === 'ArrowUp'){
        currentPos[0] +=4;
    }
    else if (event.key === 'Enter'){
        console.log(currentPos);
    }
};
const check = () => {
    console.log('check');
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
    width: 92%;
    height: 90%;
    background: white;
}
.player{
    display: flex;
    flex-direction: column;
}
.player__body{
    display: flex;
    background: black;
    margin: 0 auto;
    width: 60px;
    height: 60px;
}
</style>