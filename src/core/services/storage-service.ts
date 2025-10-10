import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import _ from "lodash";
import { Storage } from '@google-cloud/storage'
import { GC_BUCKET_NAME, GC_FILE_TIME, GC_PROJECT_ID, GCS_SA } from "../../config/config";
import mammoth from 'mammoth/lib';

const storage = new Storage({
    keyFilename: GCS_SA,
    projectId: GC_PROJECT_ID
});

const bucket = storage.bucket(GC_BUCKET_NAME);

const upload = async (name: string, file: any): Promise<string> => {
    const { buffer } = file;
    const blob = bucket.file(name);

    try {
        const blobStream = blob.createWriteStream({
            resumable: false
        });

        blobStream.on('finish', () => {
            console.info('uploaded', name);
        })
            .on('error', (error) => {
                console.error(error);
            })
            .end(buffer);

        return name;
    } catch (error) {
        throw error;
    }
};

const get = async (file: string): Promise<any> => {
    try {
        const config: any = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + GC_FILE_TIME * 60 * 1000
        };
        const [response] = await bucket.file(file).getSignedUrl(config);
        return response;
    } catch (error) {
        console.error('error get file', error);
        return false;
    }
};

const read = async (fileName: string): Promise<Array<any>> => {
    const tempFilePath = `./file.docx`;
    await bucket.file(fileName).download({ destination: tempFilePath });
    const buffer = fs.readFileSync(tempFilePath);
    const result = await mammoth.extractRawText({ buffer });

    const regex = /(.*?):\s*{(\d+)}/g;
    const extractedData: { label: string; index: number }[] = [];

    let match;
    while ((match = regex.exec(result.value)) !== null) {
        extractedData.push({
            index: parseInt(match[2]),
            label: match[1].trim(),
        });
    }

    return extractedData;
};

const writeFile = async (fileName: string, data: any, fileOutput: string): Promise<string> => {
    const tempFilePath = `./file-final.docx`;
    await bucket.file(fileName).download({ destination: tempFilePath });

    try {
        const content: any = await fsExtra.readFile(tempFilePath, "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            nullGetter: () => {
                return "-";
            }
        });

        doc.render(data);

        const buffer: any = await doc.getZip().generate({ type: "nodebuffer" });
        await fsExtra.writeFile(`${fileOutput}.docx`, buffer);
    } catch (error) {
        console.error("Failed to replace placeholder");
        throw error;
    }
    return `./${fileOutput}.docx`;
};

const copyFile = async (sourceFileName: string, destinationFileName: string): Promise<void> => {
    try {
        await bucket.file(sourceFileName).copy(destinationFileName);
    } catch (error) {
        throw new Error(error);
    }
};

export default {
    upload,
    get,
    read,
    writeFile,
    copyFile
};