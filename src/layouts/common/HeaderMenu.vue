<template>
    <Menu closeOnClick alignMenu="right">
        <template v-slot:preview>
            <div style="max-width:200px" class="d-flex-v-center cursor-pointer py-5">
                <div :class="['round-div', 'bg-background', 'box-30']">
                    <img :src="authStore.avatar" class="w-100" />
                </div>
                <div class="text-ellipsis px-10 text-b3-meta">{{ authStore.fullName }}</div>
                <div>
                    <span class="fas fa-angle-down font-14 mt-1"></span>
                </div>
            </div>
        </template>
        <template v-slot:menu={closeMenu}>
            <div class="ma-5" style="width:150px">
                <!-- <router-link :to="{ name: 'profileSettings'}" class="color-mid">
                    <div class="pa-10 cursor-pointer hover-bg-primary-shade transition-3 color-mid text-b3-meta">My Profile</div>
                </router-link> -->
                
                <div class="pa-10 cursor-pointer hover-bg-primary-shade transition-3 color-mid text-b3-meta" @click="logout">Log Out</div>
            </div>
        </template>
    </Menu>
</template>

<script setup>
    import {onMounted} from 'vue';
    import Menu from '@/components/pop/Menu.vue';
    import { useAuth } from '@/store/auth/auth';

    const authStore = useAuth();
    /**
     * Declare functions
     */
    const logout = () => {
        authStore.logOut();
    };
    onMounted(()=> {

    });
</script>