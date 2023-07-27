<template>
    <div class="result-per-page--container">
        <div class="result-per-page--text">(Showing {{from ?? 0}} to {{ to ?? 0 }} of {{totalResult}})</div>
        <div>
            <div class="result-per-page--per-page" @click="toggleOptions" ref="mainContainerRef">{{paginationLimit ?? 0}} Per Page <i class="far fa-angle-down"></i></div>
            <div ref="mainOptionContainerRef">
                <transition :name="dropdownAnimation">
                    <div class="result-per-page--option-container thin-scrollbar" v-if="toggle" ref="optionContainerRef" :style="{maxHeight:dropdownHeight+'px'}">
                        <div class="result-per-page--option-item" v-for="(item, index) in pageNumberOptions" :key="index" @click="loadItem(item)">{{item}}</div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, ref, nextTick } from 'vue';
    const props = defineProps({
        totalResult: {type:Number, default:0},
        from: {type:Number, default:0},
        to: {type:Number, default:0},
        paginationLimit: {type:Number, default:10},
        pageNumberOptions: {type:Array, default:()=>{
            return [5,10,15,20,25,30,50,100]
        }}
    })
    const toggle = ref(false);
    const mainContainerRef = ref();
    const optionContainerRef = ref();
    const mainOptionContainerRef  = ref();
    const dropdownHeight = ref(150);
    const interv = ref();
    const monitorPosition = ref();
    const dropdownAnimation = ref('dropdown')

    const emit = defineEmits(['select']);

    const toggleOptions = async () => {        
        if(toggle.value === false){
            let mainContainerEl = mainContainerRef.value.getBoundingClientRect()
            let screenY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            toggle.value = true;
            await nextTick();
            //Check if it is drop up or down
            let caclDropdownHeight = optionContainerRef.value.offsetHeight;
            if((mainContainerEl.top + mainContainerEl.height + caclDropdownHeight) > screenY){
                dropdownAnimation.value = 'dropup';
            }else{
                dropdownAnimation.value = 'dropdown';
            }
            toggle.value = false;
            await nextTick();
            //Reinnitialize to make effect transition
            toggle.value = true;
            await nextTick();

            //Get Top Position
            let offsetTop = 0;
            let elemTop = mainOptionContainerRef.value
            do{
                if(!isNaN( elemTop.offsetTop)){offsetTop += elemTop.offsetTop;}
            }while( elemTop = elemTop.offsetTop );

            //Get Left Position
            let offsetLeft = 0;
            let elemLeft = mainOptionContainerRef.value
            do{
                if(!isNaN( elemLeft.offsetLeft)){offsetLeft += elemLeft.offsetLeft;}
            }while( elemLeft = elemLeft.offsetLeft);

            //
            document.body.appendChild(optionContainerRef.value);

            //Make options visiable
            if(dropdownAnimation.value == 'dropup'){
                optionContainerRef.value.style.bottom = (screenY - offsetTop + mainContainerEl.height) + 'px';
            }else{
                optionContainerRef.value.style.top = offsetTop + 'px';
            }
            optionContainerRef.value.style.left = (mainContainerEl.left-30) + 'px';
            optionContainerRef.value.style.opacity = 1;

            //Listen for closing modal
            document.addEventListener('mousedown', closeOptions);
        }else{
            closeOptions();
        }
    }
    const closeOptions = (dt) => {
        if(dt && dt.target && dt.target.closest('.result-per-page--per-page') != null){return}
        document.removeEventListener('click', closeOptions);
        clearInterval(interv.value);
        toggle.value = false;
    }
    const loadItem = (item) => {
        emit('select', item);
    }
</script>
