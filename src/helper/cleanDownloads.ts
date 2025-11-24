import { existsSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

export const cleanDownloads = () => {
    try {
        const videosFolder = join('videos');
        if (existsSync(videosFolder)) {
            const files = readdirSync(videosFolder);
            for (const file of files) {
                try {
                    unlinkSync(join(videosFolder, file));
                } catch (error) {
                    console.log(`Error al eliminar archivo ${file}:`, error);
                }
            }
        }
    } catch (error) {
        console.log('Error al limpiar carpeta videos:', error);
    }
};
