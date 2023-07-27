<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <div @click="btnLoading = !btnLoading" class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20">Loading</div>
        <div @click="btnDisabled = !btnDisabled" class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20 ml-10">Disable</div>
        <div>
            <BtnBox class="btn-primary" btnType="submit" :disabled="btnDisabled" :loading="btnLoading">
                Test
            </BtnBox>
        </div>
        <h4 class="my-15">Button [btn-primary]</h4>
        <div>
            <BtnBox class="btn-primary" btnType="submit" :disabled="btnDisabled" :loading="btnLoading">
                Primary
            </BtnBox>
        </div>
        <h4 class="my-15">Button [btn-secondary-outlined]</h4>
        <div>
            <BtnBox class="btn-secondary-outlined" btnType="submit" :disabled="btnDisabled" :loading="btnLoading">
                Secondary Outlined
            </BtnBox>
        </div>
        <h4 class="my-15">Button with icon</h4>
        <div>
            <BtnBox class="btn-primary btn-sm" btnType="submit" :disabled="btnDisabled" :loading="btnLoading">
                <i class="fas fa-info-circle mr-5" />Icons
            </BtnBox>
        </div>
        <h4 class="my-15">Button [btn-sm]</h4>
        <div>
            <BtnBox class="btn-primary btn-sm" btnType="submit" :disabled="btnDisabled" :loading="btnLoading">
                Small Main Button
            </BtnBox>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            btnType: Submit or others<br>
            disabled: To disable button<br>
            loading: To show loading Animation.
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Events</div>
    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch  } from 'vue';
    import {useRoute} from 'vue-router';
    import PageLayout from '@/components/layout/PageLayout.vue'
    import BtnBox from '@/components/form/BtnBox.vue'

    const btnDisabled = ref(false);
    const btnLoading = ref(false);

    const LoadingBtn = (e) => {

    }
</script>