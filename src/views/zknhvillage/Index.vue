<template>
  <a-card :bordered="false">
    <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit">
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        <span v-if="pane.content == 'villagesList'">
          <VillagesList @add="add"></VillagesList>
        </span>
        <span v-if="pane.content == 'villageList'">
          <village-list @add="add"></village-list>
        </span>
        <span v-if="pane.content == 'villageModel'">
          <village-detail-model-list></village-detail-model-list>
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
    methods: {
      callback(key) {
        console.log(key);
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      add(id,title,key) {
        const panes = this.panes;
        panes.push({
          title: title,
          content: key,
          key: key,
        });
        this.panes = panes;
        this.activeKey = key;
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
