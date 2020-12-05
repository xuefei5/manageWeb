<!--这是村和镇新增的页面-->
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

        <a-form-item :label="villageNameForLable" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入名称" v-decorator.trim="[ 'villageName', validatorRules.villageName]" />
        </a-form-item>
        <a-form-item label="村庄简介" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="villageType !=1 ">
          <a-textarea placeholder="请输入村庄简介" v-decorator.trim="[ 'villageContent', validatorRules.villageContent]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上级镇ID" style="display: none">
          <a-input v-model="form.villageParentId" disabled/>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--1-20选择-->
          <a-select   v-decorator.trim="[ 'sort', validatorRules.sort]"  placeholder="请选择">
            <a-select-option v-for = 'item in list' :value="item" :key="item">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="iconForLable" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload ref="imageUpload" class="avatar-uploader" text="请上传图片" v-model="fileList"></j-image-upload>
        </a-form-item>
        <a-form-item label="村模块置顶图片" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="villageType !=1 ">
          <j-image-upload ref="imageUpload" class="avatar-uploader" text="请上传图片" v-model="fileList1"></j-image-upload>
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
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import {getAction, getFileAccessHttpUrl, postAction} from '@/api/manage'
  import {ACCESS_TOKEN} from "@/store/mutation-types";
  import Vue from 'vue'
  import JEditor from "@comp/jeecg/JEditor";
  export default {
    name: "VillageModal",
    components: {
      JEditor,
      JImageUpload,
    },
    data () {
      return {
        list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        uploadAction:window._CONFIG['domianURL']+"/acc/zknh_Image_upload/upload",
        uploadLoading:false,
        picUrl:false,
        fileList: [],
        fileList1: [],
        form: this.$form.createForm(this),//获取上级镇id
        villageType:'',//获取村镇
        villageParentId:'',//获取上级镇id
        headers:{
          contentType: false
        },
        previewImage:"",
        previewVisible: false,
        modalWidth:800,
        drawerWidth:700,
        disableSubmit:false,
        validatorRules:{
          villageName:{
            rules: [{
              required: true, message: '请输入村/镇名称!'
            }]
          },
          villageContent:{
            rules: [{
              required: false, message: '请输入村庄简介（如果是“镇”则不需要填写）!'
            }]
          }
         /* villageParentId:{
            rules: [{
              required: false, message: '如果新增是“村”时，必填，为上级镇id!'
            }]
          }*/
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
      }
    },
    computed:{
      villageNameForLable(){
        if(this.villageType == '1'){
          return "镇名称";
        }else{
          return "村名称";
        }

      },
      iconForLable(){
        if(this.villageType == '1'){
          return "镇图标";
        }else{
          return "村图标";
        }
      }
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
      beforeUpload: function(file){
        console.log("ceshi"+file);
        var fileType = file.type;
        var le2M =file.size/1024/1024 < 2;
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片');
          return false;
        }
        if(!le2M){
          this.$message.warning('上传图片大小不能超过 2M');
          return false;
        }
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
          that.form.setFieldsValue(pick(this.model,'villageName','villageContent','sort','id'))
        });
        //图片特殊处理
        if(this.model.villageMainImg){
          this.fileList1 = this.model.villageMainImg;
        }else{
          this.fileList1 = [];
        }
        if(this.model.villageBack){
          this.fileList = this.model.villageBack;
        }else{
          this.fileList = [];
        }
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
            //图片1的文件名
            formData.villageBack = this.fileList;//把获取到的图片名称放到villageBack
          //图片2的文件名
            formData.villageMainImg = this.fileList1;//把获取到的图片名称放到villageMainImg
          //获取上级镇id
            let villageType = this.villageType;
            console.log("villageType="+villageType);
            if(villageType == '1'){
              formData['villageType']= villageType;
            }else{
              formData['villageType']= '2';
            }
            let villageParentId = this.villageParentId;
            console.log("villageParentId="+villageParentId);
            if(villageParentId != '' ||villageParentId != null){

              formData['villageParentId']= villageParentId;

            }
            let obj;
            if(!this.model.id){
              //添加
              obj=postAction("/acc/zknh_wechat_config/addVillage",formData);
            }else{
              //修改
              obj=postAction("/acc/zknh_wechat_config/editVillage",formData);
            }
            obj.then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
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
.avatar-uploader > .ant-upload {
  width:104px;
  height:104px;
}
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