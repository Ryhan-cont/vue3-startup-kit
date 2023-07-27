import { defineStore } from "pinia";

export const useAuth = defineStore('auth', {
    state: () =>({
        avatar:'',
        fullName:'',
        loginError:null,
        loaginLoading:false,
    }),

    actions: {
        /**
         * login
         */
        async login(fs, setFieldError){
            try{
                this.loginError = '';
                this.loaginLoading = true;
                let resp = await this.$axios.post('login', fs)
                if(resp.status === 200){
                    localStorage.setItem('Authorization',resp.data.token)
                    this.$router.push({ name: "adminDashboard" });
                }
            }catch(err){
                console.log(err)
                this.loaginLoading = false;
                this.loginError = err.response.data.detail
            }
        },

        async loginOut(){
            try{
                let resp = await this.$axios.get('log-out')
                console.log(resp)
                //localStorage.setItem('_sessionUser',JSON.stringify(res.data.response))
            }catch(err){
                console.log(err)
            }
        },/**
         * tokenValidation
         */
        async tokenValidation(){
            try{
                let resp = await this.$axios.get('token-validation')
            }catch(err){
                console.log(err)
            }
        }
    }

});