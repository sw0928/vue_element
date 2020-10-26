<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" label-position="top" size="small">
				<el-form-item label="登录名">
					<el-input v-model="ruleForm.loginName" placeholder="登录名" @clear="clear" clearable></el-input>
				</el-form-item>								
				<el-form-item class='seach'>
					<el-button type="primary" @click.native.prevent="getTableList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table v-loading="loading" :data="tableData"  border style="width: 100%" >
			<el-table-column fixed prop="loginName" label="登录名" min-width="120">
			</el-table-column>
			<el-table-column prop="userName" label="用户名" min-width="150">
			</el-table-column>
			<el-table-column prop="accountStatus" label="账户状态" width="">
				<template slot-scope="scope">
					<span v-if="scope.row.accountStatus == 1">不可用</span>
					<span v-if="scope.row.accountStatus == 0">可用</span>					
				</template>
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
			<el-table-column prop="lastLoginTime"  label="最后登录时间" :formatter="formatter" min-width="160">				
			</el-table-column>
			<el-table-column prop="createrName" label="创建人" min-width="100">				
			</el-table-column>
			<el-table-column prop="createrTime" label="创建时间" :formatter="formatter2" min-width="160">
			</el-table-column>			
			<el-table-column label="操作" fixed="right" align="center" width="200">
				<template slot-scope="scope">
					<el-button  type="primary" @click="management(scope.row)" size="small">权限管理</el-button>
					<el-button  type="primary" @click="replacement(scope.row)"  size="small">重置密码</el-button>
				</template>
			</el-table-column>			
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[10,100, 200, 300, 400]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<el-dialog title="权限管理" :visible.sync="dialogFormVisible" @close='closeB' width ="496px">
			<el-form :inline="true" label-position="top" size="small" :model="showRefuse">																						
				<el-form-item label="登录名">
			    <el-input v-model="showRefuse.loginName" disabled></el-input>
			  </el-form-item>
			  <el-form-item label="用户名">
			    <el-input v-model="showRefuse.userName" disabled></el-input>
			  </el-form-item>
			  <el-form-item label="账户类型" style="width: 200px;">			    
			    <el-select v-model="showRefuse.accountType" disabled>
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
			  <el-form-item label="账户状态" style="width: 200px;">
			    <el-select v-model="showRefuse.accountStatus" disabled>
						<el-option label="可用" value="0"></el-option>
						<el-option label="不可用" value="1"></el-option>						
					</el-select>
			  </el-form-item>
			  <div style="padding: 20px 0;text-align: center;">
		    	<span class="demonstration">权限列表</span>
		    </div>
			  <el-tree
				  :data="data"
				  show-checkbox
				  node-key="id"				  
				  :props="defaultProps">
				</el-tree>
				<el-tree
				  :data="data"
				  show-checkbox
				  node-key="id"
				  :default-expanded-keys="[2]"
				  :props="defaultProps">
				</el-tree>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>				
			</div>
		</el-dialog>
	</section>

</template>

<script>
	import { queryOperationList, resetPassword,queryUserDefultMenu } from '../../api/api';
	export default {
		data() {
			return {
				tableData: null,
				ruleForm: {
					"loginName": "",
					"offset": 1,
					"pageSize": 10
				},
				data: [{
          id: 1,
          label: '工作台',
          children: [
          {
            id: 4,
            label: '订单失败',            
          },
          {
            id: 9,
            label: '审核发送'
            }, 
            {
              id: 10,
              label: '用户发送明细'
            }
          ]
        }, {
          id: 2,
          label: '用户管理',
          children: [{
            id: 5,
            label: '用户列表'
          }, {
            id: 6,
            label: '运维列表'
          }]
        }, {
          id: 3,
          label: '订单管理',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
				defaultProps: {
          children: 'children',
          label: 'label'
       },
				showRefuse:{},
				loading: false,
				dialogFormVisible: false,
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
			closeB(){
				
			},
			clear(){
				this.addData()
			},
			formatter(row) {
				 if(row.lastLoginTime == ''|| row.lastLoginTime == null){
		        return '-'
		      }else{
		        return row.lastLoginTime.substring(0,19)
		      }
        
      },
      formatter2(row) {
				 if(row.createrTime == ''|| row.createrTime == null){
		        return '-'
		      }else{
		        return row.createrTime.substring(0,19)
		      }
        
      },
			management(row){				
				this.dialogFormVisible = true;
				row.accountStatus = row.accountStatus.toString();
				row.accountType = row.accountType.toString()
				this.showRefuse = row
//				queryUserDefultMenu({'userId':row.userId,'accountType':1}).then(res => {
//					if(res.statusCode !== 200) {
//						this.$message({
//							message: res.message,
//							type: 'error'
//						});
//					} else {
//						console.log(res)
//					}
//				}).catch(error => {
//					// 处理 getJSON 和 前一个回调函数运行时发生的错误
//					this.$router.push({
//						path: '/login'
//					})
//				});  
			},
			replacement(row) {				
				this.$confirm('此操作将重置您的密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	resetPassword({'loginName':row.loginName}).then(res => {
					if(res.statusCode !== 200) {
						this.$message({
							message: res.message,
							type: 'error'
						});
					} else {
						this.$alert(res.data, '重置新密码', {
		          confirmButtonText: '确定',
		          callback: action => {
		            this.$message({
		              type: 'success',
		              message: '重置成功'
		            });
		          }
		        });
					}
				}).catch(error => {
					// 处理 getJSON 和 前一个回调函数运行时发生的错误
					this.$router.push({
						path: '/login'
					})
				});         
        })
			},
			addData() {
				this.loading = true;
				queryOperationList(this.ruleForm).then(res => {
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
	.demonstration{
		font-size: 16px;
    font-weight: bold;
	}
	.el-tree{
		display: inline-block;
    width: 49%;
    vertical-align: top;
	}
</style>