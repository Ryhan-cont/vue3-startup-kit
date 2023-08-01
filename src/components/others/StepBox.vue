<template>
    <div class="d-flex-center h-100 w-100 parent-step-element pb-25" style="max-width:340px" ref="parentEl">
        <!-- Block -->
        <div class="position-relative d-flex-center stepbox-item">
            <div :class="['box-35 round-div text-b2-regular color-white bg-primary cursor-pointer', {'read-only' : builderMainStore.step === 1}]" @click="builderMainStore.step = 1">1</div>
            <div class="position-abs text-b4-medium color-primary" style="bottom:-30px">Add</div>
        </div>
        <!-- End Block -->

        <div class="flex-auto bg-disable step-dash stepbox-item">
            <div :class="['bg-primary']" style="height:2px; width: 0%;"></div>
        </div>

        <!-- Block -->
        <div class="position-relative d-flex-center stepbox-item">
            <div :class="['box-35 round-div text-b2-regular color-mid bg-disable cursor-pointer', {'read-only' : builderMainStore.step <= 2}]" @click="builderMainStore.step = 2">2</div>
            <div class="position-abs text-b4-regular" style="bottom:-30px">Select</div>
        </div>
        <!-- End Block -->

        <div class="flex-auto bg-disable step-dash stepbox-item">
            <div :class="['bg-primary']" style="height:2px; width: 0%;"></div>
        </div>

        <!-- Block -->
        <div class="position-relative d-flex-center stepbox-item">
            <div :class="['box-35 round-div text-b2-regular color-mid bg-disable cursor-pointer', {'read-only' : builderMainStore.step <= 3}]" @click="builderMainStore.step = 3">3</div>
            <div class="position-abs text-b4-regular" style="bottom:-30px">Prepare</div>
        </div>
        <!-- End Block -->

        <div class="flex-auto bg-disable step-dash stepbox-item">
            <div :class="['bg-primary']" style="height:2px; width: 0%;"></div>
        </div>

        <!-- Block -->
        <div class="position-relative d-flex-center stepbox-item">
            <div :class="['box-35 round-div text-b2-regular color-mid bg-disable']">4</div>
            <div class="position-abs text-b4-regular" style="bottom:-30px">Review</div>
        </div>
        <!-- End Block -->
    </div>
</template>

<script setup>
    import {ref, watchEffect, onMounted} from 'vue'
    import {useBuilderMain} from '@/store/document/builder/builderMain';
    const builderMainStore = useBuilderMain();

    const parentEl = ref();
    const ser = ref(1);
    const loaded = ref(false);

    const resetStepper = () => {
        let intervCount = 10000;
        let interv = setInterval(()=>{
            if(parentEl.value){
                let el = parentEl.value.getElementsByClassName('stepbox-item');
                for(let i = 1; el.length > i; i++){
                    let item = el[i];
                    if(item.classList.contains('step-dash')){
                        item.children[0].style.width = '0%';
                    }else{
                        item.children[0].style.backgroundColor = 'var(--disable)';
                        item.children[0].style.color = 'var(--b2)';
                        item.children[1].style.color = 'var(--mid)';
                        item.children[1].style.fontWeight = '400';
                    }
                }
                clearInterval(interv);
                loaded.value = true;
            }
            intervCount--
            if(intervCount < 0){clearInterval(interv)}
        }, 100)
    }
    
    watchEffect(()=>{
        if(loaded.value === true && parentEl.value){
            //Up Animation
            if(ser.value < builderMainStore.step){
                let startEl = (ser.value * 2)-1;
                let endEl = (builderMainStore.step * 2) - 2;
                let intervCount = 10000;
                let interv = setInterval(()=>{
                    let el = parentEl.value.children[startEl];
                    if(el){
                        if(el.classList.contains('step-dash')){
                            el.children[0].style.width = '100%';
                        }else{
                            el.children[0].style.backgroundColor = 'var(--primary)';
                            el.children[0].style.color = 'var(--white)';
                            el.children[1].style.color = 'var(--primary)';
                            el.children[1].style.fontWeight = '500';
                        }                 
                    }
                    startEl++;
                    if(startEl > endEl){clearInterval(interv); ser.value = builderMainStore.step;}   
                    intervCount--
                    if(intervCount < 0){clearInterval(interv)}
                }, 100)
            }
            //Down Animation
            else if(ser.value > builderMainStore.step){
                let startEl = (ser.value * 2)-1;
                let endEl = (builderMainStore.step * 2) - 1;
                let intervCount = 10000;
                let interv = setInterval(()=>{
                    let el = parentEl.value.children[startEl];
                    if(el){
                        if(el.classList.contains('step-dash')){
                            el.children[0].style.width = '0%';
                        }else{
                            el.children[0].style.backgroundColor = 'var(--disable)';
                            el.children[0].style.color = 'var(--b2)';
                            el.children[1].style.color = 'var(--mid)';
                            el.children[1].style.fontWeight = '400';
                        }
                    }
                    startEl--;
                    if(startEl < endEl){clearInterval(interv); ser.value = builderMainStore.step;}

                    intervCount--
                    if(intervCount < 0){clearInterval(interv)}
                }, 100)
            }
        }
    })

    onMounted(()=>{
        resetStepper()
    })
    
</script>

<style lang="scss" scoped>
    .parent-step-element{
        transition: all .15s;
        div{
            transition: all .15s;
        }
    }
</style>