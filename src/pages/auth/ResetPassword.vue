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
<style lang="scss" scoped>
.login-card {
    max-width: 556px;
    width: 100%;
    padding: 50px 10px;
    background: var(--white);
    border-radius: 4px;
    -webkit-box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);
    margin: 10px;
    &-content{
        width: 100%;
        max-width: 364px;
        margin: auto;
    }
    &-logo{
        width: 180px;
    }
    &-sign-in-with-google {
        width: 240px;
        height: 50px;
        border: 1px solid #4285f4;
        display: flex;
    }
    &-ggl-logo-container {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 50px;
        flex: 0 0 50px;
        max-width: 50px;
        height: 100%;
        background: url(/images/g-logo.png) center center no-repeat;
        background-size: 2rem;
    }
    &-ggl-text-container {
        -webkit-box-flex: 1;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        max-width: 100%;
        font-weight: 400;
        font-size: 17px;
        color: var(--white);
        background: #4285f4;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &-login-with-email {
        position: relative;
        text-align: center;
        z-index: 1;
        margin: 20px 0px;
        &::before{
            content: " ";
            position: absolute;
            left: 0;
            right: 0;
            top: 10px;
            border-bottom: 0.1rem solid #d3d3d3;
            z-index: -1;
        }
        span{
            font-weight: 500;
            font-size: 14px;
            line-height: 22px;
            text-transform: uppercase;
            padding: 0 10px;
            background-color: var(--white);
        }
    }
}
</style>