<!--镇列表-->
<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="镇名称">
              <j-input placeholder="输入镇名称模糊查询" v-model="queryParam.villageName"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary"  @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="myHandleAdd" type="primary" icon="plus">添加镇</a-button>
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
              <a-avatar style="" shape="square" :src="getAvatarView(record.villageBack)" icon="user"/>
              <a-menu slot="overlay">
                <a-menu-item>
                  <img style="height: 10rem;width: 20rem" :src="getAvatarView(record.villageBack)"/>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="myHandleEdit(record)">编辑</a>

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
                <a href="javascript:;" @click="openVillageList(record)">村列表</a>
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

    <village-model ref="modalForm" @ok="modalFormOk"></village-model>
  </div>
</template>

<script>
import {getAction, getFileAccessHttpUrl, postAction} from '@/api/manage';
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import JSuperQuery from '@/components/jeecg/JSuperQuery'
import VillageModel from "./VillageModel";
import {mapState} from 'vuex';

export default {
  name: "VillagesList",
  mixins: [JeecgListMixin],
  components: {
    VillageModel,
    JInput,
    JSuperQuery
  },
  data() {
    return {
      queryParam: {
        //为了筛选村镇，1.镇，2.村
        villageType :1,

      },

      columns: [
        {
          title: '主键ID',
          align: "center",
          width: 100,
          dataIndex: 'id',
        },
        {
          title: '镇名称',
          align: "center",
          width: 100,
          dataIndex: 'villageName',
        },
        {
          title: '镇图标',
          align: "center",
          width: 120,
          dataIndex: 'villageBack',
          scopedSlots: {customRender: "avatarslot"}
        },

        {
          title: '排序',
          align: "center",
          width: 80,
          dataIndex: 'sort',
          sorter: true
        },
        {
          title: '修改时间',
          align: "center",
          width: 100,
          dataIndex: 'createTime'
        },
        {
          title: '修改人员',
          align: "center",
          width: 100,
          dataIndex: 'doneUserName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          width: 170
        }

      ],
      url: {
        list: "/acc/zknh_wechat_config/queryTownsVillages",
        delete: "/acc/zknh_wechat_config/deleteVillage",
      },
    }
  },
  computed:{
    ...mapState(['villageInfo'])
  },
  mounted() {

  },
  methods: {
    getAvatarView: function (avatar) {
      return getFileAccessHttpUrl(avatar)
    },
    openVillageList(recond){
      this.villageInfo.villagesId=recond.id;
      this.$emit('add',recond.villageName,'villageList');
    },
    myHandleAdd: function () {
      this.$refs.modalForm.edit({});
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.villageType='1';
    },
    myHandleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
      this.$refs.modalForm.villageType='1';
    },
  }
}
</script>

<style scoped>
.anty-img-wrap{height:25px;position: relative;}
.anty-img-wrap > img{max-height:100%;}
</style>