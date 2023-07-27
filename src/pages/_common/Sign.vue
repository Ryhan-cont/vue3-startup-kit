<template>
    <div class="modal-body">
        <div class="flex-auto col-wrap input-group-container">
            <div class="col-6 input-container">
                <div class="input-title">Full Name:<span class="input-title-require">*</span></div>
                <div>
                    <InputBox :validate="Yup.string().required()" name="sign-full-name" v-model="fullName" :showDetail="true" placeholder="e.g Adam" />
                </div>
            </div>
            <div class="col-6 input-container">
                <div class="input-title">Initials:<span class="input-title-require">*</span></div>
                <div>
                    <InputBox :validate="Yup.string().required()" name="sign-innitial" v-model="initials" :showDetail="true"  placeholder="e.g Wilson" />
                </div>
            </div>
        </div>
        <h5 class="color-dark mb-20">Make Your Own Signature</h5>  
        <BtnGroup :defaultSelected="hidePreLoad === false && hasMyContent === true ? 'My Signature' : 'Select Style'" v-slot="{ activateBtn, btnStyle }">
            <div :class="btnStyle('My Signature')" @click="changeSignatureType(activateBtn,'My Signature')" v-if="hidePreLoad === false && hasMyContent === true">My Signature</div>
            <div :class="btnStyle('Select Style')" @click="changeSignatureType(activateBtn,'Select Style')">Select Style</div>
            <div :class="btnStyle('Draw')" @click="changeSignatureType(activateBtn,'Draw')">Draw</div>
            <div :class="btnStyle('Upload New')" @click="changeSignatureType(activateBtn,'Upload New')">Upload New</div>
        </BtnGroup> 
        <div v-if="selectedTab == 'My Signature'">
            <div class="my-signature-list" v-if="preSignedData.length>0">
                <div class="signature-item" v-for="(item, index) in preSignedData" :key="index">
                    <div class="signature-inner">
                        <div class="d-flex-v-center" @click="selectedImageIndex = index">
                            <RadioBox name="signing-modal-presign-item" v-model="selectedImageIndex" :radioValue="index" />
                            <div class="ml-10"> 
                                <img  :src="signType == 'initial' ? 'data:image/png;base64,'+item.initial_image_path : 'data:image/png;base64,'+item.signature_image_path" style="height:34px" />                       
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="d-flex-center my-signature-list" style="height:100px">
                No item to show
            </div>
        </div>
        <div v-if="selectedTab == 'Select Style'">
            <div class="d-flex  my-10">
                <div class="text-b2-field color-secondary flex-auto">Preview:</div>
                <div class="color-action font-14 d-flex-v-center cursor-pointer" @click="signTextOptions = true"><span class="far fa-plus mr-5 mt--2 font-13"></span>Change Style</div>
            </div>
            <div class="px-30 pt-45 pb-30 ba-2 radius-4 border-border-primary">
                <div class="d-flex" style="height:75px; font-size:40px">
                    <div :class="textStyleClass">{{ fullName }}</div>
                    <div :class="['pl-25', textStyleClass]">{{ initials }}</div>                    
                </div>
            </div>
        </div>
        <div v-if="selectedTab == 'Draw'">
            <div class="d-flex  mt-10">
                <div class="text-b2-field color-secondary flex-auto">Preview:</div>
            </div>
            <div class="col-wrap" style="margin-top: -28px;">
                <div :class="signType == '' ? 'mt-10 col-8 col-12-sm pr-10 pr-0-sm' : 'mt-10 col-12'" v-if="signType != 'initial'">
                    <div class="color-action font-14 d-flex-v-center cursor-pointer d-flex" @click="clearPad('sign')">
                        <span class="ml-auto pb-10">Clear</span>
                    </div>
                    <Pad height="200" ref="signPadRef" :path="signPathMemory" @update="getPadImg($event, 'sign')" @pathUpdate="getPath($event, 'sign')" />
                </div>
                <div :class="signType == '' ? 'mt-10 col-4 col-12-sm' : 'mt-10 col-12'" v-if="signType != 'signature'">
                    <div class="color-action font-14 d-flex-v-center cursor-pointer d-flex" @click="clearPad('initial')">
                        <span class="ml-auto pb-10">Clear</span>
                    </div>
                    <Pad height="200" ref="initialPadRef" :path="initialPathMemory" @update="getPadImg($event, 'initial')" @pathUpdate="getPath($event, 'initial')" />
                </div>
            </div>
        </div>
        <div v-if="selectedTab == 'Upload New'">
            <div class="text-b2-field color-secondary mt-10">Preview:</div>
            <div class="col-wrap">
                <div :class="[signType == '' ? 'mt-10 col-8 col-12-sm col-6-md pr-10 pr-0-sm' : 'mt-10 col-12']" v-if="signType != 'initial'">
                    <label>
                        <input type="file" class="d-none"  @change="onFileChange($event, 'sign')" />
                        <div v-if="!signUploadedImage" class="d-grid pt-40 pb-50 bda-2 border-border-grey">
                            <div class="mx-auto text-b1-bold color-b2">Upload or Drag Signature</div>
                            <div class="mx-auto mt-15"><div class="btn-secondary-outlined px-15 py-8 cursor-pointer radius-4 d-flex-v-center transition-3"><span class="far fa-cloud mr-10"></span>Upload Signature</div></div>
                        </div>
                        <div v-else class="d-flex-center pa-20 bda-2 border-border-grey">
                            <img :src="signUploadedImage" class="mxw-100" style="max-height:250px" />
                        </div>
                    </label>
                </div>
                <div :class="[signType == '' ? 'mt-10 col-4 col-6-md col-12-sm' : 'mt-10 col-12']"  v-if="signType != 'signature'">
                    <label>
                        <input type="file" class="d-none"  @change="onFileChange($event, 'initial')" />
                        <div v-if="!initialUploadedImage" class="d-grid pt-40 pb-50 bda-2 border-border-grey">
                            <div class="mx-auto text-b1-bold color-b2">Upload or Drag Initial</div>
                            <div class="mx-auto mt-15"><div class="btn-secondary-outlined px-15 py-8 cursor-pointer radius-4 d-flex-v-center transition-3"><span class="far fa-cloud mr-10"></span>Upload Signature</div></div>
                        </div>
                        <div v-else class="d-flex-center pa-20 bda-2 border-border-grey">
                            <img :src="initialUploadedImage" class="mxw-100" style="max-height:250px" />
                        </div>
                    </label>
                </div>
            </div>
        </div>
        <Message v-if="isSignDoneError != ''" class="mt-5" :message="isSignDoneError" type="error"  />
        <!-- <img :src="testImg" /> -->
        <div v-if="hidePreLoad === false" class="text-b3-meta color-mid mt-20">
            By selecting Adopt and Sign, I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on documents, including legally binding contracts - just the same as a pen-and-paper signature or initial.
        </div>
        <div class="mt-20 d-flex">
            <BtnBox class="btn-secondary-outlined mr-20 btn-mid" @click="closeModal">Cancel</BtnBox>
            <BtnBox class="btn-primary btn-mid" @click="saveSign">Save</BtnBox>
        </div>
        <div class="sign-font-options-container" v-if="signTextOptions && selectedTab == 'Select Style'">
            <div class="d-flex-v-center pa-20 bb-1 border-border-grey">
                <div class="flex-auto text-h5 color-dark">Header</div>
                <div class="cursor-pointer" @click="signTextOptions = false"><span class="far fa-times"></span></div>
            </div>
            <div class="sign-font-options">
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-great-vibes'}]" @click="textStyleClass = 'font-great-vibes'"><div class="font-great-vibes">{{ fullName }}</div><div class="pl-25 font-great-vibes">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-parisienne'}]" @click="textStyleClass = 'font-parisienne'"><div class="font-parisienne">{{ fullName }}</div><div class="pl-25 font-parisienne">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-sacramento'}]" @click="textStyleClass = 'font-sacramento'"><div class="font-sacramento">{{ fullName }}</div><div class="pl-25 font-sacramento">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-delafield'}]" @click="textStyleClass = 'font-delafield'"><div class="font-delafield">{{ fullName }}</div><div class="pl-25 font-delafield">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-montez'}]" @click="textStyleClass = 'font-montez'"><div class="font-montez">{{ fullName }}</div><div class="pl-25 font-montez">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-satisfy'}]" @click="textStyleClass = 'font-satisfy'"><div class="font-satisfy">{{ fullName }}</div><div class="pl-25 font-satisfy">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-ubuntu'}]" @click="textStyleClass = 'font-ubuntu'"><div class="font-ubuntu">{{ fullName }}</div><div class="pl-25 font-ubuntu">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-petit-formal'}]" @click="textStyleClass = 'font-petit-formal'"><div class="font-petit-formal">{{ fullName }}</div><div class="pl-25 font-petit-formal">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-grand-hotel'}]" @click="textStyleClass = 'font-grand-hotel'"><div class="font-grand-hotel">{{ fullName }}</div><div class="pl-25 font-grand-hotel">{{ initials }}</div></div>
                <div :class="['sign-font-option-item', {'sign-font-option-item-active': textStyleClass == 'font-caveat'}]" @click="textStyleClass = 'font-caveat'"><div class="font-caveat">{{ fullName }}</div><div class="pl-25 font-caveat">{{ initials }}</div></div>
            </div>            
        </div>
    </div>
