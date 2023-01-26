const test =(req,res)=>{
    res.json({"test":"test"});
};
const login = (req, res) => {
    try {
        User.findOne({
            where: {
                username: req.body.username,
            },
        })
            .then((foundUser) => {
                // console.log(foundUser)
                if (foundUser) {
                    bcrypt.compare(
                        req.body.password,
                        foundUser.password,
                        (err, match) => {
                            if (match) {
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
                                return res.sendStatus(400);
                            }
                        }
                    );
                } else {
                    return res.sendStatus(400);
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
                        });
                });
            })
        }
        return res.json({"status":"complete"})
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
        return res.json("ok");
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
                    },
                    {
                        where: {username: req.user.username},
                    }
                ).then((r) => {
                });
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
module.exports={
    test,
    signup,
    login,
    edit,
    deleteUser
}