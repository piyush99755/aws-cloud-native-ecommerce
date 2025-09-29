import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import axios from "axios";

// Cognito User Pool details
const region = "us-east-1";
const userPoolId = "us-east-1_ZYlluw6aX";
const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

let pems = {};

// Fetch and cache Cognito JWKs (public keys)
const getPems = async () => {
  if (Object.keys(pems).length > 0) return pems;

  const url = `${issuer}/.well-known/jwks.json`;
  const { data } = await axios.get(url);

  data.keys.forEach((key) => {
    pems[key.kid] = jwkToPem(key);
  });

  return pems;
};

// Middleware to validate JWT and attach user payload
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.header?.kid) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const pemMap = await getPems();
    const pem = pemMap[decoded.header.kid];
    if (!pem) {
      return res.status(401).json({ error: "Unauthorized: Invalid key ID" });
    }

    jwt.verify(token, pem, { issuer }, (err, payload) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized: Token verification failed" });
      }

      req.user = payload; // now you can access req.user.sub, req.user.email, req.user["cognito:groups"]
      next();
    });
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(500).json({ error: "Internal server error during auth" });
  }
};

// Middleware to restrict route access to admins
export const requireAdmin = (req, res, next) => {
  const groups = req.user?.["cognito:groups"] || [];
  if (groups.includes("Admin")) {
    return next();
  }
  return res.status(403).json({ error: "Forbidden: Admin access required" });
};
