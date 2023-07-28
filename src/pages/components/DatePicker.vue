<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h4 class="mb-15">Single Date Picker {{ dateVal }}</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="dateVal = '1-24-2022'">change date</div>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20 ml-20" @click="validateFormGen()">Validate</div>
        <div>
            <DatePicker style="width: 250px;" :validate="Yup.date().nullable().required()" showDetail v-model="dateVal" format="MM-yyyy-dd" name="single-date" />
        </div>
        <h4 class="mb-15 mt-20">Range Picker</h4>
        <div>
            <DatePicker style="width: 250px;" range v-model="rangeValue" format="MM-yyyy-dd" />
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <h4 class="mb-15 mt-20">Range Preset</h4>
        <div>
            <DatePicker style="width: 250px;" range applyButton rangePreset v-model="rangeValue" />
        </div>
        <h4 class="mb-15 mt-20">Min Max Date</h4>
        <div>
            <DatePicker style="width: 250px;" range :maxDate="maxDate" :minDate="minDate" v-model="rangeValue" reset />
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <div>

        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            name: <br>
            disabled: <br>
            readonly: <br>
            size: <br>
            showDetail: <br>
            separator: <br>
            format: <br>
            validate: <br>
            message: <br>
            messageType: <br>
            range: <br>
            applyButton: <br>
            maxDate: <br>
            minDate: <br>
            rangePreset: <br>
        </div>
    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch  } from 'vue';
    import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js'
    import * as Yup from 'yup';
    import {useRoute} from 'vue-router';
    import PageLayout from '@/components/layout/PageLayout.vue'
    import DatePicker from '@/components/others/DatePicker.vue'

    initializeValidator();

    const dateVal = ref('2022/7/23');
    const disableInput = ref(true);
    const readonly = ref(true);

    const minDate = ref(new Date('2022/10/5'));
    const maxDate = ref(new Date('2022/10/20'));

    const rangeValue = ref('2022/7/23~2022/10/23')


    const genValidate = setValidators(["single-date"])
    const validateFormGen = async () => {
        let chk = await validate(genValidate);
        alert(JSON.stringify(chk, null, 2));
    }
</script>