<template>
    <div class="otp-imput--main">
        <div class="otp-imput--container">
            <div class="otp-imput--item" @paste="onPaste(item)" v-for="item in boxCountConst" :key="item">
                <input :style="{borderColor: messaging.status === true ? '#FF0003' : '', color: '#4D4D4D' }" type="text" maxlength="1" ref="inputRef" @click="onFocus" @input="updateValue(item)" v-model="modelValueTemp[item]" />
            </div>
        </div>
        <div class="otp-imput--detail" v-if="showDetail">
            <Message v-if="messaging.status === true" :message="messaging.msg" :type="messaging.type"  />
        </div>
        <input type="hidden" :value="joinedInputs" :name="name" />
    </div>
</template>

<script setup>
    import { ref, watchEffect, toRef, reactive } from 'vue'
    import { useField } from 'vee-validate';
    import { validVar } from '@/functions/com.js';
    import Message from '@/components/validate/Message.vue';
    const props = defineProps({
        modelValue: String | Number | Boolean,
        name: String,
        disabled: {type:Boolean, default:false},
        readonly: {type:Boolean, default:false},
        size: {type: String, default:''},
        showDetail:{type: Boolean, default:false},
        boxCount: {type: Number, default:6},
        validate: Array | Object,
        message:String,
        messageType:{type:String, default:null},
    })

    var joinedInputs = ref()
    var errorMessage = ref();
    if(props.name){
        var name = toRef(props, 'name');
        var {value: joinedInputs, errorMessage} = useField(name, props.validate);
    }
    const emit = defineEmits(['update:modelValue', 'change']);

    const boxCountConst = ref(props.boxCount)
    const inputRef = ref()
    const modelValueTemp = reactive({});
    const messaging = reactive({
        status:false,
        type:null,
        msg:'',
    });

    for(var i = 1; (props.boxCount + 1) > i; i++){
        modelValueTemp[i] = '';
    }
    watchEffect(()=>{
        if(props.modelValue){
            for(let i = 0; props.modelValue.length > i; i++){
                let refId = i+1;
                if(refId > 0 && refId <= boxCountConst.value){
                    modelValueTemp[refId] = props.modelValue[i];
                }
            }
        }
    });
    watchEffect(()=>{
        if(validVar(props.message)){
            messaging.status = true;
            messaging.type = props.messageType;
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
    const onPaste = async (item) => {
        let text = await navigator.clipboard.readText();
        let pasteSer = item;
        for(let i = 0; text.length>i; i++){
            if(pasteSer > 0 && pasteSer <= boxCountConst.value){
                modelValueTemp[pasteSer] = text[i];
                inputRef.value[pasteSer - 1].focus()
            }
            pasteSer++
        }
        joinedInputs.value = JoinValue();
        emit('update:modelValue',joinedInputs.value);
        emit('change',joinedInputs.value);
    }
    const onFocus = (e) => {
        e.target.select()
    }
    const JoinValue = () => {
        let fullCode = '';
        for(let key in modelValueTemp){
            fullCode = fullCode+modelValueTemp[key];
        }
        return fullCode
    }
    const updateValue = (item) => {
        if(inputRef.value[item] && validVar(inputRef.value[item-1].value)){
            inputRef.value[item].focus()
            inputRef.value[item].select()
        }
        joinedInputs.value = JoinValue();
        emit('update:modelValue',joinedInputs.value);
        emit('change',joinedInputs.value);
    };
</script>