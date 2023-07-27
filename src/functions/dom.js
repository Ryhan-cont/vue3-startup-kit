import { validNumber } from '@/functions/com.js';
/**
 * elPosition
 * 
 * @param {*} el Element to find position
 * @returns element position
 */
export const elPosition = (el) => {
    let tempEl = el;
    let offsetTop = 0;
    let offsetLeft = 0;
    let tempElParent = null;
    while(tempEl){
        let ignore  = false;
        if(tempEl.offsetParent != null){
            let position = getComputedStyle(tempEl.offsetParent).position;
            
            if(tempEl.tagName == 'TBODY' && tempEl.offsetParent.tagName == 'TABLE' && position != 'relative'){ignore = true}

            //Multiple element can have same offset parent, this is why (tempElParent != tempEl.offsetParent) is used
            if(tempElParent != tempEl.offsetParent && ignore === false){
                offsetTop += tempEl.offsetTop;
                offsetLeft += tempEl.offsetLeft;
                tempElParent = tempEl.offsetParent;
            }

            //
            if(tempEl.tagName != 'HTML'){
                offsetTop -= validNumber(tempEl.scrollTop, 0)
                offsetLeft -= validNumber(tempEl.scrollLeft, 0)
            }
            tempEl = tempEl.parentNode;
        }else{
            if(tempEl){
                let position = getComputedStyle(tempEl).position;
                if(position == 'fixed'){
                    let rect = tempEl.getBoundingClientRect()
                    offsetTop += rect.top;
                    offsetLeft += rect.left;
                }
            }
            break
        }
    }
    return {top:offsetTop, left:offsetLeft}
}

/**
 * getTargetParent
 * [Find parent element by using targeted class name. Up to 12 Parent Node]
 * 
 * @param {*} el Element to search
 * @param {*} className Name of target parent class
 * @returns 
 */
export const getTargetParent = (el, className) => {
    let tempEl = el;
    while(tempEl){
        if((tempEl.classList && tempEl.classList.contains(className)) || tempEl.id == className){
            return tempEl;
        }
        tempEl = tempEl.parentNode;
    }
    return null
}