<!--模块列表-->
<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="模块名称">
              <j-input placeholder="输入模块名称模糊查询" v-model="queryParam.modelName"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="myHandleAdd" type="primary" icon="plus">增加模块</a-button>
    </div>
    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-dropdown placement="topCenter">
              <a-avatar style="" shape="square" :src="getAvatarView(record.modelImg)" icon="user"/>
              <a-menu slot="overlay">
                <a-menu-item>
                  <img style="height: 10rem;width: 20rem" :src="getAvatarView(record.modelImg)"/>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <village-model-model ref="modalForm" @ok="modalFormOk"></village-model-model>
  </div>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JInput from '@/components/jeecg/JInput'
  import JSuperQuery from '@/components/jeecg/JSuperQuery'
  import VillageModelModel from "./VillageModelModel";
  import {getFileAccessHttpUrl} from '@/api/manage';
  import {mapState} from "vuex";

  export default {
    name: "VillageDetailModelList",
    mixins: [JeecgListMixin],
    components: {
      VillageModelModel,
      JInput,
      JSuperQuery
    },
    data() {
      return {
        queryParam: {
          //暂时写死，其实是需要父级页面传进来的
          villageId:''
        },
        columns: [
          {
            title: '模块ID',
            align: "center",
            dataIndex: 'id',
            width: 120,
            sorter: true,
            ellipsis:true
          },
          {
            title: '模块名称',
            align: "center",
            width: 100,
            dataIndex: 'modelName',
          },
          {
            title: '模块头图片',
            align: "center",
            width: 120,
            dataIndex: 'modelImg',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: '展示顺序',
            align: "center",
            width: 50,
            dataIndex: 'modelSort',
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 50
          }

        ],
        url: {
          list: "/acc/zknh_wechat_config/queryVillageModel",
          delete: "/acc/zknh_wechat_config/deleteVillageModel",
        },
      }
    },
    mounted() {
    },
    computed:{
      ...mapState(['villageInfo'])
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar);
      },
    myHandleAdd: function () {
      this.$refs.modalForm.edit({'villageId':this.queryParam.villageId});
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },
      myCustomize(){
        this.queryParam.villageId = this.villageInfo.villageId;
      }
    }
  }
</script>

<style scoped>
  .anty-img-wrap{height:25px;position: relative;}
  .anty-img-wrap > img{max-height:100%;}
</style>