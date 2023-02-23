const moment = require('moment'); // require
moment().format();

// calcula la diferencia en días entre hoy y la fecha que se le pase como parametro
const diffInDaysBetweenDateAndToday = (date) => {
    const today = new Date()
    const finishDate = moment([date.getFullYear(), date.getMonth(), date.getDate()])
    const todayMoment = moment([today.getFullYear(), today.getMonth(), today.getDate()])
    return finishDate.diff(todayMoment, 'days')
}

const transformDate = (date) => {
    return moment(date, 'YYYY-MM-DD').format('YYYY/MM/DD')
}

// redondea un numero flotante a dos decimales
const roundToTwo = (num) => {
    return +(Math.round(num + "e+4") + "e-4");
}

const convertRequest = request => {
    let response;
        if (typeof(request) == 'string') {
            response = JSON.parse(request)
        } else {
            response = request
        }
    return response
}

const addDays = date => {
    const originalDate = moment(date).add(1, 'days').add(12, 'hours')
    return originalDate.format('YYYY-MM-DD')
}

module.exports = {
    diffInDaysBetweenDateAndToday,
    roundToTwo, 
    transformDate,
    convertRequest,
    addDays
}