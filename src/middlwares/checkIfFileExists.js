const {ifObjectExists} = require('./../services/s3.js')

const checkIfFileExists = async (req, res, next) => {
    const folder = req.body.folder + '/' || ''
    const isExists = await ifObjectExists(req.params.filename, folder)
    if (!isExists) {
        return res.status(404).send("File not found")
    }
    next()
}

module.exports = checkIfFileExists