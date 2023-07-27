<template>
    <div class="pannel--body">
        <div :style="{height:`${pannelLayout.headerHeight}px`}"></div>
        <div class="pannel--body-base">
            <transition :name="pannelLayout.floatingLeftMenu ? 'fade-left-menu' : 'slide-left-menu'">
                <div class="pannel--body-spacer" v-if="pannelLayout.leftMenuStat && !pannelLayout.floatingLeftMenu" :style="{width:`${pannelLayout.leftMenuWidth}px`}"></div>
            </transition>
            <div class="pannel--body-content" :style="{height:`calc(100vh - ${pannelLayout.headerHeight}px)`}">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
    import {usePannelLayoutStore} from '@/store/layout/pannelLayout'
    const pannelLayout = usePannelLayoutStore();
</script>