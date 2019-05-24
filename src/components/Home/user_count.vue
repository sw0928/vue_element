<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" label-position="top" size="small">
				<el-form-item label="开始时间">
					<el-date-picker v-model="ruleForm.startDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="changeData" :picker-options="pickerOptions" type="datetime" style="width: 165px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-date-picker v-model="ruleForm.endDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="changeData" :picker-options="pickerOptions" type="datetime" style="width: 165px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="用户">
					<el-autocomplete class="inline-input" v-model="state1" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" @clear="searchValue" clearable></el-autocomplete>
				</el-form-item>
				<el-form-item class='seach'>
					<el-button type="primary" @click.native.prevent="getTableList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table v-loading="loading" :data="tableData" border style="width: 100%">
			<el-table-column fixed prop="loginName" label="登录名" width="">
			</el-table-column>
			<el-table-column prop="mtAmount" label="提交总量" width="">
			</el-table-column>
			<el-table-column prop="mtSend" label="发送成功量" width="">
			</el-table-column>
			<el-table-column prop="sentPct" label="发送成功占比" width="">
			</el-table-column>
			<el-table-column prop="receiptCnt" label="回执总量" width="">
			</el-table-column>
			<el-table-column prop="mtReceiptSuccess" label="回执成功总量" width="">
			</el-table-column>
			<el-table-column prop="recvPct" label="回执成功占比" width="">
			</el-table-column>
			<el-table-column prop="mtReceiptFail" label="回执失败总量" width="">
			</el-table-column>
			<el-table-column prop="mtReceiptUnknow" label="回执未知数量" width="">
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[10,100, 200, 300, 400]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</section>

</template>

<script>
	import { queryUserSendCountList, queryUserName } from '../../api/api';
	export default {
		data() {
			return {
				pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }          
        },
				tableData: null,
				ruleForm: {
					"endDate": this.getDay(0) + ' 23:59:59',
					"startDate": this.getDay(0) + ' 00:00:00',
					"offset": 1,
					"pageSize": 10,
					"userName": ""
				},
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
				this.ruleForm.userName = '';
				this.addData()
			},
			changeData() {
				this.addData()
			},
			inputVal(){				
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
				this.ruleForm.userName = item.userId;
				this.addData()
			},
			addData() {
				this.loading = true;
				queryUserSendCountList(this.ruleForm).then(res => {
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