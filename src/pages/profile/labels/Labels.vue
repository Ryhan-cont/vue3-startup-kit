<template>
    <PageLayout :header="useRoute().meta.pageTitle" background="transparent" padding="0px" @getLayoutSize="screenWidth = $event.W">
        <div class="w-100 bg-white radius-4 overflow-hidden">
            <!-- <button type="button" @click="labelStore.getLabels()">Click Here</button> -->
            <div :class="[screenWidth < 640 ? 'd-block' : 'd-flex', 'px-20 py-12']">
                <div :class="['flex-auto', screenWidth < 640 ? 'd-block' : 'd-flex']">
                    <BtnSlot @click="bulkActions()" width="75px" size="sm" title="Apply" clearLeftBorder :class="[screenWidth < 640 ? '' : 'mr-10', 'flex-auto']" :style="{'maxWidth': screenWidth < 640 ? '100%' : '200px'}">
                        <SelectBox size="sm" v-model="labelStore.viewLabels.bulkActionValue" placeholder="Bulk Action" corner="sharp-right" :options="labelStore.viewLabels.defaultValue.bulkActions" :showDetail="true" show="value" catch="id"/>
                    </BtnSlot>
                    <div :class="['flex-auto' , screenWidth < 640 ? 'pt-10' : '' ]" :style="{'maxWidth': screenWidth < 640 ? '100%' : '260px'}">
                        <InputBox size="sm" placeholder="Search by Label name" v-model="labelStore.viewLabels.searchItem" @keyup="searchTable">
                            <template v-slot:left >
                                <div class="d-flex-v-center pl-15 pr-10">
                                    <span class="far fa-search font-14 color-light"></span>
                                </div>
                            </template>
                        </InputBox>                        
                    </div>
                </div>
                <div :class="['d-flex',screenWidth < 640 ? 'mt-10' : 'ml-10']">
                    <router-link :to="{ name: 'createLabel'}">
                        <BtnBox class="btn-primary btn-sm">
                            <span class="far fa-plus font-14 mr-10"></span>Add New Label
                        </BtnBox>
                    </router-link>                  
                </div>
            </div>
            <div>
                <DataTable 
                    class="data-table" 
                    :headerData="dataTableHeader" 
                    @sort="sortCol"
                    :tableData="labelStore.viewLabels.labelsData.data"
                    :onLoading="labelStore.viewLabels.tableLoader"
                    actionColumn
                >
                    <template v-slot:name="{ data }" > 
                        <div class="d-flex-v-center"> 
                            <div class="px-5 py-3 font-13 radius-3 mr-8" :style="{backgroundColor:data.background_color_code,color:data.text_color_code}">
                                {{ data.name }}
                            </div>
                        </div>
                    </template>
                    <template v-slot:action="{ data }" >
                        <div class="d-flex-center-end pl-20">
                            <router-link :to="{ name: 'editLabel' , params: { id:data.id}}">
                                <div class="d-flex-v-center cursor-pointer color-mid">
                                        <span class="far fa-edit text-b3-meta mt--3 mr-5"></span>
                                        <span class="text-b3-meta">Edit</span>
                                </div>
                            </router-link>
                        </div>
                    </template>
                    <template v-slot:table-action="{data}" >
                    <ul>
                        <li>
                            <button @click="deleteLabel(data.id)">
                                <i class="far fa-trash"></i>
                                <span>Remove</span>
                            </button>
                        </li>
                    </ul>
                </template>
                </DataTable>
            </div>
        </div>
        <div :class="['mt-20', screenWidth < 750 ? 'd-block' : 'd-flex']">
            <div class="flex-auto d-grid">
                <div class="overflow-hidden" v-if="labelStore?.viewLabels?.labelsData?.data?.length > 0">
                    <Pagination 
                        @change="loadPage" 
                        :totalPage="labelStore.viewLabels.pagination.total_page" 
                        :currentPage="labelStore.viewLabels.pagination.current_page" 
                        :block="screenWidth < 380 ? true : false"
                        :paginationLength="
                            screenWidth < 500 ? 1 :
                            screenWidth < 760 ? 2 :
                            screenWidth < 850 ? 3 : 
                            screenWidth < 950 ? 4 : 
                            screenWidth < 1050 ? 5 : 
                            screenWidth < 1150 ? 6 : 
                            screenWidth < 1250 ? 7 : 8
                        "
                    />
            </div>
            </div>
            <div :class="['d-flex-v-center', screenWidth < 750 ? 'mt-10' : '']">
                <ResultPerPage :totalResult="labelStore.viewLabels.pagination.total_result" :from="labelStore.viewLabels.pagination.from" :to="labelStore.viewLabels.pagination.to" />
            </div>
        </div>
        <div></div>
    </PageLayout>
