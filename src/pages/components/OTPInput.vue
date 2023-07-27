<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h4 class="mb-15">Otp input</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="validateFormGen">Validate</div>
        <div>
            <OTPInput name="otp" :validate="Yup.string().required()" showDetail />
        </div>
        <h4 class="mb-15 mt-20">Otp input wiithout name</h4>
        <div>
            <OTPInput v-model="otpValue" />
        </div>
        <div>{{otpValue}}</div>
    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch  } from 'vue';
    import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js'
    import * as Yup from 'yup';
    import {useRoute} from 'vue-router';
    import PageLayout from '@/components/layout/PageLayout.vue'
    import OTPInput from '@/components/others/OTPInput.vue'

    initializeValidator();

    const otpValue = ref();
    
    const disableInput = ref(true);
    const readonly = ref(true);
    const genValidate = setValidators([ "otp"]);
    const validateFormGen = async () => {
        let chk = await validate(genValidate);
        alert(JSON.stringify(chk, null, 2));
       
        console.log(chk)
    }
</script>