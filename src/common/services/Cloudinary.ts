import { Readable } from "node:stream";
import {
	type UploadApiErrorResponse,
	type UploadApiResponse,
	v2 as cloudinary,
} from "cloudinary";
import config from "config";
import type { Logger } from "winston";
import type { FileStorage, ImageData, TUploadReturn } from "../types/buckets";

export class CloudinaryStorage implements FileStorage {
	private logger: Logger;
	constructor(logger: Logger) {
		this.logger = logger;
		cloudinary.config({
			cloud_name: `${config.get("cloudinary.cloudName")}`,
			api_key: `${config.get("cloudinary.apiKey")}`,
			api_secret: `${config.get("cloudinary.apiSecret")}`,
		});
	}
	async upload(data: ImageData): Promise<TUploadReturn> {
		try {
			const uploadResult = await new Promise<UploadApiResponse>(
				(resolve, reject) => {
					const uploadStream = cloudinary.uploader.upload_stream(
						{
							resource_type: "image",
							folder: "pizza-corp-uploads",
							public_id: data.fileName,
						},
						(error, result) => {
							if (error) {
								reject(error as UploadApiErrorResponse);
							} else {
								resolve(result as UploadApiResponse);
							}
						},
					);
					const buffer = Buffer.from(data.fileData);
					const readableStream = Readable.from(buffer);
					readableStream.pipe(uploadStream);
				},
			);
			return { public_id: uploadResult.public_id, url: uploadResult.url };
		} catch (error) {
			this.logger.error(`error: ${error}; Location: 'Cloudinary.ts'`);
			throw new Error(
				"{message: 'Failed to upload image'; location: 'Cloudinary.ts'}",
			);
		}
	}
	async delete(filename: string): Promise<void> {}
	async getObjectUrl(filename: string): Promise<string> {
		return "";
	}
}
