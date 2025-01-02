import type { Request } from "express";

export type AuthCookie = {
	ACCESS_TOKEN: string;
};

export interface RequestAuth extends Request {
	auth: {
		sub: string;
		role: string;
		tenantId: string;
	};
}

export const Roles = {
	CUSTOMER: "customer",
	ADMIN: "admin",
	MANAGER: "manager",
	SUPERADMIN: "super",
} as const;
