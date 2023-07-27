<template>
    <div>
        <div v-if="marginTop != '0px' && topLine === true" :style="{width: containerWidth + 'px', height: marginTop}" :class="{'marker-line':topLine}"></div>
        <div class="d-flex">
            <div class="d-flex-center flex-column no-shrink" :style="{width: containerWidth + 'px'}">
                <div :class="['flex-auto', {'marker-line':topLine}]"></div>
                <div v-if="mark" class="d-flex-center ba-1 border-disable" :style="{width: markerSize + 'px', height: markerSize + 'px', borderRadius: markerType == 'icon' ? '50%' : '4px'}">
                    <span v-if="markerType == 'icon'" :class="'far fa-'+markContent + ' ' + iconclass"></span>
                    <span v-else :class="contentclass">
                        {{markContent}}
                    </span>
                </div>
                <div :class="['flex-auto', {'marker-line':bottomLine}]"></div>
            </div>
            <div class="w-100">
                <slot />
            </div>
        </div>
        <div v-if="marginBottom != '0px' && bottomLine === true" :style="{width: containerWidth + 'px', height: marginBottom}" :class="{'marker-line':bottomLine}"></div>
    </div>
</template>

<script setup>
    const props = defineProps({
        mark:{type:Boolean, default:true},
        containerWidth: {type:Number, default: 40},
        markerSize:{type:[String, Number], default: 40},
        markerType:{type:String, default:'icon'},
        markContent:{type:[String, Number], default:''},
        topLine:{type:Boolean, default:true},
        bottomLine:{type:Boolean, default:true},
        iconclass:{type:String, default:'font-18 color-light'},
        contentclass: {type:String, default:'text-b4-medium color-mid py-3 px-8'},
        marginTop:{type:String, default:'0px'},
        marginBottom:{type:String, default:'0px'}
    })

</script>

<style lang="scss" scoped>
.marker-line{
    position: relative;
    &::before{
        content: '';
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 50%;
        width: 1px;
        background-color: var(--disable);
    }
}
</style>