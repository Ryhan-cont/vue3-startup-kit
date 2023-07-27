<template>
  <div>
    <div class="position-abs w-100" id="js-lazyloading-animation-parent" style="top:0px; height:2px; z-index:12; transition: all .1s;opacity:.9">
      <div class="w-100 bg-primary" id="js-lazyloading-animation" style="width:0%;height:2px; transition: all 3s;"></div>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade-route" mode="out-in">
        <component :is="Component" /> 
      </transition>
    </router-view>
  </div>
</template>

<script setup>
  import { isPhone } from '@/functions/com.js'
  import { onMounted } from '@vue/runtime-core';
  if(!isPhone()){
    document.querySelector('body').classList.add('document-nice-scroll');
  }
  const resizeEvent = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  if(window){
    window.addEventListener('resize', function() {
      resizeEvent();
    });    
  }
  onMounted(()=>{
    resizeEvent();
  })
</script>
