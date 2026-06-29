<script setup lang="ts">
import { computed } from "vue";
import EditIcon from "./EditIcon.vue";

const props = withDefaults(defineProps<{
  value: string;
  suffix?: string;
  editable?: boolean;
  editLabel?: string;
  className?: string;
}>(), {
  editable: true,
  editLabel: "Edit",
});

const emit = defineEmits<{
  (e: "edit"): void;
}>();

const classes = computed(() => ["ns-filled-wrap", props.className].filter(Boolean).join(" "));
</script>

<template>
  <span :class="classes">
    <span class="ns-filled-value">{{ value }}</span>
    <span v-if="suffix" class="ns-suffix">{{ suffix }}</span>
    <EditIcon
      v-if="editable"
      :label="editLabel"
      @edit="emit('edit')"
    />
  </span>
</template>
