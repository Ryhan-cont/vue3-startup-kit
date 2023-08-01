<template>
    <div class="avi-group-container" :style="{marginLeft:aviList.length !== 0 ? '8px' : ''}">
        <div class="avi-group-image" style="width: 30px; height: 30px" v-for="(item, index) in aviList.slice(0, show)" :key="index">
            <img :src="item[field]" />
        </div>
        <div class="avi-group-image"  style="width: 30px; height: 30px;" v-if="aviList.length > 0">
            <!-- {{aviList.length - show}} -->
            +
        </div>
        <BtnBox v-if="aviList.length == 0 && emptyText != ''" class="btn-secondary-outlined btn-xxs font-13 mr-5" >
            <i class="far fa-plus-circle font-12 mr-5"></i>{{ emptyText }}
        </BtnBox>
    </div>
</template>
<script setup>
    import BtnBox from '@/components/form/BtnBox.vue';
    const props = defineProps({
        aviList:{type:Array, default: () => {return []}},
        show:{type:Number, default:3},
        field:{type:String, default:'avi'},
        emptyText:{type:String, default:''}
    })
</script>