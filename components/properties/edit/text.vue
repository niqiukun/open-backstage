<template>
  <el-input
    v-model="modelValue"
    :placeholder="`请输入${property.label || property.key}`"
  />
</template>

<script lang="ts" setup>
import type { Property } from '@/packages/define';

defineProps<{
  property: Property<'text'>;
}>();
const modelValue = defineModel<string>();
</script>
