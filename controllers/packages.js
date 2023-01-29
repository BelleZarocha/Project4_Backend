const Package = require("../models").InsurancePackage
const User = require("../models").User

const index = (req, res) => {
    Package.findAll().then(packages => {res.json(packages)})
}

module.exports={
    index
}