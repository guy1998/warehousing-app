const moment = require('moment');


const calculateDuration = (timeStart)=>{
    const currentTime = moment();
    const duration = moment.duration(currentTime.diff(timeStart));
    return duration.asMinutes();
}

const getFormattedDuration = (duration)=>{
    const durationInMilliseconds = moment.duration(duration * 60 * 1000);
    return moment.utc(durationInMilliseconds.asMilliseconds()).format("HH:mm:ss");
}

module.exports = {
    calculateDuration,
    getFormattedDuration
}