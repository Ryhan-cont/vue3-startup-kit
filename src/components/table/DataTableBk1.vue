<template>
<div class="data-table--main">
    dddddddddddddd
    <div class="data-table--y-scroll-positioning">
        <div class="data-table--container" :style="{height:`${height}`}" ref="containerRef" @scroll="scrollEvent">
                <table class="data-table--table" ref="tableRef" border="0" cellspacing="0" cellpadding="0">
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
                    <tbody>
                        <tr ref="scrollAdjSpace" style="background-color:blue"></tr>
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
                    </tbody>
                </table>
                <div class="data-table--loading" v-if="lazyLoading">Loading...</div>
        </div>
        <div class="data-table--y-scroll" v-if="scroll.hasYScroll" :style="{width:`${scrollbarHW()}px`}">
            <div class="data-table--y-scroll-head" :style="{height:layout.headerHeight+'px'}"></div>
            <div class="data-table--y-scroll-bar" :style="{height:(clearNumber(height)-layout.headerHeight-scroll.xScrollSize)+'px'}" ref="dummyScrollRef" @scroll="yDummyScroll">
                <div :style="{height:layout.tableHeight+'px', width:'1px'}"></div>
            </div>
            <div :style="{height:scroll.xScrollSize+'px', backgroundColor: 'var(--scrollbar-line)'}"></div>
        </div>
    </div>
    <div class="data-table--x-scroll-bar">
        <div :style="{width:layout.tableWidth+'px', height:'1px'}"></div>
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
    const tableYScrollRef = ref();
    const dummyScrollRef = ref();
    const headerCheckBox = ref();

    const scrollAdjSpace = ref();

    //DUMMY SCROLL
    const layout = reactive({
        headerHeight: '',
        tableWidth: '',
        tableHeight: '',
        containerWidth: '',
    })
    const scroll = reactive({
        hasXScroll:false,
        hasYScroll:false,




        haveScroll:false,
        scrollAdjForDummy:0,
        scrollAdjForMain:0,
        dummyScrollEvent:false,
        mainScrollEvent:false,
        xScrollSize:0,
        yScrollSize:0,
    })
    const baseScrollTop = ref(0);
    const dummyScrollTop = ref(0);
    //END DUMMY SCROLL

    onMounted(()=>{
            const resizeObserver = new ResizeObserver(entries => {
                setLayout();
            })
            resizeObserver.observe(containerRef.value);
            containerRef.value.addEventListener('scroll', scrollEvent);
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

    /**
     * setLayout
     * Generate basic table data and y scroll
     */
    const setLayout = () => {
        if(containerRef.value.scrollHeight>containerRef.value.clientHeight){scroll.hasYScroll = true}else{scroll.hasYScroll = false}
        if(containerRef.value.scrollWidth>containerRef.value.clientWidth){scroll.hasXScroll = true}else{scroll.hasXScroll = false}

        console.log('-----', containerRef.value.offsetWidth, containerRef.value.clientWidth)


            layout.tableHeight = tableRef.value.offsetHeight;
            layout.tableWidth = tableRef.value.offsetWidth;

            //For dunny y scroll
            layout.headerHeight = headerRef.value.offsetHeight;
            layout.containerWidth = containerRef.value.offsetWidth;

            let givenHeight = clearNumber(props.height) - scroll.xScrollSize
            scroll.scrollAdjForDummy = layout.headerHeight/(layout.tableHeight - givenHeight);
            scroll.scrollAdjForMain = layout.headerHeight/(layout.tableHeight - (givenHeight-layout.headerHeight));
    }
    const scrollEvent = (e) => {
        let totalScrollTop = containerRef.value.scrollHeight-containerRef.value.clientHeight;

        let scrollbarMoveableSpaceInPercent = 100 - (containerRef.value.clientHeight/tableRef.value.clientHeight)*100;
        let scrollbarMoveableSpaceInPixel = (scrollbarMoveableSpaceInPercent/100)*containerRef.value.clientHeight;
        let scrollTopForClearHeader = (totalScrollTop/scrollbarMoveableSpaceInPixel)*headerRef.value.offsetHeight;

        console.log(scrollTopForClearHeader);


        scrollAdjSpace.value.style.height = scrollTopForClearHeader+'px';
        
        if(containerRef.value.scrollTop < scrollTopForClearHeader){
            containerRef.value.scrollTop = scrollTopForClearHeader;
        }
        //Prevent repetation
        if(scroll.dummyScrollEvent === true){
            scroll.dummyScrollEvent = false;
            return;
        }
        scroll.mainScrollEvent = true;
        //End prevent repetation
        dummyScrollTop.value =  Math.round(e.target.scrollTop + (e.target.scrollTop*scroll.scrollAdjForDummy))
        dummyScrollRef.value.scrollTop = dummyScrollTop.value ;
        //headerRef.value.style.transform = `translateY(${e.target.scrollTop}px)`;
    }
    const yDummyScroll = async (e) => {
        //Prevent repetation
        if(scroll.mainScrollEvent === true){
            scroll.mainScrollEvent = false;
            return;
        }
        scroll.dummyScrollEvent = true;
        //End prevent repetation

        baseScrollTop.value = e.target.scrollTop-(e.target.scrollTop*scroll.scrollAdjForMain);
        containerRef.value.scrollTop = baseScrollTop.value;
        await nextTick();
        headerRef.value.style.transform = `translateY(${containerRef.value.scrollTop}px)`;
    }
    const xDummyScroll = async (e) => {

    }
</script>