<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left"  class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username" label="账户">
      <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="code" label="动态验证码">
      <el-input type="text" v-model="ruleForm2.code" auto-complete="off" placeholder="验证码"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;text-align: center;">
      <el-button type="primary" native-type="submit"  @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <el-button @click.native.prevent="handleReset2">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          username: '',
          password: '',
          code:''
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },        
      };
    },
    methods: {
      handleReset2() {
        //this.$refs.ruleForm2.resetFields();
        this.$router.push({ path: '/register' });       
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {         	
            //_this.$router.replace('/table');
            this.logining = true;    
            //NProgress.start();
            //var loginParams = { username: this.ruleForm2.username, password: this.ruleForm2.password };
            requestLogin(this.ruleForm2).then(res => {
              this.logining = false;
              //console.log(data)             
              if (res.statusCode !== 200) {
                this.$message({
                  message: res.message,
                  type: 'error'
                });
              } else {
                sessionStorage.setItem('user', JSON.stringify(res.data));
                sessionStorage.setItem('token', res.data.Authorization);
                this.$router.push({ path: '/order' });
              }
            });
          } else {
            //console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>
<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 350px;
    position: absolute;
   	top: 50%;   	
   	left: 50%;
   	transform: translate(-50%,-50%);
    padding: 12px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    
  }
  .login-container .title {
      margin: 0px auto 10px auto;
      text-align: center;
      color: #505458;
    }
    .login-container .remember {
      margin: 0px 0px 35px 0px;
    }
    .el-form-item{
    	margin-bottom:15px
    }
</style>