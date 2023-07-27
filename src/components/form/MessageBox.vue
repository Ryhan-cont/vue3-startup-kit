<template>
    <div :class="['cc-message-box--container', {'cc-message-box--disabled read-only':disabled}, {'read-only':readonly}]">
        <div :class="['cc-message-box--main', {'site-input-focus':focus}, `cc-input-message--${messaging.type}`]" ref="containerRef">
            <div ref="slotLeftRef"><slot name="left" /></div>
            <div class="cc-message-box--message">
                <textarea
                    :placeholder="placeholder"
                    v-model="modelValueTemp" 
                    :name="name"
                    :maxlength="maxlength"
                    @mousedown="loadMouseDown"
                    :rows="rows"
                    :class="['cc-message-box--input','set-width', {'cc-message-box--noscroll':noScroll}]"
                    :style="{maxWidth:containerWidth, minWidth:registerMouseDown === true ? containerWidth : '', resize: noScroll ? 'none' : 'auto', paddingLeft: !slots['left'] ? '15px' : '0px', paddingRight: !slots['right'] ? '15px' : '0px'}"
                    @input="updateValue($event.target.value)"
                    @change="changedValue($event.target.value)"
                    @focus="processFocus"
                    @blur="focus = false"
                    ref="textAreaRef">
                </textarea>                
            </div>
            <div ref="slotRightRef"><slot name="right" /></div>
        </div>
        <div class="cc-message-box--detail" v-if="showDetail">
            <div class="cc-message-box--detail-box">
                <Message v-if="messaging.status === true" :message="messaging.msg" :type="messaging.type"  />
            </div>
            <div class="cc-message-box--detail-count" v-if="maxlength">
                {{validVar(modelValueTemp) ? modelValueTemp.length : 0}}/{{maxlength}}
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, toRef, computed , useSlots, reactive, watchEffect, onMounted} from 'vue';
    import { useField } from 'vee-validate';
    import { validVar } from '@/functions/com.js';
    import Message from '@/components/validate/Message.vue';
    const props = defineProps({
        modelValue: String | Number,
        placeholder: String,
        name: String,
        rows: {type: Number, default:5},
        disabled: {type:Boolean, default:false},
        readonly: {type:Boolean, default:false},
        maxlength: {type: Number, default:null}, 
        showDetail:{type: Boolean, default:false},
        resetVal: {type: Boolean, default:false},
        noScroll: {type: Boolean, default:false},
        message:String,
        messageType:String,
        validate: Array | Object,
        selectOnFocus:{type: Boolean, default:false},
    })

    var modelValueTemp = ref();
    var errorMessage = ref();
    if(props.name){
        var name = toRef(props, 'name');
        var {value: modelValueTemp, errorMessage} = useField(name, props.validate);
    }

    const focus = ref(false);
    const textAreaRef = ref();
    const emit = defineEmits(['update:modelValue',  'input', 'change']);
    const slots = useSlots();
    const containerRef = ref();
    const slotRightRef = ref();
    const slotLeftRef = ref();
    const containerWidth = ref('auto');
    const registerMouseDown = ref(false);

    const messaging = reactive({
        status:false,
        type:null,
        msg:'',
    })
    onMounted(()=>{
        const resizeObserver = new ResizeObserver(entries => {
            if(containerRef.value){
                containerWidth.value = (containerRef.value.offsetWidth - slotRightRef.value.offsetWidth - slotLeftRef.value.offsetWidth - 4) + 'px';
            }
            if(props.noScroll !== false && textAreaRef.value){
                textAreaRef.value.style.height = 'auto'
                textAreaRef.value.style.height = textAreaRef.value.scrollHeight+'px';  
                setTimeout(()=>{
                    textAreaRef.value.style.width = 'auto' 
                },2000)
                         
            }
        })
        resizeObserver.observe(containerRef.value);
    })
    watchEffect(()=>{
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

    const processFocus = () => {
        focus.value = true;
        if(props.selectOnFocus !== false){
            textAreaRef.value.select()
        }
    }

    const totalCount = computed(()=>{
        if(!validVar(props.modelValueTemp)){return 0}
        else{return props.modelValueTemp.length}
    });

    const updateValue = (value) => {
        emit('update:modelValue',value);
        emit('input',value);
        if(props.noScroll !== false ){
            textAreaRef.value.style.height = 'auto'
            textAreaRef.value.style.height = textAreaRef.value.scrollHeight+'px';  
            setTimeout(()=>{
                    textAreaRef.value.style.width = 'auto' 
                },2000)   
        }
    };
    const changedValue = (value) => {
        emit('change',value);
    };

    const loadMouseDown = (e) => {
        registerMouseDown.value = true;
        document.addEventListener('mouseup', processMouseUp)
    }
    const processMouseUp = (e) => {
        registerMouseDown.value = false;
        setTimeout(()=>{
            document.removeEventListener('mouseup', processMouseUp)
        },0)
    }
</script>

<style lang="scss" scoped>
.set-width{
    width: 100% !important;
}
</style>
