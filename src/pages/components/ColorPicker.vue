<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h3 class="my-20">Color Picker</h3>
            <ColorPicker :width="250" :height="200" v-model="colorPicker" />
        <h3 class="my-20">Site Color Picker</h3>
        <div style="width: 250px;">
            <SiteColorPicker @pick="pickedColor = $event" />
        </div>
        <div class="mt-10">{{ pickedColor }}</div>
    </PageLayout>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref, reactive, watch, computed  } from 'vue';

import PageLayout from '@/components/layout/PageLayout.vue';
import ColorPicker from '@/components/others/ColorPicker.vue';
import SiteColorPicker from '@/components/others/SiteColorPicker.vue';
import {useRoute} from 'vue-router';

const pickedColor = ref({})
const colorPicker = ref('#1c67d0')
</script>