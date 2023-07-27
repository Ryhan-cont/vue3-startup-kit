import {scrollbarHW} from './com.js'

export const dropZone = (prevEl, optionEl) => {
    let screenY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let caclDropdownHeight = optionEl.offsetHeight;
    let mainContainerEl = prevEl.getBoundingClientRect();

    if((mainContainerEl.top + mainContainerEl.height + caclDropdownHeight) < screenY){
        return 'dropdown';
    }else if(mainContainerEl.top > caclDropdownHeight){
        return 'dropup';
    }else{
        return 'dropmiddle';
    }
}

export const findScrollEl = (el) => {
    let tempEl = el;
    let scrollableEl = [];
    while(tempEl){
        if(tempEl.tagName != 'HTML'){
            if(tempEl.clientHeight < tempEl.scrollHeight){
                let calcStyle = getComputedStyle(tempEl)
                if(calcStyle.overflow == 'scroll' || calcStyle.overflow == 'auto'){
                    scrollableEl.push(tempEl);
                }
            }
        }
        tempEl = tempEl.parentNode;
    }
    return scrollableEl;
}

export const screenSize = () => {
    let screenY = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let screenX = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let body = document.body, html = document.documentElement;
    let docHeight = Math.max( body.offsetHeight, html.clientHeight, html.offsetHeight );
    let docWidth = Math.max( body.offsetWidth, html.clientWidth, html.offsetWidth );

    if(document.documentElement.scrollHeight > docHeight){
        screenX = screenX - scrollbarHW();
    }
    if(document.documentElement.scrollWidth > docWidth){
        screenY = screenY - scrollbarHW();
    }
    return {screenX, screenY}
}

export const calcFixedMenuPosition = (previewEl, optionWidth, animation, align = null) => {
    let top, bottom, left, right, width, menuPosition;
    let calcPreiewEl = previewEl.getBoundingClientRect();

    let {screenX, screenY} = screenSize()

    menuPosition = 'fixed';
    if(animation == 'dropdown'){
        top = (calcPreiewEl.top + calcPreiewEl.height) + 'px';
        bottom = 'none';
    }else if(animation == 'dropup'){
        bottom = (screenY - calcPreiewEl.top) + 'px';
        top = 'none';
    }else{
        bottom = '10px';
        top = 'none';
    }

    if(align == 'left'){
        left = calcPreiewEl.left + 'px';
        right = 'auto';
        width = 'auto';
    }else if(align == 'right'){
        left = 'auto';
        right = (screenX - (calcPreiewEl.left + calcPreiewEl.width)) + 'px';
        width = 'auto';
    }else if(align == 'center'){
        if(calcPreiewEl.width > optionWidth){
            let diff = (calcPreiewEl.width - optionWidth)/2;
            left = (calcPreiewEl.left + diff) + 'px';
            right = 'auto';
        }else if(calcPreiewEl.width < optionWidth){
            let diff = (optionWidth - calcPreiewEl.width)/2;
            left = calcPreiewEl.left - diff;
            right = 'auto';
            if(left < 10){left = 10;}
            left = left + 'px';
        }else{
            left = calcPreiewEl.left + 'px';
            right = calcPreiewEl.right + 'px';
        }
        width = 'auto';
    }else{
        left = calcPreiewEl.left + 'px';
        right = 'auto';
        width = calcPreiewEl.width + 'px';
    }
    return {
        top,
        bottom,
        left,
        right,
        width,
        menuPosition,
    }
}