function inputValidator(data) {
    return data?.name.length && data?.age.length && data?.hobbies.length
}

module.exports = {inputValidator}