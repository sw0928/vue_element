<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" label-position="top" size="small">
				<el-form-item label="登录名" >
					<el-input v-model="ruleForm.loginName" placeholder="登录名" @clear="clear" clearable></el-input>
				</el-form-item>
				<el-form-item label="账户类型">
					<el-select v-model="ruleForm.accountType" placeholder="请选择账户类型" @change="review" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="管理员" value="1"></el-option>
						<el-option label="财务" value="2"></el-option>
						<el-option label="运维" value="3"></el-option>
						<el-option label="销售总监" value="4"></el-option>
						<el-option label="销售经理" value="5"></el-option>
						<el-option label="客户经理" value="6"></el-option>
						<el-option label="代理商" value="7"></el-option>
						<el-option label="客户" value="8"></el-option>
						<el-option label="直营客户" value="100"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="可发类型">
					<el-select v-model="ruleForm.sendType" placeholder="请选择可发类型" @change="review" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="行业" value="2"></el-option>
						<el-option label="营销" value="4"></el-option>
						<el-option label="行业与营销" value="6"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='seach'>
					<el-button type="primary" @click.native.prevent="getTableList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table v-loading="loading" :data="tableData" border style="width: 100%">
			<el-table-column fixed prop="loginName" label="登录名" min-width="100">
			</el-table-column>
			<el-table-column prop="userName" label="用户名" min-width="120">
			</el-table-column>
			<el-table-column prop="accountType" label="账户类型" width="">
				<template slot-scope="scope">
					<span v-if="scope.row.accountType == 1">管理员</span>
					<span v-if="scope.row.accountType == 2">财务</span>
					<span v-if="scope.row.accountType == 3">运维</span>
					<span v-if="scope.row.accountType == 4">销售总监</span>
					<span v-if="scope.row.accountType == 5">销售经理</span>
					<span v-if="scope.row.accountType == 6">客户经理</span>
					<span v-if="scope.row.accountType == 7">代理商</span>
					<span v-if="scope.row.accountType == 8">客户</span>
					<span v-if="scope.row.accountType == 100">直营客户</span>
				</template>
			</el-table-column>
			<el-table-column prop="parentLoginName" label="上级用户" width="">
			</el-table-column>
			<el-table-column prop="templateTypeBitwise" label="可发类型" min-width="120">
				<template slot-scope="scope">
					<span v-if="scope.row.templateTypeBitwise == 2">行业</span>
					<span v-if="scope.row.templateTypeBitwise == 4">营销</span>
					<span v-if="scope.row.templateTypeBitwise == 6">行业与营销</span>					
				</template>
			</el-table-column>
			<el-table-column prop="billingType" label="计费方式" width="">
				<template slot-scope="scope">
					<span v-if="scope.row.billingType == 1">提交计费</span>
					<span v-if="scope.row.billingType == 2">成功计费</span>
				</template>
			</el-table-column>
			<el-table-column prop="submitInterval" label="同模版下单频率" min-width="120">
			</el-table-column>
			<el-table-column prop="submitSameDay" label="同内容下单频率" min-width="120">
			</el-table-column>
			<el-table-column prop="speed" label="行业下单速度" min-width="120">
			</el-table-column>
			<el-table-column prop="submitLimit" label="行业下单限制" min-width="120">
			</el-table-column>
			<el-table-column prop="speed2" label="营销下单速度" min-width="120">
			</el-table-column>
			<el-table-column prop="submitLimit2" label="营销下单限制" min-width="120">
			</el-table-column>
			<el-table-column prop="blackLevelMax" label="行业黑名单" min-width="100">
			</el-table-column>
			<el-table-column prop="blackLevelMax2" label="营销黑名单" min-width="100">
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[10,100, 200, 300, 400]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</section>

</template>

<script>
	import { queryUserManageList, queryUserName } from '../../api/api';
	export default {
		data() {
			return {
				tableData: null,
				ruleForm: {
					"loginName": "",
					"accountType": "",
					"offset": 1,
					"pageSize": 10,
					"sendType": "",
				},
				loading: false,
				restaurants: [],
				currentPage: 1,
				total: 0
			}
		},
		mounted() {
			this.addData()

		},
		methods: {
			getTableList() {				
				this.addData()
			},
			review() {
				this.addData()
			},
			clear(){
				this.addData()
			},
			addData() {
				this.loading = true;
				queryUserManageList(this.ruleForm).then(res => {
					this.loading = false;
					if(res.statusCode !== 200) {
						this.$message({
							message: res.message,
							type: 'error'
						});
					} else {
						this.tableData = res.data.data;
						this.total = res.data.totalCount
					}
				}).catch(error => {
					// 处理 getJSON 和 前一个回调函数运行时发生的错误
					this.$router.push({
						path: '/login'
					})
				});
			},
			handleSizeChange(val) {
				this.ruleForm.pageSize = val;
				this.addData()
			},
			handleCurrentChange(val) {
				this.ruleForm.offset = val;
				this.addData()
			}

		},
		created() {

		},
	}
</script>

<style scoped>
	
</style>