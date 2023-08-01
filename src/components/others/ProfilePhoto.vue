<template>
    <Menu alignMenu="left">
        <template v-slot:preview>
            <div class="profile-pic fas fa-camera">
                <img v-if="profilePicUrl" :src="profilePicUrl" />
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
</template>

<script setup>
    import Menu from '@/components/pop/Menu.vue';
    const props = defineProps({
        profilePicUrl: {type:String, default:null},
    })
    const emit = defineEmits(['upload', 'remove']);
    const onFileChange = (e) => {
        emit('upload', e)
    }
    const removePhoto = () => {
        emit('remove')
    }

</script>