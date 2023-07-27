<template>
    <div :class="['cc-input-box--container', size != '' ? `cc-input-box--container-${size}`: '', {'cc-input-box--disabled read-only':disabled}, {'read-only':readonly}]">
        <div :class="['cc-input-box--main', {'site-input-focus':focus}, `cc-input-message--${messaging.type}`, {'cc-input-box--no-border':noBorder}]">
            <slot name="left" />
            <div :class="['cc-input-box--boundary', {'cc-input-box--hine-spinner':noSpinner !== false}]">
                <input 
                    :class="['cc-input-box--input', {'cc-input-box--input-padding-left':!slots['left']}, {'cc-input-box--input-padding-right':!slots['right']}]" 
                    :type="inputType"
                    :placeholder="placeholder"
                    v-model="modelValueTemp"
                    @input="updateValue($event.target.value)"
                    @change="changedValue($event.target.value)"
                    @focus="processFocus"
                    @blur="focus = false"
                    :name="name"
                    :min="min"
                    :max="max"
                    :id="elID"
                    :autocomplete="autocomplete"
                    :style="resetVal && validVar(modelValueTemp) && !disabled ? 'padding-right:5px':''"
                    ref="inputRef"
                />
                <span v-if="inputType == 'number' && noSpinner === false" class="fas fa-sort position-abs font-20 color-light bg-white pl-5" :style="{right:!slots['right'] ? '13px' : '0px', top:'calc(50% - 10px)', pointerEvents: 'none'}"></span>
            </div>
            <div class="cc-input-box--reset" @click="reset" v-if="resetVal && !disabled" :style="slots['right'] ? 'padding-right:0px':''"><i v-if="validVar(modelValueTemp)" class="far fa-times"></i></div>
            <slot name="right" />
        </div>
        <div class="cc-input-box--detail" v-if="showDetail">
            <Message v-if="messaging.status === true" :message="messaging.msg" :type="messaging.type"  />
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, ref, watch, watchEffect, useSlots, toRef, reactive, onMounted } from 'vue';
    import { useField } from 'vee-validate';
    import { validVar, randomString } from '@/functions/com.js';
    import Message from '@/components/validate/Message.vue';
    const props = defineProps({
        modelValue: String | Number,
        placeholder: String,
        name: String,
        size: {type: String, default:''},
        disabled: {type:Boolean, default:false},
        readonly: {type:Boolean, default:false},
        inputType: {type: String, default:'text'},
        resetVal: {type: Boolean, default:false},
        autocomplete: String,
        showDetail:{type: Boolean, default:false},
        message:String,
        messageType:String,
        validate: Array | Object,
        noBorder:{type: Boolean, default:false},
        min:{default:''},
        max:{default:''},
        id:{default:''},
        noSpinner:{type: Boolean, default:false},
        selectOnFocus:{type: Boolean, default:false},
    })

    var modelValueTemp = ref();
    var errorMessage = ref();

    if(props.name){
        var name = toRef(props, 'name');
        var {value: modelValueTemp, errorMessage, setErrors} = useField(name, props.validate);
    }

    const inputRef = ref()

    const elID = validVar(props.id) ? props.id : 'input-'+randomString(50, '0123456789abcdefghijklmnopqrstuvwxyz');
    const focus = ref(false);
    const emit = defineEmits(['update:modelValue', 'reset', 'input', 'change']);
    const slots = useSlots();
    const showErr = ref(false);
    const messaging = reactive({
        status:false,
        type:null,
        msg:'',
    })

    onMounted(()=>{
        setTimeout(()=>{
            if(props.name){setErrors([]);}
            showErr.value = true;
        },1000)            
        modelValueTemp.value = props.modelValue;
    })

    watch(() => props.modelValue, () => {
        modelValueTemp.value = props.modelValue;
    })

    watchEffect(()=>{
        if(validVar(props.message)){
            messaging.status = true;
            messaging.type = props.messageType;
            messaging.msg = props.message;
        }else if(validVar(errorMessage.value) && showErr.value){
            messaging.status = true;
            messaging.type = 'error';
            messaging.msg = errorMessage.value;
        }else{
            messaging.status = false;
            messaging.type = null;
            messaging.msg = '';
        }
    })
    const processFocus = () => {
        focus.value = true;
        if(props.selectOnFocus !== false){
            inputRef.value.select()
        }
    }
    const updateValue = (value) => {
        emit('update:modelValue',value);
        emit('input',value);
    };
    const changedValue = (value) => {
        emit('change',value);
    };
    const reset = () => {
        modelValueTemp.value = ''
        emit('update:modelValue','');
        emit('reset','');
    };
</script>