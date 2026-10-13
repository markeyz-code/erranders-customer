<template>
  <ConfirmModal
    :isOpen="isOpen"
    :title="title"
    :message="message"
    :confirmText="confirmText"
    :cancelText="cancelText"
    :variant="variant"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import ConfirmModal from './ConfirmModal.vue'
import { useConfirmModal } from '@/composables/core/useConfirmModal'

const { isOpen, title, message, confirmText, cancelText, variant, handleConfirm, handleCancel } = useConfirmModal()
</script>
