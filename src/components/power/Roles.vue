<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区 -->
            <el-row>
                <el-col>
                    <el-button type="primary">
                        添加角色
                    </el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //所有觉得列表数据
            rolelist:[]
        }
    },
    created(){
        this.getRolesList()       
    },
    methods:{
        async getRolesList(){
            const{data:res} = await this.$http.get('roles')
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败')
            }
            this.rolelist = res.data
            console.log(this.rolelist)
        }
    }  
}
</script>

<style lang="less" scoped>

</style>