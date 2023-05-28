import { Alert } from 'react-native';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from '@env';
import { v4 as uuidv4 } from 'uuid';

export const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    },
    useAccelerateEndpoint: true
});

export const uploadPhoto = async (sessionId, img, owner) => {
    const blobImg = await fetchImageFromUri(img);
    const filename = Date.now() + uuidv4();

    const command = new PutObjectCommand({
        Bucket: "fylo-photos",
        Key: `${sessionId}/${filename}`,
        Body: blobImg,
        ContentType: 'img/jpeg',
        Metadata: {
            owner: owner
        }
    });

    try {
        return s3Client.send(command).then((resp) => {
            console.log("Image uploaded!");
            return resp.Key;
        });
    } catch (error) {
        console.log(error);
        return Alert.alert("Unable to upload photo");
    }
}

// Fetches all photos from a session
export const fetchAllPhotos = async (sessionId) => {
    const command = new ListObjectsCommand({
        Bucket: "fylo-photos",
        Prefix: `${sessionId}/`
    });

    try {
        const resp = await s3Client.send(command);
        let contents = resp.Contents;
        if (!contents) {
            return [];
        }

        const photos = contents.map(async (img) => {
            const photo = await fetchPhoto(img.Key);
            return photo;
        })


        return Promise.all(photos);
    } catch (error) {
        console.log(error);
    }
}

// Return image uri and owner
export const fetchPhoto = async (path) => {
    const command = new GetObjectCommand({
        Bucket: "fylo-photos",
        Key: path
    });

    try {
        const resp = await s3Client.send(command);

        // resp.Body is a blob image
        const imgUri = await blobToBase64(resp.Body);

        const owner = resp.Metadata.owner;

        return {
            img: imgUri,
            owner: owner,
            key: path
        }
    } catch (error) {
        console.log(error);
    }
}

// Converts blob image to base 64 uri
const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
};

// Converts image file uri to blob image
const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
};

