import { writeFile } from 'fs/promises';
import { join } from 'path';
import { YtDlp } from 'ytdlp-nodejs';

export const downloadThumbnail = async (url: string, ytdlp: YtDlp, DOWNLOAD_FOLDER: string) => {
    let thumbnailPath: string | undefined;

    try {
        const videoInfo = await ytdlp.getInfoAsync(url);
        const videoId = videoInfo.id;

        if (videoId) {
            const thumbnailFileName = `thumbnail_${Date.now()}.jpg`;
            thumbnailPath = join(DOWNLOAD_FOLDER, thumbnailFileName);

            // Intentar descargar el thumbnail de alta resolución
            try {
                const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
                const response = await fetch(thumbnailUrl);

                if (response.ok) {
                    const thumbnailBuffer = Buffer.from(await response.arrayBuffer());
                    await writeFile(thumbnailPath, thumbnailBuffer);
                } else {
                    // Si maxresdefault falla, intentar con hqdefault
                    const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                    const fallbackResponse = await fetch(fallbackUrl);
                    if (fallbackResponse.ok) {
                        const thumbnailBuffer = Buffer.from(await fallbackResponse.arrayBuffer());
                        await writeFile(thumbnailPath, thumbnailBuffer);
                    } else {
                        thumbnailPath = undefined;
                    }
                }

                return thumbnailPath;
            } catch (fetchError) {
                console.log('Error al descargar thumbnail:', fetchError);
                thumbnailPath = undefined;
            }
        }
    } catch (error) {
        console.log('Error al obtener información del video para thumbnail:', error);
        thumbnailPath = undefined;
    }
};
