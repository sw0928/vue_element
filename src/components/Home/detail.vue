<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" label-position="top" size="small">
				<el-form-item label="开始时间">
					<el-date-picker v-model="ruleForm.startDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="changeData" type="datetime" style="width: 165px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-date-picker v-model="ruleForm.endDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="changeData" type="datetime" style="width: 165px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="订单号">
					<el-input v-model="ruleForm.orderSn" placeholder="订单号" @clear="clear" clearable></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-autocomplete class="inline-input" v-model="state1" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" @clear="searchValue" clearable></el-autocomplete>
				</el-form-item>
				<el-form-item label="发送类型">
					<el-select v-model="ruleForm.sendType" placeholder="请选择发送类型" @change="clear" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option 
              v-for="(c,index) in content"
              :label ="c"
              :key="index"
              :value="index + 1">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发送方式">
					<el-select v-model="ruleForm.howSend" placeholder="请选择发送方式" @change="clear" clearable>
						<el-option label="全部" value=""></el-option>		
						<el-option label="待发" value="0"></el-option>	
						<el-option label="A" value="1"></el-option>	
						<el-option label="Z报成功" value="2"></el-option>	
						<el-option label="Z报失败" value="3"></el-option>	
						<el-option label="Z报空号" value="4"></el-option>	
						<el-option label="Z报内容限制" value="5"></el-option>	
					</el-select>
				</el-form-item>
				<el-form-item label="状态说明">
					<el-select v-model="ruleForm.receiptStatus" placeholder="请选择状态说明" @change="clear" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="失败" value="0"></el-option>
						<el-option label="成功" value="1"></el-option>
						<el-option label="未知" value="-1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='seach'>
					<el-button type="primary" @click.native.prevent="getTableList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table v-loading="loading" :data="tableData" tooltip-effect="light" border style="width: 100%">
			<el-table-column fixed prop="orderSn" label="订单号" width="180">
			</el-table-column>
			<el-table-column prop="loginName" label="用户名" width="80">
			</el-table-column>
			<el-table-column prop="msgContent" label="短信内容" min-width="260">
				<!--<template slot-scope="scope">
					<el-tooltip :content="scope.row.msgContent" placement="top"  effect="light">
					  <span class="">{{scope.row.msgContent}}</span>
					</el-tooltip>
				</template>-->
			</el-table-column>
			<el-table-column prop="ismgName"  label="网关" width="120">
			</el-table-column>
			<el-table-column prop="howSend" label="发送方式" width="">
				<template slot-scope="scope">
					<span v-if="scope.row.howSend == 0">待发</span>
					<span v-if="scope.row.howSend == 1">A</span>
					<span v-if="scope.row.howSend == 2">Z报成功</span>
					<span v-if="scope.row.howSend == 3">Z报失败</span>
					<span v-if="scope.row.howSend == 4">Z报空号</span>
					<span v-if="scope.row.howSend == 5">Z报内容限制</span>					
				</template>
			</el-table-column>
			<el-table-column prop="typeName" label="发送类型	" width="140">
			</el-table-column>
			<el-table-column prop="msgTotal" label="长短信条数" width="100">
			</el-table-column>
			<el-table-column prop="successAmount"  label="成功数量" width="100">
			</el-table-column>
			<el-table-column prop="receiverMsisdn"  label="被叫号码" width="120">
			</el-table-column>
			<el-table-column prop="receiptTime" label="回执时间" :formatter="formatter" width="160">
			</el-table-column>
			<el-table-column prop="receiptStatusCode"  label="状态说明" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.receiptStatusCode == 0" style="color:#FF3939">失败<span class="circle"></span></span>
					<span v-if="scope.row.receiptStatusCode == 1" style="color:#9AC938">成功<span class="circle"></span></span>
					<span v-if="scope.row.receiptStatusCode == null" style="color:#A9A9A9">未知<span class="circle"></span></span>
				</template>
			</el-table-column>
			<el-table-column prop="receiptStatusText"  label="状态报告" width="100">
				
			</el-table-column>
			<el-table-column prop="sentTime"  label="发送时间" :formatter="formatter2" width="160">
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[10,100, 200, 300, 400]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</section>

</template>

<script>
	import { queryUserSendDetailList, queryUserName, queryIsmgName } from '../../api/api';
	export default {
		data() {
			return {
				tableData: null,
				ruleForm: {
					"endDate": this.getDay(0) + ' 23:59:59',
					"startDate": this.getDay(0) + ' 00:00:00',
					"howSend": "",
					"ismgId": "",
					"moblieNumber": "",
					"offset": 1,
					"orderSn": "",
					"pageSize": 10,
					"receiptStatus": "",
					"sendType": "",
					"signName": "",
					"smsConten": "",
					"taskSn": "",
					"userName": ""
				},
				content:['短信移动成功计费','短信联通成功计费','短信电信成功计费','短信移动提交计费','短信联通提交计费','短信电信提交计费',
        '彩信移动成功计费','彩信联通成功计费','彩信电信成功计费','彩信联通提交计费','彩信电信提交计费','USSD弹屏成功计费',
        '语音验证码成功计费','国际短信成功计费'],
				loading: false,
				restaurants: [],
				state1: '',
				currentPage: 1,
				total: 0
			}
		},
		mounted() {
			this.addData()

		},
		methods: {
			getTableList() {
				this.inputVal()
				this.addData()
			},
			searchValue() {
				this.ruleForm.userName = ''
				this.addData()
			},
			changeData() {
				this.addData()
			},
			clear() {
				this.addData()
			},
			formatter(row) {
				if(row.receiptTime == '' || row.receiptTime == null) {
					return '-'
				} else {
					return row.receiptTime.substring(0, 19)
				}
			},
			formatter2(row) {
				if(row.sentTime == '' || row.sentTime == null) {
					return '-'
				} else {
					return row.sentTime.substring(0, 19)
				}
			},
			inputVal() {
				var restaurants = this.restaurants;
				var results = this.state1 ? restaurants.filter(this.createFilterT(this.state1)) : restaurants;
				if(results.length == 0) {
					this.$message({
						message: '内容与下拉框不匹配！',
						type: 'error'
					});
					this.state1 = '';
					this.ruleForm.userName = ''
				} else {
					//cb(results);
				}
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				if(results.length == 0) {
					this.$message({
						message: '内容与下拉框不匹配！',
						type: 'error'
					});
					this.state1 = '';
					this.ruleForm.userName = ''
				} else {
					cb(results);
				}
			},
			createFilter(queryString) {
				return(restaurant) => {
					return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			createFilterT(queryString) {
				return(restaurant) => {
					return(restaurant.value.toLowerCase() == queryString.toLowerCase());
				};
			},
			handleSelect(item) {
				this.ruleForm.userName = item.userId
			},
			addData() {
				this.loading = true;
				queryUserSendDetailList(this.ruleForm).then(res => {
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
			queryUserName({
				'loginName': ""
			}).then(res => {
				let carts = []
				res.data.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据			
					carts.push({
						'value': item.loginName,
						'userId': item.userId
					})
				})
				this.restaurants = carts;
			})
		},
	}
</script>

<style scoped>

</style>