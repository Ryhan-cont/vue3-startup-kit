<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <div @click="check()" class="pb-10 cursor-pointer">Check Function</div>
        <div class="d-flex">
            <div class="cursor-pointer pa-10 bg-primary text-white no-text-select" @click="tableHeight++">Table Height +</div>
            <div class="cursor-pointer pa-10 bg-primary text-white no-text-select ml-10" @click="tableHeight--">Table Height -</div>
        </div>

        <div class="my-10 cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block" @click="addDataToTable()">Add data to table</div>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select my-10 d-inline-block ml-10" @click="onLoading = !onLoading">On Loading</div>
        <div>
            <input class="my-10 pa-10 site-input-border input-no-outline" v-model="tableHeight" />
        </div>
        <div>
            <DataTable class="data-table" actionColumn height="200px" :onLoading="onLoading"  :headerData="dataTableHeader" :tableData="dataTableData" @sort="tableSort"  :checkBox="{field:'status', style:{width:'20px'}}" >
                <!-- <template v-slot:header-status>
                    slot data
                </template> -->
                <template v-slot:name >
                    <!-- <HeaderUserMenu /> -->
                </template>
                <template v-slot:address >
                    <div style="width:200px">
                        <SelectBox :options="['Cat', 'Dog', 'Tiget', 'Lion']" />
                    </div>
                </template>
                <template v-slot:action >
                    <div style="width:200px">
                        <DatePicker />
                    </div>
                </template>
                <template v-slot:table-action="{data, closeAllAction}" >
                    <div @click="passAction(closeAllAction, data)">{{data}}</div>
                    <!-- <div>
                        <DatePicker  />
                    </div> -->
                </template>
            </DataTable>
        </div>
        <div class="mt-30">
            <DataTable class="data-table" actionColumn :onLoading="onLoading"  :headerData="dataTableHeader" :tableData="dataTableData" @sort="tableSort"  :checkBox="{field:'status', style:{width:'20px'}}" >
                <template v-slot:name>
                    <div>
                        <DatePicker style="width:200px" />
                    </div>
                </template>
                <template v-slot:table-action="{data, closeAllAction}" >
                    <div @click="passAction(closeAllAction, data)">{{data}}</div>
                </template>
            </DataTable>
        </div>
        <div class="mt-30">
            <DataTable class="data-table" :onLoading="onLoading"  :headerData="dataTableHeader" :tableData="dataTableData" @sort="tableSort" >
                <!-- <template v-slot:header-status>
                    slot data
                </template> -->
                <template v-slot:table-action="{data, closeAllAction}" >
                    <div @click="passAction(closeAllAction, data)">{{data}}</div>
                </template>
            </DataTable>
            <div class="d-flex">
                <div class="flex-auto">
                    <Pagination @change="loadPage" :totalPage="10" :currentPage="currentPage" blockWidth="41px" :paginationLength="1" />
                </div>
                <div class="d-flex-v-center">
                    <ResultPerPage :totalResult="10" :perPage="5" />
                </div>
            </div>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <div>
            'header-'+[field or slotName]: For change header cell html<br>
            field or slotName: For change header cell html
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            headerData [Must be an array object. <div class="pl-20"><span class="h6">Object fields:</span><br> title: as header title<br> field: as table array object field name that will show in cell<br> style:to set tables width, sort:asc, desc, none<br> slotName: by default field name will be used as a slot. but if u want to use custom slot name</div>]<br>
            tableData [Array Object for table row]<br>
            checkBox [object that will contain field name as field, custom slot name as slotName]<br>
            lazyLoading [For table lazy load.(not completed yet)]<br>
            height [if table needs fixed height]<br>
            actionColumn [fixed column at the right. default false]<br>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Events</div>
        <div>
            
        </div>
    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch  } from 'vue';
    import {useRoute} from 'vue-router';
    import PageLayout from '@/components/layout/PageLayout.vue';
    import DataTable from '@/components/table/DataTable.vue';
    import Pagination from '@/components/navigation/Pagination.vue';
    import ResultPerPage from '@/components/navigation/ResultPerPage.vue';
    // import HeaderUserMenu from '../document/builder/partial/header/HeaderUserMenu.vue';
    import SelectBox from '@/components/form/SelectBox.vue';
    import DatePicker from '@/components/others/DatePicker.vue';
    const tableHeight = ref(200);
    const onLoading = ref(false);
    const currentPage = ref(2);

    const dataTableHeader = reactive([
        {
            title:'Id',
            field:'id',
            style:{width:'50px'}
        },
        {
            title:'Name',
            field:'name',
            sort:'asc'
        },
        {
            title:'Address',
            field:'address.0.present',
            slotName:'address',
            style:{width:'200px'}
        },
        {
            title:'Action',
            field:'id',
            slotName:'action',
            style:{width:'200px'}
        },
    ])
    const dataTableData = reactive([
        {
            id:1,
            name:'Abdul Malek',
            address:[{
                present:'',
                permanent:''
            }],
            status:true,
        },
        {
            id:2,
            name:'Abdul Khalek',
            address:[{
                present:'Address',
                permanent:''
            }],
            status:true,
        },
        {
            id:3,
            name:'Jamil Malek',
            address:[{
                present:'',
                permanent:''
            }],
            status:true,
        },
        {
            id:4,
            name:'Kamil Malek',
            address:[{
                present:'',
                permanent:''
            }],
            status:true,
        }
        
    ])
    // const paginationData = reactive(
    // {
    //     "success": true,
    //     "code": 200,
    //     "response": {
    //         "data": [
    //             {
    //                 "id": "f1bde6d0-fd15-437a-8fda-e3be2a7a73fe",
    //                 "subject": "Please eSign: sdfsdf.pdf",
    //                 "lastChangedDate": "22 Jul 2022",
    //                 "lastChangedTime": "02:39 PM",
    //                 "checkedStatus": false,
    //                 "isDeleted": false,
    //                 "isVoided": false,
    //                 "isSelf": true,
    //                 "signingUrl": "",
    //                 "recipient": "To: Amit Da, Mahabubul Islam",
    //                 "status": "Waiting for Others",
    //                 "isSigning": false,
    //                 "icon": "clock",
    //                 "iconColor": "#1BA2DB"
    //             }
    //         ],
    //         "links": {
    //             "first": "http://esign.v3/dashboard/get-user-envelopes?page=1",
    //             "last": "http://esign.v3/dashboard/get-user-envelopes?page=5",
    //             "prev": null,
    //             "next": "http://esign.v3/dashboard/get-user-envelopes?page=2"
    //         },
    //         "meta": {
    //             "current_page": 1,
    //             "from": 1,
    //             "last_page": 5,
    //             "links": [
    //                 {
    //                     "url": null,
    //                     "label": "&laquo; Previous",
    //                     "active": false
    //                 },
    //                 {
    //                     "url": "http://esign.v3/dashboard/get-user-envelopes?page=1",
    //                     "label": "1",
    //                     "active": true
    //                 },
    //                 {
    //                     "url": "http://esign.v3/dashboard/get-user-envelopes?page=2",
    //                     "label": "2",
    //                     "active": false
    //                 },
    //                 {
    //                     "url": "http://esign.v3/dashboard/get-user-envelopes?page=3",
    //                     "label": "3",
    //                     "active": false
    //                 },
    //                 {
    //                     "url": "http://esign.v3/dashboard/get-user-envelopes?page=4",
    //                     "label": "4",
    //                     "active": false
    //                 },
    //                 {
    //                     "url": "http://esign.v3/dashboard/get-user-envelopes?page=5",
    //                     "label": "5",
    //                     "active": false
    //                 },
    //                 {
    //                     "url": "http://esign.v3/dashboard/get-user-envelopes?page=2",
    //                     "label": "Next &raquo;",
    //                     "active": false
    //                 }
    //             ],
    //             "path": "http://esign.v3/dashboard/get-user-envelopes",
    //             "per_page": 1,
    //             "to": 1,
    //             "total": 30
    //         }
    //     },
    //     "message": "Data found successfully."
    // });
    const loadPage = (e) => {
        currentPage.value = e;
    }
    const tableSort = (e) => {
        dataTableHeader[e.index].sort = e.sort
    }
    const passAction = (closeAllAction) => {
        closeAllAction()
    }
    const addDataToTable = () => {
        dataTableData.push({
            id:0,
            name:'Kamil Push',
            address:[{
                present:'',
                permanent:''
            }],
            status:true,
        })
    }
    const check = (e) => {

    }
</script>