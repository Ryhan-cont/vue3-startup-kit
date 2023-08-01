
var menuData = [
    {
        name:'Dashboard',
        routeName:'dashboard',
        icon:'far fa-table-columns',
        items:[]
    },
    {
        name:'Components',
        icon:'fas fa-code',
        show:true,
        items:[
            {
                name:'Button Component',
                routeName:'buttonComponent',
            },
            {
                name:'InputBox Component',
                routeName:'inputBoxComponent',
            },
            {
                name:'MessageBox Component',
                routeName:'messageBoxComponent',
            },
            {
                name:'SelectBox Component',
                routeName:'selectBoxComponent',
            },
            {
                name:'CheckBox Component',
                routeName:'checkBoxComponent',
            },
            {
                name:'RadioBox Component',
                routeName:'radioBoxComponent',
            },
            {
                name:'OTP Input Component',
                routeName:'otpInput',
            },
            {
                name:'Date Picker Component',
                routeName:'datePicker',
            },
            {
                name:'Menu Component',
                routeName:'menuComponent',
            },
            {
                name:'Modal Component',
                routeName:'modalComponent',
            },
            {
                name:'Data Table Component',
                routeName:'dataTableComponent',
            },
            {
                name:'Color Picker Component',
                routeName:'colorPickerComponent',
            },
            {
                name:'Stepper Component',
                routeName:'stepperComponent',
            },
            {
                name:'Util Component',
                routeName:'utilComponent',
            },
        ]
    },
    {
        name:'Error Page',
        icon:'fas fa-circle-exclamation',
        show:false,
        items:[
            {
                name:'500',
                routeName:'500',
            },
            {
                name:'503',
                routeName:'503',
            },
            {
                name:'504',
                routeName:'504',
            },
            {
                name:'401',
                routeName:'401',
            },
            {
                name:'403',
                routeName:'403',
            },
            {
                name:'419',
                routeName:'419',
            },
            {
                name:'429',
                routeName:'429',
            },
            {
                name:'404',
                routeName:'404',
            },
        ]
    },
    {
        name:'Auth',
        icon:'fas fa-at',
        show:false,
        items:[
            {
                name:'login',
                routeName:'login',
            },
            {
                name:'Reset Password Request',
                routeName:'resetPasswordRequest',
            },
            {
                name:'Password Expired',
                routeName:'passwordExpired',
            },
            {
                name:'Change Password',
                routeName:'changePassword',
            },
            {
                name:'Reset Password',
                routeName:'resetPassword',
            },
            {
                name:'Two Factor Authentication',
                routeName:'twoFactorAuthentication',
            },
        ]
    }
]
export {
    menuData,
}

