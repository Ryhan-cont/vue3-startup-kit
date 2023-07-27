<template>
    <svg viewBox="0 0 310 258" class="site-color-picker" fill="none" @click="loadColor">
        <rect width="24" height="24" fill="#EBEBEB"/>
        <rect x="26" width="24" height="24" fill="#EBEBEB"/>
        <rect x="52" width="24" height="24" fill="#D6D6D6"/>
        <rect x="78" width="24" height="24" fill="#C2C2C2"/>
        <rect x="104" width="24" height="24" fill="#ADADAD"/>
        <rect x="130" width="24" height="24" fill="#999999"/>
        <rect x="156" width="24" height="24" fill="#858585"/>
        <rect x="182" width="24" height="24" fill="#707070"/>
        <rect x="208" width="24" height="24" fill="#5C5C5C"/>
        <rect x="234" width="24" height="24" fill="#474747"/>
        <rect x="260" width="24" height="24" fill="#333333"/>
        <rect x="286" width="24" height="24" fill="#333333"/>
        <rect y="26" width="24" height="24" fill="#00374A"/>
        <rect x="26" y="26" width="24" height="24" fill="#011D57"/>
        <rect x="52" y="26" width="24" height="24" fill="#11053B"/>
        <rect x="78" y="26" width="24" height="24" fill="#2E063D"/>
        <rect x="104" y="26" width="24" height="24" fill="#3C071B"/>
        <rect x="130" y="26" width="24" height="24" fill="#5C0701"/>
        <rect x="156" y="26" width="24" height="24" fill="#5A1C00"/>
        <rect x="182" y="26" width="24" height="24" fill="#583300"/>
        <rect x="208" y="26" width="24" height="24" fill="#563D00"/>
        <rect x="234" y="26" width="24" height="24" fill="#666100"/>
        <rect x="260" y="26" width="24" height="24" fill="#4F5504"/>
        <rect x="286" y="26" width="24" height="24" fill="#263E0F"/>
        <rect y="52" width="24" height="24" fill="#004D65"/>
        <rect x="26" y="52" width="24" height="24" fill="#012F7B"/>
        <rect x="52" y="52" width="24" height="24" fill="#1A0A52"/>
        <rect x="78" y="52" width="24" height="24" fill="#450D59"/>
        <rect x="104" y="52" width="24" height="24" fill="#551029"/>
        <rect x="130" y="52" width="24" height="24" fill="#831100"/>
        <rect x="156" y="52" width="24" height="24" fill="#7B2900"/>
        <rect x="182" y="52" width="24" height="24" fill="#7A4A00"/>
        <rect x="208" y="52" width="24" height="24" fill="#785800"/>
        <rect x="234" y="52" width="24" height="24" fill="#8D8602"/>
        <rect x="260" y="52" width="24" height="24" fill="#6F760A"/>
        <rect x="286" y="52" width="24" height="24" fill="#38571A"/>
        <rect y="78" width="24" height="24" fill="#016E8F"/>
        <rect x="26" y="78" width="24" height="24" fill="#0042A9"/>
        <rect x="52" y="78" width="24" height="24" fill="#2C0977"/>
        <rect x="78" y="78" width="24" height="24" fill="#61187C"/>
        <rect x="104" y="78" width="24" height="24" fill="#791A3D"/>
        <rect x="130" y="78" width="24" height="24" fill="#B51A00"/>
        <rect x="156" y="78" width="24" height="24" fill="#AD3E00"/>
        <rect x="182" y="78" width="24" height="24" fill="#A96800"/>
        <rect x="208" y="78" width="24" height="24" fill="#A67B01"/>
        <rect x="234" y="78" width="24" height="24" fill="#C4BC00"/>
        <rect x="260" y="78" width="24" height="24" fill="#9BA50E"/>
        <rect x="286" y="78" width="24" height="24" fill="#4E7A27"/>
        <rect y="104" width="24" height="24" fill="#008CB4"/>
        <rect x="26" y="104" width="24" height="24" fill="#0056D6"/>
        <rect x="52" y="104" width="24" height="24" fill="#371A94"/>
        <rect x="78" y="104" width="24" height="24" fill="#7A219E"/>
        <rect x="104" y="104" width="24" height="24" fill="#99244F"/>
        <rect x="130" y="104" width="24" height="24" fill="#E22400"/>
        <rect x="156" y="104" width="24" height="24" fill="#DA5100"/>
        <rect x="182" y="104" width="24" height="24" fill="#D38301"/>
        <rect x="208" y="104" width="24" height="24" fill="#D19D01"/>
        <rect x="234" y="104" width="24" height="24" fill="#F5EC00"/>
        <rect x="260" y="104" width="24" height="24" fill="#C3D117"/>
        <rect x="286" y="104" width="24" height="24" fill="#669D34"/>
        <rect y="130" width="24" height="24" fill="#00A1D8"/>
        <rect x="26" y="130" width="24" height="24" fill="#0061FD"/>
        <rect x="52" y="130" width="24" height="24" fill="#4D22B2"/>
        <rect x="78" y="130" width="24" height="24" fill="#982ABC"/>
        <rect x="104" y="130" width="24" height="24" fill="#B92D5D"/>
        <rect x="130" y="130" width="24" height="24" fill="#FF4015"/>
        <rect x="156" y="130" width="24" height="24" fill="#FF6A00"/>
        <rect x="182" y="130" width="24" height="24" fill="#FFAB01"/>
        <rect x="208" y="130" width="24" height="24" fill="#FCC700"/>
        <rect x="234" y="130" width="24" height="24" fill="#FEFB41"/>
        <rect x="260" y="130" width="24" height="24" fill="#D9EC37"/>
        <rect x="286" y="130" width="24" height="24" fill="#76BB40"/>
        <rect y="156" width="24" height="24" fill="#01C7FC"/>
        <rect x="26" y="156" width="24" height="24" fill="#3A87FD"/>
        <rect x="52" y="156" width="24" height="24" fill="#5E30EB"/>
        <rect x="78" y="156" width="24" height="24" fill="#BE38F3"/>
        <rect x="104" y="156" width="24" height="24" fill="#E63B7A"/>
        <rect x="130" y="156" width="24" height="24" fill="#FE6250"/>
        <rect x="156" y="156" width="24" height="24" fill="#FE8648"/>
        <rect x="182" y="156" width="24" height="24" fill="#FEB43F"/>
        <rect x="208" y="156" width="24" height="24" fill="#FECB3E"/>
        <rect x="234" y="156" width="24" height="24" fill="#FFF76B"/>
        <rect x="260" y="156" width="24" height="24" fill="#E4EF65"/>
        <rect x="286" y="156" width="24" height="24" fill="#96D35F"/>
        <rect y="182" width="24" height="24" fill="#52D6FC"/>
        <rect x="26" y="182" width="24" height="24" fill="#74A7FF"/>
        <rect x="52" y="182" width="24" height="24" fill="#864FFD"/>
        <rect x="78" y="182" width="24" height="24" fill="#D357FE"/>
        <rect x="104" y="182" width="24" height="24" fill="#EE719E"/>
        <rect x="130" y="182" width="24" height="24" fill="#FF8C82"/>
        <rect x="156" y="182" width="24" height="24" fill="#FEA57D"/>
        <rect x="182" y="182" width="24" height="24" fill="#FEC777"/>
        <rect x="208" y="182" width="24" height="24" fill="#FED977"/>
        <rect x="234" y="182" width="24" height="24" fill="#FFF994"/>
        <rect x="260" y="182" width="24" height="24" fill="#EAF28F"/>
        <rect x="286" y="182" width="24" height="24" fill="#B1DD8B"/>
        <rect y="208" width="24" height="24" fill="#93E3FC"/>
        <rect x="26" y="208" width="24" height="24" fill="#A7C6FF"/>
        <rect x="52" y="208" width="24" height="24" fill="#B18CFE"/>
        <rect x="78" y="208" width="24" height="24" fill="#E292FE"/>
        <rect x="104" y="208" width="24" height="24" fill="#F4A4C0"/>
        <rect x="130" y="208" width="24" height="24" fill="#FFB5AF"/>
        <rect x="156" y="208" width="24" height="24" fill="#FFC5AB"/>
        <rect x="182" y="208" width="24" height="24" fill="#FED9A8"/>
        <rect x="208" y="208" width="24" height="24" fill="#FDE4A8"/>
        <rect x="234" y="208" width="24" height="24" fill="#FFFBB9"/>
        <rect x="260" y="208" width="24" height="24" fill="#F1F7B7"/>
        <rect x="286" y="208" width="24" height="24" fill="#CDE8B5"/>
        <rect y="234" width="24" height="24" fill="#D2E2FE"/>
        <rect x="26" y="234" width="24" height="24" fill="#D2E2FE"/>
        <rect x="52" y="234" width="24" height="24" fill="#D8C9FE"/>
        <rect x="78" y="234" width="24" height="24" fill="#EFCAFE"/>
        <rect x="104" y="234" width="24" height="24" fill="#F9D3E0"/>
        <rect x="130" y="234" width="24" height="24" fill="#FFDAD8"/>
        <rect x="156" y="234" width="24" height="24" fill="#FFE2D6"/>
        <rect x="182" y="234" width="24" height="24" fill="#FEECD4"/>
        <rect x="208" y="234" width="24" height="24" fill="#FEF1D5"/>
        <rect x="234" y="234" width="24" height="24" fill="#FDFBDD"/>
        <rect x="260" y="234" width="24" height="24" fill="#F6FADB"/>
        <rect x="286" y="234" width="24" height="24" fill="#F6FADB"/>
    </svg>
</template>
<script setup>
    document.documentElement.style.setProperty('--picker-cursor', `url('${import.meta.env.VITE_FRONTEND_BASE_URL}/images/eye-dropper.svg') 0 12, auto`);
    const emit = defineEmits(['pick']);
    const loadColor = (e) => {
        let txtColor, bgColor;
        let color = e.target.getAttribute("fill");

        bgColor = color;

        color = color.substring(1);

        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16);

        if((r*0.299 + g*0.587 + b*0.114) > 175){
            txtColor = '#4D4D4D'
        }else{
            txtColor = '#FFFFFF'
        }
        emit('pick', {bgColor, txtColor})
    }
</script>

<style lang="scss">

.site-color-picker{
    &:hover{
        cursor: var(--picker-cursor)
    }
}
</style>