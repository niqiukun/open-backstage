<template>
  <el-select-v2 v-model="modelValue" :options="options" />
</template>

<script lang="ts" setup>
import type { EnumDefinition } from '@/packages/define';

const props = defineProps<{
  enum: EnumDefinition<string, readonly { key: string; label: string }[]>;
}>();
const modelValue = defineModel<string>();
const options = computed(() => {
  return props.enum.definition.map((item) => ({
    label: item.label,
    value: item.key,
  }));
});
</script>
