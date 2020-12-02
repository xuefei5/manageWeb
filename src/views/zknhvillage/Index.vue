<template>
  <a-card :bordered="false">
    <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit">
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        <span v-if="pane.content == 'villagesList'">
          <VillagesList @add="add" ref='VillagesList'></VillagesList>
        </span>
        <span v-if="pane.content == 'villageList'">
          <village-list @add="add" ref='villageList'></village-list>
        </span>
        <span v-if="pane.content == 'villageModel'">
          <village-detail-model-list ref="villageModel"></village-detail-model-list>
        </span>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
  import VillagesList from "./modules/VillagesList";
  import VillageList from "./modules/VillageList";
  import VillageDetailModelList from "./modules/VillageDetailModelList";
  export default {
    name:"Index",
    components: {VillageDetailModelList, VillageList, VillagesList},
    data() {
      const panes = [
        { title: '镇集体',content: 'villagesList', key: 'villagesList',closable:false },
      ];
      return {
        activeKey: panes[0].key,
        panes,
        newTabIndex: 0,
      };
    },
    computed:{
    },
    mounted() {

    },
    methods: {
      callback(key) {
        console.log(key);
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      add(title,key) {
        const panes = this.panes;
        //循环panes，如果存在的话则直接跳转
        let con_this =this;
        let isOpen = true;
        panes.forEach(function (item, index) {
          if(item.key==key){
            item.title = title;
            con_this.activeKey = key;
            if('villageList'==key){//村列表
              con_this.$refs.villageList[0].searchQuery();
              con_this.remove('villageModel');
            }
            if('villageModel'==key){//村模块
              con_this.$refs.villageModel[0].searchQuery();
            }
            isOpen = false;
          }
        });
        if(isOpen){
          panes.push({
            title: title,
            content: key,
            key: key,
          });
          this.panes = panes;
          this.activeKey = key;
        }
      },
      remove(targetKey) {
        let activeKey = this.activeKey;
        let lastIndex;
        this.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        this.panes = panes;
        this.activeKey = activeKey;
      },
    },
  };
</script>

<style scoped>
</style>
