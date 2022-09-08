const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  //contrôle des validations des champs
  if (!req.body.firstName || !req.body.lastName) {
    res.status(400).json({
      message: 'Merci de bien vérifier si les champs sont tous remplis !',
    });
    return;
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res
            .status(201)
            .json({ message: "Création de l'utilisateur réussie !" })
        )
        .catch((error) =>
          res.status(400).json((error = ' Erreur création utilisateur'))
        );
    })
    .catch((error) => res.status(500).json((error = ' Erreur signup')));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non inscrit !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          const userId = user._id.toString();
          res.status(200).json({
            userId: userId,
            token: jwt.sign({ userId: userId }, `${process.env.TOKEN}`, {
              expiresIn: '24h',
            }),
            lastname: user.lastname,
            firstname: user.firstname,
          });
        })
        .catch((error) =>
          res.status(500).json((error = " Erreur vaidation email/mot de passe"))
        );
    })
    .catch((error) => res.status(500).json((error = "Erreur login")));
};

exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non inscrit !" });
      }
      return res.status(200).json(user);
    })
    .catch((error) =>
      res.status(500).json((error = "Erreur recupération user"))
    );
};
