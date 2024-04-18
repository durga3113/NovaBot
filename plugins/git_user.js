const A = require('axios');

const C = async (D) => {
  try {
    const E = await Promise.all([
      A.get(`https://api.github.com/users/${D}`),
      A.get(`https://api.github.com/users/${D}/repos?per_page=1`)
    ]);
    return { userData: E[0].data, repoData: E[1].data };
  } catch (F) {
    console.error("An unexpected error occurred while fetching data:", F);
    return null;
  }
};

const G = (H) => {
  const { login, name, bio, followers, public_repos, following, blog, avatar_url } = H;
  return `
👤 *GitHub Profile*
Username: ${login}
Name: ${name || 'N/A'}
Bio: ${bio || 'N/A'}
Followers: ${followers}
Public Repos: ${public_repos}
Following: ${following}
Website: ${blog || 'N/A'}
`;
};

exports.default = {
  name: 'github',
  category: 'search',
  carryOut: async (nova, m, { react, args }) => {
    try {
      if (!args) {
        await react('❌');
        return m.reply(`Please provide a GitHub username.`);
      }

      await react('📊');

      const { userData, repoData } = await C(args);
      if (!userData) {
        await react('❌');
        return m.reply('Unable to fetch user data');
      }

      const K = G(userData);
      const L = repoData.map(M => M.name).join('\n');

      await nova.sendMessage(m.chat, { image: { url: userData.avatar_url, mimetype: 'image/jpeg' }, caption: K + '\n\n*Repositories:*\n' + L }, { quoted: m });
    } catch (N) {
      console.error("An error occurred:", N);
      await react('❌');
      return m.reply('An error occurred while processing the request');
    }
  }
};
            
