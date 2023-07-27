<template>
    <div ref="containerRef" class="ba-1 border-border-grey d-flex pad-target-parent" @mousedown="initializeDraw($event)" @mouseup="completeDraw" @touchstart="initializeDraw($event)" @touchend="completeDraw">
        <canvas ref="canvasRef" :width="canvasSize.width" :height="canvasSize.height" />
    </div>
</template>
<script setup>
    import { ref, onMounted, onUnmounted, reactive, watchEffect } from 'vue'
    /**
     * function Import
     */
    import { getTargetParent } from '@/functions/dom.js';

    /**
     * Define property
     */
    const props = defineProps({
        height:{type:[Number, String], default:0},
        width:{type:[Number, String], default:0},
        path: Object | String,
    })
    const emit = defineEmits(['update', 'pathUpdate']);

    const parentPosition = ref(null);
    const containerRef = ref(null);
    const canvasRef = ref(null);
    const ctx = ref(null);
    const path = ref(new Path2D());
    const pathMemory = ref([]);
    const onDraw = ref(false)

    const canvasSize = reactive({width:0, height:0})


    const initializeDraw = (e) => {
        e.preventDefault();
        parentPosition.value =  getTargetParent(e.target, 'pad-target-parent').getBoundingClientRect();
        let pX, pY;
        if(e.touches){
            pX = Math.round(e.touches[0].clientX - parentPosition.value.left);
            pY = Math.round(e.touches[0].clientY - parentPosition.value.top);
        }else{
            pX = Math.round(e.x - parentPosition.value.left);
            pY = Math.round(e.y - parentPosition.value.top);
        }

        pathMemory.value = []
        path.value.moveTo( pX, pY );
        path.value.lineTo( pX, pY );
        ctx.value.clearRect( 0, 0, canvasSize.width, canvasSize.height );
        ctx.value.stroke( path.value );

        pathMemory.value.push({pX, pY});

        onDraw.value = true;
    }
    const completeDraw = (e) => { 
        if(onDraw.value === true){
            onDraw.value = false;
            let imgBinary = ctx.value.getImageData(0, 0, canvasSize.width, canvasSize.height)
            let x,y
            let position = {
                top: null,
                left: null,
                x: null,
                y: null
            }

            for (let i = 0; i < imgBinary.data.length; i += 4) {
                if(imgBinary.data[i + 3] !== 0){
                    x = (i / 4) % canvasSize.width;
                    y = ~~((i / 4) / canvasSize.width);

                    if (position.top === null || y < position.top) {
                        position.top = y
                    }
                    if (position.left === null || x < position.left) {
                        position.left = x
                    }
                    if (position.y === null || y > position.y) {
                        position.y = y
                    }
                    if (position.x === null || x > position.x) {
                        position.x = x
                    }
                }
            }
            
            let resizedCanvas = document.createElement("canvas");
            let resizedContext = resizedCanvas.getContext("2d");

            let width = position.x-position.left;
            let height = position.y-position.top;

            let canvasWidth = position.x-position.left;
            let canvasHeight = position.y-position.top;

            let halfExtraHeight = 0

            let minHeight = 100;
            if(height < minHeight){
                let extraHeight = minHeight - height;
                halfExtraHeight = extraHeight/2;

                canvasHeight = canvasHeight + extraHeight;
            }

            resizedCanvas.width = canvasWidth;
            resizedCanvas.height = canvasHeight;

            resizedContext.drawImage(canvasRef.value, position.left, position.top, width, height, 0, halfExtraHeight, width, height);

            resizedCanvas.remove()

            emit('update', resizedCanvas.toDataURL())
            emit('pathUpdate', path.value);
        }
    }
    const listenDraw = (e) => {
        if(onDraw.value === true){
            let x = null;
            let y = null;
            if(e.x){
                x = e.x;
                y = e.y;
            }else if(e.targetTouches && e.targetTouches[0]){
                x = e.targetTouches[0].clientX;
                y = e.targetTouches[0].clientY;
            }

            let pX = Math.round(x - parentPosition.value.left);
            let pY = Math.round(y - parentPosition.value.top);
            
            // let diff = Math.abs(pX - pathMemory.value[pathMemory.value.length - 1].pX);
            // console.log(pX, pathMemory.value[pathMemory.value.length - 1].pX, diff)

            createStroke(pX, pY);            
        }
    }
    const createStroke = (pX, pY) => {
        let smooth = 5;
        if(pX > 0 && pY > 0){
            pathMemory.value.push({pX, pY})

            let xSum = 0;
            let ySum = 0;
            let avj = 0;
            for(let i = 1; (smooth+1) > i; i++){
                xSum = xSum + pathMemory.value[pathMemory.value.length - i].pX
                ySum = ySum + pathMemory.value[pathMemory.value.length - i].pY
                avj++
                if(!pathMemory.value[pathMemory.value.length - (i+1)]){
                    i = smooth + 10;
                }
            }
            pX = xSum/avj;
            pY = ySum/avj;

            path.value.lineTo( pX, pY );
            ctx.value.clearRect( 0, 0, canvasSize.width, canvasSize.height );

            ctx.value.stroke( path.value );
        }
    }
    const setContainerSize = () => {
        if(containerRef.value){
            containerRef.value.style.transition = 'all 0s'
            if(props.width === 0){
                canvasSize.width = containerRef.value.offsetWidth
            }else{
                canvasSize.width = props.width
            }
            if(props.height === 0){
                canvasSize.height = containerRef.value.offsetHeight
            }else{
                canvasSize.height = props.height
            }

            if(props.path == ''){
                path.value = new Path2D();
            }else{
                path.value = props.path;
            }

            ctx.value = canvasRef.value.getContext("2d", { willReadFrequently: true });
            ctx.value.lineCap = 'round';
            ctx.value.lineJoin="round";
            ctx.value.lineWidth = 4;

            ctx.value.clearRect( 0, 0, canvasSize.width, canvasSize.height );

            ctx.value.stroke( path.value );
        }
    }

    const clear = () => {
        path.value = new Path2D();
        ctx.value.clearRect( 0, 0, canvasSize.width, canvasSize.height );
        ctx.value.stroke( path.value );
        emit('update', '');
        emit('pathUpdate', '')
    }

    onMounted(()=>{
        const resizeObserver = new ResizeObserver(entries => {
            setContainerSize()
        })
        resizeObserver.observe(containerRef.value);
        document.addEventListener('mousemove', listenDraw);
        document.addEventListener('mouseup', completeDraw);

        document.addEventListener('touchmove', listenDraw, { passive: false });
        document.addEventListener('touchend', completeDraw, { passive: false });
    })

    onUnmounted(()=>{
        document.removeEventListener('mousemove', listenDraw);
        document.removeEventListener('mouseup', completeDraw);

        document.removeEventListener('touchmove', listenDraw, { passive: false });
        document.removeEventListener('touchend', completeDraw, { passive: false });
    })

    defineExpose({ clear })
</script>