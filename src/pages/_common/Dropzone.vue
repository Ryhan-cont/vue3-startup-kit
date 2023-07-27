<template>
    <div>
        <div class="drop-zone-container" @drop.prevent="dropFile" @dragover.prevent @click="uploadBtn">
            <div class="drop-zone-left">
                <div class="">
                    <div class="color-mid text-b1-bold">{{title}}</div>
                    <div class="text-b3-meta mt-5">{{subTitle}}</div>                
                </div>
            </div>
            <div class="drop-zone-right">
                <BtnBox class="btn-secondary-outlined btn-sm"><span class="far fa-cloud-upload-alt font-14 mr-10"></span>Browse</BtnBox>
            </div>
        </div>
        <Message class="mt-10" v-if="error" :message="error" type="error" />
    </div>
</template>

<script setup>
    import {ref} from 'vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    import Message from '@/components/validate/Message.vue';

    const props = defineProps({
        acceptedFileType:{type:Array, default:()=>['application/pdf', 'image/png', 'image/jpeg', 'text/csv']},
        title:{type:String, default:'Drop your file here or Browse'},
        subTitle:{type:String, default:''},
        multiple:{type:Boolean, default:true},
        maxFileSize:{type:Number, default:10240}
    })

    const error = ref(null);
    const emit = defineEmits(['upload']);

    const dropFile = (e) => {
        error.value = null;
        let files = e.dataTransfer.files;
        validateFiles(files);
    }
    
    const uploadBtn = () => {
        error.value = null;
        let fileData = document.createElement('input');
        fileData.type = 'file';
        fileData.accept = props.acceptedFileType;
        // fileData.multiple = true;
        fileData.multiple = props.multiple;
        fileData.click();
        fileData.onchange = e => {
            if(e.target.files) {
                validateFiles(e.target.files);
            }
        }
    }

    const validateFiles = (files) => {
        let err = false;
        for(let item of files){
            if(!props.acceptedFileType.includes(item.type)){
                err = 'File type not supported.'
                break;
            }
            if(item.size>props.maxFileSize*1024){
                err = 'File size must be less then '+(props.maxFileSize/1024)+' MB.'
                break;
            }
        }
        if(err === false){
            emit('upload',files);
        }else{
            error.value = err;
        }
    }
</script>