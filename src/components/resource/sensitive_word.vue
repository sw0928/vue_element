<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" label-position="left" size="small" label-width="80px" style='position: relative;'>			
				<el-form-item label="内容分类" class="labalLh" style='width: 100%;'>
			    <el-radio-group v-model="ruleForm.bizType" @change="radioVal">
			      <el-radio label="1" >营销</el-radio>
			      <el-radio label="2" >行业通知</el-radio>
			      <el-radio label="3" >验证码</el-radio>
			      <el-radio label="5" >五大类（教育、金融、房贷、房产、移民）</el-radio>
			      <el-radio label="4" >挂机模版</el-radio>
			      <el-radio label="55">自己输入</el-radio>
			    </el-radio-group>
			    <el-input
					  placeholder="请输入内容"
					  v-model="ruleForm.param"
					  v-show="paramShow"
					  style="width: 120px;"
					  clearable>
					</el-input>
				</el-form-item>					  
			  <el-form-item label="状态" style='width: 100%;'>
			    <el-radio-group v-model="ruleForm.statusInt">
			      <el-radio label="1" >可用</el-radio>
			      <el-radio label="0" >不可用</el-radio>
			      <el-radio label="2" >测试</el-radio>			      
			    </el-radio-group>
			 </el-form-item>
			 	<el-form-item label="活动性质" style='width: 100%;'>
			    <el-checkbox-group v-model="ruleForm.actionType">
			      <el-checkbox label="1" name="type" >拒绝</el-checkbox>
			      <el-checkbox label="2" name="type" >先审后发</el-checkbox>
			      <el-checkbox label="3" name="type" >先发后审</el-checkbox>
			      <el-checkbox label="4" name="type" >接受</el-checkbox>
			    </el-checkbox-group>
			  </el-form-item>
				<el-form-item class='seach' style='position: absolute;top: 0px;right: 0;'>
					<el-button type="primary" native-type="submit" @click.native.prevent="shade">新增</el-button>
					<el-button type="primary" native-type="submit" @click.native.prevent="getTableList">查询</el-button>					
				</el-form-item>
			</el-form>
		</el-col>
		<el-table v-loading="loading" :data="tableData" border style="width: 100%">
			<el-table-column fixed prop="expressionId" label="表达式ID" width="100">
			</el-table-column>
			<el-table-column label="表达式" min-width="360">
				<template slot-scope="scope">
					<el-tooltip :content="scope.row.expression" placement="top" effect="light">
					  <span class="omit">{{scope.row.expression}}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="bizTypeName" label="内容分类" width=""> 
			</el-table-column>
			<el-table-column prop="actionType" label="接单动作" width="">				
			</el-table-column>
			<el-table-column prop="statusInt" label="状态" width="">
			</el-table-column>
			<el-table-column prop="useType" label="使用方式" width="">
			</el-table-column>
			<el-table-column label="操作" fixed="right" align="center" width="150">
				<template slot-scope="scope">
					<el-button  type="primary" @click="management(scope.row)" size="small">修改</el-button>
					<el-button  type="primary" @click="replacement(scope.row)" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[10,100, 200, 300, 400]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<el-dialog title="新增敏感词" :visible.sync="dialogFormVisible" @close="close('showData')" width ="526px">
			<el-form :inline="true" label-position="top" size="small" :rules="rules" ref="showData" :model="showData">				
				<el-form-item label="表达式" style='width: 97.6%;' prop="expression">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="showData.expression" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="内容分类" prop="bizType">
					<el-select v-model="showData.bizType" placeholder="请选择内容分类">
						<el-option 
							v-for="(li, index) in queryBizType"
							:label="li.bizTypeName"
							:key="index"
							:value="li.bizTypeId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="接单动作" prop="actionType">
					<el-select v-model="showData.actionType" placeholder="请选择接单动作">
						<el-option label="拒绝" value="1"></el-option>
						<el-option label="先审后发" value="2"></el-option>
						<el-option label="先发后审" value="3"></el-option>
						<el-option label="接受" value="4"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账户状态" prop="statusInt">
					<el-select v-model="showData.statusInt" placeholder="请选择账户状态">
						<el-option label="不可用" value="0"></el-option>
						<el-option label="可用" value="1"></el-option>
						<el-option label="测试" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="使用方式" prop="useType">
					<el-select v-model="showData.useType" placeholder="请选择使用方式">
						<el-option label="接单" value="1"></el-option>
						<el-option label="补发" value="2"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button  type="primary" @click="commit('showData')">确 定</el-button>
			</div>
		</el-dialog>
	</section>

