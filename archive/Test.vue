<template>
    <div class="screen">
        <div v-if="player.active" class="map">
            <table>
                <tbody v-for="Y in sizeY" :key="-Y">
                    <tr v-for="X in sizeX" :key="X">
                        <td>Hello</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else style="margin: auto;">
            <el-button size="large" @click="showMenu">Тест</el-button>
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
            <el-button type="primary" @click="dialogVisible = false">Готово</el-button>
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
            const showMenu = async() => {
                dialogVisible.value = true;
                refreshData();
            }
            const refreshData = async() => {
                getData(server, '').then(data => {
                    playerList.value = data;
                });
            };
            const selectPlayer = async (id) => {
                updateData(server, id, {active: true}).then(refreshData().then(player.value = Object.assign(playerList.value[id])));
                console.log([player.value]);
            };
            return {
                mapSize, currentCoords, player, playerList, dialogVisible,
                refreshData, selectPlayer, showMenu
            }
        },
        mounted(){
            this.refreshData();
        },
        unmounted(){
            updateData(server, this.player.id, {active: false})
        },
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
    .map{
        background: white;
    }
    </style>