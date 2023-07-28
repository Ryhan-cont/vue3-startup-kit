<template>
<div :class="['cc-select-box--container', size != '' ? `cc-select-box--container-${size}`: '', {'cc-select-box--disabled read-only':disabled}, {'read-only':readonly}]" :id="`select-box-${selectBoxId}`">
    <div class="cc-select-box--main" ref="mainContainerRef">
        <div :class="['cc-select-box--preview' , `cc-select-box--preview-${corner}`, `cc-input-message--${messaging.type}`, size != '' ? `cc-select-box--${size}`: '', {'site-input-focus':toggle}, {'cc-select-box--no-border':noBorder}]" @click="toggleOptions">
            <div class="cc-select-box--search-input" v-if="toggle && inputSearch">
                <input ref="searchInputRef" type="text" v-model="inputSearchText" @input="inputSearchChange" :autocomplete="autocomplete" :id="`select-box-search-${selectBoxId}`" />
            </div>
            <div class="cc-select-box--placeholder" v-else-if="slots['input'] ? !validVar(customInputPreview) && !validVar(modelValueTemp) : !validVar(modelValueTemp)">
                <div class="text-ellipsis"  :style="{textAlign: previewTextAlign}">{{placeholder}}</div>
            </div>
            <div class="cc-select-box--text-preview" v-else>
                <slot name="input" :data="options[activeIndex]" />
                <div class="cc-select-box--input" v-if="!slots['input']" :style="{textAlign: previewTextAlign}">
                    {{textPreview}}
                </div>
            </div>
            <div class="cc-select-box--right-icons">
                <div class="cc-select-box--reset" @click="reset" v-if="resetVal && !disabled"><i v-if="validVar(modelValueTemp)" class="far fa-times"></i></div>
                <div class="cc-select-box--arrow-down"><i class="far fa-angle-down"></i></div>
                <input type="hidden" :value="modelValueTemp" :name="name" />
            </div>
        </div>
        <transition :name="dropdownAnimation">
            <div v-if="toggle" :class="['cc-select-box--item-container', size != '' ? `cc-select-box--option-${size}`: '']" ref="optionContainerRef">
                <div>
                    <slot name="dropdownHead" />
                </div>
                <div class="cc-select-box--items thin-scrollbar" :style="{maxHeight:dropdownHeight+'px'}" v-if="!slots['outerOption']">
                    <div 
                        v-for="(item, index) in options" 
                        :key="index" 
                        @click="completeSelect(item)"
                        :class="['cc-select-box--item', {'cc-select-box--item-hover':hoverIndex===index}, {'cc-select-box--item-active':activeIndex===index}]"
                        @mouseenter="hoverIndex = index"
                    >
                        <slot name="option" :data="item" :index="index" />
                        <div :class="['cc-select-box--item-text']" v-if="!slots['option']" :style="{textAlign: optionTextAlign}">{{validVar(show) ? item[show] : item}}</div>
                    </div>
                </div>
                <slot name="outerOption" :closeOptions="closeOptions" />
            </div>
        </transition>
    </div>
    <div class="cc-select-box--detail" v-if="showDetail">
        <Message v-if="messaging.status === true" :message="messaging.msg" :type="messaging.type"  />
    </div>
</div>
</template>

