<template>
  <el-select-v2 v-model="modelValue" :options="options" />
</template>

<script lang="ts" setup>
import type { EnumDefinition, Property } from '@/packages/define';

const props = defineProps<{
  property: Property<
    EnumDefinition<string, readonly { key: string; label: string }[]>
  >;
}>();
const modelValue = defineModel<string>();
const options = computed(() => {
  return props.property.type.definition.map((item) => ({
    label: item.label,
    value: item.key,
  }));
});
</script>
