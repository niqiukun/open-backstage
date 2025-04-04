<template>
  <el-dialog
    v-model="visible"
    :title="`新增${entity.definition.label || entity.name}`"
    :width="720"
    @closed="$emit('close')"
  >
    <el-form :model="form" :style="{ 'margin-right': '160px' }">
      <el-form-item
        v-for="property in entity.definition.properties"
        :key="property.key"
        :label="property.label || property.key"
        :label-width="180"
        required
      >
        <property-edit v-model="form[property.key]" :property="property" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary">提交审核</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { defineEntity } from '@/packages/define';
import PropertyEdit from '@/components/properties/edit/index.vue';

const visible = ref(false);
defineProps<{
  entity: ReturnType<typeof defineEntity>;
}>();
defineEmits(['close']);
const form = ref<Record<string, any>>({});

onMounted(() => {
  visible.value = true;
});
</script>
