<template>
    <PageLayout :header="useRoute().meta.pageTitle">
        <h4 class="mb-15">Example With Simple Array ['Cat', 'Dog', 'Tiget', 'Lion']</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="changeGenValue">Change Value</div>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20 ml-10" @click="validateFormGen">Validate</div>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20 ml-10" @click="setErrorGen">Set Error</div>
        <div style="max-width:200px">
            <SelectBox :validate="Yup.string().required()" resetVal v-model="selectmoedelGen" reset @reset="resetData" placeholder="PlaceHolder" name="selectbox" :options="['Cat', 'Dog', 'Tiget', 'Lion']" :showDetail="true">
                <!-- <template v-slot:input="{data}">{{data.name}}</template>
                <template v-slot:option="{data}">{{data.name}}</template> -->
            </SelectBox>
        </div>
        <h4 class="mb-15">Example With Multidimantional Array [{id,name},{id,name}]</h4>
        <div @click="changeValue()" class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20">Change Value</div>
        <div style="max-width:200px">
            <SelectBox v-model="selectmoedel" reset @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="xxx" :options="options" :showDetail="true"></SelectBox>
        </div>
        <div class="mb-20 mt-5">Selected: {{selectmoedel}}</div>


        <h4 class="mb-15">Example Of Search</h4>
        <div style="max-width:200px">
            <SelectBox @inputSearch="triggersearch" resetVal v-model="selectmoedel" @reset="resetData" placeholder="PlaceHolder" :inputSearch="true" show="name" catch="id" name="selectboxsearch" :options="searchOption" :showDetail="true"></SelectBox>
        </div>
        <div class="mb-20 mt-5">Selected: {{selectmoedel}}</div>


        <h4 class="mb-15">Example Without modal</h4>
        <div style="max-width:200px">
            <SelectBox :validate="Yup.string().required()" resetVal @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="testSchemax" :options="options" :showDetail="true"></SelectBox>
        </div>

        <h4 class="mb-15">Example Of Error</h4>
        <div style="max-width:200px">
            <SelectBox :validate="Yup.string().required()" resetVal @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="xxxa" :options="options" :showDetail="true"></SelectBox>
        </div>
        <h4 class="mb-15">Example With no options</h4>
        <div style="max-width:200px">
            <SelectBox :validate="Yup.string().required()" @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" :showDetail="true"></SelectBox>
        </div>
        <h4 class="mb-15">Example With undefined options</h4>
        <div style="width:200px">
            <SelectBox :validate="Yup.string().required()" @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" :options="undefinedOptions" :showDetail="true"></SelectBox>
        </div>
        <h4 class="mb-15">Example Of Reset and validate</h4>
        <div style="max-width:200px">
            <SelectBox :validate="Yup.string().required()" resetVal @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="validate" :options="options" :showDetail="true"></SelectBox>
        </div>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="validateForm">Validate</div>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20 ml-10" @click="setError">Set Error</div>
        <h4 class="mb-15">Example Of slots</h4>
        <div style="max-width:200px">
            <SelectBox :validate="Yup.string().required()" @inputSearch="slotSearchText = $event" :inputSearch="true" resetVal @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="selectslot" :options="slotSearchOption" :showDetail="true">
                <template v-slot:input="{data}">
                    <div class="d-flex-v-center px-10">
                        <div class="round-image bg-background mr-10" style="width:30px; height:30px"></div>
                        <div>{{data?.name}}</div>
                    </div>
                </template>
                <template v-slot:option="{data}">
                    <div class="d-flex-v-center px-10 py-5">
                        <div class="round-image bg-background mr-10" style="width:30px; height:30px"></div>
                        <div>{{data.name}}</div>
                    </div>
                </template>
            </SelectBox>
        </div>
        <h4 class="mb-15">Example Of multiselect checkbox and option header search</h4>
        <div style="max-width:200px">
            <SelectBox @inputSearch="triggersearch" :inputSearch="true" resetVal :validate="Yup.string().required()" v-model="stCheckedString" disableOptionClick disableOnClickOptionClose  @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" :options="options" :showDetail="true">
                <template v-slot:dropdownHead>
                    <div class="d-flex-v-center pa-10 ">
                        <div class="d-flex-v-center mr-10"><input type="checkbox" /></div>
                        <div>All</div>
                    </div>
                </template>
                <template v-slot:input>
                    <div class="d-flex-v-center px-10">
                        <div>{{stCheckedString}}</div>
                    </div>
                </template>
                <template v-slot:option="{data}">
                    <div class="d-flex-v-center pa-10 py-5">
                        <div class="d-flex-v-center mr-10"><input type="checkbox" v-model="data.status" /></div>
                        <div>{{data.name}}</div>
                    </div>
                </template>
            </SelectBox>
        </div>
        <h4 class="mb-15">Example Of small input</h4>
        <div style="max-width:200px">
            <SelectBox size="sm" :inputSearch="true" :validate="Yup.string().required()" resetVal @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="smallselect" :options="options" :showDetail="true"></SelectBox>
        </div>
        <h4 class="mb-15">Example Of large input and grey border</h4>
        <div style="max-width:200px">
            <SelectBox size="lg" class="grey-border" :inputSearch="true" :validate="Yup.string().required()" resetVal @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="largeselect" :options="options" :showDetail="true"></SelectBox>
        </div>
        <h4 class="mb-15">Example Of disabled</h4>
        <div class="cursor-pointer pa-10 bg-primary text-white no-text-select d-inline-block mb-20" @click="disableInput = !disableInput">Disabled</div>
        <div style="max-width:200px">
            <SelectBox :disabled="disableInput" :inputSearch="true" resetVal @reset="resetData" placeholder="PlaceHolder" show="name" catch="id" name="disabledselect" :options="options" :showDetail="true"></SelectBox>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Slot</div>
        <div>
            [input, option] For custom input and option preview
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Props</div>
        <div>
            v-model<br>
            placeholder<br>
            name [Form input field name]<br>
            size [Options:sm]<br>
            resetVal [if true, reset value icon will show]<br>
            autocomplete [Enable disable browser autocomplete for input search]<br>
            options [Could be array or array objec. if object, then show and catch props is required]<br>
            show [if option is multidimantional array, Object's field name that will be shown]<br>
            catch [if option is multidimantional array, Object's field that will return in v-model]<br>
            inputSearch [If true, on click an input field will appear]<br>
            showDetail [Maintain space for error, success, warning msg |  Default value is false]<br>
            message [message like error or warning]<br>
            messageType [message type Ex:error, warning, success, no value will show plain test]<br>
        </div>
        <div class="border-grey-b1 text-h3 mt-20 mb-10 py-5">Events</div>
        <div>
            
        </div>
    </PageLayout>
</template>
<script setup>
    import { onBeforeMount, onBeforeUnmount, ref, reactive, watch, computed  } from 'vue';
    import { initializeValidator, setValidators, validate, setErrors } from '@/functions/validate.js'
    import * as Yup from 'yup';
    import {useRoute} from 'vue-router';
    import PageLayout from '@/components/layout/PageLayout.vue'
    import SelectBox from '@/components/form/SelectBox.vue'
    initializeValidator();
    
    var dt = []
    for(var i=1; i<100; i++){
        dt.push({
            id: i,
            name: 'Option - '+i,
            status:false,
        })
    }
    const options = reactive(dt);
    const selectmoedel = ref();
    const selectmoedelGen = ref();
    const undefinedOptions = ref(undefined);
    const disableInput = ref(true)

    const changeGenValue = () => {
        selectmoedelGen.value = 'Dog';
    }
    const changeValue = (e) => {
        selectmoedel.value = 20
    }

    const resetData = (e) => {

    }

    //Search
    const searchText = ref('')
    const slotSearchText = ref();
    const stCheckedString = computed(()=>{
        let string = ''
        options.map((item)=>{
            if(item.status === true){
                if(string == ''){
                   string = item.name
                }else{
                    string = string+', '+item.name
                }
            }
        })
        return string
    })
    const CheckUncheck = (index) => {
        if(options[index].status === true){
            options[index].status = false;
        }else{
            options[index].status = true;
        }
    }
    const searchOption = computed(()=>{
        let re = new RegExp (searchText.value, 'i');
        let filteredList =  options.filter((item)=>{
            return re.test(item.name)
        })
        return filteredList
    })
    const slotSearchOption = computed(()=>{
        let re = new RegExp (slotSearchText.value, 'i');
        let filteredList =  options.filter((item)=>{
            return re.test(item.name)
        })
        return filteredList
    })
    const triggersearch = (text) => {
        searchText.value = text;
    }
    //End search
    const genValidate = setValidators(["selectbox"])
    const validateFormGen = async () => {
        let chk = await validate(genValidate);
        alert(JSON.stringify(chk, null, 2));
       
        // console.log(chk)
    }
    const setErrorGen = () => {
        setErrors({"selectbox": ["selectbox"],"void_reason": ["The void reason field is required."]})
    }


    const arrayObjValidate = setValidators(["validate"])
    const validateForm = async () => {
        let chk = await validate(arrayObjValidate);
        alert(JSON.stringify(chk, null, 2));
       
        console.log(chk)
    }
    const setError = () => {
        setErrors({"validate": ["validate"],"void_reason": ["The void reason field is required."]})
    }
</script>