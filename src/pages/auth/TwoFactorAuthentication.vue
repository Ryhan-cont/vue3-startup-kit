<template>
    <div class="d-flex-center w-v h-v">
        <div class="two-fector-auth-card">
            <div class="two-fector-auth-card-content">
                <div class="d-flex-h-center">
                    <img src="/images/logo.svg" class="two-fector-auth-card-logo" />
                </div>
                <div class="d-flex-h-center mt-40 mb-20 text-primary text-h1">
                    Two Factor Authentication
                </div>
                <form method="post" @submit="onSubmit" id="verification-form">
                    <div class="two-fector-auth-card-timeout"><span>The code will expire in 10 minutes</span></div>
                    <div class="text-b3-meta text-center mb-20">An email with a verification code has been sent to {{ decodeURIComponent(route.params.email).replace(/\%46;/g, '.') }} </div>
                    <div class="mb-20">
                        <OTPInput v-model="authStore.verification_code" name="verification_code" showDetail/>
                    </div>
                    <div class="d-flex-h-center">
                        <BtnBox class="btn-primary btn-mid" :loading="authStore.btnLoading" block>Verify Account</BtnBox>
                    </div>
                </form>
                
                <div class="d-flex-h-center mt-20 text-b3-meta cursor-pointer">Didn’t receive code?</div>
                <div class="d-flex-h-center mt-5 text-b3-meta hover-text-primary text-action cursor-pointer transition-3" @click="authStore.resendCode(route.params.id)">Resend Code</div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {ref} from 'vue';
    import {useRoute} from 'vue-router';
    import { useAuth } from '@/store/auth/auth';
    import { useForm } from "vee-validate";
    import BtnBox from '@/components/form/BtnBox.vue'
    import OTPInput from '@/components/others/OTPInput.vue'

    const togglePass = ref(false)
    const route = useRoute();
    const { handleSubmit, setFieldError } = useForm();
    const authStore = useAuth();

    
    const onSubmit = handleSubmit(() => {
        let fs = new FormData(); 
        fs.append('verification_code',authStore.verification_code);    
        authStore.verify2FA(fs, setFieldError);
    });
</script>