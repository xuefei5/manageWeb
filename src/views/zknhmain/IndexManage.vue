<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="商品名称">
              <j-input placeholder="输入账号模糊查询" v-model="queryParam.offerName"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="12">
            <a-form-item label="商品编码">
              <j-input placeholder="输入商品编码" v-model="queryParam.offerId"></j-input>
            </a-form-item>
          </a-col>


          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="商品类型">
                <!--1、准旗特产2、绿色蔬菜3、水果4、米面粮油5、肉禽蛋类6、休闲食品7、酒水饮料8、副食调料9、农品供应-->
                <a-select v-model="queryParam.offerType" placeholder="请选择">
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
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="商品状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="1">生效</a-select-option>
                  <a-select-option value="2">失效</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">添加主页元素</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            删除
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            生效
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')"/>
            失效
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <a-button @click="editMainBack" type="primary" icon="file-image">主页背景图修改</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.offerId)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==1">
                <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(record.offerId,2,record.username)">
                  <a>失效</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==2">
                <a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(record.offerId,1,record.username)">
                  <a>生效</a>
                </a-popconfirm>
              </a-menu-item>

            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <index-manage-modal ref="modalForm" @ok="modalFormOk"></index-manage-modal>
    <upload-main ref="editMainBackModal"></upload-main>

  </a-card>
</template>

<script>
  import IndexManageModal from './modules/IndexManageModal'
  import {putAction,getFileAccessHttpUrl} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JInput from '@/components/jeecg/JInput'
  import JSuperQuery from '@/components/jeecg/JSuperQuery'
  import UploadMain from "./modules/UploadMain";

  export default {
    name: "IndexManage",
    mixins: [JeecgListMixin],
    components: {
      UploadMain,
      IndexManageModal,
      JInput,
      JSuperQuery
    },
    data() {
      return {
        description: '这是商品基础信息管理页面',
        queryParam: {},
        recycleBinVisible: false,
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
          list: "/offer/offer/list",
          delete: "/offer/offer/delete",
          deleteBatch: "/offer/offer/deleteBatch",
        },
      }
    },
    computed: {
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar)
      },

      batchFrozen: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        } else {
          let ids = "";
          let that = this;
          let isAdmin = false;
          that.selectionRows.forEach(function (row) {
            if (row.username == 'admin') {
              isAdmin = true;
            }
          });
          if (isAdmin) {
            that.$message.warning('管理员账号不允许此操作,请重新选择！');
            return;
          }
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: "确认操作",
            content: "是否" + (status == 1 ? "解冻" : "冻结") + "选中账号?",
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen: function (id, status, username) {
        let that = this;
        //TODO 后台校验管理员角色
        if ('admin' == username) {
          that.$message.warning('管理员账号不允许此操作！');
          return;
        }
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      editMainBack(){
        this.$refs.editMainBackModal.open();

        this.$refs.editMainBackModal.title = '请上传主页背景(可以在页面里提示格式),下面为背景预览'
      }
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>