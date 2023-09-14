const SERVER = 'http://pgrest.oblteh:4000/';
export default{
    //АДРЕСА ЗАПРОСОВ
    URL_SERVER: SERVER,
    
    URL_AUTH: SERVER + 'rpc/authenticate',

    URL_EMP_LIST: SERVER + 'emp_list',
    URL_EMP_UPSERT: SERVER + 'rpc/emp_upsert',
    URL_EMP_DELETE: SERVER + 'rpc/emp_delete',
    URL_EMP_ADD_R: SERVER + 'rpc/emp_add_right',
    URL_EMP_ADD_G: SERVER + 'rpc/emp_add_group',
    URL_EMP_DEL_R: SERVER + 'rpc/emp_delete_right',
    URL_EMP_DEL_G: SERVER + 'rpc/emp_delete_group',//{"p_emp_id": 0,"p_group_id": 0}
    URL_EMP_GET_PROFILES: SERVER + 'rpc/emp_get_profiles',
    URL_EMP_GROUPS: SERVER + 'rpc/get_emp_groups?p_emp_id=',
    URL_EMP_CHANGE_LOGPASS: SERVER + 'rpc/emp_change_log_info',
    URL_EMP_RIGHTS: SERVER + 'rpc/get_emp_all_rights?p_emp_id=',
    URL_EMP_DIR_RIGHTS: SERVER + 'rpc/get_emp_direct_right?p_emp_id=',

    URL_GROUP_LIST: SERVER + 'group_list',
    URL_GROUP_ADD_R: SERVER + 'rpc/group_add_right',
    URL_GROUP_DEL_R: SERVER + 'rpc/group_delete_right',
    URL_GET_GROUP_EMPS: SERVER + 'rpc/get_group_emps?p_group_id=',
    URL_GET_GROUP_RIGHTS: SERVER + 'rpc/get_group_rights?p_group_id=',

    URL_RIGHT_LIST: SERVER + 'right_list',
    URL_GET_RIGHT_EMPS: SERVER + 'rpc/get_right_emps?p_right_id=',
    URL_GET_RIGHT_GROUPS: SERVER + 'rpc/get_right_groups?p_right_id=',
    

    URL_POST_LIST: SERVER + 'post_list',

    URL_DEPT_LIST: SERVER + 'dept_list',
}
