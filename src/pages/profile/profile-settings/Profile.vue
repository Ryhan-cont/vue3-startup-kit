<template>
    <PageLayout :header="selectedDefaultPageTitle" style="max-width:748px" background="transparent" padding="0px">
        <BtnGroup :defaultSelected="selectedDefaultTab" v-slot="{ activateBtn, btnStyle }">
            <div  :class="btnStyle('My Profile')" @click="changeQuickView(activateBtn,'My Profile')">My Profile</div>
            <div  :class="btnStyle('My Signature')" @click="changeQuickView(activateBtn,'My Signature')">My Signatures</div>
            <div  :class="btnStyle('My Stamp')" @click="changeQuickView(activateBtn,'My Stamp')">My Stamps</div>
        </BtnGroup>
        <div class="w-100 bg-white mt-10 radius-4">
            <transition name="fade-route" mode="out-in">
                <component :is="component"></component>
            </transition>
        </div>
    </PageLayout>
</template>
<script setup>
    /**
     * *Import plugin
     */
    import { ref, shallowRef,watchEffect  } from 'vue';
    import {useRoute} from 'vue-router';

    /**
     * * Import page Component 
     */
    import PageLayout from '@/components/layout/PageLayout.vue'
    import BtnGroup from '@/components/form/BtnGroup.vue';
    import Signature from '@/pages/profile/profile-settings/Signature.vue';
    import UserInfo from '@/pages/profile/profile-settings/UserInfo.vue';
    import Stamp from '@/pages/profile/profile-settings/Stamp.vue';

    /**
     * * Import Pinia State
     */
     import { useUser } from '@/store/settings/users/users';
     const userStore = useUser();

    /**
    * * Main Section (Variable & Constants)
    */
    const route = useRoute();
    const selectedTab = ref('My Profile');
    const selectedDefaultTab = ref('My Profile');
    const selectedDefaultPageTitle = ref('Profile');
    const component = shallowRef (UserInfo)

    const changeQuickView = (activateBtn, name) => {
        activateBtn(name)
        selectedTab.value = name;
        if(name == 'My Profile'){component.value = UserInfo; selectedDefaultPageTitle.value= 'Profile'}
        if(name == 'My Signature'){component.value = Signature; selectedDefaultPageTitle.value= 'Signature'}
        if(name == 'My Stamp'){component.value = Stamp; selectedDefaultPageTitle.value= 'Stamp'}
    }

    watchEffect( () => {
        selectedDefaultPageTitle.value = route.meta.pageTitle;
        if(route.name == 'profileStamp'){
            selectedDefaultTab.value = 'My Stamp';
            component.value = Stamp;
        }else if(route.name == 'profileSignature'){
            selectedDefaultTab.value = 'My Signature';
            component.value = Signature
        }else{
            selectedDefaultTab.value = 'My Profile';
            component.value = UserInfo;

        }
        // console.log(route.name);
    });
    
</script>