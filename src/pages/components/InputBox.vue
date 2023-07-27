<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <div @click="changeValue()" class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20">Change value</div>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20 ml-10" @click="validateFormGen">Validate</div>
        <div style="max-width:300px">
            <InputBox :validate="Yup.string().required()" v-model="inputModel" reset @reset="resetData" name="inputbox" autocomplete="off" placeholder="Placeholder" :showDetail="true" ></InputBox>
        </div>
        <div class="my-20">Typed: {{inputModel}}</div>
        <h4 class="mb-15">Example Without modal</h4>
        <div style="max-width:300px">
            <InputBox :validate="Yup.string().required()" name="inputboxwm" autocomplete="off" placeholder="Placeholder" :showDetail="true" ></InputBox>
        </div>
        <h4 class="mb-15">Example Without name</h4>
        <div style="max-width:300px">
            <InputBox v-model="inputModelNoName" autocomplete="off" placeholder="Placeholder" :showDetail="true" message="Message" messageType="success" ></InputBox>
        </div>
        <div class="my-20">Typed: {{inputModelNoName}}</div>
        <h4 class="mb-15">Example of reset</h4>
        <div style="max-width:300px">
            <InputBox resetVal @reset="resetData" name="inputreset" autocomplete="off" placeholder="Placeholder" :showDetail="true" ></InputBox>
        </div>
        <h4 class="mb-15">Example of slot</h4>
        <div style="max-width:300px">
            <InputBox resetVal @reset="resetData" name="inputslot" autocomplete="off" placeholder="Placeholder" :showDetail="true" >
                <template v-slot:left><div class="pl-10 pr-5 d-flex-v-center"><i class="fas fa-search"></i></div></template>
                <template v-slot:right><div class="pr-10 pl-5  d-flex-v-center"><i class="fas fa-eye"></i></div></template>
            </InputBox>
        </div>
        <h4 class="mb-15">Example of small input</h4>
        <div style="max-width:300px">
            <InputBox  size="sm" resetVal @reset="resetData" name="inputsmall" autocomplete="off" placeholder="Placeholder" :showDetail="true" ></InputBox>
        </div>
        <h4 class="mb-15">Example Of disabled</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="disableInput = !disableInput">Disabled</div>
        <div style="max-width:200px">
            <InputBox :disabled="disableInput" resetVal @reset="resetData" name="inputdisable" autocomplete="off" placeholder="Placeholder" :showDetail="true" ></InputBox>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <div>
            [left, right] for cutom icon or others for left and right slot
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            v-model<br>
            placeholder<br>
            name [Form input field name]<br>
            rows [Options:sm]<br>
            resetVal [if true, reset value icon will show]<br>
            autocomplete [Enable disable browser autocomplete]<br>
            showDetail [Maintain space for error, success, warning msg |  Default value is false]<br>
            message [message like error or warning]<br>
            messageType [message type Ex:error, warning, success, no value will show plain text]<br>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Events</div>
        <div>
            
        </div>
    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch  } from 'vue';
    import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js'
    import {useRoute} from 'vue-router';
    import * as Yup from 'yup';
    import PageLayout from '@/components/layout/PageLayout.vue'
    import InputBox from '@/components/form/InputBox.vue'

    initializeValidator();

    const inputModel = ref()
    const inputModelNoName = ref();
    const disableInput = ref(true)

    const changeValue = (e) => {
       inputModel.value = 'Changed value'
    }
    const resetData = (e) => {

    }

    //End search
    const genValidate = setValidators(["inputbox", "inputboxwm"])
    const validateFormGen = async () => {
        let chk = await validate(genValidate);
        alert(JSON.stringify(chk, null, 2));
       
        console.log(chk)
    }
    const setErrorGen = () => {
        setErrors({"selectbox": ["selectbox"],"void_reason": ["The void reason field is required."]})
        //setFieldError("validate", 'hasError')
    }
</script>