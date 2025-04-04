<template>
  <el-input v-model="modelValue" />
</template>

<script lang="ts" setup>
const modelValue = defineModel<string>();
</script>
