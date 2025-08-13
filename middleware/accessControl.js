const jwt = require('jsonwebtoken')
const {mappingRoles} = require('../config/mapRoles.js')
const myMap = new Map(Object.entries(mappingRoles));  
const { mySqlQury } = require('./db.js');
const { pathToRegexp, match } = require("path-to-regexp");

const compiledMappings = Object.entries(mappingRoles).map(([key, value]) => {
  const [method, rawPath] = key.split(" ");
  const matcher = match(rawPath, { decode: decodeURIComponent });

  return {
    method,
    matcher: (reqPath) => !!matcher(reqPath), // returns true if matched
    role: value.role,
    level: value.level,
  };
});
 
function accessControlMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      console.warn("Access denied: No token found.");
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded !== "object") {
      console.warn("Access denied: Malformed token.");
      return res.status(403).json({ message: "Forbidden: Invalid token structure." });
    }
 
    if (decoded.id === 1) {
      return next(); // Super admin bypass
    }

    const requestMethod = req.method;
    const requestPath = req.path;

    const matched = compiledMappings.find(
      (entry) => entry.method === requestMethod && entry.matcher(requestPath)
    );

    if (!matched) {
      console.warn(`Access denied: No mapping for ${requestMethod} ${requestPath}`);
      return res.status(404).json({ message: "Not Found: No access mapping for this route." });
    }

    const userRoles = decoded.rolesArray;
    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      console.warn("Access denied: User has no roles.");
      return res.status(403).json({ message: "Access Denied: No roles assigned to user." });
    }

    const roleSet = new Set(userRoles);
    if (!roleSet.has(matched.role)) {
      console.warn(`Access denied: Missing role '${matched.role}'`);
      return res.status(403).json({
        message: "Access Denied: You do not have permission to access this resource."
      });
    }

    // Optional: attach matched permission info to req for logging/debugging
    req.permissionInfo = {
      role: matched.role,
      level: matched.level,
    };

    return next();
  } catch (error) {
    console.error("Access Control Middleware Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}
module.exports = accessControlMiddleware