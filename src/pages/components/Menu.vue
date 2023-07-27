<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h4 class="mb-15">Menu General Example</h4>
        <div>
            <Menu>
                <template v-slot:preview>
                    <div style="width:200px;" class="pb-5">
                        <div style="height:45px" class="bg-primary d-flex-center text-white">Menu Container</div>
                    </div>
                </template>
                <template v-slot:menu={closeMenu}>
                    <div style="width:400px; height:400px" >
                        <div @click="closeMenu()" class="pa-20 cursor-pointer">Close menu</div>
                        <div class="px-20">Menu Content</div>
                    </div>
                </template>
            </Menu>
        </div>
        <h4 class="mb-15 mt-30">Menu On Click Close</h4>
        <div>
            <Menu closeOnClick>
                <template v-slot:preview>
                    <div style="width:200px;" class="pb-5">
                        <div style="height:45px" class="bg-primary d-flex-center text-white">Menu Container</div>
                    </div>
                </template>
                <template v-slot:menu={closeMenu}>
                    <div style="width:400px; height:400px" >
                        <div @click="closeMenu()" class="pa-20 cursor-pointer">Close menu</div>
                        <div class="px-20">Menu Content</div>
                    </div>
                </template>
            </Menu>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <div>
            preview: For clickable area<br>
            menu: Menu content will show here.[closeMenu - slot provide function for closing menu]
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            closeOnClick: menu will close on click<br>
            alignMenu: Align menu [left, right, gen]<br>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Events</div>

    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch  } from 'vue';
    import {useRoute} from 'vue-router';
    import PageLayout from '@/components/layout/PageLayout.vue'
    import Menu from '@/components/pop/Menu.vue'

    const modalToggle = ref(false);

</script>