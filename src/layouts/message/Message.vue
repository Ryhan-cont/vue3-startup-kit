<template>
    <div class="bg-white">
        <Header />
        <div class="message-preview-wrap">
            <div class="message-preview-content">
                <router-view />
            </div>
        </div>
    </div>
</template>
<script setup>
    import Header from '@/layouts/message/Header.vue';
</script>