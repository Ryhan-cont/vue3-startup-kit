<template>
    <div class="d-flex-center w-v h-v">
        <div class="login-card">
            <div class="login-card-content">
                <div class="d-flex-h-center">
                    <img src="/images/logo.svg" class="login-card-logo" />
                </div>
                <div class="d-flex-h-center mt-40 mb-20 text-primary text-h1">
                    Reset Password
                </div>
                <form method="post" @submit="onSubmit" id="password-reset-form">
                    <div class="input-title">Password:<span class="input-title-require">*</span></div>
                    <div>
                        <InputBox 
                            placeholder="Password" 
                            :inputType="togglePass === true ? 'text' : 'password'" 
                            showDetail
                            name="password"
                            :validate="Yup.string().required()" 
                            @input="errorMsg = ''" 
                            >
                            <template v-slot:right>
                                <div class="d-flex-v-center"><span @click="togglePass = !togglePass" class="far color-light font-14 cursor-pointer" :class="togglePass === true ? 'fa-eye-slash' : 'fa-eye'" style="margin:0px 13px 0px 10px"></span></div>
                            </template>
                        </InputBox>
                    </div>
                    <div class="input-title">Confirm Password:<span class="input-title-require">*</span></div>
                    <div>
                        <InputBox 
                            placeholder="Re type your password" 
                            :inputType="confirmTogglePass === true ? 'text' : 'password'" 
                            showDetail
                            name="password_confirmation"
                            :validate="Yup.string().required()" 
                            @input="errorMsg = ''" 
                            >
                            <template v-slot:right>
                                <div class="d-flex-v-center"><span @click="confirmTogglePass = !confirmTogglePass" class="far color-light font-14 cursor-pointer" :class="confirmTogglePass === true ? 'fa-eye-slash' : 'fa-eye'" style="margin:0px 13px 0px 10px"></span></div>
                            </template>
                        </InputBox>
                    </div>
                    <div class="d-flex-h-center">
                        <BtnBox :loading="authStore.btnLoading" class="btn-primary mt-5 btn-mid" btnType="submit" block>Submit</BtnBox>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
    /**
     * Import components
     */
    import {ref} from 'vue';
    import * as Yup from "yup";
    import InputBox from '@/components/form/InputBox.vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    import { useAuth } from '@/store/auth/auth';
    import { useForm } from "vee-validate";
    import {useRoute} from 'vue-router';
    import {initializeValidator,setValidators,validate,setErrors} from "@/functions/validate.js";

    /**
     * Initialize components
     */
    initializeValidator();
    const authStore = useAuth();
    const togglePass = ref(false);
    const confirmTogglePass = ref(false);
    const { handleSubmit, setFieldError } = useForm();
    const route = useRoute();

    /**
     * Declare functions
     */

     const onSubmit = handleSubmit(() => {
        let fs = new FormData(document.getElementById('password-reset-form'));
        fs.append('token',route.params.code);      
        authStore.resetPassword(fs, setFieldError);
    });
</script>