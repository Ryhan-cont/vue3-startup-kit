<template>
    <div>
        <div class="d-flex-v-center  px-20 pt-20 mb-20">
            <div class="flex-auto text-h4">My Signature</div>
            <BtnBox class="btn btn-sm btn-primary d-flex-v-center" :loading="userStore.signStampSaveLoading" @click="toggleSignaturePad = !toggleSignaturePad"><span class="far fa-plus mr-10"></span> Add New Signature</BtnBox>
        </div>
        <section>
            <DataTable 
                class="data-table" 
                :headerData="mySignatureTableHeader" 
                :tableData="userStore.profile.signatureList"
                :onLoading="userStore.profile.tableLoader"
                actionColumn 
            >
                <template v-slot:signature_image_path="{ data }" >
                    <div class="d-flex-v-center">
                        <RadioBox placeholder="Placeholder" name="is_default" 
                        :radioValue="data.is_default" :checked="data.is_default" @change="defaultSignatureSelect(data.id)" />
                        <div class="d-flex-v-center pl-15 py-10"> 
                            <img  :src="data.signature_image_path" style="height:34px" />                       
                        </div>                            
                    </div>
                </template>
                <template v-slot:initial_image_path="{ data }" >
                    <div class="d-flex-v-center pl-15 py-10"> 
                        <img style="height:34px" :src="data.initial_image_path" />                        
                    </div>
                </template>
                <template v-slot:action="{ data }" >
                    <div class="d-flex-center-end pl-20">
                        <div class="d-flex-v-center cursor-pointer color-mid" @click="editSignature(data.id)">
                                <span class="far fa-edit text-b3-meta mt--3 mr-5"></span>
                                <span class="text-b3-meta">Edit</span>
                        </div>
                    </div>
                </template>
                <template v-slot:table-action="{data}" >
                    <ul>
                        <li>
                            <button @click="deleteSignature(data.id)">
                                <i class="far fa-trash"></i>
                                <span>Remove</span>
                            </button>
                        </li>
                    </ul>
                </template>
            </DataTable>
        </section>
        <Modal ref="signModal" title="Modal title" mainViewClass="position-relative" v-if="toggleSignaturePad" @closeModal="toggleSignaturePad = false" width="880">
            <Sign 
                @closeModal="signModal.closeModal()"
                :fullName="modalFullName"
                :initials="modalInitial"
                @save="getSignData"
                signType=""
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

    import Sign from '@/pages/_common/Sign.vue';

    /**
    * * Import Pinia State
    */
    import { useUser } from '@/store/settings/users/users';
    const userStore = useUser();

    const signModal = ref();
    const modalFullName = ref('');
    const modalInitial = ref('');
    const toggleSignaturePad = ref(false);
    const mySignatureTableHeader = ref([
        {
            title:'Signature',
            slotName:'signature_image_path',
            style:{width:'400px'}
        },
        {
            title:'Initials',
            slotName:'initial_image_path',
        },
        {
            title:'',
            slotName:'action',
            style:{width:'200px'}
        },
    ]);

    const editSignature = (id) => {
        userStore.profile.signature_id = id;
        toggleSignaturePad.value = true;
    }

    const getSignData = (e) => {
        console.log(e);
        userStore.profile.signature = JSON.stringify(e);
        signModal.value.closeModal();
        addSignature();
    }

    const deleteSignature = (id) => {
        Swal.fire({  
        title: "Do you want to delete the signature?",  
        showDenyButton: false,  
        showCancelButton: true,  
        confirmButtonText: 'Delete',  
        // denyButtonText: `Don't save`,
        }).then((result) => {  
            /* Read more about isConfirmed, isDenied below */  
            if (result.isConfirmed) {    
                userStore.removeSignature(id);
            }
        });
        
    }
    const defaultSignatureSelect = (id) => {
        userStore.setDefaultSignature(id);
    }
    const addSignature = () => {
        let fs = new FormData();
        fs.append("signatureObject", (userStore.profile.signature));
        if(userStore.profile.signature_id) {
            fs.append('signature_id',userStore.profile.signature_id)
        }
        userStore.storeUserSignature(fs);
    }
    onMounted(() => {
        let currentUser = JSON.parse(localStorage.getItem('_sessionUser'));
        modalFullName.value = currentUser.first_name +" "+ currentUser.last_name;
        modalInitial.value = currentUser.first_name.charAt(0).toUpperCase()+currentUser.last_name.charAt(0).toUpperCase();
    });
</script>