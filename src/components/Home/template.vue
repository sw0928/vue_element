<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" label-position="top" size="small">
				<el-form-item label="模板ID">
					<el-input type="text" v-model="ruleForm.templateId" auto-complete="off" placeholder="请输入" @clear="clear" clearable></el-input>
				</el-form-item>
				<el-form-item label="申请用户">
					<el-input type="text" v-model="ruleForm.loginName" auto-complete="off" placeholder="请输入" @clear="clear" clearable></el-input>
				</el-form-item>
				<el-form-item label="模版内容">
					<el-input type="text" v-model="ruleForm.templateSms" auto-complete="off" placeholder="请输入"  @clear="clear" clearable></el-input>
				</el-form-item>
				<el-form-item label="审核状态">
					<el-select v-model="ruleForm.review" placeholder="请选择审核状态" @change="review" clearable>
						<el-option label="待审核" value="0"></el-option>
						<el-option label="已通过" value="1"></el-option>
						<el-option label="已拒绝" value="2"></el-option>
						<el-option label="试用中" value="-1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class='seach'>
					<el-button type="primary" @click="getTableList">查询</el-button>
					<el-button type="primary" icon="el-icon-folder-opened" @click="shade">申请</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-table v-loading="loading"  :data="tableData" tooltip-effect="light" border style="width: 100%">
			<el-table-column fixed prop="templateId" label="模版ID" width="100">
			</el-table-column>
			<el-table-column prop="loginName" label="申请用户" width="100">
			</el-table-column>
			<el-table-column prop="templateType" label="模版分类	" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.templateType == 1">行业短信</span>
					<span v-else>营销短信</span>
				</template>
			</el-table-column>
			<el-table-column label="模版内容" width="">
				<template slot-scope="scope">
					<el-tooltip :content="scope.row.templateSms" placement="top"  effect="light">
					  <span class="omit">{{scope.row.templateSms}}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="备注" width="">
				<template slot-scope="scope">
					<el-tooltip :content="scope.row.remark" placement="top"  effect="light">
					  <span class="omit">{{scope.row.remark}}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column  label="批注" width="">
				<template slot-scope="scope">
					<el-tooltip :content="scope.row.auditMark" placement="left"  effect="light">
					  <span class="omit">{{scope.row.auditMark}}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="时间" width="180">
			</el-table-column>
			<el-table-column prop="review"  label="审核状态" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.review == 1" style="color:#67C23A">已通过<span class="circle"></span></span>
					<span v-if="scope.row.review == -1" style="color:#909399">试用中<span class="circle"></span></span>
					<span v-if="scope.row.review == 0" style="color:#E6A23C">待审核<span class="circle"></span></span>
					<span v-if="scope.row.review == 2" style="color:#F40000">已拒绝<span class="circle"></span></span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="100">
				<template slot-scope="scope">
					<el-button v-if="scope.row.review == 0" @click="handleClick(scope.row)" type="primary" size="small">审核</el-button>
					<el-button v-else type="primary" @click="handleClick(scope.row)" size="small">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[10,100, 200, 300, 400]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<el-dialog title="申请模版" :visible.sync="dialogFormVisible" @close='close' width ="875px">
			<el-form :inline="true" label-position="top" size="small" :model="showData">
				<p class="improColor">
					* 需要更改的地方请先选中，后点击下发的A按钮选择红色； 需要取消标记的地方请先选中，后点击删除文字格式按钮
				</p><br>
				<el-form-item label="模板内容" style='width: 98.6%;height: 190px;'>
					<div class="edit_container">
						<quill-editor v-model="showData.modWord" ref="myQuillEditor" class="editer" :options="editorOption" @change="onEditorChange($event)" @ready="onEditorReady($event)">
						</quill-editor>
					</div>
				</el-form-item>
				<el-form-item label="模板分类">
					<el-select v-model="showData.templateType" placeholder="请选择模板分类">
						<el-option label="行业短信" value="1"></el-option>
						<el-option label="营销短信" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="申请人">
					<el-autocomplete class="inline-input" v-model="state1" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" @clear="searchValue" clearable></el-autocomplete>
				</el-form-item>
				<el-form-item label="挂机模版">
					<el-radio-group v-model="resource" @change="changeResource">
						<el-radio label="是"></el-radio>
						<el-radio label="否"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="号码">
					<el-input type="text" v-model="showData.miguMobile" auto-complete="off" placeholder="请输入" :disabled='disabled' clearable></el-input>
				</el-form-item>
				<el-form-item label="备注" style='width: 98.6%;'>
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="showData.remark" placeholder="请输入"></el-input>
				</el-form-item>
				<p class="improColor">
					* 模板内容请填写真实的发送内容，然后将要变化的部分标记成红色 （不要用*#之类的符号来表示要变化的内容），如有需要特别申明的请写在备注中
				</p><br>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button v-show="reviewShow == 1" type="primary" @click="commit">确 定</el-button>
				<el-button v-show="reviewShow == 0" type="primary" @click="refuse">拒 绝</el-button>
			</div>
		</el-dialog>
		<el-dialog title="拒绝原因" :visible.sync="dialogFormVisibleTwo" @close='closeB' width ="30%">
			<el-form :inline="true" label-position="top" size="small" :model="showRefuse">								
				<el-form-item label="原因">
					<el-select v-model="showRefuse.audit" placeholder="请选择原因">
						<el-option label="营销类内容" value="营销类内容"></el-option>
						<el-option label="模板内容格式不对" value="模板内容格式不对"></el-option>
						<el-option label="模板已存在" value="模板已存在"></el-option>
					</el-select>
				</el-form-item>												
				<el-form-item label="补充说明" style='width: 100%;'>
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="showRefuse.remark" placeholder="请输入"></el-input>
				</el-form-item>				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleTwo = false">取 消</el-button>
				<el-button type="primary" @click="refuseSim">确 定</el-button>
			</div>
		</el-dialog>
	</section>

