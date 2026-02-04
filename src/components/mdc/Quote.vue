<script setup lang="ts">
interface Props {
  author?: string
  role?: string
  avatar?: string
}

const props = defineProps<Props>()
</script>

<template>
  <blockquote class="quote">
    <div class="quote-content">
      <slot />
    </div>
    <footer
      v-if="props.author"
      class="quote-footer"
    >
      <img
        v-if="props.avatar"
        :src="props.avatar"
        :alt="props.author"
        class="quote-avatar"
      >
      <div class="quote-attribution">
        <cite class="quote-author">{{ props.author }}</cite>
        <span
          v-if="props.role"
          class="quote-role"
        >{{ props.role }}</span>
      </div>
    </footer>
  </blockquote>
</template>

<style scoped>
.quote {
  position: relative;
  margin: 2rem 0;
  padding: 2rem 2rem 2rem 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  font-size: 1.2em;
  line-height: 1.6;
}

.quote::before {
  content: '"';
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 4em;
  opacity: 0.3;
  font-family: Georgia, serif;
}

.quote-content {
  position: relative;
  z-index: 1;
}

.quote-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.quote-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid white;
}

.quote-attribution {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quote-author {
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
}

.quote-role {
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>
