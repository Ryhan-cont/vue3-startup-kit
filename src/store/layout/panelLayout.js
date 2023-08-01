import { defineStore } from 'pinia'

export const usePanelLayoutStore = defineStore('panelLayout', {
    state: () => ({
        //Default Settings
        breakPoint : 1150,
        smallMenu: 900,
        leftMenuWidth : 261,
        smallMenuStat: null,
        leftMenuStat : true,
        headerHeight : 80,

        //Adjustable
        leftMenuUserStat : true,
        floatingLeftMenu : false,
        winWidth : 0,
        winHeight : 0,
        activeRoute:''
    }),
    actions: {
        innitialize(){
            document.documentElement.style.setProperty("--leftMenuNegSize", (this.leftMenuWidth * -1) + 'px');
            this.winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            this.winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            if(this.winWidth < this.breakPoint){
                this.floatingLeftMenu = true;
                this.leftMenuStat = false;
            }
            this.setSmallMenu();
        },
        resizeController(){
            this.winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            this.winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            if(this.winWidth < this.breakPoint){
                setTimeout(()=>{
                    this.floatingLeftMenu = true;
                },10)
                this.leftMenuStat = false;
            }else{
                this.floatingLeftMenu = false;
                if(this.leftMenuUserStat === true){
                    this.leftMenuStat = true;
                }
            }
            this.setSmallMenu();
        },
        setSmallMenu(){
            if(this.winWidth < this.smallMenu){
                this.headerHeight = 60;
                this.smallMenuStat = true;
            }else{
                this.headerHeight = 80;
                this.smallMenuStat = false;
            }
        },
        toggleLeftMenu(){
            if(this.leftMenuStat === true){
                if(this.winWidth > this.breakPoint){this.leftMenuUserStat = false;}
                this.leftMenuStat = false;
            }else{
                if(this.winWidth > this.breakPoint){this.leftMenuUserStat = true;}
                this.leftMenuStat = true;
            }
        }
    },
})