<template>
  {{ property.type.definition.find((item) => item.key === value)?.label }}
</template>

<script lang="ts" setup>
import type { EnumDefinition, Property } from '@/packages/define';

defineProps<{
  property: Property<
    EnumDefinition<string, readonly { key: string; label: string }[]>
  >;
  value: string;
}>();
</script>
