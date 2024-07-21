



const convertDateString = (date) => {
    return new Date(date).toISOString().split('T')[0]
}

module.exports = convertDateString