import { YtDlp } from 'ytdlp-nodejs';
import { join } from 'path';
import { downloadThumbnail } from './thumbnailDL';

const ytdlp = new YtDlp();
const DOWNLOAD_FOLDER = 'videos';

export const downloadVideo = async (url: string) => {
    try {
        const fileName = `video_${Date.now()}.mp4`;
        const filePath = join(DOWNLOAD_FOLDER, fileName);
        const format =
            'best[height<=720][ext=mp4]/best[height=720][ext=mp4]/best[height<=480][ext=mp4]/best[height=480][ext=mp4]/bestvideo[height<=720]+bestaudio[ext=m4a]/bestvideo[height<=480]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/bestvideo[height<=480]+bestaudio';

        await ytdlp.downloadAsync(url, {
            output: filePath,
            format: format,
            mergeOutputFormat: 'mp4',
            writeThumbnail: true,
        });

        let thumbnailPath = await downloadThumbnail(url, ytdlp, DOWNLOAD_FOLDER);

        return { videoPath: filePath, thumbnailPath };
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
};
