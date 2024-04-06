const File  = require('./../models/File.js')

const getFile = async(fileId) => {
    return await File.findById(fileId)
}

module.exports = getFile