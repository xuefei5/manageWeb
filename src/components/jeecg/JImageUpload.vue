<template>
  <a-upload
    name="file"
    listType="picture-card"
    :multiple="isMultiple"
    :action="uploadAction"
    :headers="headers"
    :data="{biz:bizPath}"
    :fileList="fileList"
    :beforeUpload="beforeUpload"
    :disabled="disabled"
    :isMultiple="isMultiple"
    :showUploadList="isMultiple"
    @change="handleChange"
    @preview="handlePreview">
    <img v-if="!isMultiple && picUrl" :src="getAvatarView()" style="height:104px;max-width:300px"/>
    <div v-else >
      <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">{{ text }}</div>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel()">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </a-upload>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getFileAccessHttpUrl } from '@/api/manage'

  const uidGenerator=()=>{
    return '-'+parseInt(Math.random()*10000+1,10);
  }
  const getFileName=(path)=>{
    if(path.lastIndexOf("\\")>=0){
      let reg=new RegExp("\\\\","g");
      path = path.replace(reg,"/");
    }
    return path.substring(path.lastIndexOf("/")+1);
  }
  export default {
    name: 'JImageUpload',
    data(){
      return {
        uploadAction:window._CONFIG['domianURL']+"/acc/zknh_Image_upload/upload",
        uploadLoading:false,
        picUrl:false,
        headers:{
          contentType: false
        },
        fileList: [],
        previewImage:"",
        previewVisible: false,
      }
    },
    props:{
      text:{
        type:String,
        required:false,
        default:"上传"
      },
      /*这个属性用于控制文件上传的业务路径*/
      bizPath:{
        type:String,
        required:false,
        default:"temp"
      },
      value:{
        type:[String,Array],
        required:false
      },
      disabled:{
        type:Boolean,
        required:false,
        default: false
      },
      isMultiple:{
        type:Boolean,
        required:false,
        default: false
      }
    },
    watch:{
      value:{
        immediate:true,
          handler:function(val){
            if (val instanceof Array) {
              this.initFileList(val.join(','))
            } else {
              this.initFileList(val)
            }
            if(!val || val.length==0){
              this.picUrl = false;
            }
        }
      }
    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    methods:{
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
        this.picUrl = false;
        this.uploadLoading = true;
        let fileList = info.fileList

        if(info.file.status==='done'){
          if(info.file.response.success){
            this.picUrl = true;
            fileList = fileList.map((file) => {
              if (file.response) {
                file.url = file.response.message;
              }
              this.uploadLoading = false;
              return file;
            });
          }
          //this.$message.success(`${info.file.name} 上传成功!`);
        }else if (info.file.status === 'error') {
          this.uploadLoading = false;
          this.$message.error(`${info.file.name} 上传失败.`);
        }else if(info.file.status === 'removed'){
          this.uploadLoading = false;
          this.handleDelete(info.file)
        }
        this.fileList = fileList
        if(info.file.status==='done' || info.file.status === 'removed'){
          this.uploadLoading = false;
          this.handlePathChange()
        }
      },
      // 预览
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      getAvatarView(){
        if(this.fileList.length>0){
          let url = this.fileList[0].url
          return getFileAccessHttpUrl(url)
        }
      },
      handlePathChange(){
        let uploadFiles = this.fileList
        let path = ''
        if(!uploadFiles || uploadFiles.length==0){
          path = ''
        }
        let arr = [];
        if(!this.isMultiple){
          arr.push(uploadFiles[uploadFiles.length-1].response.message)
        }else{
          for(let a=0;a<uploadFiles.length;a++){
            // update-begin-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
            if(uploadFiles[a].status === 'done' ) {
              arr.push(uploadFiles[a].response.message)
            }else{
              return;
            }
            // update-end-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
          }
        }
        if(arr.length>0){
          path = arr.join(",")
        }
        this.$emit('change', path);
      },
      handleDelete(file){
        //如有需要新增 删除逻辑
        console.log(file)
      },
      handleCancel() {
        this.close();
        this.previewVisible = false;
      },
      close () {

      },
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>

<style scoped>

</style>