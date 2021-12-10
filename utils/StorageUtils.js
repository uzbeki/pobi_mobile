import { Storage } from "aws-amplify";
import defaultPicture from "../assets/icons/defaultAvatar.png";

/** Grabs the file s3 key and returns a signedURL */
// BUG: does not throw error when url is not found
const getFileSignedUrl = async (key) => {
    try {
        return await Storage.get(key, { download: false });
    } catch (error) {
        console.error("File does not exit with the provided key", error);
        return defaultPicture
    }
}


/** 
 * gets a `file` object and uploads it to the S3 bucket
 * 
 * returns the s3 response object `{key: ''}`
*/
const uploadFile = async (file) => {
    return await Storage.put(file.name, file, {
        contentType: `${file.type}`,
    })
}





export { getFileSignedUrl, uploadFile };