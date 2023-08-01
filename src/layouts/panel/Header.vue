<template>
    <div class="panel--header" :style="{height:`${panelLayout.headerHeight}px`}">
        <!-- <transition :name="panelLayout.floatingLeftMenu ? 'fade-left-menu' : 'slide-left-menu'">
            <div class="panel--header-spacer" v-if="panelLayout.leftMenuStat && !panelLayout.floatingLeftMenu" :style="{width:`${panelLayout.leftMenuWidth}px`}"></div>
        </transition> -->
        <div class="panel--header-content">
            <div class="panel--header-toggle">
                <button class="panel--header-toggle-btn" @click="panelLayout.toggleLeftMenu">
                    <span class="far fa-bars font-20 color-mid"></span>
                </button>
            </div>
            <div class="panel--header-logo">
                <img src="/images/logo.svg" class="panel--header-logo-view" :style="{width: panelLayout.smallMenuStat ? '90px' : '161px'}" />
            </div>
            <div class="panel--header-menu">
                <HeaderMenu />
            </div>
        </div>
    </div>
</template>
 
<script setup>
    import HeaderMenu from '@/layouts/common/HeaderMenu.vue';

    import {usePanelLayoutStore} from '@/store/layout/panelLayout';
    const panelLayout = usePanelLayoutStore();

    
</script>