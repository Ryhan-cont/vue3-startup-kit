<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h3 class="my-20">Drop Zone</h3>
            <Dropzone />
        <h3 class="my-20">Pad</h3>
        <!-- <Pad /> -->
        <h3 class="my-20">Labels</h3>
            <Labels />
        <h3 class="my-20">Profile Photo</h3>
            <ProfilePhoto />
        <h3 class="my-20">Avi Group</h3>
            <AviGroup :show="3" field="avi" :aviList="[{avi:'/images/dummy/1.jpg'}, {avi:'/images/dummy/2.jpg'}, {avi:'/images/dummy/3.jpg'}]" />
    </PageLayout>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref, reactive, watch, computed  } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import Dropzone from '@/components/others/Dropzone.vue';
import Pad from '@/components/others/Pad.vue';
import Labels from '@/components/others/Labels.vue';

import ProfilePhoto from '@/components/others/ProfilePhoto.vue';
import AviGroup from '@/components/others/AviGroup.vue';

import {useRoute} from 'vue-router';


const pickedColor = ref({})
const colorPicker = ref('#1c67d0')
</script>