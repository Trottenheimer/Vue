<template>
<el-dialog v-model="dialogVisible" v-if="dialogVisible" @closed="dialogClose"
    @keydown="handleKeyPress" draggable
    >
    <template #header>
        <h1>Выберите профиль</h1>
        <h4>Можно выбрать стрелками</h4>
    </template>
        <el-scrollbar max-height="400px" class="profile" @mouseover="currentProfile = -1">
            <div v-for="(profile, index) in profileList" :key="index"
                @click="setProfile(profile.emp_id)" @mouseover="currentProfile = index"
            >
                <div class="profile__body" :style="{background: currentProfile == index ? 'aliceblue' : ''}">
                    <div class="profile__info">
                        <span>Должность: {{profile.post}}</span><br>
                        <span>Отделение: {{profile.dept}}</span>
                    </div>
                    <div>
                        <div class="profile__index">#{{index+1}}</div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <template #footer>
        </template>
</el-dialog>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useCookie } from 'vue-cookie-next'
import { ref } from 'vue';
export default {
    name: "select-profile",
    setup (props, { emit }) {
        const {setCookie} = useCookie();
        const store = useStore();
        const router = useRouter();
        const dialogVisible = ref(true);
        const currentProfile = ref(-1);
        const expirationTime = 60*60

        //функции
        const setProfile = async (id) => {
            setCookie('emp_id', id, {expire: expirationTime.value});
            store.dispatch('setAuthStatus', true);
            store.dispatch('setUserData', {id: id});
            router.push('/');
        };
        const dialogClose = () => {
            dialogVisible.value = false
            emit('update:modelValue', false)
            emit('removeToken');
        };
        const handleKeyPress = (event) => {
            if (event.key === 'ArrowDown'){
                currentProfile.value === props.profileList.length-1 ? true : currentProfile.value++;
            }
            else if (event.key === 'ArrowUp'){
                currentProfile.value === 0 ? true : currentProfile.value--;
            }
            else if (event.key === 'Enter'){
                if (currentProfile.value !== -1)
                    setProfile(props.profileList[currentProfile.value].emp_id);
            }
        }
        return {
            dialogVisible, currentProfile,
            setProfile, dialogClose, handleKeyPress,
        }
    },
    props:{
        profileList: [],
    }
}
</script>
<style scoped>
.profile__body{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px;
    padding: 10px;
    max-width: 100%;
    border: 1px solid gray;
    border-radius: 4px;
    background: white;
    transition: 0.1s linear;
}
.profile__body:hover{
    cursor: pointer;
    background: aliceblue;
    transition: 0.1s linear;
}
.profile__info{
    display: flex;
    flex-direction: column;
}
.profile__index{
}
</style>