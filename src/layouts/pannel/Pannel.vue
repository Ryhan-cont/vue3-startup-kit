<template>
  <div class="pannel--layout">
    <Header />
    <transition :name="pannelLayout.floatingLeftMenu ? 'fade-left-menu' : 'slide-left-menu'">
      <LeftMenu v-if="pannelLayout.leftMenuStat" />
    </transition>
    <Body>
        <router-view v-slot="{ Component }">
          <transition name="fade-route" mode="out-in">
            <component :is="Component" /> 
          </transition>
        </router-view>
    </Body>
  </div>
</template>

<script setup>
//import watch
    import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted } from 'vue'
    /**
     * * import pusher js
     */
    import Header from './Header.vue';
    import LeftMenu from './LeftMenu.vue';
    import Body from './Body.vue';

    import {usePannelLayoutStore} from '@/store/layout/pannelLayout'
    import {useMouseProcessor} from '@/store/plugins/mouseProcessor';


    const mouseProcessor = useMouseProcessor();
    const pannelLayout = usePannelLayoutStore();

    /**
     * loadEvents
     * [All mouse move and up events for builder will be observe here.]
     * 
     * @returns 
     */
    const loadEvents = () => {
        if(!document){return}
        document.addEventListener('mousemove', mouseProcessor.mouseMoveEvent);
        document.addEventListener('mouseup', mouseProcessor.mouseUpEvent);

        document.addEventListener('touchmove', mouseProcessor.mouseMoveEvent, { passive: false });
        document.addEventListener('touchend', mouseProcessor.mouseUpEvent, { passive: false });
    }
    /**
     * removeEvents
     * [Before closing builder all default event listener will be remove here.]
     * 
     * @returns 
     */
    const removeEvents = () => {
        if(!document){return}
        document.removeEventListener('mousemove', mouseProcessor.mouseMoveEvent);
        document.removeEventListener('mouseup', mouseProcessor.mouseUpEvent);

        document.removeEventListener('touchmove', mouseProcessor.mouseMoveEvent, { passive: false });
        document.removeEventListener('touchend', mouseProcessor.mouseUpEvent, { passive: false });
    }

    /**
     * ########################################################################################
     * ############################# MOUNT ####################################################
     * ########################################################################################
     */
    onBeforeMount(()=>{
      pannelLayout.innitialize();
      window.addEventListener('resize', pannelLayout.resizeController)
    });
    onBeforeUnmount(()=>{
      window.removeEventListener('resize', pannelLayout.resizeController);
    });

    // Implemented Pusher Notifications
    onMounted(async () => {
      loadEvents();
    });
    onUnmounted(()=>{
      removeEvents();
    });

</script>
