import { fail, ok } from "@/lib/api-response";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const path = formData.get("path") as string || "";

        if (!files || files.length === 0) {
            return fail("No files uploaded", 400);
        }

        const s3 = new S3Client({
            region: "auto",
            endpoint: process.env.R3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R3_SECRET_ACCESS_KEY!,
            },
        });

        const uploadedFiles: { fileName: string; key: string }[] = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}-${file.name}`;
            const key = `${path}/${fileName}`;

            await s3.send(
                new PutObjectCommand({
                    Bucket: process.env.R3_BUCKET_NAME!,
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                })
            );

            uploadedFiles.push({ fileName, key });
        }
        return ok(uploadedFiles, 'Files uploaded successfully');
    } catch (error) {
        const errorMessage = (error as Error).message || "File upload failed";
        return fail(errorMessage, 500);
    }
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const fileName = url.searchParams.get("file");

    if (!fileName) {
        return fail('File retrieval failed', 400);
    }

    const s3 = new S3Client({
        region: "auto",
        endpoint: process.env.R3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R3_SECRET_ACCESS_KEY!,
        },
    });

    const command = new GetObjectCommand({
        Bucket: process.env.R3_BUCKET_NAME!,
        Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return ok({ url: signedUrl }, 'File retrieved successfully');
}