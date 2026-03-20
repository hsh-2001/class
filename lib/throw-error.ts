export default function getThrowError(message: string, statusCode = 500) {
    Object.assign(new Error(message), { statusCode });
}