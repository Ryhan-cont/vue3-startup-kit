<template>
    <div :class="['btn-group--container', {'btn-group--float': floatBtn}, {'btn-group--float-text-view': textView}]" ref="containerRef" :style="{gridTemplateColumns:floatBtnGrid}">
        <slot :activateBtn="activateBtn" :btnStyle="btnStyle" />

    </div>
</template>
<script setup>
    import { ref, watchEffect, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
    const props = defineProps({
        defaultSelected:{type:String, default:''},
        textView:{type:Number, default: 0}
    })
    const containerRef = ref();
    const btnSelected = ref('');
    const floatBtn = ref(false);
    const floatBtnGrid = ref('');
    const textView = ref(false);

    const resizeObserver = new ResizeObserver(entries => {
            layoutManage();
    })

    const activateBtn = (target) => {
        btnSelected.value = target;
    }

    const btnStyle = (target) => {
        if(btnSelected.value == target){
            return 'btn-group--item btn-group--active';
        }else{
            return 'btn-group--item';
        } 
    }
    const layoutManage = () => {
        if(containerRef.value){
            let screenX = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let els = containerRef.value.getElementsByClassName('btn-group--item');
            if((els.length*170) > containerRef.value.offsetWidth){
                floatBtn.value = true;
            }else{
                floatBtn.value = false;
            }
            let floatDivision = Math.round(containerRef.value.offsetWidth/250)
            let template = ''
            for(let i = 0; floatDivision > i; i++){
                template = template + '1fr '
            }
            floatBtnGrid.value = template;
            
            if(props.textView > screenX){
                floatBtn.value = false;
                textView.value = true;
                let template = ''
                for(let i = 0; els.length > i; i++){
                    template = template + '1fr '
                }
                floatBtnGrid.value = template;
            }else{
                textView.value = false;
            }
        }
    }
    watchEffect(()=>{
        btnSelected.value = props.defaultSelected;
    })
    onMounted(()=>{
        resizeObserver.observe(containerRef.value);
    })
    onBeforeUnmount(()=>{
        resizeObserver.unobserve(containerRef.value);
    })
</script>