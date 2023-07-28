<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        Stepper
    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/layout/PageLayout.vue';
import {useRoute} from 'vue-router';
</script>