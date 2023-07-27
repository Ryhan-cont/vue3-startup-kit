<template>
  <div :class="['date-picker-wrapper', {'date-picker-wrapper-reset':reset === false || disabled || readonly}, {'date-picker-wrapper-disabled':disabled}, {'date-picker-wrapper-readonly':readonly}]">
    <Datepicker 
      v-model="datePicker"
      ref="datepickerRef"
      :menuClassName="datepickerClass"
      :range="range"
      :multiCalendars="multiCalendars"
      :autoApply="applyButton == 'default' ? true : false"
      :offset="0"
      :placeholder="placeholder"
      :position="position"
      :multiCalendarsSolo="multiCalendarsSolo"
      :enableTimePicker="false"
      :transitions="false"
      :maxDate="maxDate"
      :minDate="minDate"
      :presetRanges="presetRanges"
      :format="format"
      :key="datePickerId + '-' + key"
      @update:modelValue="handleDate"
      @open="openMenuEvent"
      @closed="emit('close')"
    />
    <!-- :transitions="false" -->
    <input type="hidden" v-model="modelValueTemp" :name="name" />
    <div class="otp-imput--detail" v-if="showDetail">
      <Message v-if="messaging.status === true" :message="messaging.msg" :type="messaging.type"  />
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, watchEffect, onMounted, onUnmounted, toRef, watch } from 'vue';
  import { useField } from 'vee-validate';
  import Datepicker from '@vuepic/vue-datepicker';
  import Message from '@/components/validate/Message.vue';
  import { validVar, randomString } from '@/functions/com.js';
  import { stringToDate, dateToString } from '@/functions/date.js';

  const props = defineProps({
      modelValue: String | Number | Boolean,
      name: String,
      disabled: {type:Boolean, default:false},
      readonly: {type:Boolean, default:false},
      position:{type:String, default:'left'},
      size: {type: String, default:''},
      showDetail:{type: Boolean, default:false},
      separator: {type: String, default:'~'},
      format:{type: String, default:null},
      validate: Array | Object,
      message:String,
      messageType:{type:String, default:null},
      placeholder:{type:String, default:''},
      

      //-----
      range:{type: Boolean, default:false},
      applyButton:{type: String, default:'default'},
      maxDate:{type: Date, default:null},
      minDate:{type: Date, default:null},
      rangePreset:{type: Boolean, default:false},
      reset:{type: Boolean, default:false},
  });
  
  var modelValueTemp = ref();
  var errorMessage = ref();
  if(props.name){
    var name = toRef(props, 'name');
    var {value: modelValueTemp, errorMessage} = useField(name, props.validate);
  }

  const emit = defineEmits(['update:modelValue', 'change', 'close', 'open']);

  const datepickerRef = ref(null);
  const datePicker = ref();
  const datePickerId = ref(randomString(50, '0123456789abcdefghijklmnopqrstuvwxyz'))
  const key = ref(0);
  const multiCalendars = ref(false);
  const multiCalendarsSolo = ref(false);
  const presetRanges = ref([]);
  const datepickerClass = ref('date-picker-menu');
  const messaging = reactive({
        status:false,
        type:null,
        msg:'',
  });

  const positionToRef = toRef(props, 'position')

  const getCalendarRanges = () => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    presetRanges.value =  [
      {label: 'Today', range: [today, today]},
      {label: 'Yesterday', range: [yesterday, yesterday]},
      {label: 'Last 7 days' , range: [new Date(Date.now() - 7 * 24 * 3600 * 1000), new Date()]},
      {label: 'Last 30 days' , range: [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()]},
      {label: 'This month', range: [new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0)]},
      {label: 'Last month', range: [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)]},
      {label: 'This year', range: [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)]},  
      {label: 'Last year', range: [new Date(today.getFullYear() - 1, 0, 1), new Date(today.getFullYear() - 1, 11, 31)]},            
    ]
    key.value++
  };
  const handleDate = () =>{
    if(props.range === false){
      let date;
      if(datePicker.value === null){
        date = null;
      }else{
        date = dateToString(datePicker.value);
      }
      modelValueTemp.value = date;
      emit('update:modelValue',date);
      emit('change',date);
    }else{
      if(datePicker.value == null){
        modelValueTemp.value = null;
        emit('update:modelValue', null);
        emit('change',null);
      }else{
        let startDate, endDate;
        startDate = dateToString(datePicker.value[0]);
        endDate = dateToString(datePicker.value[1]);
        modelValueTemp.value = startDate+props.separator+endDate;
        emit('update:modelValue', startDate+props.separator+endDate);
        emit('change',startDate+props.separator+endDate);
      }
    }
  }
  const openMenuEvent = () => {
    emit('open');
    var datepickerEl = document.getElementsByClassName('date-picker-menu')[0];
    var el = datepickerEl.getElementsByTagName('div')[1];
    datepickerEl.classList.add('datepicker-animation-from');
    el.classList.add('datepicker-animation-inner-from');
    setTimeout(()=>{
      datepickerEl.classList.add('datepicker-animation-to');
      el.classList.add('datepicker-animation-inner-to');
    },10)
  }

  const openMenu = () => {
    datepickerRef.value.openMenu()
  }
  
  onMounted(()=>{
    if(props.range !== false){
      multiCalendars.value = true;
      multiCalendarsSolo.value = true;
    }
  })

  watchEffect(()=>{
      if(props.rangePreset !== false){
        getCalendarRanges()
      }
  })

  watch(positionToRef, ()=>{
    key.value++
  })

  watchEffect(()=>{
    if(props.range === false){
      if(validVar(props.modelValue)){
        let date = stringToDate(props.modelValue)
        if(null != date){
          datePicker.value = date;
          modelValueTemp.value = dateToString(date);
        }else{
          datePicker.value = null;
          modelValueTemp.value = null;
        }
      }else{
        datePicker.value = null;
        modelValueTemp.value = null;
      }
    }else{
      if(validVar(props.modelValue)){
        let dateArr = props.modelValue.split(props.separator)
        let startDate, endDate;
        if(dateArr[0]){startDate = stringToDate(dateArr[0])}else{startDate = null};
        if(dateArr[1]){endDate = stringToDate(dateArr[1])}else{endDate = null};
        if(null != (startDate && endDate)){
          datePicker.value = [startDate, endDate]
          modelValueTemp.value = dateToString(startDate)+props.separator+dateToString(endDate);
        }else{
          datePicker.value = null;
          modelValueTemp.value = null;
        }
      }else{
        datePicker.value = null;
        modelValueTemp.value = null;
      }
    }
  });
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

  defineExpose({ openMenu })
</script>