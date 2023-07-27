/**
 * validVar
 * [Validate Veriable]
 * 
 * @param {*} data 
 * @returns Boolean
 */
export const validVar = (data) => {
    if(data === 0 || data === false){return true}
    if(data){
        if(data != null && data != undefined && data != '' && data != 'null' && data != 'undefined'){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
/**
 * 
 * @param {*} value 
 * @param {*} returnVal // Specify what to return if not number or it will return Boolean
 * @returns 
 */
 export const validNumber = (value, returnVal = 'Boolean') => {
    if(value == null || value == undefined || value == '' || value == 'null' || value == 'undefined' || value === true || value == false){
        if(returnVal == 'Boolean'){
            return false;
        }else{
            return returnVal;
        }
    }
    let val = value.toString().replace(/ /g, '');
    if(val == '' || isNaN(val)){if(returnVal == 'Boolean'){return false;}else{return returnVal}}

    if(returnVal == 'Boolean'){return true}else{return Number(value)}
}
/**
 * cloneDeep
 * [Clone Array Or Object]
 * 
 * @param {*} data  Object Or Array
 * @returns Object Or Array
 */
export const cloneDeep = (data) => {
    if(data == null || data == undefined){return data}
    if(data.constructor === Array){
        var newArr = [];
        for(var i=0; data.length>i; i++){
            if(data[i] == null || data[i] == undefined){
                var newArrVal = data[i];
            }else if(data[i].constructor === Array || data[i].constructor === Object){
                var newArrVal = cloneDeep(data[i]);
            }else{
                var newArrVal = data[i];
            }
            newArr.push(newArrVal)
        }
        return newArr;
    }else if(data.constructor === Object){
        var newObj = {};
        for(var key in data){
            if(data[key] == null || data[key] == undefined){
                var newObjVal = data[key];
            }else if(data[key].constructor === Array || data[key].constructor === Object){
                var newObjVal = cloneDeep(data[key]);
            }else{
                var newObjVal = data[key];
            }
            newObj[key] = newObjVal
        }
        return newObj;
    }else{
        return data
    }
}
/**
 * clearNumber
 * [Remove String From Number]
 * 
 * @param {*} data Number With String
 * @returns Number
 */
export const clearNumber = (data) => {
    return Number(data.replace(/\D/g,''));
}
/**
 * setDecimal
 */
export const setDecimel = (number, decimal = 0, always = false) => {
    number = validNumber(number, 0);
    decimal = validNumber(decimal, 0);
    if(decimal === 0){
        return number
    }else if(number === 0 && always === false){
        return 0
    }else if (always === true){
        return number.toFixed(2)
    }else{
        let place = 1;
        for(let i=0; i<decimal; i++, place*=10);
        return Math.round(number * place) / place;        
    }
}
/**
 * scrollbarHW
 * [Get ScrollBar Height Width]
 * 
 * @returns Scroll Height Or Width Based On Body
 */
export const scrollbarHW = () => {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarHW = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarHW;
};
/**
 * isPhone
 * [Check If User From Phone]
 * 
 * @returns Boolean
 */
export const isPhone = () => {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }else{
        return false;
    }
}
/**
 * 
 * @param {*} length 
 * @returns 
 */
export const randomString = (length, chars) => {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


export const getArrObjIndex = (arr, sample) => {
    return arr.findIndex((item) => item.id == sample)
}