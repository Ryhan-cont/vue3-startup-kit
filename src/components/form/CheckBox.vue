<template>
    <div :class="['cc-check-box--container', {'read-only':readonly}]">
        <label class="cc-check-box--main">
            <div class="cc-check-box--input" :style="{marginBottom: label || slots['label'] ? '2px' : ''}">
                <input 
                    type="checkbox" 
                    :name="name" 
                    v-model="modelValueTemp"
                    @change="updateValue"
                    :disabled="disabled"
                />
            </div>
            <div v-if="label || slots['label']" :class="['cc-check-box--label', labelClasses]">
                <slot name="label" />
                <div v-if="!slots['label']" class="text-b3-meta color-mid">{{label}}</div>
            </div>
        </label>
    </div>
</template>

<script setup>
    import {watchEffect , ref, useSlots, toRef} from 'vue';
    import { useField } from 'vee-validate';
    const props = defineProps({
        modelValue: Boolean | String,
        name: String,
        disabled: {type:Boolean, default:false},
        readonly: {type:Boolean, default:false},
        size: {type: String, default:''},
        labelClasses: {type: String, default:''},
        label: {type: String, default:null},
    })
    if(props.name){
        var name = toRef(props, 'name');
        useField(name);
    }
    const emit = defineEmits(['update:modelValue', 'change']);
    const slots = useSlots();
    const modelValueTemp = ref();

    watchEffect(()=>{
        if(props.modelValue === true){
            modelValueTemp.value = true;
        }else{
            modelValueTemp.value = false;
        }
    });

    const updateValue = () => {
        emit('update:modelValue',modelValueTemp.value);
        emit('change',modelValueTemp.value);
    };
</script>
