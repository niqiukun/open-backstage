<template>
  <el-input-number
    v-model="modelValue"
    class="property-edit-number"
    placeholder="请输入数字"
  />
</template>

<script lang="ts" setup>
const modelValue = defineModel<number>();
</script>

<style lang="scss" scoped>
.property-edit-number {
  width: 100%;
}
</style>
