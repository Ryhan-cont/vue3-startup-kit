<template>
    <div>
        <Modal ref="modalRef" title="Select Contact" v-if="toggleModal" @closeModal="toggleModal=false" >
            <div class="modal-body">
                <div class="ba-1 border-border-grey radius-4">
                    <InputBox placeholder="Search" @input="page = 1; getContactList()" noBorder v-model="searchText">
                        <template v-slot:left>
                            <div class="font-14 color-light pt-10 pl-15 pr-10"><i class="far fa-search"></i></div>
                        </template>
                    </InputBox>
                    <div class="bt-1 border-border-grey data-loading-animation"><div v-if="loading"></div></div>
                    <div class="contact-list-container overflow-y-auto" @scroll="scrollEvent" v-if="userOptions.length>0" style="height: calc(100vh - 306px)">
                        <ul>
                            <li v-for="(item, index) in userOptions" :key="index">
                                <div class="contact-item d-flex-v-center cursor-pointer" @click="selectedUser = index">
                                    <RadioBox :radioValue="index" v-model="selectedUser" />
                                    <div class="contact-img ml-10">
                                        <img :src="item?.user_details?.profile?.avatar_full_path ? item.user_details.profile.avatar_full_path : apiUrl + '/storage/profiles/blank_image.png'" alt="img">
                                    </div>
                                    <div class="contact-info ml-10">
                                        <div class="name text-b2-regular">{{ item.name }}</div>
                                        <span class="email font-12 color-mid">{{ item.email }}</span>
                                    </div>
                                </div>
                            </li>
                            <li v-if="loading"><div class="slow-blink pa-10 d-flex-center">Loading....</div></li>
                        </ul>
                    </div>
                    <div v-else  style="height: calc(100vh - 300px)">
                        <div class="text-center py-30 color-mid font-14">You don’t have any contact</div>
                    </div>                  
                </div>
                <div class="d-flex mt-20">
                    <BtnBox type="button" class="btn-secondary-outlined btn-mid mr-20" @click="modalRef.closeModal()">Cancel</BtnBox>
                    <BtnBox type="button" class="btn-primary btn-mid" @click="emitSelection">Add Selected</BtnBox>
                </div>  
            </div>
        </Modal>
    </div>
</template>
<script setup>
    import {ref, onMounted} from 'vue';
    import Modal from '@/components/pop/Modal.vue';
    import InputBox from '@/components/form/InputBox.vue';
    import RadioBox from '@/components/form/RadioBox.vue';
    import BtnBox from '@/components/form/BtnBox.vue';

    const modalRef = ref();

    const toggleModal = ref(false);
    const searchText = ref('');
    const userOptions = ref([]);
    const selectedUser = ref();
    const page = ref(1);
    const loading = ref(false);
    const isMoreData = ref(true);

    const apiUrl = ref(import.meta.env.VITE_MAIN_API_URL);

    const props = defineProps({
        limit:{type:Number, default:12},
        type:{type:String, default:''}
    })

    const emit = defineEmits(['completeSelect', 'save']);
    
    const getContactList = async (type = null) => {
        try{
            loading.value = true;
            let resp = await axios.get('builder/envelope/get-contact-list?page='+page.value+'&search='+searchText.value+'&limit='+props.limit+'&type='+props.type)
            loading.value = false;
            if(resp.status == 200) {
                if(resp.data.response.data.length === 0){
                    isMoreData.value = false;
                } 
                else {
                    isMoreData.value = true;
                }
                if(type == 'push'){
                    for(let item of resp.data.response.data){
                        userOptions.value.push(item)
                    }
                }else{
                    userOptions.value = resp.data.response.data;
                }
            }
        }catch(err){
            loading.value = false;
            console.log(err)
        }
    }

    const emitSelection = () => {
        emit('completeSelect', userOptions.value[selectedUser.value]);
        modalRef.value.closeModal()
    }

    const loadModal = () => {
        toggleModal.value = true;
        getContactList()
    } 

    const scrollEvent = (e) => {
        if(isMoreData.value === false) return;
        if((e.target.scrollTop+e.target.offsetHeight+100) > e.target.scrollHeight){
            if(loading.value === false){
                page.value = page.value + 1;
                getContactList('push')
            }

        }
    }

    onMounted(()=>{
        // getContactList()
    })

    defineExpose({ loadModal })
</script>
