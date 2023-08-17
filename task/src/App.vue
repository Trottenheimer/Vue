<template>
<div class="container" style="min-width: 100%;">
  <div class="container row" style="margin: 0 auto; align-items: center;">
    <div class="input-group mb-5 mt-5">
      <my-button class="btn btn-primary" @click="showDialogCreate">Создать пользователя</my-button>
      <my-input v-model="searchQuery" class="form-control" placeholder="Поиск по фамилии..."></my-input>
      <my-select v-model:select="selectedSort" :options="sortOptions">Сортировка</my-select>
    </div>
  </div>
  <div class="container" id="data-list" style="min-width: 100%;">
    <my-dialog v-model:show="dialogEditVisible">
      <emp-data-edit 
        v-model:dialogData="dialogData"
        :deptDataSet="deptDataSet"
        :postDataSet="postDataSet"
        :dialogVisible="dialogEditVisible" 
        @refresh="fetchData"
        /><!--data отправляет данные нажатой записи в форму, visible получает эмит на закрытие диалога-->
    </my-dialog>

    <my-dialog v-model:show="dialogCreateVisible">
      <emp-data-create 
        :dialogData="dialogCreateData"
        v-model:dialogVisible="dialogCreateVisible" 
        @refresh="fetchData(URL_EMP)"
        /><!--data отправляет данные нажатой записи в форму, visible получает эмит на закрытие диалога-->
    </my-dialog>

    <emp-data-list
      v-if="isLoaded"
      :empDataSet="sortedAndSearchedData"
      @showDialog="showDialog"
    />

  <div v-else>
    <div class="" style="margin: 50vh 50%; width: 500px; height: 500px; position: fixed">
      <div class="spinner-border d-flex justify-content-center" role="status ">
        <div class="visually-hidden">Загрузка...</div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
const serverURL = 'http://192.168.0.102:4000/';
const URL_EMP = serverURL + 'emp_list';
const URL_DEPT = serverURL + 'dept_list';
const URL_POST = serverURL + 'post_list';



import axios from 'axios'

export default {
  name: 'App',
  data(){
    return {
      empDataSet: [],
      deptDataSet: [],
      postDataSet: [],
      isLoaded: false,
      dialogEditVisible: false,
      dialogCreateVisible: false,
      dialogData: {},
      dialogCreateData: {},
      selectedSort: '',
      searchQuery: '',
      sortOptions: [
        {value: "none", name: "по умолчанию"},
        {value: "surname", name: "по фамилии"},
        {value: "name", name: "по имени"},
        {value: "birth", name: "по дате рождения"},
        {value: "post", name: "по должности"},
        {value: "dept", name: "по отделениям"},
      ],
    }
  },
  methods:{
    async fetchData(url){
      try {
        this.isLoaded = false;

        const response = await axios.get(url);
        switch(url){
          case URL_EMP:{
            this.empDataSet = response.data;
            console.log('EMP TABLE READY');
            break;
          }
          case URL_DEPT:{
            this.deptDataSet = response.data;
            console.log('DEPT TABLE READY');
            break;
          }
          case URL_POST:{
            this.postDataSet = response.data;
            console.log('POST TABLE READY');
            break;
          }
        }//Определение урла и присвоение определенному массиву респонса, сбор данных с БД
      if(Object.entries(this.postDataSet).length !== 0 && Object.entries(this.postDataSet).length !== 0 && Object.entries(this.postDataSet).length !== 0){
        this.mergeEmpDataSet();//Функция мерджа используется тут, поскольку это последний запрос к серверу
      }
      else{
        console.log('waiting for other tables...');
      }
      }
      catch (error) {
        console.log('failed to load tables! ', error)
      }
    },
    refreshData(){

    },
    async mergeEmpDataSet(){
      try {
        this.empDataSet = Object.values(this.empDataSet);
        this.deptDataSet = Object.values(this.deptDataSet)
        this.postDataSet = Object.values(this.postDataSet);
        this.empDataSet.forEach(empData => {
          this.postDataSet.forEach(postData =>{
            if (postData.id === empData.post_id)
              empData.post = postData.name;
          });
          this.deptDataSet.forEach(deptData =>{
            if (deptData.id === empData.dept_id)
              empData.dept = deptData.name;
          });
          for (let val in empData){
            if (empData[val] === null) empData[val] = 'Не указано';
          }
        });
        this.isLoaded = true;
        console.log('Dataset merged.', this.empDataSet);
      }
      catch (error) {
        console.log(error);
      }
      
    },
    showDialog(data){
      this.dialogEditVisible = true;
      this.dialogData = data;
    },
    showDialogCreate(data){
      this.dialogCreateVisible = true;
      this.dialogData = data;
    }
  },
  watch:{
    dialogEditVisible(val){
      console.log("edit dialog visible: " + val);
    },
    dialogCreateVisible(val){
      console.log("create dialog visible: " + val);
    },
    empDataSet(){
      console.log('empDataSet has changed.');
    }
  },
  computed: {
    sortedData(){
        return [...this.empDataSet]?.sort((item1, item2) => item1[this.selectedSort]?.localeCompare(item2[this.selectedSort]))
    },
    sortedAndSearchedData: function(){
        return this.sortedData.filter((item) =>
          item.surname?.toLowerCase()
          .includes(this.searchQuery?.toLocaleLowerCase())
        );
    }//везде пришлось натыкать вопросительных знаков потому что вью любит ругаться на фигню
  },
  mounted(){
    this.fetchData(URL_EMP);//сбор данных о сотрудниках
    this.fetchData(URL_DEPT);//сбор данных об отделениях
    this.fetchData(URL_POST);//сбор данных о должностях
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
