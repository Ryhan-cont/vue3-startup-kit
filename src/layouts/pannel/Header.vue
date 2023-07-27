<template>
    <div class="pannel--header" :style="{height:`${pannelLayout.headerHeight}px`}">
        <!-- <transition :name="pannelLayout.floatingLeftMenu ? 'fade-left-menu' : 'slide-left-menu'">
            <div class="pannel--header-spacer" v-if="pannelLayout.leftMenuStat && !pannelLayout.floatingLeftMenu" :style="{width:`${pannelLayout.leftMenuWidth}px`}"></div>
        </transition> -->
        <div class="pannel--header-content">
            <div class="pannel--header-toggle">
                <button class="pannel--header-toggle-btn" @click="pannelLayout.toggleLeftMenu">
                    <span class="far fa-bars font-20 color-mid"></span>
                    <!-- <span class="pannel--header-toggle-icon"></span>
                    <span class="pannel--header-toggle-icon"></span>
                    <span class="pannel--header-toggle-icon"></span> -->
                </button>
            </div>
            <div class="pannel--header-logo">
                <img src="/images/logo.svg" class="pannel--header-logo-view" :style="{width: pannelLayout.smallMenuStat ? '90px' : '161px'}" />
            </div>
            <div class="pannel--header-menu">
                <HeaderMenu />
            </div>
        </div>
    </div>
</template>
 
<script setup>
    import HeaderMenu from '@/layouts/common/HeaderMenu.vue';

    import {usePannelLayoutStore} from '@/store/layout/pannelLayout';
    const pannelLayout = usePannelLayoutStore();

    
</script>