<template>
  <component
    :is="mappedComponent.component"
    v-if="mappedComponent"
    v-model="modelValue"
    v-bind="mappedComponent.props || {}"
  ></component>
</template>

<script lang="ts" setup>
import { isEnum, isList, type Property } from '@/packages/define';
import Text from './text.vue';
import List from './list.vue';
import Enum from './enum.vue';

const props = defineProps<{
  property: Property;
}>();
const modelValue = defineModel<any>();
const mappedComponent = computed(() => {
  const property = props.property;
  if (property.type === 'text') {
    return { component: Text };
  } else if (isList(props.property)) {
    return {
      component: List,
      props: {
        list: property.type,
        itemLabel: property.label || property.key,
      },
    };
  } else if (isEnum(property)) {
    return {
      component: Enum,
      props: {
        enum: property.type,
      },
    };
  }
  return undefined;
});
</script>
