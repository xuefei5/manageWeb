<!--这是村模块新增的页面-->
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

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模块ID" style="display: none">
          <a-input v-model="form.id" disabled/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="村庄ID" style="display: none">
          <a-input v-model="form.villageId" disabled/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模块名称">
          <a-input placeholder="请输入模块名称" v-decorator.trim="[ 'modelName', validatorRules.modelName]" />
        </a-form-item>

        <a-form-item label="模块图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload ref="imageUpload" class="avatar-uploader" text="请上传图片" v-model="fileList"></j-image-upload>
        </a-form-item>

        <a-form-item label="详情描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input style="height: 325px;" v-decorator.trim="[ 'detail', validatorRules.detail]" type="textarea" />
          <!--plugins把图片和媒体去了-->
<!--
          <j-editor v-decorator="[ 'detail', validatorRules.detail ]" triggerChange plugins="lists link table textcolor wordcount contextmenu fullscreen"></j-editor>
-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选择排序">
          <a-select v-decorator.trim="[ 'modelSort', validatorRules.modelSort]" placeholder="请选择顺序">
            <!--艹，搞了半个小时，尽然value不允许为数字-->
              <a-select-option :value="modelSort+''" v-for="modelSort in 20" :key="modelSort">
              {{modelSort}}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>

    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import pick from 'lodash.pick'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import {postAction,getAction} from '@/api/manage'
  import JEditor from "../../../components/jeecg/JEditor";

  export default {
    name: "VillagesModel",
    components: {
      JEditor,
      JImageUpload,
    },
    data () {
      return {
        //基本属性
        drawerWidth:700,
        title:"操作",
        visible: false,
        model: {},
        fileList:[],
        fileListDis:false,
        sortLength:20,
        sortList:[],
        disableSubmit:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          modelName:{
            rules: [
              { required: true, message: '请输入模块名称!' },
              { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
            ]},
          modelSort:{
            rules: [
              { required: true, message: '请选择排序!',trigger: 'change'},
            ]},
          detail:{
            rules: [
              { required: true, message: '详情不允许为空!',trigger: 'blur'},
            ]}
        },
      }
    },
    //计算属性
    computed:{
    },
    //初始化
    mounted() {
    },
    created () {
    },
    methods: {
      edit (record) {
        this.form.resetFields();

        if(record.modelSort){
          record.modelSort = record.modelSort+'';
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'id','villageId','modelName','modelSort'))
        });
        //图片特殊处理
        if(this.model.modelImg){
          this.fileList = this.model.modelImg;
        }else{
          this.fileList = [];
        }

        //详情特殊处理
        if(this.model.id){
          this.getDetail();
        }

      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            formData.fileList = this.fileList;
            let obj;
            if(!this.model.id){
              formData.operType = "1";
            }else{
              formData.operType = "2";
            }
            obj = postAction('/acc/zknh_wechat_config/saveVillageModel',formData);
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
      getDetail(){
        let params = {};
        params['modelId'] = this.model.id;
        getAction('/acc/zknh_wechat_config/getModelDetail',params).then((res)=>{
          let code = res.code;
          if("200" == code){
            this.form.setFieldsValue({['detail']:res.result});
            this.form.detail = res.result;
          }
        });
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

</style>