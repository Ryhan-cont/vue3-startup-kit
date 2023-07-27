<template>
    <div :class="['pannel--left-menubar', {'pannel--left-menubar-floating': pannelLayout.floatingLeftMenu}]" :style="{width:`${pannelLayout.leftMenuWidth}px`, top:pannelLayout.floatingLeftMenu ? '0px' : `${pannelLayout.headerHeight}px`}" @click="closeHoverLeftMenu">
        <div class="pannel--left-menubar-main" :style="{width:`${pannelLayout.leftMenuWidth}px`, height: pannelLayout.floatingLeftMenu ? '100vh' : `calc(100vh - ${pannelLayout.headerHeight}px)`}">
            <div v-for="(item, index) in menuItems" :key="index" class="my-5">
                <!-- {{item.items}} -->
                <router-link v-if="item.routeName" :to="{ name: item.routeName}">
                    <div :class="['pannel--left-menubar-btn','text-b2-bold', {'pannel--left-menubar-active-btn':pannelLayout.activeRoute==item.routeName}]"><span :class="item.icon" class="font-16 fw-400 mr-10"></span>{{item.name}}</div>
                </router-link>
                <div v-else>
                    <div :class="[{'pannel--left-menubar-sub-active':item.show}]">
                        <div :class="['pannel--left-menubar-btn', 'text-b2-bold', {'pannel--left-menubar-toggle-active-btn':item.show}]" @click="item.show = !item.show">
                            <span :class="item.icon" class="font-16 fw-400 mr-10"></span>{{item.name}}
                            <span class="flex-auto text-right pr-10 far fa-angle-down font-12"></span>
                        </div>
                        <transition
                            name="expand-left-menu-btn"
                            @enter="enter"
                            @after-enter="afterEnter"
                            @leave="leave"
                        >
                            <div class="pannel--left-menubar-sub-container" v-if="item.show">
                                <div v-for="(subItems, subIndex) in item.items" :key="'subitem-'+subIndex">
                                    <router-link :to="{ name: subItems.routeName}">
                                        <div :class="['pannel--left-menubar-sub-btn', 'text-b3-meta', {'pannel--left-menubar-sub-active-btn':pannelLayout.activeRoute==subItems.routeName}]">{{subItems.name}}</div>
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
    import { usePannelLayoutStore } from '@/store/layout/pannelLayout';
    import { useAuth } from '@/store/auth/auth';
    import { menuData } from './js/menu.js'

    const pannelLayout = usePannelLayoutStore();
    const authStore = useAuth();

    const menuItems = ref(menuData)

    const closeHoverLeftMenu = (e) => {
        if(e.target.closest('.pannel--left-menubar-main') == null){
            pannelLayout.leftMenuStat = false;
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
