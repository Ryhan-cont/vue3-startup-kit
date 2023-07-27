<template>
    <div class="page-layout--container">
        <div class="page-layout--header-container">
            <div class="d-flex-v-center mb-5">
                <router-link v-if="goBackRoute" :to="{ name: goBackRoute, params: goBackRouteParam}">
                    <div class="page-layout--header-go-back hover-text-action"><span class="far fa-long-arrow-left"></span>Go Back</div>
                </router-link>  
                <div v-for="(item, index) in breadcrumbs" :key="index" >
                    <div v-if="goBackRoute && item.currentPage === false"><span class="color-mid mr-6 ml-5 text-b2-regular">/</span><router-link class="text-b2-regular color-mid hover-text-action" :to="{ name: goBackRoute, params: item.params}">{{ item.name }}</router-link></div>
                </div>              
            </div>
            <div class="page-layout--header-text">
                <div class="page-layout--header-text-main">{{header}}</div>
                <div class="page-layout--header-text-sub">{{subHeader}}</div>                
            </div>
        </div>
        <div class="page-layout--content" ref="containerRef" :style="{maxWidth:width, backgroundColor: background, padding:padding}">
            <slot />
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref, watchEffect } from 'vue';
    const props = defineProps({
        header: String,
        subHeader: String,
        width: String,
        background: {type:String, default:'#FFFFFF'},
        padding: {type:String, default:'25px'},
        goBackRoute: {type:String, default:null},
        goBackRouteParam: {type:Object, default:()=>{}},
        breadcrumbs:{type:Object, default:()=>{}},
    })
    const emit = defineEmits(['getScreenWidth', 'getScreenHeight', 'getLayoutSize']);
    const containerRef = ref();

    onMounted(()=>{
        const resizeObserver = new ResizeObserver(entries => {
            emit('getScreenWidth', window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
            emit('getScreenHeight', window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
            if(containerRef.value){emit('getLayoutSize',{W:containerRef.value.offsetWidth,H:containerRef.value.offsetHeight})}
        })
        resizeObserver.observe(containerRef.value);
    })
</script>