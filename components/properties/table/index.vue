<template>
  <component
    :is="mappedComponent"
    v-if="mappedComponent"
    :value="value"
    :property="property"
  ></component>
</template>

<script lang="ts" setup>
import { isEnum, isList, type Property } from '@/packages/define';
import Text from './text.vue';
import List from './list.vue';
import Enum from './enum.vue';

const props = defineProps<{
  value: any;
  property: Property<any>;
}>();
const mappedComponent = computed(() => {
  const property = props.property;
  if (property.type === 'text' || property.type === 'integer') {
    return Text;
  }
  if (isList(property)) {
    return List;
  }
  if (isEnum(property)) {
    return Enum;
  }
  return undefined;
});
</script>
