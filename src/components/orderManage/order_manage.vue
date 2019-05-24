<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" label-position="top" size="small">
				<el-form-item label="条数大于">
					<el-input v-model="ruleForm.countMax" placeholder="条数大于" clearable @clear="clear"></el-input>
				</el-form-item>
				<el-form-item label="条数小于">
					<el-input v-model="ruleForm.countMin" placeholder="条数小于" clearable @clear="clear"></el-input>
				</el-form-item>
				<el-form-item label="提交者">
					<el-input v-model="ruleForm.commiter" placeholder="提交者" clearable @clear="clear"></el-input>
				</el-form-item>
				<el-form-item label="发送状态">
					<el-select v-model="ruleForm.orderStatus" placeholder="请选择发送状态" @change="review" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="发送完成" value="发送完成"></el-option>
						<el-option label="发送中" value="发送中"></el-option>
						<el-option label="订单暂停" value="订单暂停"></el-option>
						<el-option label="超时" value="超时"></el-option>
						<el-option label="启发限制" value="启发限制"></el-option>
						<el-option label="需失败重发" value="需失败重发"></el-option>
						<el-option label="待发" value="待发"></el-option>
						<el-option label="订单取消" value="订单取消"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单类型">
					<el-select v-model="ruleForm.receivingType" placeholder="请选择订单类型" @change="review" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="行业" value="行业"></el-option>
						<el-option label="营销" value="营销"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单内容">
					<el-input v-model="ruleForm.orderContent" placeholder="订单内容" clearable @clear="clear"></el-input>
				</el-form-item>
				<el-form-item class='seach'>
					<el-button type="primary" @click.native.prevent="getTableList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table v-loading="loading" :data="tableData" border style="width: 100%">
			<el-table-column fixed type="expand">
	      <template slot-scope="props">
	        <el-form label-position="left" inline class="demo-table-expand">
	          <el-form-item label="短信内容">
	            <span>{{ props.row.msgContent }}</span>
	          </el-form-item>         
	        </el-form>
	      </template>
    	</el-table-column>
			<el-table-column prop="orderSn" label="订单号" min-width="200">
			</el-table-column>
			<el-table-column prop="loginName" label="用户名称" width="">
			</el-table-column>
			<el-table-column prop="submitTime" label="提交时间" :formatter="formatter" min-width="160">
			</el-table-column>
			<el-table-column prop="lastActiveTime" label="最后激活" :formatter="formatter2" min-width="160">
			</el-table-column>
			<el-table-column prop="templateId" label="接单模版" width="">
			</el-table-column>
			<el-table-column prop="status" label="发送状态" width="">
			</el-table-column>
			<el-table-column prop="priceTypeName" label="发送类型" min-width="150">
			</el-table-column>
			<el-table-column prop="templateType" label="订单类型" width="">
			</el-table-column>				
			<el-table-column prop="entryBizType" label="最终接单类型" min-width="120">
			</el-table-column>
			<el-table-column prop="mtTotal" label="总量" width="">
			</el-table-column>
			<el-table-column prop="mtReady" label="待发" width="">
			</el-table-column>
			<el-table-column prop="mtSent" label="已发" width="">
			</el-table-column>
			<el-table-column prop="mtFailed" label="失败" width="">
			</el-table-column>
			<el-table-column prop="mtNotSent" label="回执未传" width="">
			</el-table-column>
			<el-table-column label="操作" fixed="right" align="center" width="220">
				<template slot-scope="scope">
					<el-button type="primary"  size="small">待发换网关</el-button>
					<el-button type="primary"  size="small">先审后发</el-button>
				</template>
			</el-table-column>

		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[5,10,100,400,1000]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</section>

</template>

<script>
	import { queryOrderManagerList } from '../../api/api';
	export default {
		data() {
			return {
				tableData: null,
				ruleForm: {
					"offset": 1,
					"pageSize": 5,
					"countMax": "",
					"countMin": "",
					"commiter": "",
					"orderStatus": "",
					"orderType": "",
					"receivingType": "",
					"sendType": "",
					"orderContent": ""
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
			formatter(row) {
				if(row.submitTime == '' || row.submitTime == null) {
					return '-'
				} else {
					return row.submitTime.substring(0, 19)
				}

			},
			formatter2(row) {
				if(row.lastActiveTime == '' || row.lastActiveTime == null) {
					return '-'
				} else {
					return row.lastActiveTime.substring(0, 19)
				}

			},
			addData() {
				this.loading = true;
				queryOrderManagerList(this.ruleForm).then(res => {
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    color: #95C0EB;
  }
</style>