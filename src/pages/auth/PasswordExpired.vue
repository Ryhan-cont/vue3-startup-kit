<template>
    <div class="d-flex-center w-v h-v">
        <div class="two-fector-auth-card">
            <div class="two-fector-auth-card-content">
                <div class="d-flex-h-center">
                    <img src="/images/logo.svg" class="two-fector-auth-card-logo" />
                </div>
                <div class="d-flex-h-center mt-40 mb-20 text-primary text-h1">
                    Password Expiration Alert!!!
                </div>
                <form method="post" @submit="onSubmit" id="verification-form">
                    <div class="two-fector-auth-card-timeout"><span>Your password has been expired</span></div>
                    <div class="text-b3-meta text-center mb-20">Please follow this instruction to reset your code. </div>
                    <router-link :to="{name: 'resetPasswordRequest'}">
                        <div class="d-flex-h-center">
                            <BtnBox class="btn-primary btn-mid" block>Password Reset Instructions</BtnBox>
                        </div>
                    </router-link>
                </form>
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