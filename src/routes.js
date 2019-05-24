import Login from '@/components/Login'
import Register from '@/components/Register'
import Home from '@/components/Home/home'
import Order from '@/components/Home/order'
import userCount from '@/components/Home/user_count'
import Template from '@/components/Home/template'
import Detail from '@/components/Home/detail'
import userManage from '@/components/userManage/user_manage'
import operationList from '@/components/userManage/operation_list'
import orderManage from '@/components/orderManage/order_manage'
import orderList from '@/components/orderManage/order_list'

let routes = [{
		path: '/',
		redirect: '/order'
	},
	{
		path: '/login',
		name: '',
		component: Login
	},
	{
		path: '/register',
		name: '',
		component: Register
	},
	{
		path: '/home',
		component: Home,
		children: [{
				path: '/order',
				component: Order
			},
			{
				path: '/user_count',
				component: userCount
			},
			{
				path: '/template',
				component: Template
			},
			{
				path: '/detail',
				component: Detail
			},
			{
				path: '/user_manage',
				component: userManage
			},
			{
				path: '/operation_list',
				component: operationList
			},
			{
				path: '/order_manage',
				component: orderManage
			},
			{
				path: '/order_list',
				component: orderList
			},
		]
	},
];
export default routes;