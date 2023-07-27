<template>
    <div class="modal-body">
        <div class="flex-auto col-wrap input-group-container">
            <div class="col-12 input-container">
                <div class="input-title">Full Name:<span class="input-title-require">*</span></div>
                <InputBox :validate="Yup.string().required()" @change="createStampTemplate()" name="stamp-full-name" v-model="fullName" :showDetail="true" placeholder="e.g Adam" />
            </div>
        </div>
        <h5 class="color-dark mb-20 mb-10-sm">Make Your Own Stamp</h5>  
        <BtnGroup :defaultSelected="hidePreLoad === false && hasMyContent === true ? 'My Stamp' : 'Upload New'" v-slot="{ activateBtn, btnStyle }">
            <div v-if="hidePreLoad === false && hasMyContent === true" :class="btnStyle('My Stamp')" @click="changeStampType(activateBtn,'My Stamp')">My Stamp</div>
            <div :class="btnStyle('Create')" @click="changeStampType(activateBtn,'Create')">Create</div>
            <div :class="btnStyle('Upload New')" @click="changeStampType(activateBtn,'Upload New')">Upload New</div>
        </BtnGroup> 
        <div v-if="selectedTab == 'My Stamp'">
            <div class="my-stamp-list">
                <div class="stamp-list-inner" v-if="preStampData.length > 0">
                    <div :class="['my-stamp', selectedStamp === index ? 'active' : '']" @click="selectedStamp = index; isStampSaveError = ''" v-for="(item, index) in preStampData" :key="index">
                        <img :src="'data:image/png;base64,'+item.stamp_image_path" alt="stamp">
                    </div>
                </div>
                <div v-else class="d-flex-center" style="height:100px">
                    No item to show
                </div>
           </div>
        </div>
        <div v-if="selectedTab == 'Create'" class="pa-30 ba-2 border-border-primary radius-4 mt-10">
            <!-- <img :src="circleStampImg" /> -->
            <div class="position-relative d-inline-block pa-11 radius-6" :style="{border: selectedCustomStamp == 'squire' ? '1px dashed #8D4CF6' : '1px dashed transparent'}">
                <img :src="squireStampImg" style="width:85px" class="cursor-pointer" @click="selectedCustomStamp = 'squire'; stampCreatedImage = squireStampImg; isStampSaveError = ''" />
                <div class="position-abs box-15 bg-primary d-flex-center font-10 color-white round-div" style="top:-7px; right:-7px" v-if="selectedCustomStamp == 'squire'">
                    <span class="fas fa-check"></span>
                </div>
            </div>
            
        </div>
        <div v-if="selectedTab == 'Upload New'">
            <div class="text-b2-field color-secondary mt-10">Preview:</div>
            <div class="mt-10">
                <label>
                    <input type="file" class="d-none"  @change="onFileChange($event)" />
                    <div v-if="!stampUploadedImage" class="d-grid pt-40 pb-50 bda-2 border-border-grey">
                        <div class="mx-auto text-b1-bold color-b2">Upload or Drag Stamp</div>
                        <div class="mx-auto mt-15"><div class="btn-secondary-outlined px-15 py-8 cursor-pointer radius-4 d-flex-v-center transition-3"><span class="far fa-cloud mr-10"></span>Upload Stamp</div></div>
                    </div>
                    <div v-else class="d-flex-center pa-20 bda-2 border-border-grey">
                        <img :src="stampUploadedImage" class="mxw-100" style="max-height:250px" />
                    </div>
                </label>
            </div>
        </div>
        <Message v-if="isStampSaveError != ''" class="mt-5" :message="isStampSaveError" type="error"  />
        <div v-if="hidePreLoad === false" class="text-b3-meta color-mid mt-20">
            By selecting Adopt and Stamp, I agree that the stamp and initials will be the electronic representation of my stamp and initials for all purposes when I (or my agent) use them on documents, including legally binding contracts - just the same as a pen-and-paper stamp or initial.
        </div>
        <div class="mt-20 d-flex">
            <BtnBox class="btn-secondary-outlined mr-20 btn-mid" @click="closeModal">Cancel</BtnBox>
            <BtnBox class="btn-primary btn-mid" @click="saveStamp">Save</BtnBox>
        </div>
    </div>
