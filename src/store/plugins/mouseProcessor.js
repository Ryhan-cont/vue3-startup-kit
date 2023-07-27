import { defineStore } from 'pinia';
import { elPosition } from '@/functions/dom.js';
import { scrollbarHW, cloneDeep, clearNumber } from '@/functions/com.js';

const defaultStates = {
    listen:null,
    mouseEvent:null,
    upEvent:null,
    innitialize:false,

    //changing mouse position
    dX:null,
    dY:null,
    //First clicked place
    mouseDownPositionX:null,
    mouseDownPositionY:null,
    //Finding Change
    oldPositionX:null,
    oldPositionY:null,
    changedPositionX:null,
    changedPositionY:null,

    //changing mouse position Compared to screen.
    sX:null,
    sY:null,
    //First clicked place Compared to screen
    mouseDownPositionSX:null,
    mouseDownPositionSY:null,
    //Finding Change Compared to screen
    oldPositionSX:null,
    oldPositionSY:null,
    changedPositionSX:null,
    changedPositionSY:null,
    
    //Visiable screen height and width
    screenX:null,
    screenY:null,
    //entire document height width
    docHeight:null,
    docWidth:null,

    //Float Element
    //#####################################################
    floatObservation:false,
    floatEl:null,
    floatTargetEl:null,
    //Float element width height
    floatElWidth:null,
    floatElHeight:null,
    //Floating element changing position
    floatElPositionX:null,
    floatElPositionY:null,
    //Float element innitial position
    floatElPrimaryPositionX:null,
    floatElPrimaryPositionY:null,
    //cursor top left compared to floating element.
    floatElInsideMousePositionX:null,
    floatElInsideMousePositionY:null,

    //Mark
    //#####################################################
    markElObservation:false,
    markEl:null,
    markTargetEl:null,
    //Mark's changing top, left, width, height
    markElTop:null,
    markElLeft:null,
    markElWidth:null,
    markElHeight:null,

    //container fixed top, bottom, width, height
    markContainerTop:null,
    markContainerLeft:null,
    markContainerWidth:null,
    markContainerHeight:null,

    //Move Element
    //#####################################################
    moveElObservation:false,
    moveElParent:null,
    moveElTarget:null,
    //Container info
    moveContainerX:null,
    moveContainerY:null,
    moveContainerWidth:null,
    moveContainerHeight:null,
    //collect muntiple element in one array.
    moveElPosition:[],

    //Scale Element
    //#####################################################
    scaleElObservation:false,
    scaleElParent:null,
    scaleElTarget:null,
    //Container info
    scaleContainerX:null,
    scaleContainerY:null,
    scaleContainerWidth:null,
    scaleContainerHeight:null,
    //scale element detail
    scaleElPrimaryPositionY:null,
    scaleElPrimaryPositionX:null,
    scaleElHeight:null,
    scaleElWidth:null,
    //scale changin value
    scaleElChaingTop:null,
    scaleElChaingLeft:null,

    //Sort Element
    //#####################################################
    sortElObservation:false,
    sortingIndex:null,
    sortClass:'',
    sortMarkBottom:null,
    sortMarkTop:null,
    sortArray:[],

    test:0,
}

//Sort : ['strore name', 'began', 'listen', 'complete', 'sort', element to sort, {itemClass, sortIndex, sortArray}];
//Float : ['strore name', 'began', 'listen', 'complete', 'float', element to float];
//Float : ['strore name', 'began', 'listen', 'complete', 'move', element to float];

