const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// TOKEN DO BOT
const TOKEN = 'MTUwOTM4NDU3OTIwNTU2MjM5OQ.GQKFmC.qqTCYBIbxk_Xq0gUDM7jK1hjqUDALrIJC55VDg';

// ID DO CANAL DE BOAS-VINDAS
const CANAL_BOASVINDAS = '1509224014059540711';

// ID DO CARGO DE REGISTRO
const CARGO_REGISTRO = '1509322756116840520';

// FOTO GRANDE
const FOTO_GRANDE = 'https://media.discordapp.net/attachments/1389345506550878321/1509358727898202173/ChatGPT_Image_27_de_mai._de_2026_21_52_26.png?ex=6a18e35b&is=6a1791db&hm=dd03cd53e6a22fb7806952ed3ded55f4bb200d9881c0d92c574a401ffe04a546&=&format=webp&quality=lossless&width=960&height=960';

// FOTO PEQUENA
const FOTO_PEQUENA = 'https://media.discordapp.net/attachments/1389345506550878321/1509358727898202173/ChatGPT_Image_27_de_mai._de_2026_21_52_26.png?ex=6a18e35b&is=6a1791db&hm=dd03cd53e6a22fb7806952ed3ded55f4bb200d9881c0d92c574a401ffe04a546&=&format=webp&quality=lossless&width=960&height=960';

// BOT ONLINE
client.once(Events.ClientReady, () => {
    console.log(`✅ Bot online: ${client.user.tag}`);
});

// QUANDO MEMBRO ENTRAR
client.on(Events.GuildMemberAdd, async member => {

    try {

        // ADICIONA O CARGO AUTOMÁTICO
        const cargo = member.guild.roles.cache.get(CARGO_REGISTRO);

        if (cargo) {
            await member.roles.add(cargo);
            console.log(`✅ Cargo adicionado para ${member.user.tag}`);
        }

        // BUSCA O CANAL
        const canal = await client.channels.fetch(CANAL_BOASVINDAS);

        if (!canal) return;

        // EMBED
        const embed = new EmbedBuilder()

            .setColor('#00ff44')

            .setAuthor({
                name: 'STREET • Sistema de Boas-vindas',
                iconURL: FOTO_PEQUENA
            })

            .setTitle('🎉 Bem-vindo(a)!')

            .setDescription(
`👋 Olá ${member}, seja muito bem-vindo(a) ao **STREET!**

✨ Esperamos que aproveite sua estadia e faça parte da nossa comunidade.

📜 Não se esqueça de ler as regras e interagir com os membros!`
            )

            // FOTO DO MEMBRO
            .setThumbnail(
                member.user.displayAvatarURL({
                    dynamic: true,
                    size: 1024
                })
            )

            // FOTO GRANDE
            .setImage(FOTO_GRANDE)

            .setFooter({
                text: 'STREET • Sistema de Boas-vindas',
                iconURL: FOTO_PEQUENA
            })

            .setTimestamp();

        // ENVIA A MENSAGEM
        await canal.send({
            embeds: [embed]
        });

    } catch (err) {

        console.log(err);

    }

});

// LOGIN
client.login(TOKEN);