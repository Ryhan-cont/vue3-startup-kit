<template>
    <div style="height:calc(100vh - 300px)" class="d-flex flex-column">
        <div class="text-b3-meta color-mid pa-10 bg-background bb-1 border-border-grey no-wrap">
            {{ header }}
        </div>
        <div class="bb-1 border-border-grey" v-if="showSearch">
            <InputBox v-model="searchKey" noBorder :placeholder="searchboxPlaceholder" @input="triggerSearch">
                <template v-slot:left>
                    <div class="d-flex-v-center pl-15 pr-10">
                        <span class="far fa-search color-light font-14"></span>
                    </div>
                </template>
            </InputBox>
        </div>
        <div v-if="showHeaderCheckbox && list.length > 0" class="py-6 px-12 bg-background d-flex-v-center">
            <CheckBox v-model="allItemCheckBox" :label="allItemCheckboxLabel" @change="triggerAllItemCheckbox" />
        </div>
        <div class="flex-auto overflow-y-auto">
            <div :class="['d-flex-v-center', {'px-12 py-12 bb-1 border-background':showAvi}, {'px-10 py-6 cursor-pointer':showAvi===false}, activeIndex === index ? activeClass : 'color-mid']" v-for="(item, index) in list" :key="index" @click="itemClicked(item, index)">
                <div v-if="showCheckbox" class="d-flex-v-center mr-10">
                    <CheckBox @change="changeCheckboxValue(item,index)" v-model="item[field.status]" /></div>
                <div v-if="showAvi" class="box-30 round-div center-pic-in-div mr-10">
                    <img :src="item[field.avi]" class="box-30" />
                </div>
                <div class="text-b3-meta flex-auto">
                    <div class="no-wrap">{{ item[field.label] }}<span class="ml-5" v-if="validVar(item[field.count])">({{ item[field.count] }})</span></div>
                    <div class="word-brek-all" v-if="showSubLabel !== false">{{ item[field.email] }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watchEffect } from 'vue';
    import { validVar } from '@/functions/com.js';
    import InputBox from '@/components/form/InputBox.vue';
    import CheckBox from '@/components/form/CheckBox.vue';

    const props = defineProps({
        list:{type:Array, defaut:()=>[]},
        field:{type:Object, defaut:()=>{return {avi:'avi', label:'label', status:'status', email :'email', count: 'count'}}},
        searchboxPlaceholder:{type:String, default:'Search'},
        allItemCheckboxLabel:{type:String, default:'Select All'},
        header:{type:String, default:''},
        showCheckbox:{type:Boolean, default:false},
        showHeaderCheckbox:{type:Boolean, default:false},
        showAvi:{type:Boolean, default:false},
        showSearch:{type:Boolean, default:false},
        showSubLabel:{type:Boolean, default:false},
        activeClass:{type:String, default:''},
        defaultSelectIndex:{type:[String, Number], default:0}
    })

    
    const emit = defineEmits(['search', 'itemClick', 'checkboxClick']);
    
    const allItemCheckBox = ref(false);
    const activeIndex = ref(false);
    const searchKey = ref('');

    const triggerSearch = (e) => {
        emit('search', searchKey.value);
    }

    const triggerAllItemCheckbox = (e) => {
        for(let item of props.list){
            item[props.field.status] = e
        }
    }
    const itemClicked = (item, index) => {
        activeIndex.value = index
        emit('itemClick', item);
    }

    const changeCheckboxValue = (item, index) => {
        activeIndex.value = index
        emit('checkboxClick', item);
    }

    watchEffect(()=>{
        if(props.showHeaderCheckbox && props.showCheckbox){
            let allChecked = true;
            for(let item of props.list){
                if(item[props.field.status] === false){
                    allChecked = false
                }
            }
            allItemCheckBox.value = allChecked;            
        }
    }),
    watchEffect(()=>{
        activeIndex.value = props.defaultSelectIndex;
    })
</script>