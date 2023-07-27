<template>
    <div class="d-flex-center w-v h-v">
        <div class="reset-card">
            <div class="reset-card-content">
                <div class="d-flex-h-center">
                    <img src="/images/logo.svg" class="reset-card-logo" />
                </div>
                <div class="d-flex-h-center mt-40 mb-20 text-primary text-h1">
                    Reset Password
                </div>
                <div class="reset-card-description text-b3-meta text-center bb-1 border-border-grey pb-20 mb-20">Enter your email address below. We’ll send you instructions to reset your password.</div>
                <div class="input-title">Email Address:<span class="input-title-require">*</span></div>
                <form method="post" @submit="onSubmit"  id="verification-form">
                    <div>
                        <InputBox placeholder="Your Email Address" name="email" v-model="authStore.email" :validate="Yup.string().required().email()" showDetail>
                            <template v-slot:right>
                                <div class="d-flex-v-center"><span class="far fa-envelope text-light font-14" style="margin:0px 13px 0px 10px"></span></div>
                            </template>
                        </InputBox>
                    </div>
                    <div class="d-flex-h-center">
                        <BtnBox :loading="authStore.btnLoading" class="btn-primary mt-5 btn-mid" block>Send Reset Instructions</BtnBox>
                    </div>
                </form>
                <div class="d-flex-h-center mt-20 text-b3-meta text-action cursor-pointer">
                    <router-link :to="{name:'login'}" class="text-action">Back To Login</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {ref} from 'vue'
    import * as Yup from "yup";
    import { useForm } from "vee-validate";
    import InputBox from '@/components/form/InputBox.vue'
    import BtnBox from '@/components/form/BtnBox.vue'
    import { useAuth } from '@/store/auth/auth';

    const authStore = useAuth();
    const { handleSubmit } = useForm();

    const onSubmit = handleSubmit(() => {
        authStore.sendPasswordResetInstruction()
    });


</script>

<style lang="scss" scoped>
.reset-card {
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
}
</style>