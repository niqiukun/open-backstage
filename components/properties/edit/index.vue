<template>
  <component
    :is="mappedComponent"
    v-if="mappedComponent"
    v-model="modelValue"
    :property="property"
  ></component>
</template>

<script lang="ts" setup>
import {
  isEnum,
  isList,
  type Property,
  type PropertyType,
} from '@/packages/define';
import Text from './text.vue';
import List from './list.vue';
import Enum from './enum.vue';
import Integer from './integer.vue';
import BooleanElement from './boolean.vue';

const props = defineProps<{
  property: Property<PropertyType>;
}>();
const modelValue = defineModel<any>();
const mappedComponent = computed(() => {
  const property = props.property;
  if (property.type === 'text') {
    return Text;
  } else if (property.type === 'integer') {
    return Integer;
  } else if (property.type === 'boolean') {
    return BooleanElement;
  } else if (isList(props.property)) {
    return List;
  } else if (isEnum(property)) {
    return Enum;
  }
  return undefined;
});
</script>
