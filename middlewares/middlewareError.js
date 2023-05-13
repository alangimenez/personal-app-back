const handlerError = (err, req, res, next) => {
    console.log(`Error: ${err.message}`)
    switch (err.message) {
        case "DuplicateAccount": {
            const message = `La cuenta ${err.account} en moneda ${err.currency} ya existe`
            console.log(`Detail: ${message}`)
            res.status(400).json({"error": message})
            break
        }
        case "CantCreateObject": {
            console.log(`Detail: ${err.detail}`)
            res.status(500).json({
                "error": `Ocurrió un error al crear el registro`,
                "detail": err.detail
            })
            break
        }
        default: {
            res.status(500).json({"error": `Ocurrio un error inesperado. Motivo: ` + err.message})
        }
    }
}

module.exports = { handlerError }