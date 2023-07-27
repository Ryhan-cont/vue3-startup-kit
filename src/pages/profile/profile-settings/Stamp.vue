<template>
    <div>
        <div class="d-flex-v-center  px-20 pt-20 mb-20">
            <div class="flex-auto text-h4">My Stamp</div>
            <BtnBox class="btn btn-sm btn-primary" :loading="userStore.signStampSaveLoading" @click="toggleStampPad = !toggleStampPad"><span class="far fa-plus font-13 mr-5"></span> Add New Stamp</BtnBox>
        </div>
        <section>
            <DataTable 
                class="data-table" 
                :headerData="myStampTableHeader" 
                :tableData="userStore.profile.stampList"
                :onLoading="userStore.profile.tableLoader"
                actionColumn 
            >
                <template v-slot:stamp_image_path="{ data }" >
                    <div class="d-flex-v-center">
                        <RadioBox placeholder="Placeholder" name="is_default" :radioValue="data.is_default" :checked="data.is_default" @change="defaultStampSelect(data.id)" />
                        <div class="d-flex-v-center pl-15 py-10"> 
                            <img  :src="data.stamp_image_path" style="height:34px" />                       
                        </div>                            
                    </div>
                </template>
                <template v-slot:action="{ data }" >
                    <div class="d-flex-center-end">
                        <div class="d-flex-v-center cursor-pointer color-mid" @click="editStamp(data.id)">
                                <span class="far fa-edit text-b3-meta mt--3 mr-5"></span>
                                <span class="text-b3-meta">Edit</span>
                        </div>
                    </div>
                </template>
                <template v-slot:table-action="{data}" >
                    <ul>
                        <li>
                            <button @click="deleteStamp(data.id)">
                                <i class="far fa-trash"></i>
                                <span>Remove</span>
                            </button>
                        </li>
                    </ul>
                </template>
            </DataTable>
        </section>
        <Modal ref="stampModal" title="Modal title" mainViewClass="position-relative" v-if="toggleStampPad" @closeModal="toggleStampPad = false" width="880">
            <Stamp 
                @closeModal="stampModal.closeModal()"
                :fullName="modalFullName"
                @save="getStampData"
                hidePreLoad
            />
        </Modal>
    </div>
</template>

<script setup>
    /**
    * *Import plugin
    */
    import { ref, onMounted,computed  } from 'vue';
    import Swal from 'sweetalert2';

    /**
    * * Import page Component 
    */
    import BtnBox from '@/components/form/BtnBox.vue';
    import Modal from '@/components/pop/Modal.vue';
    import DataTable from '@/components/table/DataTable.vue';
    import RadioBox from '@/components/form/RadioBox.vue';

    import Stamp from '@/pages/_common/Stamp.vue';

    /**
    * * Import Pinia State
    */
    import { useUser } from '@/store/settings/users/users';
    const userStore = useUser();

    const stampModal = ref();
    const modalFullName = ref('');
    const modalInitial = ref('');
    const toggleStampPad = ref(false);
    const myStampTableHeader = ref([
        {
            title:'Stamp',
            slotName:'stamp_image_path',
            style:{width:'400px'}
        },
        {
            title:'',
            slotName:'',
        },
        {
            title:'',
            slotName:'action',
            style:{width:'200px'}
        },
    ]);

    const editStamp = (id) => {
        userStore.profile.stamp_id = id;
        toggleStampPad.value = true;
    }

    const getStampData = (e) => {
        console.log(e);
        userStore.profile.stamp = JSON.stringify(e);
        stampModal.value.closeModal();
        addStamp();
    }

    const deleteStamp = (id) => {
        Swal.fire({  
        title: "Do you want to delete the stamp?",  
        showDenyButton: false,  
        showCancelButton: true,  
        confirmButtonText: 'Delete',  
        // denyButtonText: `Don't save`,
        }).then((result) => {  
            /* Read more about isConfirmed, isDenied below */  
            if (result.isConfirmed) {    
                userStore.removeStamp(id);
            }
        });
        
    }
    const defaultStampSelect = (id) => {
        userStore.setDefaultStamp(id);
    }
    const addStamp = () => {
        let fs = new FormData();
        fs.append("stampObject", (userStore.profile.stamp));
        if(userStore.profile.stamp_id) {
            fs.append('stamp_id',userStore.profile.stamp_id)
        }
        userStore.storeUserStamp(fs);
    }

    onMounted(() => {
        let currentUser = JSON.parse(localStorage.getItem('_sessionUser'));
        modalFullName.value = currentUser.first_name +" "+ currentUser.last_name;
        userStore.getUserStamps();
    });
</script>