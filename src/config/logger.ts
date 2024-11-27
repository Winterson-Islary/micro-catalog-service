import winston from "winston";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	defaultMeta: { service: "catalog-service" },
	transports: [
		new winston.transports.Console({
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
				winston.format.prettyPrint(),
			),
		}),
		// new winston.transports.File({ filename: "error.log", level: "error" }),
		// new winston.transports.File({ filename: "combined.log" }),
	],
});

export default logger;
