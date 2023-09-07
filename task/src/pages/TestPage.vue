<template>
<div class="screen">
    <div v-if="!player.active" style="margin: auto;">
        <el-button size="large" @click="dialogVisible = true">Начать игру</el-button>
    </div>
    <div>

    </div>
</div>


<el-dialog v-model="dialogVisible" title="Выбор">
    <template #default>
        <el-row>
            <el-col :span="8" v-for="player in playerList" :key="player.id" :style="{background: player.active ? 'gray' : 'white' }">
                <div class="player-card" @click="selectPlayer(player.id)">
                    <span>{{player.name}}</span>
                </div>
            </el-col>
        </el-row>
    </template>
    <template #footer>
    <div class="dialog-footer">
        <el-button type="primary">Готово</el-button>
    </div>
    </template>
</el-dialog>
</template>
<script>
const server = 'http://localhost:3000/players/';
const sizeX = 10
const sizeY = 10
import { ref } from 'vue';
import {getData, updateData} from '@/components/globalFunctions';
export default{
    name: "test-page",
    setup(){
        const mapSize = ref([sizeX, sizeY]);
        const currentCoords = ref([0, 0]);
        const playerList = ref({});
        const player = ref({});
        const dialogVisible = ref(false);


        //функции
        const refreshData = async() => {
            getData(server,'').then(data => {
                playerList.value = data;
            });
        };
        const selectPlayer = async (id) => {
            refreshData();
            player.value = playerList.value[id]
            console.log(playerList.value[id]);
            !player.value.active
                ? updateData(server, id, {active: true})
                : console.log('no');
        };
        return {
            mapSize, currentCoords, player, playerList, dialogVisible,
            refreshData, selectPlayer,
        }
    },
    mounted(){
        this.refreshData();
    },
    beforeUnmount(){
        updateData(server, this.player.id, {active: false})
    }
}
</script>
<style>
.screen{
    display: flex;
    flex-direction: column;
    background: black;
    width: 100%;
    height: 90vh;
}
.player-card{
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    border: 1px solid black;
    height: 200px;
}
.player-card:hover{
    background: aliceblue;
}
</style>