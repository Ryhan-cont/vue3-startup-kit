/**
 * validVar
 * [Validate Veriable]
 * 
 * @param {*} data 
 * @returns Boolean
 */
 export const dateToString = (dateFunction, formet = 'YYYY-MM-DD') => {
    dateFunction = new Date(dateFunction);
    if(dateFunction == 'Invalid Date'){return null}

    let dateString = formet;
    let year = dateFunction.getFullYear();
    let month = ('0' + (dateFunction.getMonth()+1)).slice(-2);
    let date = ('0' + dateFunction.getDate()).slice(-2)

    if(formet.includes('YYYY') & !formet.includes('YYYYY')){dateString = dateString.replace("YYYY", year)}
    if(formet.includes('MM') & !formet.includes('MMM')){dateString = dateString.replace("MM", month)}
    if(formet.includes('DD') & !formet.includes('DDD')){dateString = dateString.replace("DD", date)}
    return dateString
}

export const stringToDate = (string) => {
    let date = new Date(string);
    if(date == 'Invalid Date'){date = null}
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date;
}