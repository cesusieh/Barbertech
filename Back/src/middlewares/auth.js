const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const token = req.cookies.token; 

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}


function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Usuário não autenticado" })

    if (!allowedRoles.includes(req.user.papel)) {
      return res.status(403).json({ error: "Acesso negado: permissão insuficiente" })
    }

    next()
  }
}

module.exports = {
  authenticateToken,
  authorizeRoles,
}