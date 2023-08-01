<template>
    <div :class="['panel--left-menubar', {'panel--left-menubar-floating': panelLayout.floatingLeftMenu}]" :style="{width:`${panelLayout.leftMenuWidth}px`, top:panelLayout.floatingLeftMenu ? '0px' : `${panelLayout.headerHeight}px`}" @click="closeHoverLeftMenu">
        <div class="panel--left-menubar-main" :style="{width:`${panelLayout.leftMenuWidth}px`, height: panelLayout.floatingLeftMenu ? '100vh' : `calc(100vh - ${panelLayout.headerHeight}px)`}">
            <div v-for="(item, index) in menuItems" :key="index" class="my-5">
                <!-- {{item.items}} -->
                <router-link v-if="item.routeName" :to="{ name: item.routeName}">
                    <div :class="['panel--left-menubar-btn','text-b2-bold', {'panel--left-menubar-active-btn':panelLayout.activeRoute==item.routeName}]"><span :class="item.icon" class="font-16 fw-400 mr-10"></span>{{item.name}}</div>
                </router-link>
                <div v-else>
                    <div :class="[{'panel--left-menubar-sub-active':item.show}]">
                        <div :class="['panel--left-menubar-btn', 'text-b2-bold', {'panel--left-menubar-toggle-active-btn':item.show}]" @click="item.show = !item.show">
                            <span :class="item.icon" class="font-16 fw-400 mr-10"></span>{{item.name}}
                            <span class="flex-auto text-right pr-10 far fa-angle-down font-12"></span>
                        </div>
                        <transition
                            name="expand-left-menu-btn"
                            @enter="enter"
                            @after-enter="afterEnter"
                            @leave="leave"
                        >
                            <div class="panel--left-menubar-sub-container" v-if="item.show">
                                <div v-for="(subItems, subIndex) in item.items" :key="'subitem-'+subIndex">
                                    <router-link :to="{ name: subItems.routeName}">
                                        <div :class="['panel--left-menubar-sub-btn', 'text-b3-meta', {'panel--left-menubar-sub-active-btn':panelLayout.activeRoute==subItems.routeName}]">{{subItems.name}}</div>
                                    </router-link>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<script setup>
    import { ref, reactive, onMounted, computed  } from 'vue';
    import { usePanelLayoutStore } from '@/store/layout/panelLayout';
    import { useAuth } from '@/store/auth/auth';
    import { menuData } from './js/menu.js'

    const panelLayout = usePanelLayoutStore();
    const authStore = useAuth();

    const menuItems = ref(menuData)

    const closeHoverLeftMenu = (e) => {
        if(e.target.closest('.panel--left-menubar-main') == null){
            panelLayout.leftMenuStat = false;
        }
    }

    const enter = (el) => {
        el.style.height = 'auto';
        const height = getComputedStyle(el).height;
        el.style.height = 0;

        getComputedStyle(el);
        setTimeout(() => {
          el.style.height = height;
        });        
    };
    const afterEnter = (el) => {
        el.style.height = 'auto';
    };
    const leave = (el) => {
        el.style.height = getComputedStyle(el).height;

        getComputedStyle(el);
        setTimeout(() => {
            el.style.height = 0;
        });
    }
    
</script>
