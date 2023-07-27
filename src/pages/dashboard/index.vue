<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h3>Global component</h3>
        <router-link :to="{ name: 'buttonComponent'}">/button-component</router-link>
        <h3>Error handler</h3>
        Error handle page link will go here
        <h3>Auth</h3>
        Auth related page link will go here
    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/layout/PageLayout.vue'
import {useRoute} from 'vue-router';

</script>
