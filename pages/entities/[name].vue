<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ entity.definition.label || entity.name }}</span>
        <el-button
          v-if="!isDataFixed"
          type="primary"
          @click="createEditVisible = true"
        >
          新增
        </el-button>
      </div>
    </template>
    <div style="height: 800px">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="data || []"
            :width="width"
            :height="height"
            fixed
          ></el-table-v2>
        </template>
      </el-auto-resizer>
    </div>
    <create-edit
      v-if="createEditVisible"
      :entity="entity"
      @close="createEditVisible = false"
    />
  </el-card>
</template>

<script lang="tsx" setup>
import Collection from '@/manifests';
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants.mjs';
import CreateEdit from '@/components/entities/createEdit.vue';
import PropertyTable from '@/components/properties/table/index.vue';
import { kebabToPascal } from '@/packages/utils';

const route = useRoute();
const { name } = route.params;
const entityName = kebabToPascal(name as string);
const entity = Collection.getEntity(entityName);
const isDataFixed = entity.definition.dataSource?.type === 'fixed';
const columns = [
  ...entity.definition.properties.map((property) => {
    return {
      title: property.label || property.key,
      dataKey: property.key,
      width: 250,
      cellRenderer: ({ cellData: item }: { cellData: any }) => {
        return <PropertyTable property={property} value={item} />;
      },
    };
  }),
  ...(!isDataFixed
    ? [
        {
          title: '操作',
          width: 170,
          fixed: FixedDir.RIGHT,
          cellRenderer: () => {
            return (
              <div class="table-actions">
                <el-link type="info">查看</el-link>
                <el-link type="primary">编辑</el-link>
                <el-link type="success">审核</el-link>
                <el-link type="danger">删除</el-link>
              </div>
            );
          },
        },
      ]
    : []),
];
async function getEntityData() {
  if (entity.definition.dataSource?.type === 'fixed') {
    return entity.definition.dataSource.data;
  }
  return (await useFetch(`/api/${entityName}/list`)).data;
}
const data = await getEntityData();
const createEditVisible = ref(false);
</script>

<style lang="scss" scoped>
.el-card {
  :deep(.el-card__body) {
    padding: 0;
  }

  :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.el-table-v2 {
  :deep(.table-actions) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .el-link {
      margin: 0 5px;
    }
  }
}
</style>
