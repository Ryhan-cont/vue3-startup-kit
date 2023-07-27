<template>
    <div class="pa-30">
        <form method="post" @submit="onSubmit" id="admin-user-form">
            <Menu alignMenu="left">
                <template v-slot:preview>
                    <div class="profile-pic fas fa-camera">
                        <img v-if="userStore.createUser.uploadPhotoPreview" :src="userStore.createUser.uploadPhotoPreview" />
                        <div class="profile-pic-edit text-b3-bold">Edit</div>
                    </div>
                </template>
                <template v-slot:menu={closeMenu}>
                    <div class="px-5 py-5 bg-white round-4">
                        <div class="color-action hover-bg-primary-shade transition-3 d-flex-v-center">

                        <label class="custom-file-upload">
                            <input type="file" accept="image/x-png,image/jpeg" name="avatar" class="d-none" @change="onFileChange" />
                            <div class="px-15 py-7 cursor-pointer ">
                                <span class="far fa-upload font-16 mr-10"></span>
                                <span class="text-underline font-14 cursor-pointer">Upload Photo</span>
                            </div>
                        </label>
                        
                        </div>
                        <div class="px-15 py-7 cursor-pointer color-mid hover-bg-primary-shade transition-3 d-flex-v-center" @click="removePhoto">
                            <span class="far fa-times-circle font-16 mr-10"></span>
                            <span class="font-14">Remove Photo</span>
                        </div>
                    </div>
                </template>
            </Menu>
        
            <div class="flex-auto col-wrap input-group-container pt-30">
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">First Name:<span class="input-title-require">*</span></div>
                    <div>
                        <InputBox :validate="Yup.string().required()" name="first_name" v-model="userStore.createUser.formData.profile.first_name" :showDetail="true" placeholder="e.g Adam" />
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Last Name:<span class="input-title-require">*</span></div>
                    <div>
                        <InputBox :validate="Yup.string().required()" name="last_name" v-model="userStore.createUser.formData.profile.last_name" :showDetail="true"  placeholder="e.g Wilson" />
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Email:<span class="input-title-require">*</span></div>
                    <div>
                        <InputBox :validate="Yup.string().email().required()" name="email" v-model="userStore.createUser.formData.email" :showDetail="true"  placeholder="e.g example@esign.com" />
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Phone Number:</div>
                    <div>
                        <InputBox name="phone" :showDetail="true" placeholder="(702) 123-1234" v-model="userStore.createUser.formData.profile.phone" />
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Password:</div>
                    <div>
                        <InputBox v-model="userStore.createUser.formData.profile.password" :inputType="togglePass ? 'text' : 'password'" name="password" :validate="Yup.string().nullable(true)" :showDetail="true" placeholder="Password" >
                            <template v-slot:right>
                                <div class="d-flex-v-center"><span @click="togglePass = !togglePass" class="far color-light font-14 cursor-pointer" :class="togglePass === true ? 'fa-eye-slash' : 'fa-eye'" style="margin:0px 13px 0px 10px"></span></div>
                            </template>
                        </InputBox>
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Password Confirmation:</div>
                    <div>
                        <InputBox :inputType="toggleConfirmPass ? 'text' : 'password'" :validate="Yup.string().nullable().matches(new RegExp(userStore.createUser.formData.profile.password), 'matched')" name="password_confirmation" :showDetail="true" placeholder="Confirm Password" >
                            <template v-slot:right>
                                <div class="d-flex-v-center"><span @click="toggleConfirmPass = !toggleConfirmPass" class="far color-light font-14 cursor-pointer" :class="toggleConfirmPass === true ? 'fa-eye-slash' : 'fa-eye'" style="margin:0px 13px 0px 10px"></span></div>
                            </template>
                        </InputBox>
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Country:</div>
                    <div>
                        <SelectBox @inputSearch="triggerCountrySearch" :inputSearch="true" :validate="Yup.string()" resetVal v-model="userStore.createUser.formData.profile.country" reset @reset="userStore.createUser.formData.profile.country == ''" placeholder="Select Country" name="country" :options="countryOption" :showDetail="true">
                        </SelectBox>
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">City:</div>
                    <div>
                        <InputBox name="city" :showDetail="true" placeholder="e.g New York" v-model="userStore.createUser.formData.profile.city" />
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">State:</div>
                    <div>
                        <InputBox name="state" :showDetail="true" placeholder="e.g New York" v-model="userStore.createUser.formData.profile.state"/>
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Zip Code:</div>
                    <div>
                        <InputBox  name="zipcode" :showDetail="true" placeholder="e.g 0000" v-model="userStore.createUser.formData.profile.zipcode"/>
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Address:</div>
                    <div>
                        <InputBox name="address" :showDetail="true" placeholder="e.g Street, House" v-model="userStore.createUser.formData.profile.address"/>
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Gender:</div>
                    <div>
                        <SelectBox resetVal v-model="userStore.createUser.formData.profile.gender" reset @reset="userStore.createUser.formData.profile.gender == ''"  placeholder="Select Gender" show="value" catch="id" name="gender" :options="userStore.createUser.defaultValue.gender" :showDetail="true"></SelectBox>
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Date of Birth:</div>
                    <div>
                        <DatePicker placeholder="Select Date" class="datepicker-size-lg" showDetail v-model="userStore.createUser.formData.profile.date_of_birth" reset @reset="userStore.createUser.formData.profile.date_of_birth == ''" format="MM/dd/yyyy" name="date_of_birth" />
                    </div>
                </div>
                <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Roles:<span class="input-title-require">*</span></div>
                    <div>
                        <SelectBox v-model="userStore.createUser.formData.profile.role" reset @reset="userStore.createUser.formData.profile.role == ''"  placeholder="Select Group" show="name" catch="id" name="role" :options="userStore.viewUsers.rolesData.role_data" :showDetail="true"></SelectBox>
                    </div>
                </div>
                <!-- <div class="col-6 col-12-sm input-container">
                    <div class="input-title">Add user to group:</div>
                    <div>
                        <SelectBox v-model="selectmoedel" reset @reset="resetData" placeholder="Select Group" show="name" catch="id" name="xxx" :options="options" :showDetail="true"></SelectBox>
                    </div>
                </div> -->
            </div>

            <BtnBox btnType="submit" :disabled="userStore.createUser.btn.btnDisabled" :loading="userStore.createUser.btn.btnLoading" class="btn-primary btn-mid">
                Save Updates
            </BtnBox>
        </form>
    </div>
