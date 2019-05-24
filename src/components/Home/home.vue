<template>
	<el-container>
		<el-header class="header" height='80px'>
			<el-row>
				<el-col :span="24">
					<div class="">
						<el-col :span="3" class="logo">
							VUEADMIN
						</el-col>
						<el-col :span="18" class="">
							<div class="bander">
								<img src="../../assets/bander.jpg" />
							</div>
						</el-col>
						<el-col :span="3" class="userinfo">
							<el-dropdown :hide-on-click="false">
								<span class="el-dropdown-link">
					            欢迎登录：{{username}}
					    <i class="el-icon-arrow-down el-icon--right"></i>
					  </span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item @click.native.prevent="logout">退出登录</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</el-col>

					</div>
				</el-col>
			</el-row>
		</el-header>
		<el-container>
			<el-aside :class="isCollapse?'logo-width':'logo-collapse-width'">							
					<div class="triggle fade-enter-active" ref='triggle' @click="triggle()">
						<i class="el-icon-d-arrow-left"  v-if="!isCollapse"></i>
						<i class="el-icon-d-arrow-right" v-if="isCollapse"></i>
					</div>			
				<el-menu :default-active="routePath" :router="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-s-platform"></i>
							<span slot="title">工作台</span>
						</template>
						<el-menu-item-group>
							<el-menu-item index="/order">订单失败</el-menu-item>
							<!--<el-menu-item index="/auditing">审核发送</el-menu-item>-->
							<el-menu-item index="/detail">用户发送明细</el-menu-item>
							<el-menu-item index="/user_count">用户发送统计</el-menu-item>
							<el-menu-item index="/template">模板申请</el-menu-item>
						</el-menu-item-group>						
					</el-submenu>
					<el-submenu index="2">
						<template slot="title">
							<i class="el-icon-s-custom"></i>
							<span slot="title">用户管理</span>
						</template>
						<el-menu-item-group>
							<el-menu-item index="/user_manage">用户列表</el-menu-item>							
							<el-menu-item index="/operation_list">运维列表</el-menu-item>
						</el-menu-item-group>						
					</el-submenu>
					<el-submenu index="3">
						<template slot="title">
							<i class="el-icon-setting"></i>
							<span slot="title">订单管理</span>
						</template>
						<el-menu-item-group>
							<el-menu-item index="/order_manage">订单列表</el-menu-item>							
							<el-menu-item index="/order_list">详单列表</el-menu-item>
						</el-menu-item-group>						
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>	
				<transition name="fade" mode="out-in">
					<router-view></router-view>
				</transition>					
			</el-main>
		</el-container>
	</el-container>
</template>
<script>
	export default {
		data() {
			return {
				username: '',
				isCollapse: false,
				routePath:'/order'
			};
		},
		mounted: function() {
			let $this = this;
			let user = JSON.parse(sessionStorage.getItem('user'));
			//console.log(this.$route.path)
			this.routePath = this.$route.path;
			if(!user) {
				$this.showname = false
			} else {
				$this.showname = true
				$this.username = user.userInfo.loginName
			}

		},
		methods: {

			logout() {
				this.$router.push({
					path: '/login'
				})
			},
			triggle(e){
				if(this.isCollapse){
					this.$refs.triggle.style.width = '100%'
					this.isCollapse = false
				}else{
					this.$refs.triggle.style.width = '65px'
					this.isCollapse = true
				}
			},
			handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
      }
		}
	}
</script>
<style scoped>
	.header {
		padding: 0px;
		height: 100px;
		background-color: #20a0ff
	}
	
	.el-menu-demo {
		height: 80px;
	}
	
	.el-menu--horizontal>.el-menu-item {
		height: 80px;
		line-height: 80px;
		font-weight: bold;
		font-size: 16px;
	}
	
	.logo {
		color: #FFFFFF;
		font-weight: bold;
		font-size: 28px;
		height: 80px;
		line-height: 80px;
		padding-left: 20px;
	}
	.logo-width{
				width:65px !important;
			}
	.logo-collapse-width{
				width:220px !important;
				background: #fff;
			}
	.el-dropdown-link {
		cursor: pointer;
		color: #fff;
	}
	.el-menu{
		border: none;
	}
	.el-dropdown {
		height: 80px;
		line-height: 80px;
	}
	
	.el-icon-arrow-down {
		font-size: 12px;
	}
	
	.bander img {
		width: 100%;
		height: 80px;
	}
	.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 218px;
    min-height: 846px;
    height: 94%;
  }
	.userinfo {
		text-align: center;
	}
	.triggle{
		display: inline-block;
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #fff;
    border-radius: 5px;
    margin: 10px 0;
	}
	.triggle:hover{
		background: #20a0ff;
		color: #fff;
	}
</style>