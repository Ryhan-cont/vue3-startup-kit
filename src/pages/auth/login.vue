<template>
    <div class="d-flex-center w-v h-v">
        <div v-if="authStore.pageLoader" class="d-flex-center bg-background" style="position:fixed;inset: 0;z-index: 2;">
            <img src="/images/loader.gif">
        </div>
        <div v-else class="login-card">
            <div class="login-card-content">
                <div class="d-flex-h-center">
                    <img src="/images/logo.svg" class="login-card-logo" />
                </div>
                <div class="d-flex-h-center mt-40 mb-20 color-primary text-h1">
                    Login to Chatbot Account
                </div>
                <!-- <div class="d-flex-h-center">
                    <a :href="generateLogin()">
                        <div class="login-card-sign-in-with-google">
                        <div class="login-card-ggl-logo-container"></div>
                        <div class="login-card-ggl-text-container">Sign in with Google</div>
                    </div>
                    </a>
                </div>
                <div class="login-card-login-with-email"><span>OR LOGIN WITH EMAIL</span></div> -->
                <form method="post" @submit="onSubmit" id="login-form">
                    <div class="input-title">Email Address:<span class="input-title-require">*</span></div>
                    <div>
                        <InputBox 
                            :validate="Yup.string().required()" 
                            @input="errorMsg = ''; authStore.loginError = ''" 
                            placeholder="Your Email Address" 
                            showDetail 
                            name="username"
                            >
                            <template v-slot:right>
                                <div class="d-flex-v-center"><span class="far fa-envelope color-light font-14" style="margin:0px 13px 0px 10px"></span></div>
                            </template>
                        </InputBox>
                    </div>
                    <div class="input-title">Password:<span class="input-title-require">*</span></div>
                    <div>
                        <InputBox 
                            placeholder="Your Password" 
                            :inputType="togglePass === true ? 'text' : 'password'" 
                            showDetail
                            name="password"
                            :validate="Yup.string().required()" 
                            @input="errorMsg = ''; authStore.loginError = ''" 
                            >
                            <template v-slot:right>
                                <div class="d-flex-v-center"><span @click="togglePass = !togglePass" class="far color-light font-14 cursor-pointer" :class="togglePass === true ? 'fa-eye-slash' : 'fa-eye'" style="margin:0px 13px 0px 10px"></span></div>
                            </template>
                        </InputBox>
                    </div>
                    <Message class="mb-10" v-if="validVar(authStore.loginError)" :message="authStore.loginError" type="error" />
                    <div class="d-flex mb-20">
                        <div class="flex-auto"><CheckBox label="Remember Me" /></div>
                        <router-link :to="{ name: 'resetPasswordRequest'}" class="hover-text-action color-mid cursor-pointer">
                            <div class="text-b3-meta transition-3">Forgot password?</div>
                        </router-link>
                    </div>
                    <div class="d-flex-h-center">
                        <BtnBox class="btn-primary btn-mid" btnType="submit" :loading="authStore.btnLoading" block>Login To Your Account</BtnBox>
                    </div>
                    <div class="d-flex-h-center mt-20 text-b3-meta">By signing in, you agree to our <span class="ml-5 text-action text-underline color-action cursor-pointer">Privacy Policy</span></div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
    /**
     * Import components
     */
    import {ref, onBeforeMount} from 'vue';
    import { validVar } from '@/functions/com.js';
    import * as Yup from "yup";
    import InputBox from '@/components/form/InputBox.vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    import CheckBox from '@/components/form/CheckBox.vue';
    import Message from '@/components/validate/Message.vue';
    import alert from '@/functions/alert';

    import { useAuth } from '@/store/auth/auth';
    import { useForm } from "vee-validate";
    import {useRoute} from 'vue-router';

    /**
     * Initialize components
     */
    const authStore = useAuth();
    const togglePass = ref(false);

    const { handleSubmit, setFieldError } = useForm();

    /**
     * Declare functions
     */
    const onSubmit = handleSubmit(() => {
        let fs = new FormData(document.getElementById('login-form'));     
        authStore.login(fs, setFieldError);
    });

    onBeforeMount(()=>{  
        
    });
</script>