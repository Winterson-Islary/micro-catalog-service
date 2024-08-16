import { config } from "dotenv";
import path from "node:path";

config({
	path: path.join(__dirname, `../../.env.${process.env.NODE_ENV} || "dev"}`),
});

const { SOMETHING } = process.env;

export const Config = { SOMETHING } as const;