export const useMouseProcessor = defineStore('mouseProcessor', {
    state: () => cloneDeep(defaultStates),

    actions: {
        /**
         * mouseMoveEvent
         * [This is a event listener scaleed from main builder index]
         * 
         * @returns 
         */
        mouseMoveEvent(e){
            if(this.listen == null){return}
            this.mouseEvent = e;
            e.preventDefault();

            //Set screen size to store
            if(this.innitialize === false){this.setScreenSize();}
            //Set mouse position (according to screen) to state
            this.mousePosition(e);

            //Trigger began function
            if(this.listen[0] != '' && this.innitialize === false && this.listen[1] && this.listen[1] != ''){
                this.listen[0][this.listen[1]](this.$state);
            }else if(this.listen[0] == '' && this.innitialize === false && this.listen[1] && this.listen[1] != ''){
                this.listen[1](this.$state)
            }
            
            //Listen function.
            if(this.listen[0] != '' && this.listen[2] && this.listen[2] != ''){
                this.listen[0][this.listen[2]](this.$state);
            }else if(this.listen[0] == '' && this.listen[2] && this.listen[2] != ''){
                this.test++
                this.listen[2](this.$state)
            }


            //Inside function to trigger with mouse move
            if(this.floatObservation === true){this.ElFloatController()}
            if(this.markElObservation === true){this.markELController()}
            if(this.moveElObservation === true){this.moveElController()}
            if(this.scaleElObservation === true){this.scaleElController()}
            if(this.sortElObservation === true){this.sortController()}

            //innitialize event
            if(this.innitialize === false && this.listen[4]){
                if((this.listen[4] == 'float' || this.listen[4] == 'sort') && this.listen[5]){this.floatClone(this.listen[5])}
                else if(this.listen[4] == 'mark' && this.listen[5]){this.markBox(this.listen[5])}
                else if(this.listen[4] == 'move' && this.listen[5] && this.listen[6]){this.moveEl(this.listen[5], this.listen[6])}
                else if(this.listen[4] == 'scale' && this.listen[5] && this.listen[6]){this.scale(this.listen[5], this.listen[6])}
            }
            this.innitialize = true;
        },
        /**
         * mouseMoveEvent
         * [This is a event listener scaleed from main builder index]
         * 
         * @returns 
         */
        mouseUpEvent(e){
            if(this.listen == null){return}

            this.upEvent = e;

            //If mouse position in state then it mean its not click but drag.
            //Need this function to trigger only if its a drag mouse move.
            if(this.dX != null){
                //Function to trigger after evetn end.
                if(this.listen[0] != '' && this.listen[3] && this.listen[3] != ''){
                    this.listen[0][this.listen[3]](this.$state)
                }else if(this.listen[0] == '' && this.listen[3] && this.listen[3] != ''){
                    this.listen[3](this.$state);
                }
            }
            //If temporary floating div, then remove it.
            if(document && document.getElementById("mouse-processon-temporary-floating-div")){
                document.getElementById("mouse-processon-temporary-floating-div").remove();
            }
            //Remove sorting marker
            if(this.listen[4] == 'sort'){
                let markEl = document.getElementsByClassName(this.sortClass);
                for(let item of markEl){
                    item.classList.remove('mouse-processor-dashed-border');
                }                
            }
            //Reset entire state. 
            //It is require to initiate next mouse event without error
            this.resetState();
        },
        /**
         * resetState
         * [reset all store value]
         * 
         * @returns 
         */
        resetState(){
            Object.assign(this, cloneDeep(defaultStates));
        },

        //############################################
        //############# Helper function ##############
        //############################################
        /**
         * mousePosition
         * [Get mouse position according to screen]
         * 
         * @returns 
         */
        mousePosition(event) {
            if(!document || !window){return}

            let eventDoc, doc, body;
            event = event || window.event; // IE-ism
    
            // If pageX/Y aren't available and clientX/Y are,
            // calculate pageX/Y - logic taken from jQuery.
            // (This is to support old IE)
            if (event.pageX == null && event.clientX != null) {
                eventDoc = (event.target && event.target.ownerDocument) || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;
    
                event.pageX = event.clientX +
                  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                  (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY +
                  (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
                  (doc && doc.clientTop  || body && body.clientTop  || 0 );
            }else if(event.touches && event.touches[0].pageX){
                event.pageX = event.touches[0].pageX
                event.pageY = event.touches[0].pageY
            }

            //Position Compared to document
            let oldPositionX = this.oldPositionX;
            let oldPositionY = this.oldPositionY;

            this.oldPositionX = this.dX;
            this.oldPositionY = this.dY;

            this.dX = event.pageX;
            this.dY = event.pageY;

            if(oldPositionX == null || oldPositionY == null){
                this.changedPositionX = 0;
                this.changedPositionY = 0;
            }else{
                this.changedPositionX = event.pageX - oldPositionX;
                this.changedPositionY = event.pageY - oldPositionY;
            }

            //-------------------------Change Compared to Screen-------------------------
            let x = null;
            let y = null;
            if(event.x){
                x = event.x;
                y = event.y;
            }else if(event.targetTouches && event.targetTouches[0]){
                x = event.targetTouches[0].clientX;
                y = event.targetTouches[0].clientY;
            }
            let oldPositionSX = this.oldPositionSX;
            let oldPositionSY = this.oldPositionSY;

            this.oldPositionSX = this.sX;
            this.oldPositionSY = this.sY;

            this.sX = x;
            this.sY = y;

            if(oldPositionSX == null || oldPositionSY == null){
                this.changedPositionSX = 0;
                this.changedPositionSY = 0;
            }else{
                this.changedPositionSX = x - oldPositionSX;
                this.changedPositionSY = y - oldPositionSY;
            }

            //Store Innitial Value
            if(this.innitialize === false){
                this.mouseDownPositionSX = x;
                this.mouseDownPositionSY = y;  
            }
            //--------------------------------------End-----------------------------------


            //Store Innitial Value
            if(this.innitialize === false){
                this.mouseDownPositionX = event.pageX;
                this.mouseDownPositionY = event.pageY; 
            }

        },
        setScreenSize(){
            if(!document || !window){return}
            let body = document.body, html = document.documentElement;
            let scrollSize = scrollbarHW()

            this.screenY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.screenX = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if(html.scrollWidth > html.clientWidth){
                this.screenY = this.screenY - scrollSize;
            }

            if(html.scrollHeight > html.clientHeight){
                this.screenX = this.screenX - scrollSize;
            }

            this.docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            this.docWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
        },

        //############################################
        //############## Float function ##############
        //############################################

        /**
         * floatClone
         * [Will make a clone of targeted element and flote it with cursor.]
         * 
         * @returns 
         */
         floatClone(el){
            if(!document || this.listen == null){return}
            let position = elPosition(el);

            this.floatElPrimaryPositionX = position.top;
            this.floatElPrimaryPositionY = position.left;
            
            this.floatElInsideMousePositionY = this.dY - position.top;
            this.floatElInsideMousePositionX = this.dX - position.left;

            this.floatElWidth = el.offsetWidth;
            this.floatElHeight = el.offsetHeight;

            this.floatElPositionX = position.left;
            this.floatElPositionY = position.top;

            let tempEl = document.createElement('div');
            tempEl.id = 'mouse-processon-temporary-floating-div';
            tempEl.classList.add("mouse-processon-temporary-floating-div-float");
            tempEl.style.height = el.offsetHeight + 'px';
            tempEl.style.width = el.offsetWidth + 'px';
            tempEl.style.top = position.top + 'px';
            tempEl.style.left = position.left + 'px';

            let clone = el.cloneNode( true );
            clone.classList.add('mouse-processor-remove-margin');
            tempEl.appendChild( clone );

            this.floatEl = tempEl;
            this.floatTargetEl = el;
            this.floatObservation = true;
            if(this.listen[4] == 'sort'){
                this.sortElObservation = true;
                if(this.listen[6]){
                    this.sortingIndex = this.listen[6].sortIndex;
                    this.sortClass = this.listen[6].itemClass;
                    this.sortArray = this.listen[6].sortArray;
                }
            }
            document.body.appendChild(tempEl);
        },
        /**
         * ElFloatController
         * [Move element with cursor]
         * 
         * @returns 
         */
        ElFloatController(){
            if(!document || this.listen == null){return}
            let el = document.getElementById('mouse-processon-temporary-floating-div');
            let top, left;
            if((this.dY - this.floatElInsideMousePositionY) < 0){
                top = 0;
            }else if(((this.dY - this.floatElInsideMousePositionY) + this.floatElHeight) > this.docHeight){
                top = (this.docHeight - this.floatElHeight);
            }else{
                top = (this.dY - this.floatElInsideMousePositionY);
            }

            if(((this.dX - this.floatElInsideMousePositionX) + this.floatElWidth) > this.screenX){
                left = (this.screenX - this.floatElWidth);
            }else{
                left = (this.dX - this.floatElInsideMousePositionX);
            }

            el.style.top = top + 'px';
            el.style.left = left + 'px';

            this.floatElPositionX = left;
            this.floatElPositionY = top;
        },

        //############################################
        //############ Mark box function #############
        //############################################
        markBox(el){
            if(!document || this.listen == null){return}
            let tempEl = document.createElement('div');
            tempEl.id = 'mouse-processon-temporary-floating-div';
            tempEl.classList.add("mouse-processon-temporary-floating-div-mark");

            let containerPosition = elPosition(el);
            this.markContainerTop = containerPosition.top;
            this.markContainerLeft = containerPosition.left;
            this.markContainerWidth = el.offsetWidth;
            this.markContainerHeight = el.offsetHeight;

            this.markTargetEl = el;
            this.markEl = tempEl;

            this.setMarkPosition(this.dY, this.dX, 0, 0);

            this.markElObservation = true;
            document.body.appendChild(tempEl);
        },
        markELController(){
            if(!document || this.listen == null){return}
            let top, left, width, height;

            if(this.dY > this.mouseDownPositionY){
                top = this.mouseDownPositionY;
                height = this.dY - this.mouseDownPositionY;
                if(this.dY > (this.markContainerTop + this.markContainerHeight)){
                    height = (this.markContainerTop + this.markContainerHeight) - this.mouseDownPositionY;
                }
                if((top + height) > this.screenY){
                    height = this.screenY - top
                }
            }else if(this.dY < this.mouseDownPositionY){
                top = this.dY;
                if(top < this.markContainerTop){
                    top = this.markContainerTop;
                    height = this.mouseDownPositionY - this.markContainerTop;
                }else{
                    height = this.mouseDownPositionY - this.dY;
                }
            }else{
                top = this.mouseDownPositionY;
                height = 0;
            }

            if(this.dX > this.mouseDownPositionX){
                left = this.mouseDownPositionX;
                width = this.dX - this.mouseDownPositionX
                if(this.dX > (this.markContainerLeft + this.markContainerWidth)){
                    width = (this.markContainerLeft + this.markContainerWidth) - this.mouseDownPositionX;
                }
                if((left + width) > this.screenX){
                    width = this.screenX - left
                }
            }else if(this.dX < this.mouseDownPositionX){
                left = this.dX;
                if(left < this.markContainerLeft){
                    left = this.markContainerLeft;
                    width = this.mouseDownPositionX - this.markContainerLeft;
                }else{
                    width = this.mouseDownPositionX - this.dX;
                }
            }else{
                left = this.mouseDownPositionX;
                width = 0;
            }

            this.setMarkPosition(top, left, width, height);
        },
        setMarkPosition(top, left, width, height){
            this.markElTop = top;
            this.markElLeft = left;
            this.markElWidth = width;
            this.markElHeight = height;

            this.markEl.style.height = height + 'px';
            this.markEl.style.width = width + 'px';
            this.markEl.style.top = top + 'px';
            this.markEl.style.left = left + 'px';
        },


        //############################################
        //########## Move Element Function ###########
        //############################################
        moveEl(parent, el){
            if(!document || this.listen == null){return}
            this.moveElParent = parent;
            this.moveElTarget = el;
            let containerPosition = elPosition(parent);
            this.moveContainerX = containerPosition.left;
            this.moveContainerY = containerPosition.top;
            this.moveContainerWidth = parent.offsetWidth;
            this.moveContainerHeight = parent.offsetHeight;

            for(let item of el){
                let calculatedStyle = getComputedStyle(item);
                let tempArr = {
                    primaryPositionY:clearNumber(calculatedStyle.top),
                    primaryPositionX:clearNumber(calculatedStyle.left),
                    height:item.offsetHeight,
                    width:item.offsetWidth,
                    changingTop:null,
                    changingLeft:null
                }
                this.moveElPosition.push(tempArr);
            }

            this.moveElObservation = true;
        },
        moveElController(){
            for(let i = 0; this.moveElTarget.length > i; i++){
                let adjTop = this.dY - this.mouseDownPositionY;
                let adjLeft = this.dX - this.mouseDownPositionX;

                let top = this.moveElPosition[i].primaryPositionY + adjTop;
                if(top<0){top = 0}
                else if(top > (this.moveContainerHeight-this.moveElPosition[i].height)){top = (this.moveContainerHeight-this.moveElPosition[i].height)}

                let left = this.moveElPosition[i].primaryPositionX + adjLeft;
                if(left<0){left = 0}
                else if(left > (this.moveContainerWidth-this.moveElPosition[i].width)){left = (this.moveContainerWidth-this.moveElPosition[i].width)}

                this.changingTop = top;
                this.changingLeft = left;
                this.moveElTarget[i].style.top = top + 'px';
                this.moveElTarget[i].style.left = left + 'px';
            }
        },

        //############################################
        //######### Scale Element Function ###########
        //############################################
        scale(parent, el){
            if(!document || this.listen == null){return}
            this.scaleElParent = parent;
            this.scaleElTarget = el;

            let containerPosition = elPosition(parent);
            this.scaleContainerX = containerPosition.left;
            this.scaleContainerY = containerPosition.top;
            this.scaleContainerWidth = parent.offsetWidth;
            this.scaleContainerHeight = parent.offsetHeight;

            let calculatedStyle = getComputedStyle(el);

            this.scaleElPrimaryPositionY = clearNumber(calculatedStyle.top);
            this.scaleElPrimaryPositionX = clearNumber(calculatedStyle.left);
            this.scaleElHeight = el.offsetHeight;
            this.scaleElWidth = el.offsetWidth;

            this.scaleElObservation = true;
        },
        scaleElController(){
            let adjTop = this.dY - this.mouseDownPositionY;
            let adjLeft = this.dX - this.mouseDownPositionX;

            let top = this.scaleElPrimaryPositionY + adjTop;
            if(top<0){top = 0}
            else if(top > (this.moveContainerHeight-this.scaleElHeight)){top = (this.moveContainerHeight-this.scaleElHeight)}

            let left = this.scaleElPrimaryPositionX + adjLeft;
            if(left<0){left = 0}
            else if(left > (this.moveContainerWidth-this.scaleElWidth)){left = (this.moveContainerWidth-this.scaleElWidth)}
            
            this.scaleElChaingTop = top;
            this.scaleElChaingLeft = left;
        },

        //############################################
        //########## Sort Element Function ###########
        //############################################
        sortController(){
            this.sortTriggerPosition();

            if(this.dY > this.sortMarkBottom && this.sortMarkBottom != null){
                let targetEl = this.sortArray[this.sortingIndex];
                let elToMove = this.sortArray[this.sortingIndex + 1];

                if(targetEl != undefined && elToMove != undefined){
                    this.sortArray.splice((this.sortingIndex + 1), 1, targetEl);
                    this.sortArray.splice(this.sortingIndex, 1, elToMove);
                    this.sortingIndex = this.sortingIndex + 1;
                }
            }
            if(this.dY < this.sortMarkTop && this.sortMarkTop != null){
                let targetEl = this.sortArray[this.sortingIndex];
                let elToMove = this.sortArray[this.sortingIndex - 1];

                if(targetEl != undefined && elToMove != undefined){
                    this.sortArray.splice((this.sortingIndex - 1), 1, targetEl);
                    this.sortArray.splice(this.sortingIndex, 1, elToMove);
                    this.sortingIndex = this.sortingIndex - 1;
                }
            }

            
            let markEl = document.getElementsByClassName(this.sortClass);
            for(let item of markEl){
                item.classList.remove('mouse-processor-dashed-border');
            }
            markEl[this.sortingIndex].classList.add('mouse-processor-dashed-border');
        },
        /**
         * sortTriggerPosition
         * Finding Position for sorting
         */
        sortTriggerPosition(){
            let els = document.getElementsByClassName(this.sortClass);
            
            if((this.sortingIndex+1) < els.length){
                let position = elPosition( els[this.sortingIndex+1]);
                this.sortMarkBottom = position.top + (els[this.sortingIndex+1].offsetHeight/2) + 10;
            }else{
                this.sortMarkBottom = null;
            }
            if((this.sortingIndex-1) >= 0){
                let position = elPosition( els[this.sortingIndex-1]);
                this.sortMarkTop = position.top + (els[this.sortingIndex-1].offsetHeight/2) - 10;
            }else{
                this.sortMarkTop = null;
            }
        },
    }

});