<template>
    <div class="menu--container">
        <div class="menu--preview" ref="previewRef" @click="toggleOption">
            <slot name="preview" />
        </div>
        <div ref="mainOptionContainerRef">
            <transition :name="dropdownAnimation">
                <div class="menu--options" ref="optionContainerRef" v-if="toggle">
                    <slot name="menu" :closeMenu="closeOptions" />
                </div>
            </transition>            
        </div>

    </div>
</template>

<script setup>
    import { ref, nextTick, onMounted } from 'vue'
    import { validNumber, scrollbarHW } from '@/functions/com.js';
import { isTemplateNode } from '@vue/compiler-core';
    const props = defineProps({
        closeOnClick:{type: Boolean, default:false},
        alignMenu:{type:String, default:'center'},
        fixed:{type:Boolean, default:false}
    })
    const mainOptionContainerRef = ref();
    const optionContainerRef = ref();
    const previewRef = ref();

    const toggle = ref(false);
    const scrollableEl = ref([]);
    const dropdownAnimation = ref('dropdown');

    const dromdownZone = (prevEl, optionEl) => {
        let screenY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        let caclDropdownHeight = optionEl.offsetHeight;
        let mainContainerEl = prevEl.getBoundingClientRect();

        if((mainContainerEl.top + mainContainerEl.height + caclDropdownHeight) < screenY){
            return 'dropdown';
        }else if(mainContainerEl.top > caclDropdownHeight){
            return 'dropup';
        }else{
            return 'middle';
        }
    }

    const toggleOption = async (e) => {
        if(toggle.value === false){
            toggle.value = true;
            await nextTick();

            dropdownAnimation.value = dromdownZone(previewRef.value, optionContainerRef.value);

            console.log(dropdownAnimation.value)

            toggle.value = false;
            await nextTick();

            //Reinnitialize to make effect transition
            toggle.value = true;
            await nextTick();

            document.body.appendChild(optionContainerRef.value)
            //let position = calcMenuPosition(mainOptionContainerRef.value, optionContainerRef.value, previewRef.value, dropdownAnimation.value, props.alignMenu);
            positioning('innitial');

            document.addEventListener('mousedown', closeOptions);

            window.addEventListener('scroll', positioning);
            scrollableEl.value = [];
            scrollableEl.value = findScrollEl();
            console.log(scrollableEl.value)
            for(let item of scrollableEl.value){
                item.addEventListener('scroll', closeOptions);
            }
            window.addEventListener('resize', closeOptions)
        }else{
            closeOptions();
        }
    }
    const closeOptions = (dt) => {
        if(props.closeOnClick === false){
            if(dt && dt.type != 'resize' && dt.type != 'scroll' && dt.target && dt.target.closest('.menu--options') != null){return}
        }
        if(dt && dt.type != 'resize' && dt.type != 'scroll' && dt.target && dt.target.closest('.menu--preview') != null){return}
        
        if(dt && (dt.type == 'resize' || dt.type == 'scroll')){
            optionContainerRef.value.style.transition = '0s'
        }

        
        window.removeEventListener('scroll', positioning);
        document.removeEventListener('mousedown', closeOptions);
        for(let item of scrollableEl.value){
            item.removeEventListener('scroll', closeOptions);
        }
        window.removeEventListener('resize', closeOptions)

        toggle.value = false;
    }

    const findScrollEl = () => {
        let tempEl = previewRef.value;
        let scrollableEl = [];
        while(tempEl){
            if(tempEl.tagName != 'HTML'){
                if(tempEl.clientHeight < tempEl.scrollHeight){
                    let calcStyle = getComputedStyle(tempEl)
                    if(calcStyle.overflow == 'scroll' || calcStyle.overflow == 'auto'){
                        scrollableEl.push(tempEl);
                    }
                }
            }
            tempEl = tempEl.parentNode;
        }
        return scrollableEl;
        console.log(scrollableEl)
    }

    const calcMenuPosition = (menuPositioningEl, optionEl, previewEl, animation, align = null) => {
        console.log('align')
        let screenY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        let screenX = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            screenX = screenX - scrollbarHW();

        let calcPreiewEl = previewEl.getBoundingClientRect()

        let tempEl = menuPositioningEl;
        let hasFixed = false;
        let tempElParent = null;
        let offsetTop = 0;
        let offsetLeft = 0;
        let scrollableEl = [];

        while(tempEl){
            let ignore  = false;
            if(tempEl.offsetParent != null){
                let position = getComputedStyle(tempEl.offsetParent).position;
                
                if(tempEl.tagName == 'TBODY'){ignore = true}
                if(tempEl.tagName == 'TABLE' && position != 'relative'){ignore = true}

                if(ignore === false){
                    offsetTop += tempEl.offsetTop;
                    offsetLeft += tempEl.offsetLeft;
                    //tempElParent = tempEl.offsetParent;
                }
                if(tempEl.tagName != 'HTML'){
                    offsetTop -= validNumber(tempEl.scrollTop, 0)
                    offsetLeft -= validNumber(tempEl.scrollLeft, 0)
                    if(tempEl.clientHeight < tempEl.scrollHeight){
                        scrollableEl.push(tempEl);
                    }
                }
                tempEl = tempEl.parentNode;
                //if(position == 'fixed'){hasFixed = true; break}
            }else{
                break
            }
        }
        let top, bottom, left, right, width, menuPosition;
        console.log('yyyyyyyyyyyy', hasFixed)
        if(hasFixed === true){
            menuPosition = 'fixed';
            if(animation == 'dropup'){
                console.log('calcPreiewEl.top, calcPreiewEl.height')
                bottom = (screenY - calcPreiewEl.top) + 'px';
                top = 'none';
            }else{
                console.log(calcPreiewEl.top, calcPreiewEl.height)
                top = (calcPreiewEl.top + calcPreiewEl.height) + 'px';
                bottom = 'none';
            }

            if(align == 'left'){
                left = calcPreiewEl.left + 'px';
                right = 'auto';
                width = 'auto';
            }else if(align == 'right'){
                left = 'auto';
                right = (screenX - (calcPreiewEl.left + calcPreiewEl.width)) + 'px';
                width = 'auto';
            }else if(align == 'center'){
                if(calcPreiewEl.width > optionEl.offsetWidth){
                    let diff = (calcPreiewEl.width - optionEl.offsetWidth)/2;
                    left = (calcPreiewEl.left + diff) + 'px';
                    right = 'auto';
                }else if(calcPreiewEl.width < optionEl.offsetWidth){
                    let diff = (optionEl.offsetWidth - calcPreiewEl.width)/2;
                    left = calcPreiewEl.left - diff;
                    right = 'auto';
                    if(left < 10){left = 10;}
                    left = left + 'px';
                }else{
                    left = calcPreiewEl.left + 'px';
                    right = calcPreiewEl.right + 'px';
                }
                width = 'auto';
            }else{
                left = calcPreiewEl.left + 'px';
                right = calcPreiewEl.right + 'px';
                width = 'auto';
            }
        }else{
            menuPosition = 'absolute';
            if(animation == 'dropup'){
                bottom = (screenY - calcPreiewEl.top) + 'px';
                top = 'none';
            }else{
                console.log(offsetTop, optionEl.offsetHeight, calcPreiewEl.offsetHeight)
                top = offsetTop - optionEl.offsetHeight - calcPreiewEl.height + 'px';
                bottom = 'none';
            }

            left = offsetLeft + 'px';
            right = "auto";
            width = "auto";


            if(align == 'left'){
                left = calcPreiewEl.left + 'px';
                right = 'auto';
                width = 'auto';
            }else if(align == 'right'){
                left = 'auto';
                console.log('right',screenX, calcPreiewEl.left, calcPreiewEl.width)
                right = (screenX - (calcPreiewEl.left + calcPreiewEl.width)) + 'px';
                width = 'auto';
            }else if(align == 'center'){
                if(calcPreiewEl.width > optionEl.offsetWidth){
                    let diff = (calcPreiewEl.width - optionEl.offsetWidth)/2;
                    left = (calcPreiewEl.left + diff) + 'px';
                    right = 'auto';
                }else if(calcPreiewEl.width < optionEl.offsetWidth){
                    let diff = (optionEl.offsetWidth - calcPreiewEl.width)/2;
                    left = calcPreiewEl.left - diff;
                    right = 'auto';
                    if(left < 10){left = 10;}
                    left = left + 'px';
                }else{
                    left = calcPreiewEl.left + 'px';
                    right = calcPreiewEl.right + 'px';
                }
                width = 'auto';
            }else{
                left = calcPreiewEl.left + 'px';
                right = calcPreiewEl.right + 'px';
                width = 'auto';
            }
        }
        return {
            top,
            bottom,
            left,
            right,
            width,
            menuPosition,
            scrollableEl,
        }
    }
    const calcFixedMenuPosition = (optionEl, previewEl, animation, align = null) => {
        let top, bottom, left, right, width, menuPosition;
        let calcPreiewEl = previewEl.getBoundingClientRect();
        let screenY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        let screenX = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        menuPosition = 'fixed';
        if(animation == 'dropup'){
            bottom = (screenY - calcPreiewEl.top) + 'px';
            top = 'none';
        }else{
            top = (calcPreiewEl.top + calcPreiewEl.height) + 'px';
            bottom = 'none';
        }

        if(align == 'left'){
            left = calcPreiewEl.left + 'px';
            right = 'auto';
            width = 'auto';
        }else if(align == 'right'){
            left = 'auto';
            console.log('right',screenX, calcPreiewEl.left, calcPreiewEl.width)
            right = (screenX - (calcPreiewEl.left + calcPreiewEl.width)) + 'px';
            width = 'auto';
        }else if(align == 'center'){
            if(calcPreiewEl.width > optionEl.offsetWidth){
                let diff = (calcPreiewEl.width - optionEl.offsetWidth)/2;
                left = (calcPreiewEl.left + diff) + 'px';
                right = 'auto';
            }else if(calcPreiewEl.width < optionEl.offsetWidth){
                let diff = (optionEl.offsetWidth - calcPreiewEl.width)/2;
                left = calcPreiewEl.left - diff;
                right = 'auto';
                if(left < 10){left = 10;}
                left = left + 'px';
            }else{
                left = calcPreiewEl.left + 'px';
                right = calcPreiewEl.right + 'px';
            }
            width = 'auto';
        }else{
            left = calcPreiewEl.left + 'px';
            right = calcPreiewEl.right + 'px';
            width = 'auto';
        }
        return {
            top,
            bottom,
            left,
            right,
            width,
            menuPosition,
        }
    }
    const positioning = (e) =>{
        console.log( 'xxx')
        if(e && (e == 'innitial' || e.type == 'scroll')){
            let optionEl = optionContainerRef.value;
            let position = calcMenuPosition(mainOptionContainerRef.value, optionContainerRef.value, previewRef.value, dropdownAnimation.value, props.alignMenu);
            console.log(position)

            //Make options visiable
            optionEl.style.position = position.menuPosition;
            optionEl.style.top = position.top;
            optionEl.style.bottom = position.bottom;
            optionEl.style.left = position.left;
            optionEl.style.right = position.right;
            optionEl.style.width = position.width;
            optionEl.style.opacity = 1;
        }else{

        }

    }
</script>
