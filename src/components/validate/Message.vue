<template>
    <div :class="['message--container', {'message--error':messaging.type == 'error'}, {'message--warning':messaging.type == 'warning'}, {'message--success':messaging.type == 'success'}, {'message--info':messaging.type == 'info'}]" :style="{height:height}">
        <div v-if="messaging.type" class="message--icon">
            <span v-if="messaging.type == 'error'" class="far fa-info-circle"></span>
            <span v-if="messaging.type == 'success'" class="far fa-check-circle"></span>
            <span v-if="messaging.type == 'warning'" class="far fa-exclamation-circle"></span>
            <span v-if="messaging.type == 'info'" class="far fa-info-circle"></span>
        </div>
        <div class="message--text">{{messaging.msg}}</div>
        <input type="hidden" :name="name" />
    </div>
</template>

<script setup>
    import { watchEffect, ref, reactive, toRef } from 'vue';
    import { useField } from 'vee-validate';
    import { validVar } from '@/functions/com.js';
    const props = defineProps({
        name: String,
        validateValue: String | Number | Boolean,
        message:String,
        height:String,
        type:String,
        validate: Array | Object,
    })
    var tempValue = ref();
    var errorMessage = ref();
    if(props.name){
        var name = toRef(props, 'name');
        var {value: tempValue, errorMessage} = useField(name, props.validate);
    }
    const messaging = reactive({
        status:false,
        type:null,
        msg:'',
    })
    watchEffect(()=>{
        tempValue.value = props.validateValue;
    })

    watchEffect(()=>{
        if(validVar(props.message)){
            messaging.status = true;
            messaging.type = props.type;
            messaging.msg = props.message;
        }else if(validVar(errorMessage.value)){
            messaging.status = true;
            messaging.type = 'error';
            messaging.msg = errorMessage.value;
        }else{
            messaging.status = false;
            messaging.type = null;
            messaging.msg = '';
        }
    })
</script>
