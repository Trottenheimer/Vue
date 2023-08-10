<template>
<div class="app">
    <h1>Страница с постами</h1>
    <my-input
        v-model="searchQuery"
        placeholder="Поиск..."
    >

    </my-input>
    <div class="app__btns">
        <my-button
            @click="showDialog"
        >
            Создать пост
        </my-button>
        <my-select
            v-model="selectedSort"
            :options="sortOptions"
        >
        </my-select>
    </div>
    
    <my-dialog v-model:show="dialogVisible">
        <post-form
            @create="createPost"
        />
    </my-dialog>
    <post-list
        v-if="!isPostsLoading"
        :posts="sortedAndSearchedPosts"
        @remove="removePost"
    />
    <div v-else>
        <h1>Идет загрузка</h1>
    </div>
    <post-pagination :test="totalPages"></post-pagination>
</div>
</template>

<script>
import PostForm from "@/components/PostForm"
import PostList from "@/components/PostList"
import PostPagination from "@/components/PostPagination"
import axios from 'axios'
export default {
    components: {
        PostList, PostForm, PostPagination,
    },
    data(){
        return{
            posts: [],
            dialogVisible: false,
            isPostsLoading: true,
            selectedSort: '',
            searchQuery: '',
            page: 1,
            limit: 10,
            totalPages: 0,
            sortOptions: [
                {value: 'title', name: "по названию"},
                {value: 'body', name: "по содержимому"}
            ]
        }
    },
    methods:{
        createPost(post){
            this.posts.push(post);
            this.dialogVisible = false;
        },
        removePost(post){
            this.posts = this. posts.filter(p => p.id !== post.id);
        },
        showDialog(){
            this.dialogVisible = true;
        },
        async fetchPosts(){
            try {
                this.isPostsLoading = true;
                const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
                    params: {
                        _limit: this.limit,
                        _page: this.page,
                    }
                })//Всё работает нормально, просто вскоду плохо
                this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limit)
                this.posts =response.data;
                this.isPostsLoading = false;
                
            } catch (error) {
                alert('Ошибка' + error);
            }
        },
    },
    mounted(){
            this.fetchPosts();
    },
    watch:{
        /*selectedSort(newValue){
            this.posts.sort((post1, post2) => {
                return post1[newValue]?.localeCompare(post2[newValue])
            })
        },*/
        dialogVisible(newValue){
            console.log(newValue);
        }
    },
    computed: {
        sortedPosts(){
            return [...this.posts].sort((post1, post2) => post1[this.selectedSort]?.localeCompare(post2[this.selectedSort]))
        },
        sortedAndSearchedPosts(){
            return this.sortedPosts.filter(post => post.title.toLowerCase().includes(this.searchQuery.toLocaleLowerCase()));
        }
    },
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.app{
    padding: 20px;
}
.app__btns{
    margin: 15px 0px;
    display: flex;
    justify-content: space-between;
}
</style>