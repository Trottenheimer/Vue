<template>
<div class="container" style="min-width: 100%;">
  <div class="container" id="data-action-bar" style="margin: 0 auto; align-items: center">
    <my-input v-model="searchQuery" placeholder="Поиск..."></my-input>
    <my-button @click="showDialog">Создать пост</my-button>
    <my-select v-model="selectedSort" :options="sortOptions"></my-select>
  </div>
  <div class="container" id="data-list" style="min-width: 100%;">
  <my-dialog v-model:show="dialogVisible">
    <data-edit 
      :dialogData="dialogData"
      v-model:dialogVisible="dialogVisible" 
      /><!--data отправляет данные нажатой записи в форму, visible получает эмит на закрытие диалога-->
  </my-dialog>

  <data-list
    v-if="isLoaded"
    :dataSet="dataSet"
    @showDialog="showDialog"
  />

  <div v-else>
    <div class="" style="margin: 50vh 50%; width: 500px; height: 500px">
      <div class="spinner-border d-flex justify-content-center" role="status ">
        <div class="visually-hidden">Загрузка...</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
const URL_EMP = 'http://192.168.0.102:4000/emp_list';


import axios from 'axios'
import DataList from "@/components/DataList.vue"
import DataEdit from "@/components/DataEdit.vue"

export default {
  name: 'App',
  components: {
    DataList, DataEdit,
  },
  data(){
    return {
      dataSet: [ {} ],
      isLoaded: false,
      url: URL_EMP,
      dialogVisible: false,
      dialogData: {},
      sortOptions: [
                {value: 'title', name: "по названию"},
                {value: 'body', name: "по содержимому"}
      ],
      selectedSort: '',
      searchQuery: ''
    }
  },
  methods:{
    async fetchData(){
      try {
        this.isLoaded = false;

        const response = await axios.get(this.url);
        this.dataSet = response.data;
        
        /*this.dataSet = this.dataSet.map(item => {
          const {db_user, ...dataItem} = item;
          console.log(db_user);
          return dataItem;
        })*/
        
        this.isLoaded = true;
      }
      catch (error) {
        console.log('ошибка' + error)
      }
    },
    showDialog(data){
      this.dialogVisible = true;
      this.dialogData = data;
    }
  },
  watch:{
    dialogVisible(val){
      console.log("dialog visible: " + val);
    }
  },
  computed: {
    /*filteredData(){
      return this.dataSet.map(item => {
        const {db_user, ...filteredItem} = item;
        return filteredItem;
      });
    },*/
    sortedData(){
        return [...this.posts].sort((post1, post2) => post1[this.selectedSort]?.localeCompare(post2[this.selectedSort]))
    },
    sortedAndSearchedData(){
        return this.sortedPosts.filter(post => post.title.toLowerCase().includes(this.searchQuery.toLocaleLowerCase()));
    }
  },
  mounted(){
    this.fetchData();
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
