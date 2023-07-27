<template>
    
    <div :class="['pagination--container', {'pagination--container-block':block}]">
        <div :class="['pagination--btn-nav noselect', {'pagination--btn-nav-container-disable':!navs.prev.active}]" @click="loadPage(navs.prev.page)">
            <span :class="['far fa-long-arrow-left', {'pagination--btn-nav-disable':!navs.prev.active}]"></span>
        </div>
        <div v-for="(item, index) in pages" :key="index" :class="['pagination--btn-page noselect', {'pagination--btn-page-active': item.active}, {'pagination--btn-page-disable': item.active || item.page == '--'}]" @click="loadPage(item.page)">{{item.page}}</div>
        <div :class="['pagination--btn-nav noselect', {'pagination--btn-nav-container-disable':!navs.next.active}]" @click="loadPage(navs.next.page)">
            <span :class="['far fa-long-arrow-right', {'pagination--btn-nav-disable':!navs.next.active}]"></span>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, watchEffect } from 'vue';
    import { validNumber } from '@/functions/com.js';
    const props = defineProps({
        totalPage:{type:Number, default:null},
        currentPage:{type:Number, default:null},
        paginationLength:{type:Number, default:2},
        block:{type:Boolean, default:false}
    })
    const pages = ref([]);
    const navs = reactive({prev:{active:false, page:null}, next:{active:false, page:null}});

    const emit = defineEmits(['change']);

    const caclPages = () => {
        let currentPage = Number(props.currentPage);
        let totalPage = Number(props.totalPage);

        if(currentPage < 2){
            navs.prev = {active:false, page:null};
        }else{
            navs.prev = {active:true, page:currentPage - 1};
        }

        if((totalPage - currentPage) < 1){
            navs.next = {active:false, page:null};
        }else{
            navs.next = {active:true, page:currentPage + 1};
        }

        let paginationLength = props.paginationLength;
        if(currentPage <= props.paginationLength + 3){paginationLength++}
        if((totalPage - currentPage) <= props.paginationLength + 3){paginationLength++}

        let prevPages = Number(currentPage - paginationLength);
        let nextPages = Number(currentPage + paginationLength);
        if(prevPages < 1 && (totalPage - nextPages)<0){
            prevPages = 1;
            nextPages = totalPage;
        }else if(prevPages < 1){
            if((nextPages + Math.abs(prevPages))>totalPage){
                nextPages = totalPage;
            }else{
                nextPages = nextPages + Math.abs(prevPages) + 1;
            }
            prevPages = 1;
        }else if((totalPage - nextPages)<0){
            if((prevPages - Math.abs(totalPage - nextPages))<1){
                prevPages = 1;
            }else{
                prevPages = prevPages - Math.abs(totalPage - nextPages);
            }
            nextPages = totalPage;
        }
        return {prevPages, nextPages}
    }

    watchEffect(()=>{
        if(!validNumber(props.currentPage) || !validNumber(props.totalPage) || validNumber(props.currentPage, 0) > validNumber(props.totalPage, 0)){
            navs.next = {active:false, page:null};
            navs.prev = {active:false, page:null};
            pages.value = [];
            return
        }

        let currentPage = Number(props.currentPage);
        let totalPage = Number(props.totalPage);
        pages.value = [];

        let calcPages = caclPages();
        if(currentPage > props.paginationLength + 3){
            pages.value.push({active:false, page:1});
            pages.value.push({active:false, page:'--'});
        }
        for(let i = calcPages.prevPages; i<(calcPages.nextPages + 1); i++ ){
            if(currentPage === i){
                pages.value.push({active:true, page:i});
            }else{
                pages.value.push({active:false, page:i});
            }
        }
        if((totalPage - currentPage) > props.paginationLength + 3){
            pages.value.push({active:false, page:'--'});
            pages.value.push({active:false, page:totalPage});
        }
    })
    const loadPage = (item) => {
        emit('change',item);
    }
</script>
