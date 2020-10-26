import axios from 'axios';
//let base = '';
let qs=require('qs');
//let Author = JSON.parse(sessionStorage.getItem('user'))
//Author = Author?Author.Authorization : '';
//let aa = axios.create({
//  headers: {dataType : 'json',contentType: 'application/json',Authorization:Author}
//});
//let bb = axios.create({
//  headers: {dataType : 'json'}
//});
export const requestLogin = params => { return axios.post(`/api/login`, params).then(res => res.data); };
export const orderFailList = params => { return axios.post(`/api/icos/order/orderFailList`, params).then(res => res.data); };
export const queryUserName = params => { return axios.post(`/api/icos/user/queryUserName`, qs.stringify(params)).then(res => res.data); };
export const queryIsmgName = params => { return axios.post(`/api/icos/ismg/queryIsmgName`, qs.stringify(params)).then(res => res.data); };
export const queryBizType = params => { return axios.post(`/api/icos/bizexpression/queryBizType`, qs.stringify(params)).then(res => res.data); };
export const queryUserSendCountList = params => { return axios.post(`/api/icos/order/queryUserSendCountList`, params).then(res => res.data); };
export const templateApplyList = params => { return axios.post(`/api/icos/template/templateApplyList`, params).then(res => res.data); };
export const templateApply = params => { return axios.post(`/api/icos/template/templateApply`, params).then(res => res.data); };
export const templateApplyInfo = params => { return axios.post(`/api/icos/template/templateApplyInfo`, qs.stringify(params)).then(res => res.data); };
export const repulseTemplateApply = params => { return axios.post(`/api/icos/template/repulseTemplateApply`, params).then(res => res.data); };
export const queryUserManageList = params => { return axios.post(`/api/icos/usermanager/queryUserManageList`, params).then(res => res.data); };
export const queryOperationList = params => { return axios.post(`/api/icos/user/queryOperationList`, params).then(res => res.data); };
export const resetPassword = params => { return axios.post(`/api/icos/user/resetPassword`, qs.stringify(params)).then(res => res.data); };
export const queryUserDefultMenu = params => { return axios.post(`/api/icos/queryUserDefultMenu`, qs.stringify(params)).then(res => res.data); };
export const queryOrderManagerList = params => { return axios.post(`/api/icos/order/queryOrderManagerList`, params).then(res => res.data); };
export const queryOrderDetailList = params => { return axios.post(`/api/icos/order/queryOrderDetailList`, params).then(res => res.data); };
export const queryUserSendDetailList = params => { return axios.post(`/api/icos/order/queryUserSendDetailList`, params).then(res => res.data); };
export const queryBizExpressionList = params => { return axios.post(`/api/icos/bizexpression/queryBizExpressionList`, params).then(res => res.data); };
export const removeBizExpression = params => { return axios.post(`/api/icos/bizexpression/removeBizExpression`, qs.stringify(params)).then(res => res.data); };
export const createBizExpression = params => { return axios.post(`/api/icos/bizexpression/createBizExpression`, params).then(res => res.data); };
export const queryBizExpressionInfo = params => { return axios.post(`/api/icos/bizexpression/queryBizExpressionInfo`, qs.stringify(params)).then(res => res.data); };

//export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
//
//export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
//
//export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
//
//export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
//
//export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };