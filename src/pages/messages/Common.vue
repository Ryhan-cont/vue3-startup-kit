<template>
    <div class="message-img">
        <img :src="image" alt="status Code">
    </div>
    <div class="message-title">
        <h1>{{ title }}</h1>
    </div>
    <div class="message-description">
       <p>{{ subtitle }}</p>
    </div>
    <div v-if="noButton === false">
        <slot name="button" />
        <div v-if="!slots['button']" class="message-button-group">
            <a href="/button-component" class="btn btn-mid btn-primary">Go Back To Home</a>
        </div>
    </div>
</template>

<script setup>
    import { useSlots } from 'vue';
    const slots = useSlots();

    const props = defineProps({
        image: {type: String, default: ''},
        title: {type: String, default: ''},
        subtitle: {type: String, default: ''},
        noButton: {type: Boolean, default: false},
    })



</script>