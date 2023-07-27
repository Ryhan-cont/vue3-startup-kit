<template>
    <PageLayout :header="useRoute().meta.pageTitle" background="transparent" goBackRoute="labels" padding="0px" style="max-width:748px" @getLayoutSize="screenWidth = $event.W">
        <form method="post" @submit="onSubmit" id="label-form">
            <div class="w-100 bg-white pa-30">
                <div class="col-wrap input-group-container">
                    <div class="col-6 col-12-sm input-container">
                        <div class="input-title">Label Name:<span class="input-title-require">*</span></div>
                        <div>
                            <InputBox :validate="Yup.string().required()" name="name" :showDetail="true" v-model="labelStore.createLabel.formData.name" placeholder="e.g Adam" />
                        </div>
                    </div>
                    <div class="col-6 col-12-sm input-container">
                        <div class="input-title">Pick A Color:<span class="input-title-require">*</span></div>
                        <div>
                            <SelectBox placeholder="Select Color" v-model="labelStore.createLabel.formData.background_color_code" name="country" :showDetail="true" disableOnClickOptionClose>
                                <template v-slot:input>
                                    <div class="d-flex-v-center pl-20 text-b3-meta color-mid">
                                        <div class="d-flex-center radius-2" :style="{backgroundColor:labelStore.createLabel.formData.background_color_code, height:'20px', width:'30px'}">
                                            <div :style="{color:labelStore.createLabel.formData.text_color_code}" class="font-14">Aa</div>
                                        </div>
                                        <span class="mt-1 ml-10">{{ labelStore.createLabel.formData.background_color_code }}</span>
                                    </div>
                                </template>
                                <template v-slot:outerOption="{closeOptions}" >
                                    <div class="pa-12">
                                        <div class="color-dark text-b4-medium mb-10">Select Color</div>
                                        <SiteColorPicker @pick="loadColor($event, closeOptions)" />
                                    </div>
                                </template>
                            </SelectBox>
                        </div>
                    </div>
                </div>
                <div>
                    <BtnBox class="btn-primary btn-mid">Save</BtnBox>
                </div>
            </div>
        </form>
        
    </PageLayout>
</template>
<script setup>
    /**
     * *Import plugin
     */
    import { ref, reactive, watch, onMounted, onUnmounted,  } from 'vue';
    import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js';
    import * as Yup from 'yup';
    import {useRoute} from 'vue-router';
    import { useForm } from "vee-validate";
    /**
     * * Import page Component 
     */
    import PageLayout from '@/components/layout/PageLayout.vue'
    import DataTable from '@/components/table/DataTable.vue';
    import Modal from '@/components/pop/Modal.vue';
    import BtnGroup from '@/components/form/BtnGroup.vue';
    import ResultPerPage from '@/components/navigation/ResultPerPage.vue';
    import Pagination from '@/components/navigation/Pagination.vue';
    import {useDashboardEnvelope} from '@/store/inbox/inbox'

    import BtnBox from '@/components/form/BtnBox.vue';
    import CheckBox from '@/components/form/CheckBox.vue';
    import RadioBox from '@/components/form/RadioBox.vue';
    import MessageBox from '@/components/form/MessageBox.vue';
    import InputBox from '@/components/form/InputBox.vue';
    import SelectBox from '@/components/form/SelectBox.vue';
    import BtnSlot from '@/components/form/BtnSlot.vue';
    import DatePicker from '@/components/others/DatePicker.vue';
    import SiteColorPicker from '@/components/others/SiteColorPicker.vue';

    /**
     * * Import Pinia State
     */
     import { useLabels } from '@/store/settings/labels/labels';

    /**
     * * Main Section (Variable & Constants)
     */
    const labelStore = useLabels();
    const route = useRoute();
    const { handleSubmit, setFieldError } = useForm();
    const loadColor = (e, closeOptions) => {
        if(e.bgColor != 'none'){
            labelStore.createLabel.formData.background_color_code = e.bgColor;
            labelStore.createLabel.formData.text_color_code = e.txtColor;
            closeOptions()            
        }
    }
    /**
     * * All Methods ...
     */

    onMounted(() => {
        resetFormData();
        if(route.params.id) {
            labelStore.editLabel(route.params.id);
        }
    });
    const onSubmit = handleSubmit(() => {
        let fs = new FormData(document.getElementById('label-form'));
        if(route.params.id) {
            fs.append("id", route.params.id);
        }
        fs.append("background_color_code", labelStore.createLabel.formData.background_color_code);
        fs.append("text_color_code", labelStore.createLabel.formData.text_color_code);
        labelStore.postLabel(fs, setFieldError);
    });
    const resetFormData = () => {
        labelStore.createLabel.formData = {
            name:'',
            background_color_code:'',
            text_color_code:'',
        }
    }
    
</script>