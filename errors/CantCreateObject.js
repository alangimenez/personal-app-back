module.exports = (e) => {
    const error = new Error("CantCreateObject")
    console.log(e.message)
    error.detail = e.message
    throw error
}