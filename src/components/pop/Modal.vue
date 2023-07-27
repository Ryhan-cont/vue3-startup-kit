<template>
    <div class="modal--container" @mousedown="mouseDownEvent" ref="modalContainerRef">
        <transition name="zoom-toggle">
            <div :class="['modal--view', mainViewClass]" :style="{maxWidth: `${props.width}px`}" v-if="toggle" ref="modalBody">
                <div :class="['modal--header', {'modal--header-no-border':noHeaderBorder === false}]" v-if="!noHeader">
                    <div class="flex-auto">
                        <slot name="header" />
                        <div class="modal--header-text" v-if="!slots['header']">
                            {{title}}
                        </div>
                    </div>
                    <div class="modal--close-btn"><i @click="closeModal" class="far fa-times cursor-pointer" v-if="hideCloseBtn === false"></i></div>
                </div>
                <div class="modal-body-container" :style="{maxHeight:modalMaxHeight}">
                    <slot />
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, useSlots, ref, onMounted, onBeforeUnmount } from 'vue';
    import { validVar } from '@/functions/com.js'
    const props = defineProps({
        title: {type: String, default: ''},
        width: {type: [Number, String], default: 550},
        noHeader: {type:Boolean, default: false},
        noHeaderBorder:{type:Boolean, default: false},
        closeOnOutsideClick:{type:Boolean, default: true},
        mainViewClass:{type:String, default:''},
        hideCloseBtn:{type:Boolean, default:false}
    })
    const emit = defineEmits(['closeModal']);
    const slots = useSlots();

    const modalContainerRef = ref()
    const toggle = ref(false);
    const modalBody = ref(null);
    const modalMaxHeight = ref('100%');

    const resizeObserver = new ResizeObserver(entries => {
        modalMaxHeightCalculator();
    })

    onMounted(()=>{
        toggle.value =  true;
        setTimeout(()=>{
            modalContainerRef.value.style.opacity = 1;
        }, 10)
        resizeObserver.observe(modalContainerRef.value)
    })

    onBeforeUnmount(()=>{
        resizeObserver.unobserve(modalContainerRef.value);
    })

    const modalMaxHeightCalculator = () => {
        modalMaxHeight.value = (window.innerHeight - 100)+'px';
    }

    const closeModal = () => {
        toggle.value = false;
        modalContainerRef.value.style.opacity = 0;
        setTimeout(()=>{
            emit('closeModal')
        }, 300)
    }
    const mouseDownEvent = (e) => {
        if(e.target.closest('.modal--view') == null){
            if(props.closeOnOutsideClick === true){
                closeModal()
            }else{
                modalBody.value.style.transition = 'all .1s'
                modalBody.value.style.scale = '1.01';
                setTimeout(()=>{
                    modalBody.value.style.scale = '';
                    modalBody.value.style.transition = 'all .3s'
                },100)
            }
        } 
    }

    defineExpose({ closeModal })

</script>