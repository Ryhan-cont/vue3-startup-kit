<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h4 class="mb-15">Site Checkbox</h4>
        <div>
            <input type="checkbox" class="site-checkbox" name="sitecheckbox" />
            <input type="checkbox" class="site-checkbox ml-10" name="sitecheckbox" />
        </div>
        <h4 class="mb-15">Message Box General</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="validateFormGen">Validate</div>
        <div>
            <CheckBox label="checkbox false" v-model="checkBoxValue1" name="check1" showDetail></CheckBox>
            <CheckBox label="checkbox true" v-model="checkBoxValue2" name="check2" showDetail></CheckBox>
            <Message name="checkbox@checker" :validateValue="(checkBoxValue1 === true || checkBoxValue2 === true) ? true : undefined" :validate="Yup.boolean().required().nullable()" />
        </div>
        <h4 class="mb-15">Example Of disabled</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="disableInput = !disableInput">Disabled</div>
        <div>
            <CheckBox :disabled="disableInput" label="checkbox false" name="checkboxdisabled" :checkboxValue="false" showDetail></CheckBox>
            <input :disabled="disableInput" type="checkbox" class="site-checkbox" />
        </div>
        <h4 class="mb-15">Example Of read only</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="readonly = !readonly">Read only</div>
        <div>
            <CheckBox :readonly="readonly" label="checkbox false" name="checkboxreadonly" :checkboxValue="false" showDetail></CheckBox>
            <input :readonly="readonly" type="checkbox" :class="['site-checkbox', {'read-only':readonly}]" />
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <div>
            label: for cutom label
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            name: checkbox name.<br>
            checkboxValue: value that chacked checkbox will return.<br>
            size: size of raadio.<br>
            label:checkbox label
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
    import CheckBox from '@/components/form/CheckBox.vue'
    import Message from '@/components/validate/Message.vue';

    initializeValidator();

    const checkBoxValue1 = ref(false);
    const checkBoxValue2 = ref(false);
    const genValidate = setValidators(["check1", "check2", "checkbox@checker"])
    const disableInput = ref(true);
    const readonly = ref(true)
    const validateFormGen = async () => {
        let chk = await validate(genValidate);
        alert(JSON.stringify(chk, null, 2));
    }
</script>