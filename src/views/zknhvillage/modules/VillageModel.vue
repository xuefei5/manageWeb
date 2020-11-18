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

        <a-form-item label="商品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入商品名称" v-decorator.trim="[ 'offerName', validatorRules.offerName]" :readOnly="!!model.id"/>
        </a-form-item>

        <a-form-item label="商品描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea placeholder="请输入商品描述(例如：【产自云南】很甜很过瘾)" v-decorator.trim="[ 'offerDesc', validatorRules.offerDesc]" :readOnly="!!model.id"/>
        </a-form-item>

        <a-form-item label="商品类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!--1、准旗特产2、绿色蔬菜3、水果4、米面粮油5、肉禽蛋类6、休闲食品7、酒水饮料8、副食调料9、农品供应-->
          <a-select v-decorator.trim="[ 'offerType', validatorRules.offerType]" :readOnly="!!model.id" placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="1">准旗特产</a-select-option>
            <a-select-option value="2">绿色蔬菜</a-select-option>
            <a-select-option value="3">水果</a-select-option>
            <a-select-option value="4">米面粮油</a-select-option>
            <a-select-option value="5">肉禽蛋类</a-select-option>
            <a-select-option value="6">休闲食品</a-select-option>
            <a-select-option value="7">酒水饮料</a-select-option>
            <a-select-option value="8">副食调料</a-select-option>
            <a-select-option value="9">农品供应</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="商品价格(￥)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :default-value="58"
            :precision="2"
            v-decorator="['offerPrice', validatorRules.offerPrice]"
          />
        </a-form-item>

        <a-form-item label="生失效时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker v-decorator="['offer_time_ve', validatorRules.offerTime]" />
        </a-form-item>

        <!--<a-form-item label="图片上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            action=""
            list-type="picture-card"
            :file-list="fileList"
          >
            <div v-if="fileList.length < 8">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>-->


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
  import { getAction,postAction } from '@/api/manage'

  export default {
    name: "IndexManageModal",
    data () {
      return {
        modalWidth:800,
        drawerWidth:700,
        disableSubmit:false,
        validatorRules:{
          offerName:{
            rules: [{
              required: true, message: '请输入商品名称!'
            }]
          },
          offerDesc:{
            rules: [{
              required: true, message: '请输入商品描述!'
            }]
          },
          offerType:{
            rules: [{
              required: true, message: '请选择商品类型!'
            }]
          },
          offerPrice:{
            rules: [{
              required: true, message: '请输入商品价格!'
            }]
          },
          offerTime:{
            rules: [{
              required: true, message: '请选择生失效时间!'
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
        let offer_time_ve = [];
        offer_time_ve.push(record.validDate);
        offer_time_ve.push(record.expireDate);
        this.model.offer_time_ve = offer_time_ve;
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model,'offerId','offerName','offerDesc','offerType','offerPrice','offer_time_ve'))
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
            let validDate = values.offer_time_ve[0];
            if(validDate){
              formData.validDate = validDate.format(this.dateFormat);
            }
            let expireDate = values.offer_time_ve[1];
            if(expireDate){
              formData.expireDate = expireDate.format(this.dateFormat);
            }
            let obj;
            if(!this.model.offerId){
              //添加
              obj=postAction("/offer/offer/add",formData);
            }else{
              //修改
              obj=postAction("/offer/offer/edit",formData);
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
</style>