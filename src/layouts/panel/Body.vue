<template>
    <div class="panel--body">
        <div :style="{height:`${panelLayout.headerHeight}px`}"></div>
        <div class="panel--body-base">
            <transition :name="panelLayout.floatingLeftMenu ? 'fade-left-menu' : 'slide-left-menu'">
                <div class="panel--body-spacer" v-if="panelLayout.leftMenuStat && !panelLayout.floatingLeftMenu" :style="{width:`${panelLayout.leftMenuWidth}px`}"></div>
            </transition>
            <div class="panel--body-content" :style="{height:`calc(100vh - ${panelLayout.headerHeight}px)`}">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
    import {usePanelLayoutStore} from '@/store/layout/panelLayout'
    const panelLayout = usePanelLayoutStore();
</script>