</template>
<script setup>
    /**
     * *Import plugin
     */
    import Swal from 'sweetalert2';
    import { ref, reactive, watch, onMounted,  } from 'vue';
    import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js';
    import * as Yup from 'yup';
    import {useRoute} from 'vue-router';
    import alert from '@/functions/alert';
    /**
     * * Import page Component 
     */
    import PageLayout from '@/components/layout/PageLayout.vue'
    import DataTable from '@/components/table/DataTable.vue';
    import Modal from '@/components/pop/Modal.vue';
    import ResultPerPage from '@/components/navigation/ResultPerPage.vue';
    import Pagination from '@/components/navigation/Pagination.vue';

    import BtnBox from '@/components/form/BtnBox.vue';
    import CheckBox from '@/components/form/CheckBox.vue';
    import RadioBox from '@/components/form/RadioBox.vue';
    import MessageBox from '@/components/form/MessageBox.vue';
    import InputBox from '@/components/form/InputBox.vue';
    import SelectBox from '@/components/form/SelectBox.vue';
    import BtnSlot from '@/components/form/BtnSlot.vue';
    import DatePicker from '@/components/others/DatePicker.vue';
    
    /**
     * * Import Pinia State
     */
        import { useLabels } from '@/store/settings/labels/labels';
    /**
     * * Main Section (Variable & Constants)
     */
    const labelStore = useLabels();
    const screenWidth = ref(null);
    const currentPage = ref(2);
    const totalPage = ref(30);

    const dataTableHeader = reactive([
        {
            title:'Label Name',
            field:'name',
            sort:true,
        },
        {
            title:'',
            slotName:'action',
        },
    ])
    const loadPage = (e) => {
        currentPage.value = e;
        labelStore.filter.page = e;
        labelStore.getLabels();
    }
    const sortCol = (e) => {
        let column = e.data.field;
        if(column == 'origin_name') {
            column = 'name';
        }
        labelStore.filter.columnIndex = column;
        labelStore.filter.order = e.sort;
        
        labelStore.getLabels();
        e.setSort(e.index, e.sort)       
    }
    /**
     * * All Methods ...
     */

    onMounted(() => {
        labelStore.getLabels();
    });
    const searchTable = () => {
        labelStore.filter.searchItem = labelStore.viewLabels.searchItem;
        labelStore.getLabels();
    }

    const deleteLabel = (id) => {
        let msg =  "Do you want to delete it?";
        Swal.fire({  
        title: msg,  
        showDenyButton: false,  
        showCancelButton: true,  
        confirmButtonText: 'Delete',  
        // denyButtonText: `Don't save`,
        }).then((result) => {  
            /* Read more about isConfirmed, isDenied below */  
            if (result.isConfirmed) {    
                let fs = new FormData();
                fs.append('id[]',id);
                labelStore.removeLabel(fs);
                setTimeout(function(){
                    //code goes here
                    labelStore.getLabels();
                }, 800);
            }
        });
    }

    const bulkActions = () => {
        let selectedUsers = labelStore.viewLabels.labelsData.data.filter( ({ checkbox_status }) => checkbox_status === true );
        if(!selectedUsers) {
            alert.warning({
                title: "Warning",
                text:"Please select user"
            });return;
        }
        
        
        let msg = "Do you want to delete? It will permanently delete it.";
        Swal.fire({  
        title: msg,  
        showDenyButton: false,  
        showCancelButton: true,  
        confirmButtonText: 'Delete',  
        // denyButtonText: `Don't save`,
        }).then((result) => {  
            /* Read more about isConfirmed, isDenied below */  
            if (result.isConfirmed) {  
                let fs = new FormData();
                selectedUsers.forEach((item, index)=>{
                    fs.append('id['+index+']',item.id);
                }); 
                labelStore.removeLabel(fs);
                setTimeout(function(){
                    labelStore.getLabels();
                }, 800);
            }
        });
    }
</script>