</template>


<script setup>
    /**
     * *Import plugin
     */
    import { ref, onMounted, computed  } from 'vue';
    import Swal from 'sweetalert2';
    // import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js';
    import * as Yup from 'yup';
    import {useRoute} from 'vue-router';
    import { useForm } from "vee-validate";
    /**
     * * Import page Component 
     */
    import Menu from '@/components/pop/Menu.vue';
    import BtnBox from '@/components/form/BtnBox.vue';
    import InputBox from '@/components/form/InputBox.vue';
    import SelectBox from '@/components/form/SelectBox.vue';
    import DatePicker from '@/components/others/DatePicker.vue';

    /**
     * * Import Pinia State
     */
    import { useUser } from '@/store/settings/users/users';
    // initializeValidator();
    const userStore = useUser();


    /**
     * * Main Section (Variable & Constants)
     */

    const route = useRoute();

    const searchCountryText = ref('');
    const { handleSubmit, setFieldError } = useForm();
    const togglePass = ref(false);
    const toggleConfirmPass = ref(false);

    /**
    * * Computed
    */
    const countryOption = computed(()=>{
        let re = new RegExp (searchCountryText.value, 'i');
        let filteredList =  userStore.createUser.countryList.filter((item)=>{
            return re.test(item);
        })
        return filteredList;
    })

    /**
     * * All Methods ...
     */
    const onSubmit = handleSubmit(() => {
        let fs = new FormData(document.getElementById('admin-user-form'));
        if(userStore.profile.route_id) {
            fs.append("user_id", userStore.profile.route_id);
        }
        fs.append("avatar",userStore.createUser.formData.profile.avatar);

        if(!userStore.createUser.formData.profile.password){
                fs.delete('password');
                fs.delete('password_confirmation');
        }
        userStore.postUser(fs, setFieldError, 'profile');
    });

    const onFileChange = (e) => {
      const file = e.target.files[0];
      userStore.createUser.formData.profile.avatar = file;
      userStore.createUser.uploadPhotoPreview = URL.createObjectURL(file);
    }

    const removePhoto = (e) => {
        userStore.createUser.uploadPhotoPreview = '';
    }

    const triggerCountrySearch = (text) => {
        searchCountryText.value = text;
    }
    
    const resetFormData = () => {
        userStore.createUser.uploadPhotoPreview = '';
        userStore.createUser.formData = {
            profile: {
                country:"",
                role:"",
                gender:"",
                date_of_birth:"",
                password:"",
                avatar:"",
            }
        }
    }

    


    onMounted(() => {
        resetFormData();
        userStore.profile.route_id = JSON.parse(localStorage.getItem('_sessionUser')).id;
        userStore.getCountries();
        userStore.getRoles();
        userStore.editUser(userStore.profile.route_id);
        userStore.getUserSignatures();
    });

</script>