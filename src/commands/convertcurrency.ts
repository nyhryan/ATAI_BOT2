import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

const axios = require('axios').default;

interface Choices {
    name: string;
    value: string;
}

const choices: Choices[] = [
    { name: 'USA Dollar', value: 'USD' },
    { name: 'South Korea Won', value: 'KRW' },
    { name: 'Australian Dollar', value: 'AUD' },
    { name: 'Euro', value: 'EUR' },
    { name: 'Croatian Kuna', value: 'HRK' },
    { name: 'Indonesian Rupiah', value: 'IDR' },
    { name: 'Japanese Yen', value: 'JPY' },
    { name: 'Malaysian Ringgit', value: 'MYR' },
    { name: 'Zimbabwean Dollar', value: 'ZWL' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convertcurrency')
        .setDescription('It converts currencies!')
        .addStringOption((option) =>
            option
                .setName('cur1')
                .setDescription('from ?')
                .addChoices(...choices)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('cur2')
                .setDescription('to ?')
                .addChoices(...choices)
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('amount')
                .setDescription('How much do you want to convert?')
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const amount = interaction.options.getNumber('amount') ?? 1;

        const fromCurrency = interaction.options.getString('cur1') ?? 'USD';
        const toCurrency = interaction.options.getString('cur2') ?? 'USD';

        const fromDesc = (
            choices.find((i) => i.value === fromCurrency) as Choices
        ).name;
        const toDesc = (choices.find((i) => i.value === toCurrency) as Choices)
            .name;

        const requestURL = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`;

        const axiosGet = axios
            .get(requestURL)
            .then((res: any | undefined) => {
                const rate: number = res.data.info.rate;
                const returnCurrency = Math.round(amount * rate * 100) / 100;
                // const returnCurrency = amount * rate;
                // const roundUSD = Math.round(USD * 100) / 100;

                return returnCurrency;
            })
            .catch((err: Error) => {
                console.error(err);
            });

        const convertedAmount: number = await axiosGet;

        const fromAmount = amount.toLocaleString('en-US');
        const toAmount = convertedAmount.toLocaleString('en-US');

        const embedMessage = new MessageEmbed()
            .setColor('#00FFFF')
            .addFields(
                {
                    name: `${fromDesc}`,
                    value: `${fromCurrency} ${fromAmount}`,
                    inline: true,
                },
                { name: '➡', value: '\u200B', inline: true },
                {
                    name: `${toDesc}`,
                    value: `${toCurrency} ${toAmount}`,
                    inline: true,
                }
            );
        await interaction.reply({
            embeds: [embedMessage],
        });
    },
};
