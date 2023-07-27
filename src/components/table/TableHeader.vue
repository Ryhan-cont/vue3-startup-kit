<template>
    <div class="px-20 bg-white" style="border-radius: 4px 4px 0px 0px;">
        <div class="py-7">
            <slot name="content" :activeFilter="activeFilter" :toggleFilter="toggleFilter" />
        </div>
        <transition name="table-filter">
            <div v-if="toggleFilter">
                <div class="bg-background mb-10 d-inline-block w-100 pa-20 radius-4"  style="min-height:72px">
                    <slot name="filter" />
                </div>
            </div>            
        </transition>

    </div>
</template>
<script setup>
    /**
     * *Import plugin
     */
     import { ref, shallowRef  , onMounted,computed  } from 'vue';
    /**
    * * Main Section (Variable & Constants)
    */
    const toggleFilter = ref(false);
    const activeFilter = () => {
        toggleFilter.value = !toggleFilter.value;
    }

</script>