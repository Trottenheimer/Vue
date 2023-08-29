const SERVER = 'http://pgrest.oblteh:4000/';
export default{
    //АДРЕСА ЗАПРОСОВ
    URL_SERVER: SERVER,
    URL_EMP_LIST: SERVER + 'emp_list',
    URL_EMP_UPSERT: SERVER + 'rpc/emp_upsert',
    URL_EMP_DELETE: SERVER + 'rpc/emp_delete',
    URL_GROUP_LIST: SERVER + 'group_list',
    URL_RIGHT_LIST: SERVER + 'right_list',
    URL_POST_LIST: SERVER + 'post_list',
    URL_DEPT_LIST: SERVER + 'dept_list',
    URL_GET_GROUP_RIGHTS: SERVER + 'rpc/get_group_rights?p_group_id=',
    URL_GROUP_ADD_R: SERVER + 'rpc/group_add_right',
    URL_GROUP_DEL_R: SERVER + 'rpc/group_delete_right',
}