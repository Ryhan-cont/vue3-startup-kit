<template>
    <header class="message-header">
        <div class="message-header-container">
            <!-- <router-link :to="{ name: 'inbox'}" class="color-mid">
                <div class="message-header-brand">
                    <div class="message-header-logo">
                        <img src="/images/logo.svg" alt="Header Brand">
                    </div>
                </div>
            </router-link> -->
            <div class="message-header-actions">
                <div class="action-item">
                    <HeaderMenu />
                </div>
            </div>
        </div>
    </header>
    <div :style="{height:`${pannelLayout.headerHeight}px`}"></div>
</template>

<script setup>
import HeaderMenu from '@/layouts/common/HeaderMenu.vue';
import {usePannelLayoutStore} from '@/store/layout/pannelLayout';
const pannelLayout = usePannelLayoutStore();
</script>