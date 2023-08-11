<template>
<div v-if="posts.length > 0">
    <h1>Список постов</h1>
    <transition-group name="post-list">
        <post-item
            v-for="post in posts"
            :post="post"
            :key="post.id"
            @remove="$emit('remove', post)"
        />
    </transition-group>  
</div>

<div
    v-else
    style="color: red;"
>
    <h1>Список пуст</h1>
</div>
</template>

<script>
import PostItem from "@/components/PostItem"
export default{
    components:{
        PostItem
    },
    props:{
        posts:{
            type: Object,
            required: true
        }
    }
}
</script>
<style scoped>
.post-list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .post-list-enter-active,
  .post-list-leave-active {
    transition: all 0.3s ease;
  }
  .post-list-enter-from,
  .post-list-leave-to {
    opacity: 0;
    transform: translateX(130px);
  }
  .post-list-move {
    transition: transform 0.5s ease;
  }
</style>