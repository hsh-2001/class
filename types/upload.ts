export interface IUploadRequest {
    file: File | File[];
    path: string;
}

export interface IUploadResponse {
    fileName: string;
    versionId: string;
}

export interface IGetFileResponse {
    url: string;
}