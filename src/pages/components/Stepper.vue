<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h3 class="my-20">Stepper</h3>
        <!-- <StepBox /> -->
        <h3 class="my-20">Marker</h3>
        <Marker />
    </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/layout/PageLayout.vue';
// import StepBox from '@/components/others/StepBox.vue';
import Marker from '@/components/others/Marker.vue';
import {useRoute} from 'vue-router';
</script>