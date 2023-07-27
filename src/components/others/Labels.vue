<template>
    <div>
        <Menu alignMenu="right">
            <template v-slot:preview>
                <div v-if="filteredLabel.length > 0" class="d-flex-v-center cursor-pointer col-wrap" :style="{minWidth: (labelTextWidth*10 + 25 + filteredLabel.slice(0, 3).length * 8)+'px'}">        
                    <div class="px-5 py-3 font-13 radius-3 mr-8 my-3 no-wrap" v-for="(item, index) in filteredLabel" :key="index" :style="{backgroundColor:item.background_color_code,color:item.text_color_code}">
                        {{ item.name }}
                    </div>
                    <div class="round-div font-14 color-b1 box-18 bg-background d-flex-center">+</div>
                </div>
                <BtnBox v-else class="btn-secondary-outlined btn-xxs font-13">
                    <span class="far fa-plus-circle font-12 mr-6"></span>
                    Add
                </BtnBox>
            </template>
            <template v-slot:menu="{closeOptions}">
                <div class="bg-white radius-2">
                    <div class="pa-10">
                        <div class="mb-10"><input type="text" class="site-input-border input-no-outline radius-4 site-input-on-focus transition-3 px-10 py-5" v-model="labelSearchText" /></div>
                        <CheckBox @change="manageLabel(item)" v-for="(item, index) in searcLabelOption" :key="index" v-model="item.status" :label="item.name" />                        
                    </div>
                    <div @click="emit('newLabel')" class="d-flex-center color-mid text-b3-meta bg-background cursor-pointer pa-5"><span class="far fa-plus mr-5 font-12"></span>Create New</div>
                </div>
            </template>
        </Menu>        
    </div>

</template>
<script setup>
    import { ref, watchEffect, computed } from 'vue';
    import { cloneDeep } from '@/functions/com.js';
    import Menu from '@/components/pop/Menu.vue';
    import CheckBox from '@/components/form/CheckBox.vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    const props = defineProps({
        items: {type:Array, default:() => []},
        options: {type:Array, default:() => []},
    })

    const emit = defineEmits(['change', 'newLabel']);

    const labelOption = ref([]);
    const labelSearchText = ref('');
    const labelTextWidth = ref('');

    const searcLabelOption = computed(()=>{
        let re = new RegExp (labelSearchText.value, 'i');
        let filteredList =  labelOption.value.filter((item)=>{
            return re.test(item.name)
        })
        return filteredList
    })
    const filteredLabel = computed(()=>{
        let newItemList = [];
        for(let item of labelOption.value){
            if(item.status === true){
                newItemList.push(cloneDeep(item));
            }
        }
        labelTextWidth.value = 0;
        for(let item of newItemList.slice(0, 3)){
            labelTextWidth.value = labelTextWidth.value + item.name.length;
        }
        return newItemList;
    })

    

    const manageLabel = (item) => {
        emit('change', item)
    }

    watchEffect(()=>{
        let idList = [];
        for(let item of props.items){idList.push(item.label_id)}
        let options = cloneDeep(props.options);
        let newOption = [];
        for(let item of options){
            if(idList.includes(item.id)){
                item.status = true;
            }else{
                item.status = false;
            }
            newOption.push(item);
        }
        labelOption.value = newOption;
    })
</script>