<template>
  <div class="list-item">
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="list-item__single"
    >
      <div class="list-item__single__content">
        <el-form-item
          v-for="listProperty in list.definition"
          :key="listProperty.key"
          :label="`${listProperty.label || listProperty.key}${index + 1}`"
          label-position="top"
          required
        >
          <property-edit
            v-model="item[listProperty.key]"
            :property="listProperty"
          ></property-edit>
        </el-form-item>
      </div>
      <el-button
        class="delete-button"
        type="danger"
        :icon="Delete"
        circle
        @click="handleDelete(index)"
      />
    </div>
    <el-button class="add-button" type="primary" plain @click="handleAdd">{{
      `添加${itemLabel}`
    }}</el-button>
  </div>
</template>

<script lang="ts" setup>
import type { ListDefinition, Property } from '@/packages/define';
import { Delete } from '@element-plus/icons-vue';
import PropertyEdit from './index.vue';

const props = withDefaults(
  defineProps<{
    property: Property<ListDefinition<readonly Property<any>[]>>;
    modelValue?: any[];
  }>(),
  {
    modelValue: () => [],
  }
);
const emit = defineEmits(['update:modelValue']);
const list = computed(() => props.property.type);
const itemLabel = computed(() => props.property.label || props.property.key);

function handleAdd() {
  const newItem = props.property.type.definition.reduce(
    (acc, property) => {
      acc[property.key] = undefined;
      return acc;
    },
    {} as Record<string, any>
  );
  emit('update:modelValue', [...props.modelValue, newItem]);
}
function handleDelete(index: number) {
  const newList = [...props.modelValue];
  newList.splice(index, 1);
  emit('update:modelValue', newList);
}
</script>

<style lang="scss" scoped>
.list-item {
  width: 100%;
}

.list-item__single {
  display: flex;
  margin-right: -40px;
}

.list-item__single__content {
  flex: 1;
  margin-right: 8px;
}

.list-item__single:not(:last-of-type) {
  margin-bottom: 12px;
}

.add-button {
  margin-top: 12px;
}

.delete-button {
  margin-top: 32px;
}
</style>
