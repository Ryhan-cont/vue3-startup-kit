<template>
    <div class="data-table--main">
        <div class="data-table--container" :style="{maxHeight:`${height}`}" ref="containerRef">
            <table ref="tableRef" border="0" cellspacing="0" cellpadding="0">
                <thead ref="headerRef">
                    <tr>
                        <td class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                        <td v-if="checkBox.field" :style="{width:checkBox.style ? checkBox.style.width: '', maxWidth: checkBox.style ? checkBox.style.maxWidth: '', minWidth: checkBox.style ? checkBox.style.minWidth: ''}">
                            <slot v-if="checkIfSlot(checkBox) != ''" :name="'header-'+checkIfSlot(checkBox)" />
                            <div class="data-table--header-cell-checkbox" v-if="!slots['header-'+checkIfSlot(checkBox)]">
                                <input type="checkbox" v-model="headerCheckBox" @change="hederCheckBoxAction()" />
                            </div>
                        </td>
                        <td v-for="(headerItem, HeaderIndex) in headerData" :key="'header-'+HeaderIndex" :style="{width:headerItem.style.width, maxWidth:headerItem.style.maxWidth, minWidth:headerItem.style.minWidth}">
                            <div class="data-table--header-cell">
                                <div>
                                    <slot v-if="checkIfSlot(headerItem) != ''" :name="'header-'+checkIfSlot(headerItem)" :data="headerItem" />
                                    <div class="data-table--header-cell-def" v-if="!slots['header-'+checkIfSlot(headerItem)]">{{headerItem.title}}</div>
                                </div>
                                <div v-if="headerItem.sort" class="data-table--header-cell-sort" @click="sortColumn(headerItem, HeaderIndex)">
                                    <i class="data-table--header-cell-sort-icon" v-if="headerItem.sort == 'none'"></i>
                                    <i class="fas fa-sort-down data-table--header-cell-sort-icon" v-if="headerItem.sort == 'asc'"></i>
                                    <i class="fas fa-sort-up data-table--header-cell-sort-icon" v-if="headerItem.sort == 'dsc'"></i>
                                </div>
                            </div>
                        </td>
                        <td v-if="actionColumn" class="data-table--action-spacer"><div class="data-table--action-spacer"></div></td>
                        <td v-else class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                    </tr>
                </thead>
                <tbody v-if="tableData.length">
                    <tr :style="{height:`${scrollData.topScrollLimit}px`}"></tr>
                    <tr v-for="(rowItem, rowInedx) in tableData" :key="'row-'+rowInedx" class="data-table--row-tr">
                        <td class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                        <td v-if="checkBox.field" :style="{width:checkBox.style ? checkBox.style.width: '', maxWidth: checkBox.style ? checkBox.style.maxWidth: '', minWidth: checkBox.style ? checkBox.style.minWidth: ''}">
                            <div class="data-table--body-cell-checkbox">
                                <input type="checkbox" v-model="rowItem[checkBox.field]" @change="bodyCheckBox()" />
                            </div>
                        </td>
                        <td v-for="(cellItem, cellIndex) in headerData" :key="'cell-'+cellIndex" :style="{width:cellItem.style.width, maxWidth:cellItem.style.maxWidth, minWidth:cellItem.style.minWidth}">
                            <slot v-if="checkIfSlot(cellItem) != ''" :name="checkIfSlot(cellItem)" :data="rowItem" />
                            <div class="data-table--body-cell-def" v-if="!slots[checkIfSlot(cellItem)]">{{getData(rowItem, cellItem.field)}}</div>
                        </td>
                        <td class="data-table--cell-action data-table--action-spacer" v-if="actionColumn">
                            <div class="data-table--cell-action-container">
                                <div class="data-table--cell-action-title">...</div>
                                <div class="data-table--cell-action-option-container">
                                    <div class="data-table--cell-action-options"></div>
                                </div>
                            </div>
                        </td>
                        <td v-else class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                    </tr>
                    <tr></tr>
                </tbody>
                <tbody v-else>

                </tbody>
            </table>

            
        </div>
        <div class="data-table--hide-header-scroll" v-if="scrollData.hasYScroll" :style="{height:`${scrollData.headerHeight}px`, width:`${scrollData.scrollWidth}px`}"></div>
        <div class="data-table--loader-animation" :style="{top:`${scrollData.headerHeight}px`}">
            <div class="data-table--loader-animation-content">
                
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, useSlots, nextTick, reactive, watch } from 'vue';
    import { cloneDeep, clearNumber, scrollbarHW, isPhone } from '@/functions/com.js'
    const props = defineProps({
        headerData: {type: Array, default: () => {return []}},
        tableData: {type: Array, default: () => {return []}},
        checkBox: {type: Object, default: () => {return {}}},
        lazyLoading: {type: Boolean, default: false},
        height: {type:String, default:'auto'},
        actionColumn: {type: Boolean, default: false},
    })
    const slots = useSlots();
    const emit = defineEmits(['sort']);

    const containerRef = ref();
    const headerRef = ref();
    const tableRef = ref();

    const headerCheckBox = ref();
    const scrollData = reactive({
        hasXScroll:false,
        hasYScroll:false,
        topScrollLimit:0,
        headerHeight:0,
        scrollWidth:10,
    })

    onMounted(()=>{
        // const resizeObserver = new ResizeObserver(entries => {
        //     scrollSetting('mount');
        // })
        // resizeObserver.observe(tableRef.value);
        // const containerResizeObserver = new ResizeObserver(entries => {
        //     scrollSetting('c');
        // })
        // containerResizeObserver.observe(containerRef.value);  
        // containerRef.value.addEventListener('scroll', scrollEvent);
    })
    /**
     * checkIfSlot
     * Check and return slot name
     */
    const checkIfSlot = (data) => {
        if(data.slotName){
            return data.slotName
        }else if(data.field){
            return data.field
        }
        return '';
    }
    /**
     * getData
     * Use key and data to generate cell value.
     */
    const getData = (source, key) => {
        if(key.includes(".")){
            let clonedSource = cloneDeep(source)
            let keyArr = key.split('.');
            for(let item of keyArr){
                if(!clonedSource.hasOwnProperty(item)) {return ''}
                clonedSource = clonedSource[item]
            }
            return clonedSource;
        }else{
            return source[key];
        }
    }
    /**
     * sortColumn
     * Sorting column and trigger event
     */
    const sortColumn = (headerItem, index) => {
        let sort = 'none';
        if(headerItem.sort == 'none'){
            sort = 'asc'
        }else if(headerItem.sort == 'asc'){
            sort = 'dsc'
        }else if(headerItem.sort == 'dsc'){
            sort = 'none'
        }
        emit('sort',{data:headerItem, index, sort});
    }

    ////////////////////// CHECKBOX
    /**
     * hederCheckBoxAction
     * Select unselect all checkbox in table body
     */
    const hederCheckBoxAction = () => {
        props.tableData.map((item)=>{
            item[props.checkBox.field] = headerCheckBox.value;
        })
    };
    /**
     * bodyCheckBox
     * Select unselect all checkbox in table body
     */
    const bodyCheckBox = () => {
        let allTure = true;
        props.tableData.map((item)=>{
            if(item[props.checkBox.field] === false){allTure = null}
        })
        if(allTure === true){headerCheckBox.value = true; return}
        headerCheckBox.value = false;
    }

    ////////////////////// SCROLL
    /**
     * scrollSetting
     * Scrollbar should not go to header area. General settings for this.
     */
    const scrollSetting = async (from) => {
        
        
        //Check if has Y and X scroll
        if(containerRef.value.scrollHeight>containerRef.value.clientHeight){scrollData.hasYScroll = true}else{scrollData.hasYScroll = false}
        if(containerRef.value.scrollWidth>containerRef.value.clientWidth){scrollData.hasXScroll = true}else{scrollData.hasXScroll = false}
        scrollData.headerHeight = headerRef.value.offsetHeight;
        scrollData.scrollWidth = containerRef.value.offsetWidth - containerRef.value.clientWidth;

        //Calculate top scroll limit size
        let totalScrollTop = containerRef.value.scrollHeight-containerRef.value.offsetHeight;
        let scrollbarMoveableSpaceInPercent = 100 - (containerRef.value.offsetHeight/tableRef.value.offsetHeight)*100;
        let scrollbarMoveableSpaceInPixel = (scrollbarMoveableSpaceInPercent/100)*containerRef.value.offsetHeight;
        let scrollTopForClearHeader = (totalScrollTop/scrollbarMoveableSpaceInPixel)*headerRef.value.offsetHeight;

        //If there is no scroll requre then make spacer tr height 0 px
        if((tableRef.value.offsetHeight - scrollData.topScrollLimit) < containerRef.value.offsetHeight){
            scrollTopForClearHeader = 0
        }
        scrollData.topScrollLimit = scrollTopForClearHeader;
        await nextTick();
        //If already scroll then ignore setup scroll top
        if(containerRef.value.scrollTop < scrollTopForClearHeader){
            containerRef.value.scrollTop = scrollTopForClearHeader;
        }
    }
    /**
     * scrollSetting
     * On scroll function, Scrollbar should not go to header area.
    */
    const scrollEvent = (e) => {
        console.log(e)
        if(containerRef.value.scrollTop < scrollData.topScrollLimit){
            containerRef.value.scrollTop = scrollData.topScrollLimit;
        }
    }
</script>