<script setup>
    import { defineProps, defineEmits, ref, watchEffect, watch, computed, useSlots, nextTick, toRef, reactive, onUnmounted } from 'vue';
    import { useField } from 'vee-validate';
    import Message from '@/components/validate/Message.vue';
    import { validVar, randomString } from '@/functions/com.js';
    import { getTargetParent } from '@/functions/dom.js';
    import { findScrollEl, calcFixedMenuPosition, dropZone } from '@/functions/drop.js';
    const props = defineProps({
        modelValue: String | Number,
        customInputPreview: {type:[String, Number, Boolean], default:''},
        placeholder: String,
        name: String,
        size: {type: String, default:''},
        disabled: {type:Boolean, default:false},
        readonly: {type:Boolean, default:false},
        resetVal: {type: Boolean, default:false},
        autocomplete: String,
        options: {type: [Array, Object], default: () => {return []}},
        show: {type: String},
        catch: {type: String},
        inputSearch:{type: Boolean, default:false},
        showDetail:{type: Boolean, default:false},
        message:String,
        messageType:{type:String, default:null},
        validate: Array | Object,
        disableOnClickOptionClose:{type: Boolean, default:false},
        disableOptionClick:{type: Boolean, default:false},
        noBorder:{type: Boolean, default:false},
        corner:{type:String, default:''},
        onChangeReturnFullArr:{type: Boolean, default:false},
        optionTextAlign:{type:String, default:'left'},
        previewTextAlign:{type:String, default:'left'},
    })

    var modelValueTemp = ref();
    var errorMessage = ref();
    if(props.name){
        var name = toRef(props, 'name');
        var {value: modelValueTemp, errorMessage} = useField(name, props.validate);
    }

    //Component
    const emit = defineEmits(['update:modelValue', 'reset', 'inputSearch', 'change', 'open', 'close']);
    const slots = useSlots();
    //Refs
    const optionContainerRef = ref();
    const mainContainerRef = ref();
    const searchInputRef = ref();
    const optionWidth = ref(0);
    const selectBoxId = ref(randomString(50, '0123456789abcdefghijklmnopqrstuvwxyz'))
    //
    //const modelValueTemp = ref();
    const scrollableEl = ref([]);
    const toggle = ref(false);
    const inputSearchText = ref();
    const hoverIndex = ref('');
    const dropdownHeight = ref(250);
    const dropdownAnimation = ref('dropdown');
    const messaging = reactive({
        status:false,
        type:null,
        msg:'',
    })

    watch(() => props.modelValue, () => {
        modelValueTemp.value = props.modelValue;
    })

    watchEffect(()=>{
        if(validVar(props.message)){
            messaging.status = true;
            messaging.type = props.messageType;
            messaging.msg = props.message;
        }else if(validVar(errorMessage.value)){
            messaging.status = true;
            messaging.type = 'error';
            messaging.msg = errorMessage.value;
        }else{
            messaging.status = false;
            messaging.type = null;
            messaging.msg = '';
        }
    })

    const activeIndex = computed(() => {
        if(validVar(props.catch) && validVar(props.show)){
            let index = props.options.findIndex(x => x[props.catch] === modelValueTemp.value);
            if(index === -1){return null}
            if(props.options[index][props.show]){return index}else{return null}
        }else if(validVar(props.catch) && slots['input']){
            let index = props.options.findIndex(x => x[props.catch] === modelValueTemp.value);
            if(index === -1){return null}else{return index}
        }else{
            let index = props.options.findIndex(x => x === modelValueTemp.value);
            if(index === -1){return null}
            if(props.options[index]){return index}else{return null}
        }
    })
    const textPreview = computed(() => {
        if(validVar(props.catch) && validVar(props.show)){
            let index = props.options.findIndex(x => x[props.catch] === modelValueTemp.value);
            if(index === -1){return ''}
            return props.options[index][props.show];
        }else{
            let index = props.options.findIndex(x => x === modelValueTemp.value);
            if(index === -1){return ''}
            return props.options[index];
        }
    })
    const toggleOptions = async (ev) => {     
        if(!document){return}
        if(toggle.value === false){
            emit('open');
            if(ev && ev.target && ev.target.closest('.cc-select-box--reset') != null){return}

            toggle.value = true;
            await nextTick();

            dropdownAnimation.value = dropZone(mainContainerRef.value, optionContainerRef.value);
            optionWidth.value = optionContainerRef.value.offsetWidth;

            toggle.value = false;
            await nextTick();
            //Reinnitialize to make effect transition
            toggle.value = true;
            await nextTick();

            if(searchInputRef.value){searchInputRef.value.focus()}
            optionContainerRef.value.style.display = 'none';
            document.body.appendChild(optionContainerRef.value)
            positioning('innitial');

            addEvents();

        }else{
            if(ev && ev.target && ev.target.closest('.cc-select-box--search-input') != null){return}
            closeOptions();
        }
    }
    const positioning = (e) =>{
        let optionEl = optionContainerRef.value;
        let position = calcFixedMenuPosition(mainContainerRef.value, optionWidth.value, dropdownAnimation.value, props.alignMenu);

        //Make options visiable
        optionEl.style.position = position.menuPosition;
        optionEl.style.top = position.top;
        optionEl.style.bottom = position.bottom;
        optionEl.style.left = position.left;
        optionEl.style.right = position.right;
        optionEl.style.width = position.width;
        optionEl.style.display = 'block';
        optionEl.style.opacity = 1;
    }
    const closeOptions = (dt) => {
        if(dt && dt.target && dt.target.closest('.cc-select-box--search-input, .cc-select-box--text-preview, .cc-select-box--placeholder, .cc-select-box--preview') != null){
            if(getTargetParent(dt.target, 'cc-select-box--container') && getTargetParent(dt.target, 'cc-select-box--container').id === 'select-box-'+selectBoxId.value){
                return
            }
            if(document.activeElement.id == 'select-box-search-'+selectBoxId.value){return}
            
        }
        if(props.disableOnClickOptionClose && dt && dt.target && dt.target.closest('.cc-select-box--item-container') != null){return}
        
        removeEvents()

        toggle.value = false;

        setTimeout(()=>{
            emit('close');
        },150)
        
        hoverIndex.value = '';
    }
    const centerItem = () => {
        let el = optionContainerRef.value.querySelector('.cc-select-box--item-hover')
        optionContainerRef.value.scrollTop = el.offsetTop - dropdownHeight.value/2;
    }
    const completeSelect = (item) => {
        if(props.disableOptionClick === false){
            if(validVar(props.catch)){
                modelValueTemp.value = item[props.catch];
                emit('update:modelValue', item[props.catch]);
                if(props.onChangeReturnFullArr === false){
                    emit('change', item[props.catch]);
                }else{
                    emit('change', item);
                }
            }else{
                modelValueTemp.value = item;
                emit('update:modelValue', item);
                emit('change', item);
            }            
        }
    }
    const reset = () => {
        setTimeout(()=>{
            modelValueTemp.value = '';
            emit('update:modelValue','');
            emit('reset','');
            emit('change','');
        },50)
    };
    const inputSearchChange = () => {
        emit('inputSearch',inputSearchText.value);
    }

    const addEvents = () => {
        document.addEventListener('mousedown', closeOptions);
        window.addEventListener('scroll', positioning);
        window.addEventListener('resize', closeOptions);

        scrollableEl.value = [];
        scrollableEl.value = findScrollEl(mainContainerRef.value);
        for(let item of scrollableEl.value){
            item.addEventListener('scroll', closeOptions);
        }
    }
    const removeEvents = () => {
        window.removeEventListener('scroll', positioning);
        document.removeEventListener('mousedown', closeOptions);
        window.removeEventListener('resize', closeOptions);

        for(let item of scrollableEl.value){
            item.removeEventListener('scroll', closeOptions);
        }
    }

</script>