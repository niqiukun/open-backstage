<template>
  <el-tooltip
    effect="dark"
    placement="top"
    :content="
      value
        .map((item) =>
          (property.type.options.table?.itemToString || ((x) => x))(item)
        )
        .join(', ')
    "
    popper-class="table-list-tooltip"
  >
    <div class="table-list">
      <el-tag v-for="item in displayedItems" :key="JSON.stringify(item)">{{
        (property.type.options.table?.itemToString || ((x) => x))(item)
      }}</el-tag>
      <el-tag v-if="hiddenItemCount > 0">{{ `+${hiddenItemCount}` }}</el-tag>
    </div>
  </el-tooltip>
</template>

<script lang="ts" setup>
import type { ListDefinition, Property } from '@/packages/define';

const props = defineProps<{
  property: Property<ListDefinition<readonly Property<any>[]>>;
  value: any[];
}>();
const displayedItems = computed(() => {
  const displayLimit = props.property.type.options.table?.displayLimit || 0;
  if (displayLimit === 0) {
    return props.value;
  }
  return props.value.slice(0, displayLimit);
});
const hiddenItemCount = computed(() => {
  const displayLimit = props.property.type.options.table?.displayLimit || 0;
  if (displayLimit === 0) {
    return 0;
  }
  return Math.max(0, props.value.length - displayLimit);
});
</script>

<style lang="scss" scoped>
.table-list {
  .el-tag:not(:last-child) {
    margin-right: 4px;
  }
}
</style>

<style lang="scss">
.table-list-tooltip {
  max-width: 420px;
}
</style>
