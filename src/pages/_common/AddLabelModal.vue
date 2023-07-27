<template>
    <Modal ref="newLabelModalRef" v-if="modalToggle" title="New Label" @closeModal="modalToggle=false">
        <form method="post" @submit="onSubmit" id="label-form">
            <div class="w-100 bg-white modal-body">
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
                    <BtnBox class="btn-primary btn-sm">Save</BtnBox>
                </div>
            </div>
        </form>
    </Modal>   
</template>
<script setup>
    import { ref, onMounted, computed,watchEffect } from 'vue';
    import * as Yup from 'yup';
    import { useForm } from "vee-validate";
    import {useRoute} from 'vue-router';
    import Modal from '@/components/pop/Modal.vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    import InputBox from '@/components/form/InputBox.vue';
    import SelectBox from '@/components/form/SelectBox.vue';
    import SiteColorPicker from '@/components/others/SiteColorPicker.vue';

     /**
     * * Import Pinia State
     */
    import { useLabels } from '@/store/settings/labels/labels';
    import {useDashboardTemplate} from '@/store/templateDashboard/templateDashboard';
    import {useDashboardEnvelope} from '@/store/inbox/inbox';
    import {useDashboardSentEnvelope} from '@/store/sent/sent';
    import {useDashboardDraftedEnvelope} from '@/store/drafts/drafts';
    const labelStore = useLabels();
    const templateStore = useDashboardTemplate();
    const envelopesStore = useDashboardEnvelope();
    const sentEnvelopesStore = useDashboardSentEnvelope();
    const draftedEnvelopesStore = useDashboardDraftedEnvelope();
    const route = useRoute();
    const props = defineProps({
        data: {type:Object, default:() => {}},
    })

    const newLabelModalRef = ref();
    const modalToggle = ref(false);

    const { handleSubmit, setFieldError } = useForm();

    const loadModal = () => {
        resetFormData();
        modalToggle.value = true;
    } 
    

    const loadColor = (e, closeOptions) => {
        if(e.bgColor != 'none'){
            labelStore.createLabel.formData.background_color_code = e.bgColor;
            labelStore.createLabel.formData.text_color_code = e.txtColor;
            closeOptions();            
        }
    }

    const onSubmit = handleSubmit(() => {
        let fs = new FormData(document.getElementById('label-form'));
        if(route.params.id) {
            fs.append("id", route.params.id);
        }
        fs.append("background_color_code", labelStore.createLabel.formData.background_color_code);
        fs.append("text_color_code", labelStore.createLabel.formData.text_color_code);
        labelStore.postLabel(fs, setFieldError, false);
        setTimeout(function(){
            //code goes here
            if(route.name == 'inbox' ){
                envelopesStore.getAllLabels();
            }else if(route.name == 'sent'){
                sentEnvelopesStore.getAllLabels();
            }else if(route.name == 'drafts'){
                draftedEnvelopesStore.getAllLabels();
            }else{
                templateStore.getAllLabels();
            }
            newLabelModalRef.value.closeModal();
            //modalToggle.value = false;
        }, 1000);
    });
    const resetFormData = () => {
        labelStore.createLabel.formData = {
            name:'',
            background_color_code:'',
            text_color_code:'',
        }
    }

    // watchEffect((route) => {
    //     console.log(route);
    // });

    defineExpose({ loadModal })
</script>