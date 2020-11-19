import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import Vue from 'vue'
import {UI_CACHE_DB_DICT_DATA } from "@/store/mutation-types"

////根路径
// const doMian = "/jeecg-boot/";
////图片预览请求地址
// const imgView = "http://localhost:8080/jeecg-boot/acc/common/view/";

//角色管理
const addRole = (params)=>postAction("/acc/role/add",params);
const editRole = (params)=>putAction("/acc/role/edit",params);
// const getRoleList = (params)=>getAction("/acc/role/list",params);
// const deleteRole = (params)=>deleteAction("/acc/role/delete",params);
// const deleteRoleList = (params)=>deleteAction("/acc/role/deleteBatch",params);
const checkRoleCode = (params)=>getAction("/acc/role/checkRoleCode",params);
const queryall = (params)=>getAction("/acc/role/queryall",params);

//用户管理
const addUser = (params)=>postAction("/acc/user/add",params);
const editUser = (params)=>putAction("/acc/user/edit",params);
const queryUserRole = (params)=>getAction("/acc/user/queryUserRole",params);
const getUserList = (params)=>getAction("/acc/user/list",params);
// const deleteUser = (params)=>deleteAction("/acc/user/delete",params);
// const deleteUserList = (params)=>deleteAction("/acc/user/deleteBatch",params);
const frozenBatch = (params)=>putAction("/acc/user/frozenBatch",params);
//验证用户是否存在
const checkOnlyUser = (params)=>getAction("/acc/user/checkOnlyUser",params);
//改变密码
const changePassword = (params)=>putAction("/acc/user/changePassword",params);
//20201119王顺 模块修改
const modelUpdate = (params)=>postAction("/acc/zknh_wechat_config/editModule",params);
//权限管理
const addPermission= (params)=>postAction("/acc/permission/add",params);
const editPermission= (params)=>putAction("/acc/permission/edit",params);
const getPermissionList = (params)=>getAction("/acc/permission/list",params);
/*update_begin author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */
const getSystemMenuList = (params)=>getAction("/acc/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/acc/permission/getSystemSubmenu",params);
const getSystemSubmenuBatch = (params) => getAction('/acc/permission/getSystemSubmenuBatch', params)
/*update_end author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */

// const deletePermission = (params)=>deleteAction("/acc/permission/delete",params);
// const deletePermissionList = (params)=>deleteAction("/acc/permission/deleteBatch",params);
const queryTreeList = (params)=>getAction("/acc/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/acc/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/acc/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/acc/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/acc/permission/saveRolePermission",params);
//const queryPermissionsByUser = (params)=>getAction("/acc/permission/queryByUser",params);
const queryPermissionsByUser = (params)=>getAction("/acc/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/acc/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/acc/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/acc/permission/queryPermissionRule",params);

// 部门管理
const queryDepartTreeList = (params)=>getAction("/acc/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/acc/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/acc/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/acc/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/acc/sysDepart/delete",params);

//二级部门管理
const queryDepartPermission = (params)=>getAction("/acc/permission/queryDepartPermission",params);
const saveDepartPermission = (params)=>postAction("/acc/permission/saveDepartPermission",params);
const queryTreeListForDeptRole = (params)=>getAction("/acc/sysDepartPermission/queryTreeListForDeptRole",params);
const queryDeptRolePermission = (params)=>getAction("/acc/sysDepartPermission/queryDeptRolePermission",params);
const saveDeptRolePermission = (params)=>postAction("/acc/sysDepartPermission/saveDeptRolePermission",params);
const queryMyDepartTreeList = (params)=>getAction("/acc/sysDepart/queryMyDeptTreeList",params);

//日志管理
//const getLogList = (params)=>getAction("/acc/log/list",params);
const deleteLog = (params)=>deleteAction("/acc/log/delete",params);
const deleteLogList = (params)=>deleteAction("/acc/log/deleteBatch",params);

//数据字典
const addDict = (params)=>postAction("/acc/dict/add",params);
const editDict = (params)=>putAction("/acc/dict/edit",params);
//const getDictList = (params)=>getAction("/acc/dict/list",params);
const treeList = (params)=>getAction("/acc/dict/treeList",params);
// const delDict = (params)=>deleteAction("/acc/dict/delete",params);
//const getDictItemList = (params)=>getAction("/acc/dictItem/list",params);
const addDictItem = (params)=>postAction("/acc/dictItem/add",params);
const editDictItem = (params)=>putAction("/acc/dictItem/edit",params);
//const delDictItem = (params)=>deleteAction("/acc/dictItem/delete",params);
//const delDictItemList = (params)=>deleteAction("/acc/dictItem/deleteBatch",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>getAction(`/acc/dict/getDictItems/${code}`,params);
//从缓存中获取字典配置
function getDictItemsFromCache(dictCode) {
  if (Vue.ls.get(UI_CACHE_DB_DICT_DATA) && Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]) {
    let dictItems = Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode];
    console.log("-----------getDictItemsFromCache----------dictCode="+dictCode+"---- dictItems=",dictItems)
    return dictItems;
  }
}

//系统通告
const doReleaseData = (params)=>getAction("/acc/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/acc/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/acc/loginfo",params);
const getVisitInfo = (params)=>getAction("/acc/visitInfo",params);
//数据日志访问
// const getDataLogList = (params)=>getAction("/acc/dataLog/list",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/acc/user/queryUserByDepId",params);

// 查询用户角色表里的所有信息
// const queryUserRoleMap = (params)=>getAction("/acc/user/queryUserRoleMap",params);
// 重复校验
const duplicateCheck = (params)=>getAction("/acc/duplicate/check",params);
// 加载分类字典
const loadCategoryData = (params)=>getAction("/acc/category/loadAllData",params);
const checkRuleByCode = (params) => getAction('/acc/checkRule/checkByCode', params)
//加载我的通告信息
const getUserNoticeInfo= (params)=>getAction("/acc/sysAnnouncementSend/getMyAnnouncementSend",params);
const getTransitURL = url => `/acc/common/transitRESTful?url=${encodeURIComponent(url)}`
// 中转HTTP请求
export const transitRESTful = {
  get: (url, parameter) => getAction(getTransitURL(url), parameter),
  post: (url, parameter) => postAction(getTransitURL(url), parameter),
  put: (url, parameter) => putAction(getTransitURL(url), parameter),
  http: (url, parameter) => httpAction(getTransitURL(url), parameter),
}

export {
  // imgView,
  // doMian,
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  modelUpdate,
  checkOnlyUser,
  changePassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  getSystemSubmenuBatch,
  loadCategoryData,
  checkRuleByCode,
  queryDepartPermission,
  saveDepartPermission,
  queryTreeListForDeptRole,
  queryDeptRolePermission,
  saveDeptRolePermission,
  queryMyDepartTreeList,
  getUserNoticeInfo,
  getDictItemsFromCache
}



