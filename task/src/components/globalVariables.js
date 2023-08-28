const URL_SERVER = 'http://192.168.0.102:4000/';
export default{
    URL_GROUP_LIST: URL_SERVER + 'group_list',
    URL_RIGHT_LIST: URL_SERVER + 'right_list',
    URL_GET_GROUP_RIGHTS: URL_SERVER + 'rpc/get_group_rights?p_group_id=',
    URL_GROUP_ADD_R: URL_SERVER + 'rpc/group_add_right',
    URL_GROUP_DEL_R: URL_SERVER + 'rpc/group_delete_right',
}