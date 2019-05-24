<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" label-position="top" size="small">
				<el-form-item label="开始时间">
					<el-date-picker v-model="ruleForm.startDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="changeData"  type="datetime" style="width: 165px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-date-picker v-model="ruleForm.endDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="changeData"  type="datetime" style="width: 165px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="订单号">
					<el-input v-model="ruleForm.orderSn" placeholder="订单号" clearable @clear="clear"></el-input>
				</el-form-item>
				<el-form-item label="状态说明">
					<el-select v-model="ruleForm.status" placeholder="请选择状态说明" @change="review" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="失败" value="0"></el-option>
						<el-option label="成功" value="1"></el-option>
						<el-option label="未知" value="-1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="ruleForm.phone" placeholder="手机号码" clearable @clear="clear"></el-input>
				</el-form-item>
				<el-form-item label="短信内容">
					<el-input v-model="ruleForm.content" placeholder="短信内容" clearable @clear="clear"></el-input>
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
	            <span class="omit">{{ props.row.smsText }}</span>
	          </el-form-item>         
	        </el-form>
	      </template>
    	</el-table-column>
			<el-table-column prop="orderSn" label="订单号" min-width="170">
			</el-table-column>
			<el-table-column prop="receiverMsisdn" label="手机号码" min-width="110">
			</el-table-column>
			<el-table-column prop="receiptDesc" label="发送状态">
			</el-table-column>
			<el-table-column prop="sentTime" label="发送时间" :formatter="formatter" min-width="150">
			</el-table-column>
			<el-table-column prop="receiptType" label="状态说明" width="">
				<template slot-scope="scope">
					<span v-if="scope.row.receiptType !== null" :class="scope.row.receiptType=='成功' ? 'class-a' : 'class-b' ">{{scope.row.receiptType}}<span class="circle"></span></span>
					<span v-else>未知<span class="circle"></span></span>					
				</template>
			</el-table-column>
			<el-table-column prop="receiptText" label="状态报告" width="">
			</el-table-column>
			<el-table-column prop="msgTotal" label="长短信" min-width="">
			</el-table-column>
			<el-table-column prop="receiptAmount" label="接收回执数" width="100">
			</el-table-column>				
			<el-table-column prop="receiptTime" label="回执时间" :formatter="formatter2" min-width="150">
			</el-table-column>						
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[5,10,100,400,1000]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</section>

</template>

<script>
	import { queryOrderDetailList } from '../../api/api';
	export default {
		data() {
			return {
				tableData: null,
				ruleForm: {
					"offset": 1,
					"pageSize": 5,
					"endDate": this.getDay(0) + ' 23:59:59',
					"startDate": this.getDay(0) + ' 00:00:00',
					"content":'',
					"orderSn":'',
					"phone":'',
					"status":''
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
			changeData() {
				this.addData()
			},
			review() {
				this.addData()
			},
			clear(){
				this.addData()
			},
			formatter(row) {
				if(row.sentTime == '' || row.sentTime == null) {
					return '-'
				} else {
					return row.sentTime.substring(0, 19)
				}

			},
			formatter2(row) {
				if(row.receiptTime == '' || row.receiptTime == null) {
					return '-'
				} else {
					return row.receiptTime.substring(0, 19)
				}

			},
			addData() {
				this.loading = true;
				queryOrderDetailList(this.ruleForm).then(res => {
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
  .class-a{
  	color: #67C23A;
  }
  .class-b{
  	color: #f40000;
  }
</style>