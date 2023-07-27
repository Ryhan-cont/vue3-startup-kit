<template>
    <button :class="['btn', {'btn-disabled':disabled}, {'btn-loading':sloawLoader}, {'read-only':readonly}]" :type="btnType" ref="btnRef" :style="{width:block ? '100%' : btnWidth}">
        <div v-if="sloawLoader">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block; shape-rendering: auto;" width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <circle cx="50" cy="50" r="32" stroke-width="14" stroke="#FFFFFF" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round">
                    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
                </circle>
            </svg>
        </div>
        <slot v-else />
    </button>
</template>

<script setup>
    import { watchEffect, ref, nextTick } from 'vue';
    const props = defineProps({
        btnType: String,
        disabled: {type:Boolean, default:false},
        loading: {type:Boolean, default:false},
        readonly: {type:Boolean, default:false},
        block: {type:Boolean, default:false},
    })
    const btnWidth = ref();
    const sloawLoader = ref();
    const btnRef = ref();
    
    watchEffect(async ()=>{
        if(props.loading === true){
            btnWidth.value = btnRef.value.offsetWidth + 'px';
            await nextTick();
            sloawLoader.value = true;
        }else{
            btnWidth.value = 'auto';
            sloawLoader.value = false;
        }
    })
</script>
