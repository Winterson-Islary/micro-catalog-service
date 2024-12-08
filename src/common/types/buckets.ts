export type ImageData = {
	fileName: string;
	fileData: ArrayBuffer;
};
export type TUploadReturn = {
	public_id: string;
	url: string;
};
export interface FileStorage {
	upload(data: ImageData): Promise<TUploadReturn>;
	delete(filename: string): Promise<void>;
	getObjectUrl(filename: string): Promise<string>;
}
