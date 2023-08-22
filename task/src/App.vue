<template>
<div class="container" style="min-width: 100%;">
  <div class="container row" style="margin: 0 auto; align-items: center;">
    <div class="input-group mb-5 mt-5">
      <my-button class="btn btn-primary" style=""
        @click="showDialogCreate">Создать пользователя</my-button>
      <my-input class="form-control" placeholder="Поиск по фамилии..."
        v-model="searchQuery" ></my-input>
      <my-select-string class="form-control"
        v-model:select="selectedSort" :options="sortOptions">Сортировка</my-select-string>
    </div>
  </div>
  <div class="container" style="min-width: 100%;">


    <!--ОКНО СОЗДАНИЯ-->
    <my-dialog v-model:show="dialogCreateVisible">
      <emp-data-create 
        v-model:show="dialogCreateVisible"
        :dataSet="dataSet[0]"
        :deptDataSet="deptDataSet"
        :postDataSet="postDataSet"
        @refresh="fetchData"
        />
    </my-dialog>


    <!--ОКНО РЕДАКТИРОВАНИЯ-->
    <my-dialog v-model:show="dialogEditVisible">
      <emp-data-edit
        v-model:show="dialogEditVisible"
        v-model:dialogData="dialogData"
        :deptDataSet="deptDataSet"
        :postDataSet="postDataSet"
        :groupDataSet="groupDataSet"
        :rightDataSet="rightDataSet"
        @refresh="fetchData"
        />
    </my-dialog>
    

    <!--ТАБЛИЦА EMP-->
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
const URL_GROUPS = serverURL + 'group_list';
const URL_RIGHTS = serverURL + 'right_list';



import axios from 'axios'

export default {
  name: 'App',
  data(){
    return {
      dataSet: [],
      empDataSet: [],
      deptDataSet: [],
      postDataSet: [],
      groupDataSet: [],
      rightDataSet: [],
      isLoaded: false,
      dialogEditVisible: false,
      dialogCreateVisible: false,
      dialogData: {},
      dialogCreateData: {},
      selectedSort: 'surname',
      searchQuery: '',
      sortOptions: [
        {value: "none", name: "по умолчанию"},
        {value: "surname", name: "по фамилии"},
        {value: "name", name: "по имени"},
        {value: "birth", name: "по дате рождения"},
        {value: "sex", name: "по полу"},
        {value: "post", name: "по должности"},
        {value: "dept", name: "по отделениям"},
      ],
    }
  },
  watch:{
    dialogEditVisible(){
      console.log('Edit window on', this.dialogEditVisible);
    }
  },
  methods:{
    async fetchData(url){
      try {
        this.dataSet = [];
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
          case URL_GROUPS:{
            this.groupDataSet = response.data;
            for (let index = 0; index < this.groupDataSet.length; index++) {
              this.groupDataSet[index].checked = false
            }
            console.log('GROUPS TABLE READY');
            break;
          }
          case URL_RIGHTS:{
            this.rightDataSet = response.data;
            console.log('RIGHTS TABLE READY');
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
    async mergeEmpDataSet(){
      try {
        this.dataSet = Object.values(this.empDataSet);
        this.deptDataSet = Object.values(this.deptDataSet)
        this.postDataSet = Object.values(this.postDataSet);
        this.dataSet.forEach(data => {
          this.postDataSet.forEach(postData =>{
            if (data.post_id === postData.id)
            data.post = postData.name;
          });
          this.deptDataSet.forEach(deptData =>{
            if (data.dept_id === deptData.id)
            data.dept = deptData.name;
          });
        });
        this.isLoaded = true;
        console.log('Dataset merged.');
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
  computed: {
    sortedData(){
        return [...this.dataSet]?.sort((item1, item2) => item1[this.selectedSort]?.localeCompare(item2[this.selectedSort]))
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
    this.fetchData(URL_GROUPS);//сбор данных о группах
    this.fetchData(URL_RIGHTS);//сбор данных о правах
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
