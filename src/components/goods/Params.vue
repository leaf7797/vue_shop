<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

       <!-- 卡片视图区域 -->
       <el-card>
            <!-- 警告区域 -->
            <el-alert show-icon
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning" :closable="false">
            </el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                     <el-cascader
                        v-model="selectedCateKeys"
                        :options="catelist"
                        expand-trigger="hover"
                        :props="cateProps"
                        @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- tab页签区域 -->
             <el-tabs v-model="activeName" @tab-click="handleTabClick">
                 <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <!-- eslint-disable-next-line -->
                            <template slot-scope="scope">
                                <!-- 索引列 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性</el-button>
                     <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <!-- eslint-disable-next-line -->
                            <template slot-scope="scope">
                                <!-- 索引列 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

       </el-card>

        <!-- 添加参数的对话框 -->
       <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <!-- 添加参数的对话框 -->
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

        <!-- 修改参数的对话框 -->
       <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <!-- 添加参数的对话框 -->
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
            // 商品分类列表
            catelist:[],
            // 级联选择框的配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys:[],
            // 被激活的页签的名称
            activeName:'many',
            // 动态参数的数据
            manyTableData:[],
            // 静态参数的数据
            onlyTableData:[],
            // 控制添加对话框的显示与隐藏
            addDialogVisible:false,
            // 添加参数的表单数据对象
            addForm:{
                attr_name:''
            },
            // 添加表单的验证规则对象
            addFormRules:{
                attr_name:[
                    {required:true, message:'请输入参数名称', trigger:'blur'}
                ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible:false,
            // 修改的表单数据对象
            editForm:{},
            // 修改表单的验证规则对象
            editFormRules:{
                attr_name:[
                    {required:true, message:'请输入参数名称', trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取所有的商品分类列表
        async getCateList(){
            const{data:res} = await this.$http.get('categories')
             if(res.meta.status !== 200){
                return this.$message.error('获取商品分类失败!')
            }
            this.catelist = res.data
            console.log(this.catelist)
        },
        // 级联选择框选中项变化会触发这个函数
        async handleChange(){
           this.getParamsData()
        },
        // tab页签的点击事件处理函数
        handleTabClick(){
            console.log(this.activeName)
            this.getParamsData()
        },
        // 获取参数的列表数据
       async  getParamsData(){
            // 证明选中的不是三级分类
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return 
            }

            // 证明选中的是三级分类
            console.log(this.selectedCateKeys)
            // 根据所选分类的Id，和当时所处的面板，获取对应的参数
            const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:this.activeName}
            })

            if(res.meta.status !== 200){
                return this.$message.error('获取参数列表失败!')
            }
            console.log(res.data)
            if(this.activeName === 'many'){
                this.manyTableData = res.data
            }else{
                this.onlyTableData = res.data
            }
       },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const{data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })

                if(res.meta.status !== 201){
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
                this.addDialogVisible = false
                this.getParamsData()
            })

        },
        // 展示按钮，添加参数
        async showEditDialog(attr_id){
            // 查询当前参数的信息
            const{data:res} =await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                params:{attr_sel:this.activeName}
            })

             if(res.meta.status !== 200){
                return this.$message.error('获取参数信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 重置修改的表单
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮修改参数信息
        // 点击按钮，修改参数信息
        editParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                { attr_name: this.editForm.attr_name, attr_sel: this.activeName })

                if (res.meta.status !== 200) {
                return this.$message.error('修改参数失败！')
                }

                this.$message.success('修改参数成功！')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },

        // 根据Id删除对应的参数项
        async removeParams(attr_id){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)

            // 用户取消了删除的操作
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消操作！')
            }

            // 删除的业务逻辑
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败！')
            }

            this.$message.success('删除参数成功')
            this.getParamsData()
            }
       

    },
    computed:{
        isBtnDisable(){
            if(this.selectedCateKeys.length !== 3){
                return true
            }
            return false
        },
        // 当前选中的三级分类的Id
        cateId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        titleText(){
            if(this.activeName === 'many'){
                return '动态参数'
            }
            return '静态属性'
        }

    }

}
</script>

<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
</style>