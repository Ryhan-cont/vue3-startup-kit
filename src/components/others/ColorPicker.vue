<template>
    <div>
        <div class="ba-1 border-border-grey position-relative" ref="colorPickerContainerRef">
            <canvas ref="colorPickerCanvasRef" @mousedown="colorPickEvent($event, 'canvas')" :width="canvasWidth" :height="canvasHeight"></canvas>
            <div class="position-abs box-18 round-div ba-1 border-white" @mousedown="colorPickEvent($event, 'selector')" :style="{left:pickerX-9+'px', top:pickerY-9+'px', backgroundColor:selectedColor}"></div>
        </div>
        <div class="position-relative radius-4 mt-10" @mousedown="colorSlideEvent" ref="colerSlideContainerRef" style="height:12px; background: linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%));">
            <div class="round-div bg-white box-12 position-abs d-flex-center cursor-pointer pointer-event-none" ref="colerSlideRef" style="border: 0.5px solid rgba(0, 0, 0, 0.2); left:-6px; top: 0px;" ><div class="box-8 round-div" :style="{backgroundColor:baseColor}"></div></div>
        </div>
        <div class="d-grid  mt-10" style="grid-template-columns: 50px 1fr 20px;">
            <div class="d-flex-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.402 0.597982C12.6047 -0.199327 11.4088 -0.199327 10.6114 0.597982L7.82083 3.38856L7.02352 2.69092C6.62487 2.29226 6.02689 2.29226 5.62823 2.69092C5.22958 3.08957 5.22958 3.68755 5.62823 4.08621L6.32588 4.78385L0.545412 10.5643C0.146759 10.963 -0.451221 12.458 0.545412 13.4546C1.54204 14.4512 3.03699 13.8532 3.43564 13.4546L9.21611 7.6741L9.91376 8.37174C10.3125 8.7704 10.9104 8.7704 11.3091 8.37174C11.7077 7.97309 11.7077 7.37511 11.3091 6.97645L10.6114 6.27881L13.402 3.48823C14.1993 2.59125 14.1993 1.39529 13.402 0.597982ZM2.53867 12.458H1.54204V11.4613L7.32251 5.68083L8.31914 6.67746C8.21948 6.67746 2.53867 12.458 2.53867 12.458Z" fill="black" fill-opacity="0.8"/>
                </svg>
            </div>
            <div class="d-flex">
                <div class="box-30 ba-1 border-border-grey" :style="{backgroundColor:selectedColor}"></div>
                <div class="pl-10 flex-auto">
                    <input type="text" v-model="tempColor" @change="loadInputColor(tempColor)" class="w-100 h-100 px-10 text-b4-regular ba-1 border-border-grey input-no-outline" />
                </div>
            </div>
            <div class="d-flex-center-end">
                <svg width="14px" height="14px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" @click="$emit('update:modelValue', defaultValue)" class="cursor-pointer">
                    <g fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" transform="matrix(0 1 1 0 2.5 2.5)">
                        <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>
                        <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, reactive, onMounted, watch, nextTick, watchEffect} from 'vue';
    import { rgbToHex, hsvToHex, hexToHsv } from '@/functions/color.js';
    import {useMouseProcessor} from '@/store/plugins/mouseProcessor';

    const mouseProcessorStore = useMouseProcessor();

    const props = defineProps({
        modelValue: String,
        width:{type:Number, default:0},
        height:{ type: Number, default:0},
        defaultValue:{type:String, default:''}
    })

    const emit = defineEmits(['update:modelValue', 'reset', 'input', 'change']);

    const resizeObserver = new ResizeObserver(entries => {
        observeSize();
    })
    //refs
    const colorPickerContainerRef = ref();
    const colorPickerCanvasRef = ref();
    const colerSlideContainerRef = ref();
    const colerSlideRef = ref();

    //General settings
    const canvasWidth = ref(100);
    const canvasHeight = ref(100);

    //Define color
    const baseColor = ref();
    const selectedColor = ref('#FFFFFF');
    const tempColor = ref('#FFFFFF');

    //Positioning memory
    const pickerX = ref(0);
    const pickerY = ref(0);
    const innitialLeftPosition = ref(0);
    const initialPickPosition = reactive({
        x: 0,
        y: 0
    });

    //Others 
    const loadLog = ref(false)

    
    const observeSize = async () => {
        if(loadLog.value === true){console.log('observeSize')}
        if(props.width === 0 && colorPickerContainerRef.value){
            canvasWidth.value = colorPickerContainerRef.value.offsetWidth-2;
            await nextTick();
            loadColorPlate(selectedColor.value)
        }
    }

    //Color slide
    const colorSlideEvent = (e) =>{
        if(loadLog.value === true){console.log('colorSlideEvent')}
        colerSlideRef.value.style.left = (e.offsetX - 6)+'px'; 
        innitialLeftPosition.value = (e.offsetX - 6);
        mouseProcessorStore.listen = ['', '', processColorSlide, '', ''];
        getColorSlidePercent();
    }

    const processColorSlide = (e) => {
        if(loadLog.value === true){console.log('processColorSlide')}
        let newWidth = innitialLeftPosition.value + (e.dX - e.mouseDownPositionX);
        if(newWidth < -6){
            colerSlideRef.value.style.left = '-6px';
        }else if(newWidth > (colerSlideContainerRef.value.offsetWidth-6)){
            colerSlideRef.value.style.left = (colerSlideContainerRef.value.offsetWidth-6) + 'px'
        }else{
           colerSlideRef.value.style.left = newWidth+'px'; 
        }
        getColorSlidePercent();
    }

    const getColorSlidePercent = () => {
        if(loadLog.value === true){console.log('getColorSlidePercent')}
        let left = Number(colerSlideRef.value.style.left.replace('px', '')) + 6;
        let degree = (360/colerSlideContainerRef.value.offsetWidth)*left;
        let color = hsvToHex(degree/360, 1, 1);
        loadColorPlate(color, true);
        setColor();
    }
    //End color slide

    //Color pick
    const colorPickEvent = (e, type) => {
        if(loadLog.value === true){console.log('colorPickEvent')}
        let x, y;
        if(type == 'selector'){x =  pickerX.value; y =  pickerY.value;}
        else{x = e.offsetX; y = e.offsetY;}

        pickerX.value = x;
        pickerY.value = y;
        initialPickPosition.x  = x;
        initialPickPosition.y  = y;

        setColor()

        mouseProcessorStore.listen = ['', '', processColorPickEvent, '', ''];
    }

    const processColorPickEvent = (e) => {
        if(loadLog.value === true){console.log('processColorPickEvent')}
        let x = initialPickPosition.x + (e.dX - e.mouseDownPositionX);
        let y = initialPickPosition.y + (e.dY - e.mouseDownPositionY);

        if(x < 0){x = 0}
        else if(x > canvasWidth.value-1){x = (canvasWidth.value-1)}

        if(y < 0){y = 0}
        else if(y > canvasHeight.value-1){y = (canvasHeight.value-1)}

        pickerX.value = x;
        pickerY.value = y;
        setColor();
    }
    //End color pick

    const setColor = () => {
        if(loadLog.value === true){console.log('setColor')}
        let ctx = colorPickerCanvasRef.value.getContext("2d")
        let pixel = ctx.getImageData(pickerX.value,pickerY.value,1,1)['data'];
        let hex = rgbToHex(pixel[0],pixel[1],pixel[2]);
        //selectedColor.value = `rgb(${pixel[0]+','+pixel[1]+','+pixel[2]})`;
        selectedColor.value = tempColor.value = hex;
        emit('update:modelValue',hex)
    }
    /**
     * could load:
     * on slide, on input change, on v-model, on size change
     */
    const loadColorPlate = (color, slide = false) => {
        if(loadLog.value === true){console.log('loadColorPlate')}
        if(colorPickerCanvasRef.value){
            color = validateColor(color);
            let hsv = hexToHsv(color)
            baseColor.value = hsvToHex(hsv.h/360,1,1);

            if(slide === false){
                colerSlideRef.value.style.left = (((colerSlideContainerRef.value.offsetWidth/360)*hsv.h) - 6)+'px';
                pickerX.value = (canvasWidth.value/100)*hsv.s;
                pickerY.value = (canvasHeight.value/100)*(100-hsv.v);                
            }

            let ctx = colorPickerCanvasRef.value.getContext("2d")

            let gradientH = ctx.createLinearGradient(1, 1, ctx.canvas.width-1, 1);
            gradientH.addColorStop(0, '#fff');
            gradientH.addColorStop(1, baseColor.value);
            ctx.fillStyle = gradientH;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            //Create a Vertical Gradient(white to black)
            let gradientV = ctx.createLinearGradient(1, 1, 1, canvasHeight.value-1);
            gradientV.addColorStop(0, 'rgba(0,0,0,0)');
            gradientV.addColorStop(1, '#000000');
            ctx.fillStyle = gradientV;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }

    const loadInputColor = (color) => {
        if(loadLog.value === true){console.log('loadInputColor')}
        let reg = /^#([0-9a-f]{3}){1,2}$/i;
        if(reg.test(color) && colerSlideContainerRef.value){
            loadColorPlate(color);
            selectedColor.value = tempColor.value = color;
            emit('update:modelValue',selectedColor.value)
        }
    }

    const loadModelColor = () => {
        let color = validateColor(props.modelValue);
        loadColorPlate(color);
        selectedColor.value = tempColor.value = color;
    }

    const validateColor = (color) => {
        let reg = /^#([0-9a-f]{3}){1,2}$/i;
        if(reg.test(color)){
            return color
        }else{
            return '#ff0000'
        }
    }

    watch(() => props.modelValue, () => {
        if(props.modelValue != selectedColor.value){
            if(loadLog.value === true){console.log('watch props.modelValue')}
            loadModelColor()            
        }

    });

    onMounted(()=>{
        loadModelColor()
        resizeObserver.observe(colorPickerContainerRef.value);
        canvasWidth.value = props.width;
        canvasHeight.value = props.height;
    })
</script>