import path from "node:path";
import { config } from "dotenv";

config({
	path: path.join(__dirname, `../../.env.${process.env.NODE_ENV} || "dev"}`),
});

const { SOMETHING } = process.env;

export const Config = { SOMETHING } as const;
