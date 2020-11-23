<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="镇ID" style="display: none">
          <a-input v-model="form.id" disabled/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="镇名称">
          <a-input placeholder="请输入镇名称" v-decorator.trim="[ 'villageName', validatorRules.villageName]" />
        </a-form-item>

        <a-form-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload class="avatar-uploader" text="请上传图标" v-model="fileList" ></j-image-upload>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-select v-decorator.trim="[ 'sort', {}]" placeholder="请选择顺序">
            <a-select-option :value="item" v-for="item in 20" :key="item">
              {{item}}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import {postAction} from '@/api/manage'

  export default {
    name: "VillagesModel",
    components: {
      JImageUpload,
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        fileList:[],
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
          villageName:{
            rules: [
              { required: true, message: '请输入镇名称!' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ]},
          sort:{
            rules: [
              { required: true, message: '请选择排序!',trigger: 'change'},
            ]}
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'id','villageName','sort'))
        });
        //图片特殊处理

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            //设置类型为镇
            formData.villageType='1';
            let obj;
            console.log(formData)
            if(!this.model.id){
              obj=postAction('/acc/zknh_wechat_config/addVillages',formData);
            }else{
              obj=postAction('/acc/zknh_wechat_config/editVillages',formData);
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
      }

    }
  }
</script>

<style scoped>
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }

</style>