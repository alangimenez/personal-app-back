module.exports = (name, currency) => {
    const error = new Error("DuplicateAccount")
    error.account = name
    error.currency = currency
    throw error
}