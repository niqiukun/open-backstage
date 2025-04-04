<template>
  <el-switch v-model="modelValue" />
</template>

<script lang="ts" setup>
const modelValue = defineModel<boolean>();
</script>
