import jwt from "jsonwebtoken";

function getToken(req) {
  const cookieToken = req.cookies?.admin_token;

  if (cookieToken) {
    return cookieToken;
  }

  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return null;
}

export function protect(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";

    return res.status(401).json({
      success: false,
      message: expired
        ? "Sesi login sudah berakhir, silakan login kembali"
        : "Token tidak valid, silakan login kembali"
    });
  }
}
