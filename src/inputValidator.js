function inputValidator(data) {
    return data?.name.length && data?.age.length && data?.hobbies instanceof Array
}

module.exports = {inputValidator}