import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const uploadFile = async (file: File, type: string, folder?: string) => {
    try {
        const uuid = crypto.randomUUID();
        const fileName = `${folder}/${type}-${uuid}-${file.name}`;

        const newFile = new File([file], fileName, {
            type: file.type,
            lastModified: file.lastModified,
        });

        const uploadResponse = await utapi.uploadFiles(newFile);

        if (!uploadResponse.data) {
            throw new Error("No data returned from upload");
        }

        return uploadResponse.data.ufsUrl;

    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
};
