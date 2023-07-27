<template>
    <div class="menu--container">
        <div class="menu--preview" ref="previewRef" @click="toggleOption" style="box-sizing: content-box !important;">
            <slot name="preview" />
        </div>
        <transition :name="dropdownAnimation">
            <div class="menu--options" ref="optionContainerRef" v-if="toggle">
                <slot name="menu" :closeMenu="closeOptions" />
            </div>
        </transition>            
    </div>
</template>

<script setup>
    import { ref, nextTick } from 'vue'
    import { findScrollEl, calcFixedMenuPosition, dropZone, screenSize } from '@/functions/drop.js';
    const props = defineProps({
        closeOnClick:{type: Boolean, default:false},
        alignMenu:{type:String, default:'center'},
        fixed:{type:Boolean, default:false}
    })
    const optionContainerRef = ref();
    const previewRef = ref();

    const toggle = ref(false);
    const scrollableEl = ref([]);
    const dropdownAnimation = ref('dropdown');
    const optionWidth = ref(0);

    const toggleOption = async (e) => {
        if(toggle.value === false){
            toggle.value = true;
            await nextTick();

            dropdownAnimation.value = dropZone(previewRef.value, optionContainerRef.value);
            optionWidth.value = optionContainerRef.value.offsetWidth;

            toggle.value = false;
            await nextTick();

            //Reinnitialize to make effect transition
            toggle.value = true;
            await nextTick();

            optionContainerRef.value.style.display = 'none';
            document.body.appendChild(optionContainerRef.value)
            positioning('innitial');

            //Events
            addEvents();

        }else{
            closeOptions();
        }
    }
    
    const positioning = (e) =>{
        let optionEl = optionContainerRef.value;
        let position = calcFixedMenuPosition(previewRef.value, optionWidth.value, dropdownAnimation.value, props.alignMenu);

        //Make options visiable
        optionEl.style.position = position.menuPosition;
        optionEl.style.top = position.top;
        optionEl.style.bottom = position.bottom;
        optionEl.style.left = position.left;
        optionEl.style.right = position.right;
        optionEl.style.width = position.width;
        optionEl.style.display = 'block';
        optionEl.style.opacity = 1;
    }

    const closeOptions = (dt) => {
        if(props.closeOnClick === false){
            if(dt && dt.type != 'resize' && dt.type != 'scroll' && dt.target && dt.target.closest('.menu--options') != null){return}
        }
        if(dt && dt.type != 'resize' && dt.type != 'scroll' && dt.target && dt.target.closest('.menu--preview') != null){return}
        
        if(dt && (dt.type == 'resize' || dt.type == 'scroll')){
            optionContainerRef.value.style.transition = '0s'
        }

        removeEvents();

        toggle.value = false;
    }

    const addEvents = () => {
        document.addEventListener('mousedown', closeOptions);
        window.addEventListener('scroll', positioning);
        window.addEventListener('resize', closeOptions);

        scrollableEl.value = [];
        scrollableEl.value = findScrollEl(previewRef.value);
        for(let item of scrollableEl.value){
            item.addEventListener('scroll', closeOptions);
        }
    }

    const removeEvents = () => {
        window.removeEventListener('scroll', positioning);
        document.removeEventListener('mousedown', closeOptions);
        window.removeEventListener('resize', closeOptions);

        for(let item of scrollableEl.value){
            item.removeEventListener('scroll', closeOptions);
        }
    }
</script>
