const {ifObjectExists} = require('./../services/s3.js')

const checkIfFileExists = async (req, res, next) => {
    const {path} = req.params
    const isExists = await ifObjectExists(path)
    if (!isExists) {
        return res.status(404).send("File not found")
    }
    next()
}

module.exports = checkIfFileExists