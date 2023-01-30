const User = require("../models").User;
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Pet = require("../models").Pets;
const test = (req, res) => {
    res.json({"test": "test"});
};

const getUser = (req, res) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    }
    console.log(req.token)
    jwt.verify(req.token, process.env.JWT_SECRET, (err, decodedUser) => {
        console.log(decodedUser)
        if (err || !decodedUser)
            return res.status(401).json({error: "Unauthorized Request"});

        req.user = decodedUser;
        User.findOne({where: {username: decodedUser.username}}).then((resu) => {
            console.log(resu)
            Pet.findOne({where: {user_id: decodedUser.id}}).then(pet => {
                res.json({
                    username: resu.username,
                    email: resu.email,
                    phone: resu.phone,
                    firstname: resu.firstname,
                    lastname: resu.lastname,
                    pet: pet,
                    address: resu.address,
                });
            })

        });
    });
};

const login = (req, res) => {
    try {
        User.findOne({
            where: {
                username: req.body.username,
            },
        })
            .then((foundUser) => {
                console.log(foundUser)
                if (foundUser) {
                    bcrypt.compare(
                        req.body.password,
                        foundUser.password,
                        (err, match) => {
                            if (match) {
                                console.log("match")
                                const token = jwt.sign(
                                    {
                                        username: foundUser.username,
                                        id: foundUser.id,
                                    },
                                    process.env.JWT_SECRET,
                                    {
                                        expiresIn: "30 days",
                                    }
                                );

                                res.cookie("jwt", token);
                                res.json(token);
                            } else {
                                return res.sendStatus(401);
                            }
                        }
                    );
                } else {
                    return res.sendStatus(402);
                }
            })
    } catch (e) {
        console.log(e)
    }
};
const signup = async (req, res) => {
    await User.findAndCountAll({
        where: {
            username: req.body.username,
        },
    }).then((find) => {
        console.log(find)
        if (find.count != 0) {
            console.log("has user")
            return res.status(201).json({status: "Username has taken"});
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return res.status(500).json(err);

                bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
                    if (err) return res.status(500).json(err);
                    req.body.password = hashedPwd;
                    User.create(req.body)
                        .then((newUser) => {
                            const token = jwt.sign(
                                {
                                    username: newUser.username,
                                    id: newUser.id,
                                },
                                process.env.JWT_SECRET,
                                {
                                    expiresIn: "30 days",
                                }
                            )
                            Pet.create({
                                createdAt: "2023-01-30T09:19:19.080Z",
                                expire_date: "2023-01-30T09:19:19.080Z",
                                image: "https://cdn.pixabay.com/photo/2017/10/29/18/00/chihuahua-2900362__480.jpg",
                                name: "kitties",
                                package_id: 20,
                                species: "cat",
                                start_date: "2023-01-30T09:19:19.080Z",
                                type: 1,
                                updatedAt: "2023-01-30T09:19:19.080Z",
                                user_id: newUser.id
                            })
                        });

                });
            })
        }
        return res.json({"status": "complete"})
    });
}


const edit = (req, res) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    }

    jwt.verify(req.token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err || !decodedUser)
            return res.status(401).json({error: "Unauthorized Request"});

        req.user = decodedUser;
        // return res.json("ok");
    });
    if (req.body.password !== "") {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500);

            bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
                if (err) return res.status(500);
                User.update(
                    {
                        username: req.body.username,
                        password: hashedPwd,
                        email: req.body.email,
                        phone: req.body.phone,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        address: req.body.address,
                    },
                    {
                        where: {username: req.user.username},
                    }
                ).then((r) => {
                });
                Pet.update({
                    name:req.body.petName,
                    species: req.body.petSpecies
                },{
                    where: {user_id: decodedUser.id},
                }).then(t=>{
                    return res.json({status:"cool"})
                })
            });
        });
    } else {
        User.update(
            {
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
            },
            {
                where: {username: req.user.username},
            }
        ).then((r) => {
        });
    }
};
const deleteUser = async (req, res) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    }

    jwt.verify(req.token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err || !decodedUser)
            return res.status(401).json({error: "Unauthorized Request"});

        req.user = decodedUser;
        User.destroy({where: {id: decodedUser.id}});
    });
};
const editPet=(req, res)=>{
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
    }

    jwt.verify(req.token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err || !decodedUser)
            return res.status(401).json({error: "Unauthorized Request"});

        req.user = decodedUser;
        // return res.json("ok");
    });
    if (req.body.password !== "") {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500);

            bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
                if (err) return res.status(500);
                console.log(decodeUser);
                Pet.update({
                    name:req.body.petName,
                    species: req.body.petSpecies
                },{
                    where: {user_id: decodedUser.id},
                }).then(t=>{
                    return res.json({status:"cool"})
                })
            });
        });
    } else {
        User.update(
            {
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
            },
            {
                where: {username: req.user.username},
            }
        ).then((r) => {
        });
    }
};
module.exports = {
    test,
    signup,
    login,
    edit,
    deleteUser,
    getUser,
    editPet,

}