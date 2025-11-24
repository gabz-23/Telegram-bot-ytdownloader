import 'dotenv/config';

import { Telegraf, Input } from 'telegraf';
import { downloadVideo } from './videoDL.ts';
import { existsSync, statSync } from 'fs';
import { cleanDownloads } from './helper/cleanDownloads.ts';

const bot = new Telegraf(process.env.BOT_TOKEN!, {
    handlerTimeout: Infinity,
});

bot.command('start', async (ctx) => {
    await ctx.reply(
        'Bienvenido al bot de descarga de videos de YouTube. Para descargar un video, use el comando /dl <URL del video>'
    );
});

bot.command('dl', async (ctx) => {
    const url = ctx.message.text.split(' ')[1];

    const downloadingMsg = await ctx.reply('Descargando video...');

    try {
        const { videoPath, thumbnailPath } = await downloadVideo(url);

        // Verificar que el archivo existe antes de enviarlo
        if (!existsSync(videoPath)) {
            throw new Error('El archivo de video no existe');
        }

        const fileStats = statSync(videoPath);
        if (fileStats.size === 0) {
            throw new Error('El archivo de video está vacío');
        }

        const sendingMsg = await ctx.reply('Enviando video...');

        const videoOptions: any = {
            supports_streaming: true,
            duration: 100,
        };

        // Agregar thumbnail si está disponible y existe
        if (thumbnailPath && existsSync(thumbnailPath)) {
            videoOptions.thumbnail = Input.fromLocalFile(thumbnailPath);
        }

        await ctx.replyWithVideo(Input.fromLocalFile(videoPath), videoOptions);

        // Eliminar mensajes de descarga y envío
        await ctx.deleteMessage(downloadingMsg.message_id);
        await ctx.deleteMessage(sendingMsg.message_id);

        cleanDownloads();
    } catch (error) {
        // Limpiar archivos incluso si hay error
        cleanDownloads();
        await ctx.reply(`Error en la descarga: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
});

bot.launch();

console.log('Bot started');
