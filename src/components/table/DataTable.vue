<template>
    <div class="data-table--main">
        <div class="data-table--container" :style="{maxHeight:`${height}`}" ref="containerRef">
            <table ref="tableRef" border="0" cellspacing="0" cellpadding="0">
                <thead ref="headerRef" v-if="hideHeader === false">
                    <tr>
                        <td class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                        <td v-if="checkBox.field" :style="checkBox.headerStyle" class="data-table--checkbox">
                            <slot v-if="checkIfSlot(checkBox) != ''" :name="'header-'+checkIfSlot(checkBox)" />
                            <div class="data-table--header-cell-checkbox d-flex" v-if="!slots['header-'+checkIfSlot(checkBox)]">
                                <div class="d-flex pr-10 color-light cursor-move" style="opacity:0" v-if="moveable !== false">
                                    <span class="fas fa-ellipsis-v"></span>
                                    <span class="fas fa-ellipsis-v"></span>
                                </div>
                                <input type="checkbox" class="site-checkbox" v-model="headerCheckBox" @change="hederCheckBoxAction()" />
                            </div>
                        </td>
                        <td v-for="(headerItem, HeaderIndex) in headerData" :key="'header-'+HeaderIndex" :style="headerItem.style">
                            <div :class="['data-table--header-cell', headerItem.cellClasses]">
                                <div>
                                    <slot v-if="checkIfSlot(headerItem) != ''" :name="'header-'+checkIfSlot(headerItem)" :data="headerItem" />
                                    <div class="data-table--header-cell-def" v-if="!slots['header-'+checkIfSlot(headerItem)]">{{headerItem.title}}</div>
                                </div>
                                <div v-if="(headerItem.sort || headerItem.sort == '') && headerItem.sort !== false" class="data-table--header-cell-sort" @click="sortColumn(headerItem, HeaderIndex)">
                                    <i class="fas fa-sort-down data-table--header-cell-sort-icon color-mid font-12 pt-3" v-if="headerItem.sort == 'asc' && sortColumnIndex == HeaderIndex"></i>
                                    <i class="fas fa-sort-up data-table--header-cell-sort-icon color-mid font-12 pt-3" v-else-if="headerItem.sort == 'desc' && sortColumnIndex == HeaderIndex"></i>
                                    <i class="data-table--header-cell-sort-icon" v-else></i>
                                </div>
                            </div>
                        </td>
                        <td v-if="actionColumn" class="data-table--action-spacer"><div class="data-table--action-spacer"></div></td>
                        <td v-else class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                    </tr>
                </thead>
                <tbody v-if="tableData.length > 0">
                    <tr v-for="(rowItem, rowIndex) in tableData" :key="'row-'+rowIndex" class="data-table--row-tr" @mouseup="$emit('drop', {rowItem, rowIndex})">
                        <td class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                        <td v-if="checkBox.field" :style="checkBox.style" class="data-table--checkbox">
                            <div class="data-table--body-cell-checkbox d-flex">
                                <div class="d-flex pr-10 color-light cursor-move" v-if="moveable !== false" @mousedown="emit('moveStart', {rowItem, rowIndex})">
                                    <span class="fas fa-ellipsis-v"></span>
                                    <span class="fas fa-ellipsis-v"></span>
                                </div>
                                <input type="checkbox" class="site-checkbox" v-model="rowItem[checkBox.field]" @change="bodyCheckBox()" />
                            </div>
                        </td>
                        <td v-for="(cellItem, cellIndex) in headerData" :key="'cell-'+cellIndex" :style="cellItem.style">
                            <slot v-if="checkIfSlot(cellItem) != ''" :name="checkIfSlot(cellItem)" :data="rowItem" :index="rowIndex" />
                            <div :class="['data-table--body-cell-def', cellItem.cellClasses]" v-if="!slots[checkIfSlot(cellItem)]">{{getData(rowItem, cellItem.field)}}</div>
                        </td>
                        <td class="data-table--cell-action data-table--action-spacer" v-if="actionColumn">
                            <div class="data-table--cell-action-container" @mouseup="loadAction($event, rowIndex)">
                                <div class="data-table--cell-action-title"><i :class="[actionOpenIndex === rowIndex ? 'color-action far fa-ellipsis-stroke-vertical ' : 'far fa-ellipsis-v']"></i></div>
                            </div>
                        </td>
                        <td v-else class="data-table--x-spacer"><div class="data-table--x-spacer"></div></td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr :style="{height: height == 'auto' ? '80px' : `${clearNumber(height)-headerHeight-scrollHeight}px`}"></tr>
                </tbody>
            </table>
        </div>
        <div class="data-table--loader-animation" v-if="onLoading" :style="{top:`${headerHeight}px`, right:`${scrollWidth}px`}">
            <div class="data-table--loader-animation-content"></div>
        </div>
        <div v-if="tableData.length === 0" class="data-table--no-item" :style="{top:`${headerHeight-2}px`, right:`${scrollWidth}px`, bottom:`${scrollHeight}px`}">
            No item to show.
        </div>
        <div :class="['data-table--cell-action-option-container', actionSelectorClass]" v-for="(actionItem, actionInedx) in tableData" :id="'action_'+tableId+'_'+actionInedx" :key="'action-'+actionInedx">
            <slot :name="'table-action'" :data="actionItem" :closeAllAction="closeAllAction" />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, useSlots, nextTick, reactive, watch } from 'vue';
    import { cloneDeep, clearNumber, randomString } from '@/functions/com.js'
    import { getTargetParent } from '@/functions/dom.js';
    const props = defineProps({
        headerData: {type: Array, default: () => {return []}},
        tableData: {type: Array, default: () => {return []}},
        checkBox: {type: Object, default: () => {return {}}},
        onLoading: {type: Boolean, default: false},
        height: {type:String, default:'auto'},
        actionColumn: {type: Boolean, default: false},
        hideHeader: {type: Boolean, default: false},
        actionSelectorClass: {type:String, default:''},
        moveable: {type: Boolean, default: false}
    })
    const slots = useSlots();
    const emit = defineEmits(['sort', 'drop', 'moveStart']);

    const containerRef = ref();
    const headerRef = ref();
    const tableRef = ref();

    const headerCheckBox = ref();
    const headerHeight = ref();
    const scrollWidth = ref(0);
    const scrollHeight = ref(0);
    const actionOpenIndex = ref(null);

    const sortColumnIndex = ref(null);

    const tableId = ref(randomString(50, '0123456789abcdefghijklmnopqrstuvwxyz'))

    const actionMonitor = reactive({
        elPosition:{},
        interv:null,
        loaded:false,
        timeCount:0,

    })

    onMounted(()=>{
        headerHeight.value  = headerRef.value.offsetHeight;
        const resizeObserver = new ResizeObserver(entries => {
            if(containerRef.value){
                scrollWidth.value = containerRef.value.offsetWidth - containerRef.value.clientWidth
                scrollHeight.value = containerRef.value.offsetHeight - containerRef.value.clientHeight                
            }
        })
        resizeObserver.observe(containerRef.value);
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
        if(key && key.includes(".")){
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
    const setSort = (index, sort)=>{
        for(let item of props.headerData){
            if(item.sort || item.sort == ''){
                item.sort = '';
            }
        }
        props.headerData[index].sort = sort;
        sortColumnIndex.value = index;
    }
    /**
     * sortColumn
     * Sorting column and trigger event
     */
    const sortColumn = (headerItem, index) => {
        let sort = '';
        if(headerItem.sort == '' || headerItem.sort === true){
            sort = 'asc'
        }else if(headerItem.sort == 'asc'){
            sort = 'desc'
        }else if(headerItem.sort == 'desc'){
            sort = 'asc'
        }
        emit('sort',{data:headerItem, index, sort, setSort});
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
            if(item[props.checkBox.field] === false || item[props.checkBox.field] == undefined){allTure = null}
        })
        if(allTure === true){headerCheckBox.value = true; return}
        headerCheckBox.value = false;
    }
    const loadAction = async (e, index) => {
        if(actionOpenIndex.value != index){closeAllAction()}
        if(actionMonitor.loaded === false){
            actionOpenIndex.value = index;
            closeAllAction()
            actionMonitor.timeCount = 0;
            actionMonitor.loaded = true;
            let el = getTargetParent(e.target, 'data-table--cell-action-container');
            let floatingEl = document.getElementById('action_'+tableId.value+'_'+index);
            let elPosition = el.getBoundingClientRect();
            let winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            actionMonitor.elPosition = elPosition;
            
            floatingEl.style.display = 'block';
            floatingEl.style.top = (elPosition.top + (elPosition.height/2))+'px';
            floatingEl.style.right = (winWidth - elPosition.right + elPosition.width/2 - 7)+'px';

            if(((elPosition.top + (elPosition.height/2)) + floatingEl.offsetHeight)>winHeight){
                floatingEl.style.top = (winHeight - floatingEl.offsetHeight - 10)+'px';
            }

            await nextTick();
            floatingEl.style.opacity = 1;
            
            document.addEventListener('click', tableDocClicked);
            actionMonitor.interv = setInterval(()=>{
                actionMonitor.timeCount = actionMonitor.timeCount + 50;
                let elPosition = getTargetParent(e.target, 'data-table--cell-action-container').getBoundingClientRect();
                if(Math.abs(elPosition.top - actionMonitor.elPosition.top)>2 || Math.abs(elPosition.left - actionMonitor.elPosition.left)>2){
                    clearInterval(actionMonitor.interv);
                    actionOpenIndex.value = null;
                    closeAllAction()
                }
            },50)            
        }else{
            actionOpenIndex.value = null;
            closeAllAction()
        }
    }
    const tableDocClicked = (e) => {
        if(e.target.closest('.data-table--cell-action-option-container, .data-table--cell-action-container, .data-table--cell-action') == null){
            actionOpenIndex.value = null;
            closeAllAction();
        }else if(actionMonitor.loaded === true && actionMonitor.timeCount > 500){
               //closeAllAction()
        }
    }
    const closeAllAction = () => {
        //actionOpenIndex.value = null;
        let els = document.getElementsByClassName('data-table--cell-action-option-container');
        for(let item of els){
            item.style.display = 'none';
            item.style.opacity = 0;
        }
        clearInterval(actionMonitor.interv);
        document.removeEventListener('click', tableDocClicked)
        actionMonitor.loaded = false;
    }
</script>