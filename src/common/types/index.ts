import type { Request } from "express";

export type AuthCookie = {
	ACCESS_TOKEN: string;
};
export interface RequestAuth extends Request {
	auth: {
		sub: string;
		role: string;
	};
}
