<template>
  <div>
    <div><router-view /></div>
  </div>
</template>
<script setup>
  import { onMounted, onUnmounted } from 'vue'
  
  // Open if mouse process require
  // import {useMouseProcessor} from '@/store/plugins/mouseProcessor';
  // const mouseProcessor = useMouseProcessor();
  /**
   * loadEvents
   * [All mouse move and up events for builder will be observe here.]
   * 
   * @returns 
   */
    const loadEvents = () => {
      if(!document){return}
      // Open if mouse process require
      // document.addEventListener('mousemove', mouseProcessor.mouseMoveEvent);
      // document.addEventListener('mouseup', mouseProcessor.mouseUpEvent);

      // document.addEventListener('touchmove', mouseProcessor.mouseMoveEvent, { passive: false });
      // document.addEventListener('touchend', mouseProcessor.mouseUpEvent, { passive: false });
  }
  /**
   * removeEvents
   * [Before closing builder all default event listener will be remove here.]
   * 
   * @returns 
   */
  const removeEvents = () => {
      if(!document){return}
      // Open if mouse process require
      // document.removeEventListener('mousemove', mouseProcessor.mouseMoveEvent);
      // document.removeEventListener('mouseup', mouseProcessor.mouseUpEvent);

      // document.removeEventListener('touchmove', mouseProcessor.mouseMoveEvent, { passive: false });
      // document.removeEventListener('touchend', mouseProcessor.mouseUpEvent, { passive: false });
  }
  onMounted(async () => {
    loadEvents();
  });
  onUnmounted(()=>{
    removeEvents();
  })
</script>