</template>

<script>
	import { queryBizExpressionList, removeBizExpression, queryBizType, createBizExpression,queryBizExpressionInfo } from '../../api/api';
	export default {
		data() {
			return {
				tableData: null,
				queryBizType:null,
				ruleForm: {
					"actionType": [],					
					"bizType": 0,
					"offset": 1,
					"pageSize": 10,
					"param": "",
					"statusInt": '1'
				},
				showData:{
					"actionType": '',					
					"bizType": '',
					"useType": '1',
					"expression": "",
					"statusInt": '1'
				},
				rules: {
          expression: [
            { required: true, message: '请输入表达式', trigger: 'blur' },            
          ],
          bizType: [
            { required: true, message: '请选择内容分类', trigger: 'change' }
          ],  
           useType: [
            { required: true, message: '请选择使用方式', trigger: 'change' }
          ], 
           actionType: [
            { required: true, message: '请选择接单动作', trigger: 'change' }
          ], 
           statusInt: [
            { required: true, message: '请选择账户状态', trigger: 'change' }
          ], 
        },
				dialogFormVisible:false,
				paramShow:false,
				loading: false,
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
			shade(){
				this.dialogFormVisible = true;
			},
			management(row){
				queryBizExpressionInfo({
				'expressionId': row.expressionId
				}).then(res => {
					res.data.actionType = res.data.actionType.toString()
					res.data.statusInt = res.data.statusInt.toString()
					res.data.useType = res.data.useType.toString()
					this.showData = res.data
					this.dialogFormVisible = true;
				})
			},
			close(formName) {
				 this.showData = {
					"actionType": '',					
					"bizType": '',
					"useType": '1',
					"expression": "",
					"statusInt": '1'
				};
				 this.$refs[formName].resetFields();
			},
			commit(formName) {						
				 this.$refs[formName].validate((valid) => {
          if (valid) {
            createBizExpression(this.showData).then(res => {
							if(res.statusCode !== 200) {
								this.$message({
									message: res.message,
									type: 'error'
								});
							} else {
								this.dialogFormVisible = false;
								this.$notify({
									title: '成功',
									duration: 1000,
									message: res.message,
									type: 'success',
									onClose: action => {
										this.addData()
									}
								});
							}
						}).catch(error => {
							// 处理 getJSON 和 前一个回调函数运行时发生的错误
							this.$router.push({
								path: '/login'
							})
						});
          } else {
            
            return false;
          }
        });

			},
			replacement(row){
				this.$confirm('此操作将删除该敏感词, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	removeBizExpression({'expressionId':row.expressionId}).then(res => {
					if(res.statusCode !== 200) {
						this.$message({
							message: res.message,
							type: 'error'
						});
					} else {
						this.$message({
							message: res.message,
							type: 'success'
						});
						this.addData()
					}
				}).catch(error => {
					// 处理 getJSON 和 前一个回调函数运行时发生的错误
					this.$router.push({
						path: '/login'
					})
				});         
        })
			},
			radioVal(val){
				if(val == 55){
					this.paramShow = true
				}else{
					this.paramShow = false;
					this.ruleForm.param = ''
				}
			},
			changeData() {
				this.addData()
			},
			clear() {
				this.addData()
			},
			addData() {
				this.loading = true;
				queryBizExpressionList(this.ruleForm).then(res => {
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
			queryBizType({
				
			}).then(res => {			
				this.queryBizType = res.data;
			})
		},
	}
</script>

<style scoped>
	
</style>