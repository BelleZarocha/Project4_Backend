// const Package = require("../models").InsurancePackage
// const User = require("../models").User

// const index = (req, res) => {
//     Package.findAll().then(packages => {res.json(packages)})
// }

// module.exports={
//     index
// }

const Package = require("../models").InsurancePackage
const User = require("../models").User
const Pet = require("../models").Pets

const index = (req, res) => {
    Package.findAll().then(packages => {res.json(packages)})
}

const buy =(req,res)=>{
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    }
    console.log(req.token)

    jwt.verify(req.token, process.env.JWT_SECRET, (err, decodedUser) => {
        console.log(decodedUser);
        if (err || !decodedUser)
            return res.status(401).json({error: "Unauthorized Request"});

        req.user = decodedUser;

        Pet.update(
            {
                package_id: req.body.package_id
            },
            {
                where: {username: decodedUser.id}
            }
        ).then((r) => {
            console.log("fin");
        });

    })
}

module.exports={
    index,
    buy,
}