<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: 100%;overflow: auto;padding-bottom: 53px;">

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>

    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="模块名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入模块名称" v-decorator.trim="[ 'modalName', validatorRules.modalName]" />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--1-20选择-->
          <a-select   v-decorator.trim="[ 'sort', validatorRules.sort]"  placeholder="请选择,默认1">
            <a-select-option v-for = 'item in list' :value="item">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="链接方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--1、内部链接、2.外部链接-->
          <a-select v-decorator.trim="[ 'modalType', validatorRules.modalType]"   placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="1">1.内部链接</a-select-option>
            <a-select-option value="2">2.外部链接</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模块状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--1、生效、2.失效-->
          <a-select v-decorator.trim="[ 'status', validatorRules.status]"   placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="1">1.生效</a-select-option>
            <a-select-option value="2">2.失效</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="链接地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入链接地址" v-decorator.trim="[ 'modalUrl', validatorRules.modalUrl]" />
        </a-form-item>
       <!-- 图标上传按钮-->
        <a-form-item label="图片上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-upload
          :action="uploadAction"
          :headers="headers"
          list-type="picture"
          :multiple="false"
          :file-list="fileList"
          @change="handleChange"
          v-decorator.trim="[ 'modalIcon', validatorRules.modalIcon]"
        >
          <a-button> <a-icon type="upload" /> 上传图标 </a-button>
        </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import pick from 'lodash.pick'
  import Vue from 'vue'
  import {getAction, getFileAccessHttpUrl, postAction} from '@/api/manage'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "IndexManageModal",
    data () {
      return {
        list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        uploadAction:window._CONFIG['domianURL']+"/acc/zknh_Image_upload/upload",
        uploadLoading:false,
        picUrl:false,
        headers:{
          contentType: false
        },

        previewImage:"",
        previewVisible: false,
        modalWidth:800,
        drawerWidth:700,
        disableSubmit:false,
        fileList: [],
        validatorRules:{
          modalName:{
            rules: [{
              required: true, message: '请输入模块名称!'
            }]
          },
          modalType:{
            rules: [{
              required: true, message: '请选择链接方式!'
            }]
          },
          status:{
            rules: [{
              required: true, message: '请选择模块状态!'
            }]
          },
          sort:{
            rules: [{
              required: true, message: '请输入模块优先级!'
            }]
          },
          modalUrl:{
            rules: [{
              required: true, message: '请输入链接地址!'
            }]
          }
        },
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form:this.$form.createForm(this),
      }
    },
    computed:{
    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    methods: {
      //窗口最大化切换
      toggleScreen(){
        if(this.modaltoggleFlag){
          this.modalWidth = window.innerWidth;
        }else{
          this.modalWidth = 800;
        }
        this.modaltoggleFlag = !this.modaltoggleFlag;
      },
      refresh () {
      },
      initFileList(paths){
        if(!paths || paths.length==0){
          this.fileList = [];
          return;
        }
        this.picUrl = true;
        let fileList = [];
        let arr = paths.split(",")
        for(var a=0;a<arr.length;a++){
          let url = getFileAccessHttpUrl(arr[a]);
          fileList.push({
            uid: uidGenerator(),
            name: getFileName(arr[a]),
            status: 'done',
            url: url,
            response:{
              status:"history",
              message:arr[a]
            }
          })
          console.log(fileList);
        }
        this.fileList = fileList
      },
      beforeUpload: function(file){
        console.log("ceshi"+file);
        var fileType = file.type;
        var le500k =file.size/1024 < 500;
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片');
          return false;
        }
        if(!le500k){
          this.$message.warning('上传图片大小不能超过 500k');
          return false;
        }
      },
      handleChange(info) {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        fileList = fileList.slice(-1);
        // 2. read from response and show file link
        fileList = fileList.map(file => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });

        this.fileList = fileList;
      },
      add () {
        this.refresh();
        this.edit({activitiSync:'1'});
      },
      edit (record) {
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        let that = this;
        that.form.resetFields();
        that.visible = true;
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model,'id','modalName','modalType','modalIcon','iconType','modalUrl','sort','status'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
      },
      handleSubmit () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            var aaa = this.fileList.length;
            console.log(aaa)
            if(aaa != 0){
              let validDate =this.fileList[0].name;
              formData['modalIcon']= validDate;
            }
            let obj;
            if(!this.model.id){
              //添加
              obj=postAction("/acc/zknh_wechat_config/addModule",formData);
            }else{
              //修改
              obj=postAction("/acc/zknh_wechat_config/editModule",formData);
            }
            console.log(obj);
            obj.then((res)=>{
              console.log("11"+res);
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                console.log("11"+res);
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      }
    }
  }
</script>

<style scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
/* tile uploaded pictures */
.upload-list-inline >>> .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline >>> .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline >>> .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}
</style>