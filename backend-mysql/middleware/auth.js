const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for checking JWT-token (takes place before request reaches the route, checks if token is valid, and if yes - adds payload into req.user, if not - returns error):
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" }); // 401 Unauthorized - user is not authenticated
  }

  // Token verification: checks if token is correctly signed with JWT_SECRET, not expired and not modified.
  // If token is valid - returns payload (data that we put in token when it's created - in our case, customer_id and role):
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // add payload (customer_id and role) into req.user. Request-object will contain user info, like req.user.id and req.user.role
    next(); // if token is valid, move to the next step - next middleware or route handler (otherwise, if token invalid, throw error)
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
    // 403 Forbidden - user is authenticated but doesn't have access
  }
};

// Middleware: check if customer has some specific role:
const requireRole = (role) => (req, res, next) => {
  // higher order function (function that returns a function)
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  if (req.user.role !== role) {
    // if user has role 'user', but the route requires role 'admin' - the route is forbidden for this user.
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = { authenticateToken, requireRole };