</template>
<script setup>
    /**
    * *Import plugin
    */
    import { ref, onMounted, watchEffect  } from 'vue';
    import {initializeValidator,setValidators,validate,setErrors} from "@/functions/validate.js";
    import { loadFont, generateMarker, textToImage, base64ToCanvas, clearExtraCanvasBackground } from '@/functions/imageProcessor.js';
    import * as Yup from 'yup';
    /**
    * * Import Component 
    */
    import Pad from '@/components/others/Pad.vue';
    import BtnGroup from '@/components/form/BtnGroup.vue';
    import InputBox from '@/components/form/InputBox.vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    import Message from '@/components/validate/Message.vue';
    import RadioBox from '@/components/form/RadioBox.vue';

    import { useUser } from '@/store/settings/users/users';
    const userStore = useUser();

    const defaultSignatureSelect = (id) => {
        userStore.setDefaultSignature(id);
    }

    initializeValidator();
    const genValidate = setValidators(["sign-full-name", "sign-innitial"]);

    const props = defineProps({
        fullName:{type:String, default:''},
        initials:{type:String, default:''},
        envelopeId:{type:String, default:''},
        addMarker:{type:Boolean, default:false},
        hidePreLoad:{type:Boolean, default:false},
        signType:{type:String, default:''},
        preSignedData:{type:Array, default:()=>[]},
        hasMyContent:{type:Boolean, default:true},
    })
    /**
    * Vars
    */
    const signPadRef = ref(null);
    const initialPadRef = ref(null);
    const isSignDoneError = ref('');

    const fullName = ref('');
    const initials = ref('');

    const signPadImage = ref('');
    const initialPadImage = ref('');

    const signPathMemory = ref('');
    const initialPathMemory = ref('');

    const signUploadedImage = ref('');
    const initialUploadedImage = ref('');

    const signTextOptions = ref(false);
    const selectedTab = ref(props.hidePreLoad === false && props.hasMyContent === true ? 'My Signature' : 'Select Style');
    const textStyleClass = ref('font-great-vibes');
    const selectedImageIndex = ref(null);

    const testImg = ref()

    const emit = defineEmits(['closeModal', 'save']);

    const getPadImg = (e, type) => {
        isSignDoneError.value = ''
        if(type == 'sign'){
            signPadImage.value = e
        }else{
            initialPadImage.value = e
        }
    }
    const getPath = (e, type) => {
        if(type == 'sign'){
            signPathMemory.value = e
        }else{
            initialPathMemory.value = e
        }
    }
    const changeSignatureType = (activateBtn, name) => {
        activateBtn(name);
        signTextOptions.value = false;
        selectedTab.value = name;
        isSignDoneError.value = ''
    }
    const clearPad = (type) => {
        if(type == 'sign'){
            signPadRef.value.clear()
        }else{
            initialPadRef.value.clear()
        }
    }
    const closeModal = () => {
        emit('closeModal');
    }


    const saveSign = async () => {
        let validateInput = await validate(genValidate);

        isSignDoneError.value = ''
        if(selectedTab.value == 'Draw' && initialPadImage.value == '' && props.signType == 'initial'){
            isSignDoneError.value = 'Please sign before save';
        }
        if(selectedTab.value == 'Draw' && signPadImage.value == '' && props.signType == 'signature'){
            isSignDoneError.value = 'Please sign before save';
        }
        if(selectedTab.value == 'Draw' && (signPadImage.value == '' || initialPadImage.value == '') && props.signType == ''){
            isSignDoneError.value = 'Please sign before save';
        }

        if(selectedTab.value == 'Upload New' && initialUploadedImage.value == ''  && props.signType == 'initial'){
            isSignDoneError.value = 'Please upload a sign before save';
        } 
        if(selectedTab.value == 'Upload New' && signUploadedImage.value == ''  && props.signType == 'signature'){
            isSignDoneError.value = 'Please upload a sign before save';
        } 
        if(selectedTab.value == 'Upload New' && (signUploadedImage.value == '' || initialUploadedImage.value == '')  && props.signType == ''){
            isSignDoneError.value = 'Please upload a sign before save';
        } 

        if(selectedTab.value == 'My Signature' && selectedImageIndex.value == null){
            isSignDoneError.value = 'Please select before save';
        } 

        if (validateInput.status === true && isSignDoneError.value == '') {
            let returnSignImg = ''
            let returnInitialImg = ''

            if(props.signType == '' || props.signType == 'signature'){
                if(props.addMarker === false){
                    if(selectedTab.value == 'Draw'){
                        returnSignImg = signPadImage.value;
                    }
                    if(selectedTab.value == 'Select Style'){
                        returnSignImg = await textToImage(fullName.value, textStyleClass.value)
                    }
                    if(selectedTab.value == 'Upload New'){
                        returnSignImg = signUploadedImage.value;
                    } 
                    if(selectedTab.value == 'My Signature'){
                        returnSignImg = signUploadedImage.value;
                    } 
                }else{
                    if(selectedTab.value == 'Draw'){
                        returnSignImg = await generateMarker('img', 'signature', signPadImage.value, props.envelopeId)
                    }
                    if(selectedTab.value == 'Select Style'){
                        returnSignImg = await generateMarker('text', 'signature', {text:fullName.value, class:textStyleClass.value}, props.envelopeId)
                    }
                    if(selectedTab.value == 'Upload New'){
                        returnSignImg = await generateMarker('img', 'signature', signUploadedImage.value, props.envelopeId)
                    }    
                    if(selectedTab.value == 'My Signature'){ 
                        returnSignImg = await generateMarker('img', 'signature', 'data:image/png;base64,'+props.preSignedData[selectedImageIndex.value].signature_image_path, props.envelopeId)
                    }
                }
            }
            if(props.signType == '' || props.signType == 'initial'){
                if(props.addMarker === false){
                    if(selectedTab.value == 'Draw'){
                        returnInitialImg = initialPadImage.value;
                    }
                    if(selectedTab.value == 'Select Style'){
                        returnInitialImg =  await textToImage(initials.value, textStyleClass.value)
                    }
                    if(selectedTab.value == 'Upload New'){
                        returnInitialImg = initialUploadedImage.value;
                    } 
                }else{
                    if(selectedTab.value == 'Draw'){
                        returnInitialImg = await  generateMarker('img', 'initial', initialPadImage.value, props.envelopeId)
                    }
                    if(selectedTab.value == 'Select Style'){
                        returnInitialImg = await generateMarker('text', 'initial', {text:initials.value, class:textStyleClass.value}, props.envelopeId)
                    }
                    if(selectedTab.value == 'Upload New'){
                        returnInitialImg = await generateMarker('img', 'initial', initialUploadedImage.value, props.envelopeId)
                    }    
                    if(selectedTab.value == 'My Signature'){ 
                        returnInitialImg = await generateMarker('img', 'initial', 'data:image/png;base64,'+props.preSignedData[selectedImageIndex.value].initial_image_path, props.envelopeId)
                    }          
                }                
            }

            emit('save',{
                fullName: fullName.value,
                initials: initials.value,
                signType: props.signType,
                signImg: returnSignImg,
                initialImg: returnInitialImg,
                type: selectedTab.value
            });
        }
    }
    const onFileChange = async (e, type) => {
        isSignDoneError.value = ''
        if(e.target.files[0]){
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let interv = setInterval(async ()=>{
                if(reader.result){
                    clearInterval(interv)
                    let canvas = await base64ToCanvas(reader.result);
                    let img = clearExtraCanvasBackground(canvas.canvas, {width:canvas.width, height:canvas.height})
                    if(type == 'sign'){
                        signUploadedImage.value = img;
                    }else{
                        initialUploadedImage.value = img;
                    }
                }
            },1)            
        }

    }

    watchEffect(() => {fullName.value = props.fullName})
    watchEffect(() => {initials.value = props.initials})

    onMounted(()=>{
        loadFont()
    })

</script>

<style lang="scss" scoped>
    .sign-font-options-container{
        position: absolute;
        top:0;
        width:345px;
        right:0;
        bottom:0;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);
        background-color: var(--white);
        display: flex;
        flex-direction: column;
        border-radius: 0px 4px 4px 0px;
        overflow: hidden;
    }
    .sign-font-options-header{

    }
    .sign-font-options{
        flex: auto;
        overflow-y: auto;
        
    }
    .sign-font-option-item{
        display: flex;
        margin:8px 10px;
        padding: 10px;
        font-size: 20px;
        cursor:pointer;
        &:hover{
            background-color: var(--background);
        }
    }
    .sign-font-option-item-active{
        background-color: var(--border-primary) !important;
        pointer-events: none;
    }
    .my-signature-list {
        margin-top: 10px;
        .signature-item {
           border-bottom: 1px solid #D3D3D3;
            .signature-inner {
                margin: 6px 0;
                padding: 15px 20px;
                transition: 0.3s;
            }
            &:hover {
                .signature-inner {
                    background-color: #F4F5F7;
                }
            }
        }
    }
</style>