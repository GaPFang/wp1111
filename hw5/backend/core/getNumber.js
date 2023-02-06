let number = 87

const getNumber = () => {
    return number
}

const genNumber = () => {
    number = Math.floor(Math.random() * 99 + 1)
}

export { genNumber, getNumber }