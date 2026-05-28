const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// TOKEN
const TOKEN = 'MTUwOTM4NDU3OTIwNTU2MjM5OQ.GQKFmC.qqTCYBIbxk_Xq0gUDM7jK1hjqUDALrIJC55VDg';

// CANAIS
const CANAL_REGISTRO = '1509224306045878302';
const CANAL_APROVACAO = '1509224382176825386';

// CARGOS
const CARGO_MEMBRO = '1509279658766766101';
const CARGO_REGISTRO = '1509322756116840520';

client.once(Events.ClientReady, async () => {

    console.log(`✅ Bot online: ${client.user.tag}`);

    const canal = await client.channels.fetch(CANAL_REGISTRO);

    const embed = new EmbedBuilder()

        .setColor('#FFD700')

        .setAuthor({
            name: 'Street • Sistema de Registro',
            iconURL: 'https://media.discordapp.net/attachments/1389345506550878321/1509358727898202173/ChatGPT_Image_27_de_mai._de_2026_21_52_26.png?ex=6a18e35b&is=6a1791db&hm=dd03cd53e6a22fb7806952ed3ded55f4bb200d9881c0d92c574a401ffe04a546&=&format=webp&quality=lossless&width=960&height=960'
        })

        .setTitle('📋 Registro de Membros')

        .setDescription(
`Você está prestes a iniciar o processo de **registro oficial** no servidor.

• 🍀 Apenas membros ainda não registrados podem se registrar.

• 👮 Após o registro, a equipe verificará suas informações.

> Clique no botão abaixo para começar.`
        )

        .setFooter({
            text: 'Sistema de Registro • Automático'
        })

        .setThumbnail('https://media.discordapp.net/attachments/1389345506550878321/1509358727898202173/ChatGPT_Image_27_de_mai._de_2026_21_52_26.png?ex=6a18e35b&is=6a1791db&hm=dd03cd53e6a22fb7806952ed3ded55f4bb200d9881c0d92c574a401ffe04a546&=&format=webp&quality=lossless&width=960&height=960');

    const botao = new ButtonBuilder()
        .setCustomId('registrar')
        .setLabel('Registrar')
        .setEmoji('📋')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(botao);

    await canal.send({
        embeds: [embed],
        components: [row]
    });

});

// MEMBRO ENTRA
client.on(Events.GuildMemberAdd, async member => {

    try {

        const cargo = member.guild.roles.cache.get(CARGO_REGISTRO);

        if (cargo) {
            await member.roles.add(cargo);
        }

        console.log(`Cargo de registro adicionado em ${member.user.tag}`);

    } catch (err) {
        console.log(err);
    }

});

client.on(Events.InteractionCreate, async interaction => {

    // BOTÕES
    if (interaction.isButton()) {

        // REGISTRAR
        if (interaction.customId === 'registrar') {

            const modal = new ModalBuilder()
                .setCustomId('formRegistro')
                .setTitle('📋 Registro');

            const nome = new TextInputBuilder()
                .setCustomId('nome')
                .setLabel('Seu Nome')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const id = new TextInputBuilder()
                .setCustomId('idplayer')
                .setLabel('Seu ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const numero = new TextInputBuilder()
                .setCustomId('numero')
                .setLabel('Seu Número')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row1 = new ActionRowBuilder().addComponents(nome);
            const row2 = new ActionRowBuilder().addComponents(id);
            const row3 = new ActionRowBuilder().addComponents(numero);

            modal.addComponents(row1, row2, row3);

            await interaction.showModal(modal);
        }

        // ACEITAR
        if (interaction.customId.startsWith('aceitar_')) {

            try {

                const partes = interaction.message.embeds[0].fields;

                const nome = partes[0].value;
                const id = partes[1].value;

                const userId = interaction.customId.split('_')[1];

                const membro = await interaction.guild.members.fetch(userId);

                // MUDA NOME
                try {
                    await membro.setNickname(`[MEM] ${nome} | ${id}`);
                } catch {
                    console.log('Não consegui mudar nickname.');
                }

                // REMOVE CARGO REGISTRO
                await membro.roles.remove(CARGO_REGISTRO);

                // ADICIONA CARGO MEMBRO
                await membro.roles.add(CARGO_MEMBRO);

                await interaction.reply({
                    content: `✅ ${membro.user.tag} aprovado!`
                });

                await membro.send('✅ Seu registro foi aprovado!');

            } catch (err) {

                console.log(err);

                await interaction.reply({
                    content: '❌ Erro ao aprovar.',
                    ephemeral: true
                });

            }

        }

        // RECUSAR
        if (interaction.customId.startsWith('recusar_')) {

            const userId = interaction.customId.split('_')[1];

            const membro = await interaction.guild.members.fetch(userId);

            await interaction.reply({
                content: `❌ ${membro.user.tag} recusado!`
            });

            await membro.send('❌ Seu registro foi recusado.');

        }

    }

    // MODAL
    if (interaction.isModalSubmit()) {

        if (interaction.customId === 'formRegistro') {

            const nome = interaction.fields.getTextInputValue('nome');
            const id = interaction.fields.getTextInputValue('idplayer');
            const numero = interaction.fields.getTextInputValue('numero');

            const canalStaff = await client.channels.fetch(CANAL_APROVACAO);

            const embed = new EmbedBuilder()

                .setColor('#FFD700')

                .setAuthor({
                    name: 'Street • Sistema de Registro',
                    iconURL: 'https://i.imgur.com/AfFp7pu.png'
                })

                .setTitle('📋 Novo Registro')

                .setDescription(
`Um novo membro enviou um pedido de registro.`
                )

                .addFields(
                    { name: '👤 Nome', value: nome, inline: true },
                    { name: '🆔 ID', value: id, inline: true },
                    { name: '📱 Número', value: numero, inline: true },
                    { name: 'Discord', value: `${interaction.user}` }
                )

                .setFooter({
                    text: 'Sistema de Registro • Staff'
                })

                .setThumbnail('https://i.imgur.com/AfFp7pu.png');

            const aceitar = new ButtonBuilder()
                .setCustomId(`aceitar_${interaction.user.id}`)
                .setLabel('Aceitar')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅');

            const recusar = new ButtonBuilder()
                .setCustomId(`recusar_${interaction.user.id}`)
                .setLabel('Recusar')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌');

            const row = new ActionRowBuilder()
                .addComponents(aceitar, recusar);

            await canalStaff.send({
                embeds: [embed],
                components: [row]
            });

            await interaction.reply({
                content: '✅ Registro enviado para staff!',
                ephemeral: true
            });

        }

    }

});

client.login(TOKEN);