</template>

<script>
	import { quillEditor } from 'vue-quill-editor' //调用编辑器
	import { templateApplyList, templateApply, templateApplyInfo,repulseTemplateApply, queryUserName } from '../../api/api';
	export default {
		data() {
			return {
				tableData: null,
				editorOption: {
					modules: {
						toolbar: [
							//['color', 'clean'] // toggled buttons
							[{
								'color': ['#f40000', 'blue']
							}, 'clean'],
						]
					}
				},
				ruleForm: {
					"loginName": '',
					"review": '',
					"offset": 1,
					"pageSize": 10,
					"templateId": "",
					"templateSms": ""
				},
				showRefuse:{
					'auditMark':'',
					'audit':'',
					'templateId':'',
					'remark':''
				},
				showData: {
					'userId': "",
					'miguMobile': '',
					'modWord': "",
					'remark': '',
					'templateSms': "",
					'templateType': "1"
				},
				loading: false,
				dialogFormVisible: false,
				reviewShow:1,
				dialogFormVisibleTwo:false,
				editorContent: '',
				disabled: true,
				resource: '是',
				restaurants: [],
				state1: '',
				currentPage: 1,
				total: 0
			}

		},
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill
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
			clear(){
				this.addData()
			},
			onEditorReady(editor) {},
			close() {
				this.showData = {
					'userId': "",
					'miguMobile': '',
					'modWord': "",
					'remark': '',
					'templateSms': "",
					'templateType': "1"
				};

				this.disabled = true
				this.resource = '是'
			},
			closeB(){
				this.showRefuse.audit = ''
				this.showRefuse.remark = ''
			},
			refuse(){
				this.dialogFormVisibleTwo = true;				
			},
			refuseSim(){
				this.showRefuse.auditMark = this.showRefuse.audit +";" + this.showRefuse.remark;
				repulseTemplateApply(this.showRefuse).then(res => {
					if(res.statusCode !== 200) {
						this.$message({
							message: res.message,
							type: 'error'
						});
					} else {
						this.dialogFormVisibleTwo = false;
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
			},
			onEditorChange(data) {
				//console.log(data)
				this.showData.templateSms = data.text
			}, // 内容改变事件
			review() {
				this.addData()
			},
			searchValue() {
				this.ruleForm.userName = ''
			},
			changeData() {
				this.addData()
			},
			changeResource(val) {
				//	console.log(val)
				if(val == '否') {
					this.disabled = false
				} else {
					this.disabled = true
				}
			},
			commit() {				
				let str = this.showData.templateSms;
				this.showData.templateSms = str.substr(0, str.length - 1);
				if(this.showData.miguMobile == '' || this.showData.miguMobile == null) {
					
				} else {
					if(!(/^1[34578]\d{9}$/.test(this.showData.miguMobile))) {
						this.$message({
							message: "手机号码有误，请重填",
							type: 'error'
						});
						return false;
					}
				}
				templateApply(this.showData).then(res => {
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
			},
			shade() {
				this.dialogFormVisible = true;
				this.reviewShow = 1;
			},
			handleClick(row) {
				
				this.reviewShow = row.review;
				this.dialogFormVisible = true;
				templateApplyInfo({
					"templateId": row.templateId
				}).then(res => {
					if(res.statusCode !== 200) {
						this.$message({
							message: res.message,
							type: 'error'
						});
					} else {
						this.showData = {
							'userId': res.data.userId,
							'miguMobile': res.data.miguMobile,
							'modWord': res.data.modWord,
							'remark': res.data.remark,
							'templateSms': res.data.templateSms,
							'templateType': res.data.templateType.toString()
						}
						this.state1 = res.data.loginName
						this.showRefuse.templateId = res.data.templateId
					}
				}).catch(error => {
					// 处理 getJSON 和 前一个回调函数运行时发生的错误
					this.$router.push({
						path: '/login'
					})
				});
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
					this.showData.userId = ''
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
					this.showData.userId = ''
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
				this.showData.userId = item.userId
			},
			addData() {
				this.loading = true;
				templateApplyList(this.ruleForm).then(res => {
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
		components: {
			//使用编辑器
			quillEditor
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
	.quill-editor {
		height: 100px;
	}
</style>