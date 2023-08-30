<template>
<emp-list
    :empList="empListComputed"
    :postList="postList"
    :deptList="deptList"
    @refresh="refreshData()"
/>
</template>
<script>
import EmpList from "@/components/EMP/EmpList"
import { ref } from "vue";
import { ElLoading} from "element-plus";
export default{
    name: "emp-page",
    components:{EmpList},
    setup(){
        const show = ref(false);
        const empList = ref([]);
        const postList = ref([]);
        const deptList = ref([]);
        const loading = ElLoading.service({
            lock: true, text: 'Загрузка',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        return{empList, deptList, postList, loading, show};
    },
    methods:{
        refreshData(){
            this.loading
            const promises = [//СБОР ПРОМИСА ДЛЯ ОТСЛЕЖИВАНИЯ ВСЕХ АСИНХ ФУНКЦИЙ
                this.$getData(this.$URL_EMP_LIST, '').then(data => {
                    this.empList = data
                }),
                this.$getData(this.$URL_POST_LIST, '').then(data => {
                    this.postList = data;
                }),
                this.$getData(this.$URL_DEPT_LIST, '').then(data => {
                    this.deptList = data;
                })
            ]
            Promise.all(promises).then(() => {
                this.loading.close();
                console.log('All promises completed successfully.');
                this.empList.forEach(emp => {
                    this.postList.forEach(post => {
                        if (emp.post_id === post.id) emp.post = post.name
                    })
                    this.deptList.forEach(dept => {
                        if (emp.dept_id === dept.id) emp.dept = dept.name
                    })
                });
            }).catch((e) => {
                console.log('Error occured during promise processing:', e);
            })
        },
    },
    computed:{
        empListComputed(){
            return this.empList
        }
    },
    mounted(){
        this.refreshData();
    }
}
</script>