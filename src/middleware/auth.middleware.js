var jwt = require("jsonwebtoken");

const authMiddleware = (isAccess) => {
	return (req, res, next) => {
		const token =
			req.headers.token ||
			req.headers.Authorization ||
			req.headers.authorization ||
			"";
		if (!token)
			return res.status(402).json({ error: "token not provided" });

		try {
			const decoded = jwt.verify(
				token,
				isAccess
					? process.env.ACCESS_SECRET
					: process.env.REFRESH_SECRET,
			);

			if (decoded) {
				req.user = decoded.user;
				next();
			} else return res.status(402).json({ error: "no payload found" });
		} catch (e) {
			if (e.name == "TokenExpiredError") {
				return res.status(409).json({ error: "token expired" });
			} else if (e.name == "JsonWebTokenError") {
				return res.status(401).json(e.message);
			} else return res.status(400).json(e);
		}
	};
};

module.exports = authMiddleware;
