const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {

  try {
    // donne pour valeur a token tout ce qu il y a apres le premiers espace du contenu d'authorization
    const token = req.headers.authorization.split(' ')[1];
    // dechiffre le token a l'aide de la clé secrete et du token presant dans authorization
    const decodedToken = jwt.verify(token, `${process.env.TOKEN}`);
    // Récuperation de l'userId presente dans l'objet decodedToken
    const userId = decodedToken.userId;
    // Si il y a un userId dans la requete et que celui ci est différent de l'userId dans le token ou null
    if (req.body.userId && req.body.userId !== userId) {
      // renvoie une erreur si on a un usedId différent
      throw 'Invalid user ID';
    } else {
      // sinon passe a la suite
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
