const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const themes = [
  { id: 'rain-bookstore', title: '雨夜书店', desc: '雨声、翻书声、暖灯书页', image: '/assets/theme-rain-bookstore.webp' },
  { id: 'cat-hotel', title: '猫咪旅馆', desc: '软垫、猫咪呼噜、温柔陪伴', image: '/assets/theme-cat-hotel.webp' },
  { id: 'underground-garden', title: '末日地下花园', desc: '大女主、无 CP、空间异能', image: '/assets/theme-underground-garden.webp' },
  { id: 'zodiac-office', title: '星座梦境管理局', desc: '十二星座、庇护所、视频分镜', image: '/assets/theme-zodiac-office.webp' },
  { id: 'night-store', title: '深夜便利店', desc: '夜灯、街角、低刺激治愈', image: '/assets/theme-night-store.webp' }
];

const gifts = [
  { id: 'starsea', title: '星海入梦礼盒', price: 129, image: '/assets/gift-starsea.webp' },
  { id: 'moonfairy', title: '月光童话礼盒', price: 169, image: '/assets/gift-moonfairy.webp' },
  { id: 'deepsea', title: '深海絮语礼盒', price: 199, image: '/assets/gift-deepsea.webp' }
];

app.get('/api/health', (_, res) => res.json({ ok: true, name: 'Dream Radio API v12' }));
app.get('/api/themes', (_, res) => res.json(themes));
app.get('/api/gifts', (_, res) => res.json(gifts));

app.post('/api/generate', (req, res) => {
  const body = req.body || {};
  const contentType = body.contentType || '末世小说';
  const theme = body.theme || (contentType === '十二星座视频' ? '星座梦境管理局' : '末日地下花园');
  const zodiacSign = body.zodiacSign || '双鱼座';
  const foundTheme = themes.find((item) => item.title === theme) || themes[2];
  const duration = Number(body.duration || 30);
  const endAfter = Number(body.endAfter || 30);
  const backgroundMusic = body.backgroundMusic || '空灵钢琴';

  const titles = {
    '末世小说': `${body.storyMode || '大女主'}末世：她把安全屋种成地下花园`,
    '十二星座视频': `${zodiacSign}进入你的${body.zodiacScene || '末日庇护所'}`,
    '睡前故事': `${theme}：今晚的故事已经准备好`,
    '白噪音声景': `${body.background || '雨声'}声景：慢慢把白天淡出`
  };

  const chapters = contentType === '十二星座视频'
    ? ['星座进入避难所', '选择你的安全屋', '今夜分镜脚本']
    : contentType === '末世小说'
      ? ['醒在地下花园', '安全屋初建', '月光下种第一株花']
      : ['抵达梦境入口', '声景渐入', '晚安淡出'];

  res.json({
    title: titles[contentType] || titles['睡前故事'],
    subtitle: contentType === '末世小说'
      ? `末世小说 · ${body.storyMode || '大女主'} · ${body.cpMode || '无 CP'} · ${body.power || '空间异能'}`
      : contentType === '十二星座视频'
        ? `十二星座视频 · ${zodiacSign} · ${body.zodiacScene || '末日庇护所'} · 口播文案 + 分镜脚本`
        : `${contentType} · ${body.voice || '温柔女声'} · ${body.background || '雨声'}`,
    cover: foundTheme.image,
    theme,
    contentType,
    mood: body.mood || '焦虑',
    voice: body.voice || '温柔女声',
    background: body.background || '雨声',
    backgroundMusic,
    musicVolume: Number(body.musicVolume || 45),
    duration,
    endAfter,
    progress: '02:34',
    total: `${String(duration).padStart(2, '0')}:45`,
    chapters: chapters.map((name, index) => ({ no: `0${index + 1}`, name, time: index === 0 ? '09:21' : index === 1 ? '09:48' : '09:36' }))
  });
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Dream Radio API running at http://localhost:${port}`));
