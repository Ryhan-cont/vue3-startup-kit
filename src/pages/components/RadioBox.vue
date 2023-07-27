<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h4 class="mb-15">Site Radio</h4>
        <div>
            <input type="radio" class="site-radio" name="siteradio" />
            <input type="radio" class="site-radio ml-10" name="siteradio" />
        </div>
        <h4 class="mb-15">Message Box General</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="validateFormGen">Validate</div>
        <div>
            <RadioBox placeholder="Placeholder" label="Radio false" v-model="radioValue" name="radio" radioValue="yyy" showDetail></RadioBox>
            <RadioBox placeholder="Placeholder" label="Radio true" v-model="radioValue" name="radio" radioValue="xxx" showDetail></RadioBox>
            <Message name="radio@checker" height="18px" :validateValue="radioValue" />
        </div>
        <div>{{radioValue}}</div>
        <h4 class="mb-15">Example Of disabled</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="disableInput = !disableInput">Disabled</div>
        <div>
            <RadioBox :disabled="disableInput" placeholder="Placeholder" label="Radio false" name="radiodisabled" :radioValue="false" showDetail></RadioBox>
            <input :disabled="disableInput" type="radio" class="site-radio" name="radiodisabled" />
        </div>
        <h4 class="mb-15">Example Of read only</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="readonly = !readonly">Read only</div>
        <div>
            <RadioBox :readonly="readonly" placeholder="Placeholder" label="Radio false" name="radioreadonly" :radioValue="false" showDetail></RadioBox>
            <input :readonly="readonly" type="radio" :class="['site-radio', {'read-only':readonly}]" name="radioreadonly" />
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <div>
            label: for cutom label
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            name: radio name.<br>
            radioValue: value that chacked radio will return.<br>
            size: size of raadio.<br>
            label:Radio label
        </div>
        <div class="text-h3 mt-20 mb-10 py-5">Note: For error habdle use message component</div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Events</div>
    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch  } from 'vue';
    import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js'
    import * as Yup from 'yup';
    import {useRoute} from 'vue-router';
    import PageLayout from '@/components/layout/PageLayout.vue'
    import RadioBox from '@/components/form/RadioBox.vue'
    import Message from '@/components/validate/Message.vue';

    initializeValidator();

    const radioValue = ref('xxx');
    const genValidate = setValidators(["radio@checker", "radio"]);
    const disableInput = ref(true);
    const readonly = ref(true)
    const validateFormGen = async () => {
        let chk = await validate(genValidate);
        alert(JSON.stringify(chk, null, 2));
       
        console.log(chk)
    }
</script>