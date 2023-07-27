<template>
    <div :class="['cc-radio-box--container', {'read-only':readonly}]">
        <label class="cc-radio-box--main">
            <div class="cc-radio-box--input">
                <input 
                    type="radio" 
                    :name="name" 
                    :value="radioValue"
                    v-model="modelValueTemp"
                    @change="updateValue"
                    :disabled="disabled"
                    :checked="checkedTemp"
                />
            </div>
            <div v-if="label || slots['label']" class="cc-radio-box--label">
                <slot name="label" />
                <div v-if="!slots['label']">{{label}}</div>
            </div>
        </label>
    </div>
</template>

<script setup>
    import { ref, watchEffect , useSlots, toRef } from 'vue'
    import { useField } from 'vee-validate';
    const props = defineProps({
        modelValue: String | Number | Boolean,
        name: String,
        disabled: {type:Boolean, default:false},
        checked: {type:Boolean, default:false},
        readonly: {type:Boolean, default:false},
        radioValue: String | Number | Boolean,
        size: {type: String, default:''},
        label: {type: String, default:null},
    })
    if(props.name){
        var name = toRef(props, 'name');
        useField(name);
    }
    const emit = defineEmits(['update:modelValue', 'change']);
    const slots = useSlots();

    const modelValueTemp = ref();
    const checkedTemp = ref(false)

    watchEffect(()=>{
        modelValueTemp.value = props.modelValue;
    });

    watchEffect(()=>{
        if(props.checked === true){
            checkedTemp.value = true;
        }else if(props.modelValue != undefined){
            if(props.radioValue === props.modelValue){
                checkedTemp.value = true;
            }else{
                checkedTemp.value = false;
            }            
        }
    });

    const updateValue = () => {
        emit('update:modelValue',modelValueTemp.value);
        emit('change',modelValueTemp.value);
    };
</script>
