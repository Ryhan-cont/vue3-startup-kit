<template>
    <div :class="['d-grid', `cc-btn-slot--container-${size}`]" :style="{'gridTemplateColumns':'1fr ' + width}">
        <div class="flex-auto">
            <slot></slot>
        </div>
        <div @click="$emit('click')" class="cc-btn-slot--btn-container">
            <div class="cc-btn-slot--btn">
                {{title}}
            </div>
            <div class="cc-btn-slot--btn-border" :style="{left: clearLeftBorder !== false ? '-2px' : '0px'}">{{clearLeftBorder}}</div>
            <!--  -->
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        title: String,
        clearLeftBorder:{type: String, default:false},
        size: {type: String, default:''},
        width: {type: String, default:'auto'}
    })
    const emit = defineEmits(['click']);
</script>