</template>
<script setup>
    /**
    * *Import plugin
    */
    import { ref, onMounted, watchEffect  } from 'vue';
    import { base64ToCanvas, clearExtraCanvasBackground } from '@/functions/imageProcessor.js';
    import { circleStamp, squireStamp  } from '@/functions/stampProcessor.js';
    import {initializeValidator,setValidators,validate} from "@/functions/validate.js";
    import * as Yup from 'yup';
    /**
    * * Import Component 
    */

    import BtnGroup from '@/components/form/BtnGroup.vue';
    import InputBox from '@/components/form/InputBox.vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    import Message from '@/components/validate/Message.vue';

    initializeValidator();
    const genValidate = setValidators(["stamp-full-name"]);

    const props = defineProps({
        fullName:{type:String, default:''},
        hidePreLoad:{type:Boolean, default:false},
        preStampData:{type:Array, default: ()=> []},
        hasMyContent:{type:Boolean, default:true},
    })
    /**
    * Vars
    */
    const isStampSaveError = ref('');
    const fullName = ref('');
    const stampUploadedImage = ref('');
    const stampCreatedImage = ref('');
    const stampSelectedImage = ref('');
    const selectedTab = ref(props.hidePreLoad === false && props.hasMyContent === true ? 'My Stamp' : 'Upload New');
    const selectedStamp = ref(null);
    const selectedCustomStamp = ref(null);
    const circleStampImg = ref(null);
    const squireStampImg = ref(null);

    const emit = defineEmits(['closeModal', 'save']);

    const changeStampType = async (activateBtn, name) => {
        activateBtn(name);
        selectedTab.value = name;
        isStampSaveError.value = '';

        if(name == 'Create'){createStampTemplate()}
    }

    const createStampTemplate = async () => {
        //console.log('created..')
        //circleStampImg.value = await circleStamp(fullName);
        squireStampImg.value = await squireStamp(fullName.value);
    }

    const closeModal = () => {
        emit('closeModal');
    }

    const saveStamp = async () => {
        let validateInput = await validate(genValidate);
        if (validateInput.status === true && isStampSaveError.value == '') {
            let returnStampImg = '';

            if(selectedTab.value == 'Upload New' && stampUploadedImage.value == '' ){
                isStampSaveError.value = 'Please upload a stamp before save';
            }else if(selectedTab.value == 'Upload New'){returnStampImg = stampUploadedImage.value}

            if(selectedTab.value == 'Create' && stampCreatedImage.value == ''){
                isStampSaveError.value = 'Please create stamp before save';
            }else if(selectedTab.value == 'Create'){returnStampImg = stampCreatedImage.value}

            if(selectedTab.value == 'My Stamp' && selectedStamp.value == null){
                isStampSaveError.value = 'Please select stamp before save';
            }else if(selectedTab.value == 'My Stamp'){
                returnStampImg = 'data:image/png;base64,'+props.preStampData[selectedStamp.value].stamp_image_path;
            }

            if (validateInput.status === true && isStampSaveError.value == '') {
                emit('save',{
                    fullName: fullName.value,
                    stampImg: returnStampImg,
                    type: selectedTab.value
                });                
            }
        }
    }
    const onFileChange = async (e) => {
        isStampSaveError.value = ''
        if(e.target.files[0]){
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let interv = setInterval(async ()=>{
                if(reader.result){
                    clearInterval(interv)
                    let canvas = await base64ToCanvas(reader.result)
                    let img = clearExtraCanvasBackground(canvas.canvas, {width:canvas.width, height:canvas.height})
                    stampUploadedImage.value = img;

                }
            },1)            
        }
    }

    watchEffect(() => {fullName.value = props.fullName})
</script>

<style lang="scss" scoped>
    .my-stamp-list {
        margin-top: 10px;
        .stamp-list-inner {
            border: 2px solid #B9EBF1;
            border-radius: 4px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            .my-stamp {
                border-radius: 6px;
                padding: 10px;
                margin: 15px 10px;
                text-align: center;
                position: relative;
                border: 2px solid transparent;
                img {
                    height: 90px;
                }
                &.active {
                    border: 2px dashed #8D4CF6;
                    &:after {
                        content: '\f00c';
                        font-family: 'Font Awesome 5 Pro';
                        height: 15px;
                        width: 15px;
                        line-height: 16px;
                        background-color: var(--primary);
                        border-radius: 50%;
                        text-align: center;
                        font-size: 10px;
                        color: var(--white);
                        display: block;
                        position: absolute;
                        top: -7px;
                        right: -7px;
                    }
                }
            }
        }
    }
</style>