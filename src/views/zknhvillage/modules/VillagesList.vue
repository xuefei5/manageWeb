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
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">添加镇</a-button>
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

    <villages-model ref="modalForm"></villages-model>
  </div>
</template>

<script>
import {getAction,postAction} from '@/api/manage';
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import JSuperQuery from '@/components/jeecg/JSuperQuery'
import VillagesModel from "./VillagesModel";

export default {
  name: "VillagesList",
  mixins: [JeecgListMixin],
  components: {
    VillagesModel,
    JInput,
    JSuperQuery
  },
  data() {
    return {
      queryParam: {},
      columns: [
        {
          title: '商品编码',
          align: "center",
          dataIndex: 'offerId',
          width: 120,
          sorter: true,
          ellipsis:true
        },
        {
          title: '商品名称',
          align: "center",
          width: 100,
          dataIndex: 'offerName',
        },
        {
          title: '商品描述',
          align: "center",
          width: 120,
          dataIndex: 'offerDesc',
        },

        {
          title: '商品类型',
          align: "center",
          width: 80,
          dataIndex: 'offerType',
          sorter: true
        },
        {
          title: '价格',
          align: "center",
          width: 100,
          dataIndex: 'offerPrice'
        },
        {
          title: '创建时间',
          align: "center",
          width: 100,
          dataIndex: 'createTime'
        },
        {
          title: '创建人',
          align: "center",
          width: 180,
          dataIndex: 'createUserName'
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
        delete: "/acc/zknh_wechat_config/deleteVillages",
      },
    }
  },
  mounted() {

  },
  methods: {
    openVillageList(id){
      this.$emit('add', id,'村列表','villageList');
    }
  }
}
</script>

<style scoped>

</style>