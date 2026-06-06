import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const mainNav = [
  { key: 'home', label: '首页' },
  { key: 'studio', label: '梦境故事', tab: 'choose' },
  { key: 'store', label: '内容商店' },
  { key: 'sleep', label: '睡前播放' },
  { key: 'member', label: '会员' },
  { key: 'gift', label: '礼盒' },
  { key: 'dashboard', label: '数据看板' }
];

const fallbackThemes = [
  { id: 'rain-bookstore', title: '雨夜书店', desc: '雨声、翻书声、暖灯书页', image: '/assets/theme-rain-bookstore.webp', target: 'sleep' },
  { id: 'cat-hotel', title: '猫咪旅馆', desc: '软垫、猫咪呼噜、温柔陪伴', image: '/assets/theme-cat-hotel.webp', target: 'sleep' },
  { id: 'underground-garden', title: '末日地下花园', desc: '大女主、无 CP、空间异能', image: '/assets/theme-underground-garden.webp', target: 'studio', tab: 'apocalypse' },
  { id: 'zodiac-office', title: '星座梦境管理局', desc: '十二星座、庇护所、视频分镜', image: '/assets/theme-zodiac-office.webp', target: 'studio', tab: 'zodiac' },
  { id: 'night-store', title: '深夜便利店', desc: '夜灯、街角、睡前温和版治愈', image: '/assets/theme-night-store.webp', target: 'sleep' }
];

const fallbackGifts = [
  { id: 'starsea', title: '星海入梦礼盒', price: 129, image: '/assets/gift-starsea.webp', match: '星座梦境管理局', desc: '星座梦境卡、晚安内容兑换码、月光贴纸与睡前记录本。' },
  { id: 'moonfairy', title: '月光童话礼盒', price: 169, image: '/assets/gift-moonfairy.webp', match: '雨夜书店', desc: '睡前香薰、眼罩、月光明信片与雨夜书店会员音频包。' },
  { id: 'deepsea', title: '深海絮语礼盒', price: 199, image: '/assets/gift-deepsea.webp', match: '末日地下花园', desc: '安全感助眠包、主题卡册、限定内容兑换码与小夜灯。' }
];

const contentTypes = [
  { key: '末世小说', tab: 'apocalypse', desc: '大女主、CP、异能、篇幅与助眠强度可定制', cover: '/assets/theme-underground-garden.webp' },
  { key: '十二星座视频', tab: 'zodiac', desc: '星座选择庇护所、梦境房间，生成口播与分镜', cover: '/assets/theme-zodiac-office.webp' },
  { key: '睡前故事', tab: 'story', desc: '雨夜书店、猫咪旅馆、深夜便利店等睡前温和版故事', cover: '/assets/theme-rain-bookstore.webp' },
  { key: '白噪音声景', tab: 'soundscape', desc: '雨声、海浪、壁炉、翻书声，配合定时淡出', cover: '/assets/theme-cat-hotel.webp' }
];

const digitalProducts = [
  { id: 'pack-apocalypse', type: '内容包', scene: 'apocalypse', title: '《末世重生：她靠空间异能养活整座安全屋》10 集', price: 12.9, oldPrice: 19.9, cover: '/assets/theme-underground-garden.webp', desc: '大女主、空间异能、囤货经营，前 3 集免费，第 4–10 集解锁。', badge: '限时小内容包', benefits: ['10 集连续剧', '睡前温和版睡前版', '空间能力设定库'] },
  { id: 'pack-zodiac', type: '内容包', scene: 'zodiac', title: '十二星座末日庇护所视频脚本包', price: 9.9, oldPrice: 15.9, cover: '/assets/theme-zodiac-office.webp', desc: '一次生成 12 个星座庇护所分镜、口播文案和封面标题。', badge: '视频脚本包', benefits: ['12 星座分镜', '口播文案', '封面标题'] },
  { id: 'pack-story', type: '内容包', scene: 'story', title: '雨夜书店晚安故事包', price: 6.9, oldPrice: 12.9, cover: '/assets/theme-rain-bookstore.webp', desc: '7 晚连续睡前故事，配合雨声、翻书声和温柔旁白。', badge: '晚安故事包', benefits: ['7 晚故事', '温柔声线', '睡前情绪适配'] },
  { id: 'pack-soundscape', type: '内容包', scene: 'soundscape', title: '白噪音高级混音包', price: 4.9, oldPrice: 8.9, cover: '/assets/theme-cat-hotel.webp', desc: '雨声、海浪、壁炉、猫咪呼噜，支持定时淡出与混音比例保存。', badge: '声景混音包', benefits: ['高级白噪音', '混音保存', '定时淡出'] },
  { id: 'pack-exam', type: '内容包', scene: 'story', title: '考前放松睡前包', price: 9.9, oldPrice: 16.9, cover: '/assets/theme-night-store.webp', desc: '适合期末、考研、论文焦虑，降低信息刺激，帮助睡前切换状态。', badge: '场景包', benefits: ['考前焦虑', '睡前温和版故事', '20 分钟淡出'] },
  { id: 'pack-alone', type: '内容包', scene: 'apocalypse', title: '独居女生安全感音频包', price: 12.9, oldPrice: 19.9, cover: '/assets/theme-cat-hotel.webp', desc: '安全屋、猫咪、雨夜、电台陪伴，适合独居夜晚和睡前放松。', badge: '安全感包', benefits: ['安全屋世界观', '猫咪陪伴', '晚安电台'] }
];

const memberProducts = {
  apocalypse: { id: 'vip-apocalypse', type: '会员', title: '末世连续剧会员 · 年卡', price: 128, cover: '/assets/theme-underground-garden.webp', desc: '解锁 90 分钟长音频、安全屋系列追更和能力设定库。' },
  zodiac: { id: 'vip-zodiac', type: '会员', title: '星座视频创作会员 · 年卡', price: 168, cover: '/assets/theme-zodiac-office.webp', desc: '解锁十二星座分镜导出、封面标题库和批量生成。' },
  story: { id: 'vip-story', type: '会员', title: '晚安故事会员 · 年卡', price: 98, cover: '/assets/theme-rain-bookstore.webp', desc: '解锁高级声线、雨夜书店追更和情绪适配报告。' },
  soundscape: { id: 'vip-soundscape', type: '会员', title: '白噪音声景会员 · 年卡', price: 88, cover: '/assets/theme-cat-hotel.webp', desc: '解锁高品质环境音、混音保存和整夜循环淡出。' }
};

function toCartItem(item, quantity = 1) {
  return {
    id: item.id,
    type: item.type || '商品',
    title: item.title,
    price: Number(item.price),
    cover: item.cover || item.image || '/assets/theme-rain-bookstore.webp',
    desc: item.desc || '',
    quantity
  };
}

const musicOptions = ['无背景音乐', '空灵钢琴', '雨夜钢琴', '低频氛围', '星空八音盒', '轻柔弦乐', 'Lo-fi 慢拍'];
const bgs = ['雨声', '海浪', '壁炉', '猫咪呼噜', '深夜城市', '翻书声'];
const voices = ['温柔女声', '姐姐声线', '广播电台', '低沉男声'];
const timers = [10, 15, 20, 30, 45, 60, 90, 120];
const sceneBackgrounds = {
  apocalypse: { key: 'apocalypse', label: '末世小说', image: '/assets/bg-apocalypse-scene.png' },
  zodiac: { key: 'zodiac', label: '十二星座视频', image: '/assets/bg-zodiac-scene.png' },
  story: { key: 'story', label: '睡前故事', image: '/assets/bg-story-scene.png' },
  soundscape: { key: 'soundscape', label: '白噪音声景', image: '/assets/bg-soundscape-scene.png' }
};

const contentConfigs = {
  apocalypse: {
    scene: 'apocalypse',
    label: '末世小说',
    cover: '/assets/theme-underground-garden.webp',
    accent: 'apocalypse',
    badge: '废墟生存 / 安全屋 / 荧光植物',
    previewTitle: '末世重生',
    previewDesc: '她重回末世前三天，清空银行卡囤满空间，用一座地下安全屋养活了所有愿意相信她的人。',
    previewFine: '适合大女主、无 CP、空间异能、囤货经营与安全屋群像；推荐连续剧追更与安全感礼盒。',
    buttonLabel: '生成末世章节',
    resultReason: '系统降低了高强度冲突，把废墟、温室、储物空间与植物生长写成更安静的睡前版本。',
    quote: '上一世她救错了人，这一世，她只救值得活下去的人。',
    chips: ['末世声景', '安全屋氛围', '睡前温和版成长'],
    chapters: [{ no: '01', name: '重回末世前三天', time: '09:21' },{ no: '02', name: '空间仓库第一次开启', time: '09:48' },{ no: '03', name: '安全屋收留第一批人', time: '09:36' }],
    sleepTitle: '今晚为你准备的内容',
    sleepHint: '重生、囤货、空间异能与安全屋经营，会在睡前温和版版本里慢慢淡出。',
    detailTitle: '主角设定',
    detailText: '世界观：末日地下花园\n主角特质：冷静、成长、治愈\n本集氛围：睡前温和版，适合睡前',
    companionTitle: '今晚会听到'
  },
  zodiac: {
    scene: 'zodiac',
    label: '十二星座视频',
    cover: '/assets/theme-zodiac-office.webp',
    accent: 'zodiac',
    badge: '星座梦境 / 分镜脚本 / 宇宙场景',
    previewTitle: '星座梦境管理局',
    previewDesc: '把十二星座放进同一片星穹：有人住进玻璃穹顶，有人守着月光塔楼，也有人拥有海上庇护所。',
    previewFine: '适合生成口播文案、分镜脚本、封面标题；推荐星海入梦礼盒。',
    buttonLabel: '生成星座脚本',
    resultReason: '系统会根据星座氛围、庇护所类型与视频想要什么成品，为你生成更适合传播的镜头与文案节奏。',
    quote: '当十二种性格住进同一片星空，每个梦境都会有自己的光。',
    chips: ['星空镜头', '分镜脚本', '口播文案'],
    chapters: [{ no: '01', name: '开头怎么抓人：选择你的庇护所', time: '00:18' },{ no: '02', name: '星座怎么分组与场景切换', time: '00:31' },{ no: '03', name: '月光收束与结尾文案', time: '00:22' }],
    sleepTitle: '为你生成的今夜视频脚本',
    sleepHint: '这一版分镜更强调星空、月光与梦境房间的视觉连续性。',
    detailTitle: '分镜设定',
    detailText: '视觉世界：星座梦境管理局\n输出重点：口播、分镜、封面文案\n本集氛围：华丽梦幻，适合短视频',
    companionTitle: '今夜分镜'
  },
  story: {
    scene: 'story',
    label: '睡前故事',
    cover: '/assets/theme-rain-bookstore.webp',
    accent: 'story',
    badge: '雨夜书店 / 睡前温和版叙事 / 温柔陪伴',
    previewTitle: '雨夜书店',
    previewDesc: '雨滴落在窗面上，书页轻轻翻过，你在书灯和暖雾里，慢慢把白天的情绪放下。',
    previewFine: '适合焦虑、疲惫、孤独等夜晚情绪；推荐月光童话礼盒与连续剧式追更。',
    buttonLabel: '生成晚安故事',
    resultReason: '系统保留暖灯、翻书声、雨夜与陪伴感，减少反转和刺激，帮助大脑慢慢进入休息状态。',
    quote: '今晚没有必须完成的事情，只有一页一页慢慢翻过去的雨夜。',
    chips: ['温柔旁白', '雨夜环境音', '陪伴式叙事'],
    chapters: [{ no: '01', name: '晚安前的最后一盏灯', time: '08:42' },{ no: '02', name: '雨声落在窗边', time: '09:06' },{ no: '03', name: '故事慢慢淡出', time: '08:57' }],
    sleepTitle: '为你生成的今夜故事',
    sleepHint: '睡前温和版睡前故事已经准备好，旁白会在结尾慢慢变轻。',
    detailTitle: '主角设定',
    detailText: '故事发生地：雨夜书店\n旁白风格：温柔、缓慢、陪伴\n本集氛围：适合焦虑与疲惫的夜晚',
    companionTitle: '今夜陪伴'
  },
  soundscape: {
    scene: 'soundscape',
    label: '白噪音声景',
    cover: '/assets/theme-cat-hotel.webp',
    accent: 'soundscape',
    badge: '环境声景 / 定时淡出 / 纯陪伴',
    previewTitle: '月光白噪音电台',
    previewDesc: '把雨声、海浪、壁炉与轻音乐慢慢混进夜色里，只保留最安静的环境陪伴。',
    previewFine: '适合直接入睡、冥想放空或专注休息；推荐深海絮语礼盒。',
    buttonLabel: '生成声景组合',
    resultReason: '系统会根据你选择的环境音、背景音乐和多久后停时间，生成更适合入睡节奏的声景组合。',
    quote: '有时陪你入睡的，不必是一段故事，只要是刚刚好的夜晚声音。',
    chips: ['雨声 / 海浪', '定时淡出', '低干扰循环'],
    chapters: [{ no: '01', name: '环境声进入', time: '10:00' },{ no: '02', name: '音量稳定循环', time: '10:00' },{ no: '03', name: '逐渐淡出停止', time: '10:00' }],
    sleepTitle: '为你生成的今夜声景',
    sleepHint: '环境声景已准备好，会在设定时间后自然淡出。',
    detailTitle: '声景设定',
    detailText: '环境音：雨声、海浪、壁炉等\n播放方式：循环、睡前温和版、自动淡出\n本集氛围：适合直接入睡或放空',
    companionTitle: '今夜声景'
  }
};

function getConfigByTab(tab) {
  return contentConfigs[inferSceneByTab(tab)] || contentConfigs.story;
}

function getConfigByTrack(track) {
  return contentConfigs[inferSceneByTrack(track)] || contentConfigs.story;
}

function normalizeSetting(input) {
  return (input || '').trim().replace(/\s+/g, ' ');
}

function generateStoryTitle(contentType, theme, form, cfg) {
  const custom = normalizeSetting(form.customSetting);
  if (custom && contentType !== '白噪音声景') {
    if (/末世|重生|空间|安全屋|囤货|异能/.test(custom)) return `《${custom.replace(/[。！？!?]$/,'')}》`;
    if (/星座|庇护所|房间|视频|分镜/.test(custom)) return `《${custom.replace(/[。！？!?]$/,'')}》`;
    return `《${theme}：${custom.slice(0, 22)}》`;
  }
  return `${theme}：今夜内容已经生成`;
}

function buildFullStory(contentType, theme, form, cfg) {
  const custom = normalizeSetting(form.customSetting);
  const mustHave = normalizeSetting(form.mustHave);
  const avoid = normalizeSetting(form.avoidElements);
  const pov = form.pov || '第三人称';
  const density = form.dramaLevel || '有点狗血';
  const ending = form.endingStyle || '留悬念';
  const baseSetting = custom || `${theme}，${form.storyMode || '大女主'}，${form.power || '空间异能'}，${form.tone || '睡前温和版'}`;

  if (contentType === '十二星座视频') {
    return `【用户设定】${baseSetting}

【视频标题】
如果末日突然来临，十二星座会住进哪一种庇护所？

【开场 0–5 秒】
镜头从一片紫蓝色星空切入，旁白压低声音：如果只剩最后一座庇护所，你的星座，会选择躲进哪里？

【主体分镜】
1. 火象星座住进高塔型庇护所，外墙是防爆玻璃，内部有训练室和燃烧的壁炉。
2. 土象星座选择地下仓库，物资按月份分类，墙面贴着详细的生存计划。
3. 风象星座住在漂浮通讯站，靠无线电联系幸存者，用情报换取物资。
4. 水象星座住进海边疗愈屋，潮汐声、月光和药草温室构成最安静的安全区。

【必加元素】${mustHave || '星盘、月光、末日庇护所、选择感'}
【规避元素】${avoid || '过强血腥、过度惊吓'}
【结尾】
旁白收束：你以为星座决定性格，但在末日里，它也可能决定你活下去的方式。`;
  }

  if (contentType === '白噪音声景') {
    return `【声景设定】${baseSetting}

今晚的声景由三层组成：第一层是很轻的${form.background || '雨声'}，像远处玻璃窗上慢慢滑落的水痕；第二层是${form.backgroundMusic || '空灵钢琴'}，只保留低频和尾音，不打扰入睡；第三层是几乎听不见的环境底噪，让房间不再显得空。

【播放结构】
0–5 分钟：环境音逐渐进入，音量从 20% 缓慢升到 ${form.musicVolume || 60}%。
5–20 分钟：保持稳定循环，减少突兀变化。
最后 5 分钟：自动降低高频，进入淡出，${form.endAfter || 30} 分钟后停止播放。

【适配说明】
适合不想听完整故事，只需要一点夜晚陪伴的人。`;
  }

  if (contentType === '睡前故事') {
    return `【用户设定】${baseSetting}

【完整故事】
雨夜书店快打烊时，门口的风铃忽然响了一下。

她抬头，看见一个浑身湿透的女孩站在门边，手里攥着一张被雨水泡皱的纸条。纸条上只有一句话：今晚不要一个人回家。

书店老板没有追问，只把最靠窗的位置留给她，又推过去一杯热牛奶。雨落在玻璃上，像无数细小的白噪音，把白天那些来不及说出口的委屈，一点一点盖住。

女孩说，她今天很累，累到连解释都不想解释。老板只是翻开一本旧书，说：“那今晚不讲道理，我们只讲一个能让人慢慢睡着的故事。”

故事里有一间永远亮着灯的书店，有一只会在客人难过时跳上膝盖的猫，还有一张不会催促任何人的沙发。每一个走进来的人，都可以暂时把自己的烦恼放在门口的伞架里。

到了最后，雨声变小，女孩也终于困了。她发现纸条背面还有一行字：你不用马上变好，今晚先睡一觉。

【必加元素】${mustHave || '雨声、暖灯、书店、被接住的情绪'}
【规避元素】${avoid || '强冲突、惊吓、过快反转'}
【结尾方式】${ending}`;
  }

  return `【用户设定】${baseSetting}

【完整故事】
末世爆发的前三天，林栖从一场噩梦里惊醒。

上一世，她把最后一箱药让给了前男友，把安全屋的密码告诉了所谓的朋友，结果在极寒来临的第七夜，被他们锁在门外。她死前看见仓库的灯还亮着，里面的人吃着她囤下的食物，却没有一个人回头。

这一世，她醒来时，手机屏幕上显示距离全球停电还有七十二小时。

林栖没有哭，也没有去找任何人解释。她先卖掉婚房，把账户里的钱全部转出来，然后去了最大的仓储市场。压缩饼干、净水片、抗生素、柴油发电机、太阳能板、种子、营养土、猫粮、常用药，她一车一车地买，直到老板忍不住问她是不是要开超市。

她只说：“开一座安全屋。”

第三天夜里，第一场黑雨落下。城市停电，通讯中断，街道上开始出现尖叫声。也是在那一刻，林栖第一次打开了空间异能。她的掌心浮出一扇透明的门，门后是整整齐齐的仓库，货架一排排延伸到看不见的尽头。

前男友打来电话时，声音发抖：“林栖，我知道你家里有物资。我们以前毕竟在一起过，你不能见死不救。”

林栖站在地下安全屋的监控屏前，看着他和那群曾经背叛她的人挤在铁门外。门内，发电机低声运转，净水系统亮着蓝光，育苗架上的第一批蔬菜刚冒出嫩芽。

她按下通话键，语气很平静：“上一世，我救过你们。”

电话那头安静了一秒。

“所以这一世，”她说，“我只救值得活下去的人。”

当天晚上，她收留了第一个人。那是住在楼下的单亲妈妈，怀里抱着发烧的孩子，手里却还攥着半包退烧药，说愿意用药换一杯热水。林栖打开门，让她们进来，又把安全屋规则贴在墙上：不背叛，不抢夺，不浪费，不伤害弱者。

后来，安全屋里的人越来越多。有人会修电路，有人懂种植，有人会做饭，也有人只会在夜里给孩子们讲故事。但每个人都要劳动，每个人都要守规矩。

三个月后，外面的城市变成废墟，林栖的地下安全屋却亮着灯。空间仓库里的物资没有被挥霍，而是变成了药房、厨房、温室和一间小小的图书角。

她终于明白，所谓空间异能，不只是让她囤满货架。它真正给她的，是重新选择谁能进入自己世界的权利。

【必加元素】${mustHave || '重生、空间仓库、囤货、安全屋规则、打脸前男友'}
【规避元素】${avoid || '过度血腥、强恐怖描写'}
【叙事视角】${pov}
【狗血程度】${density}
【结尾方式】${ending}`;
}

function buildFallbackTrack(contentType, theme, form) {
  const scene = inferSceneByTrack({ contentType, theme, title: theme });
  const cfg = contentConfigs[scene] || contentConfigs.story;
  const title = generateStoryTitle(contentType, theme, form, cfg);
  const fullStory = buildFullStory(contentType, theme, form, cfg);
  return {
    title,
    subtitle: `${contentType} · ${form.voice || cfg.label} · ${form.backgroundMusic}`,
    cover: cfg.cover,
    theme,
    contentType,
    progress: scene === 'zodiac' ? '00:18' : '02:34',
    total: scene === 'zodiac' ? '01:11' : `${form.endAfter}:45`,
    chapters: cfg.chapters,
    fullStory,
    userSetting: normalizeSetting(form.customSetting),
    mustHave: normalizeSetting(form.mustHave),
    avoidElements: normalizeSetting(form.avoidElements)
  };
}

function inferSceneByTab(tab) {
  if (tab === 'apocalypse') return 'apocalypse';
  if (tab === 'zodiac') return 'zodiac';
  if (tab === 'soundscape') return 'soundscape';
  return 'story';
}

function inferSceneByTrack(track) {
  const type = `${track?.contentType || ''}${track?.theme || ''}${track?.title || ''}`;
  if (/末世|末日|地下花园/.test(type)) return 'apocalypse';
  if (/星座|梦境管理局|双鱼/.test(type)) return 'zodiac';
  if (/白噪|声景|海浪|雨声|壁炉/.test(type)) return 'soundscape';
  return 'story';
}

function SceneBackdrop({ scene = 'story' }) {
  const meta = sceneBackgrounds[scene] || sceneBackgrounds.story;
  return <div className={`scene-backdrop scene-${scene}`} aria-hidden>
    <img src={meta.image} alt="" />
    <div className="scene-overlay" />
    <div className="scene-glow" />
  </div>;
}


function Brand({ setPage }) {
  return <button className="brand" onClick={() => setPage('home')}>
    <span className="brand-mark">☾</span>
    <span><b>梦境电台</b><small>Dream Radio</small></span>
  </button>;
}

function TopNav({ page, setPage, setStudioTab, cartCount = 0 }) {
  const handleNav = (item) => {
    if (item.tab) {
      setStudioTab(item.tab);
      setPage(item.key);
      return;
    }
    if (item.anchor) {
      setPage(item.key);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(item.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      return;
    }
    setPage(item.key);
  };

  return <header className="topnav homepage-nav">
    <Brand setPage={setPage} />
    <nav>
      {mainNav.map((item, index) => <button key={`${item.key}-${index}`} onClick={() => handleNav(item)} className={page === item.key && !item.anchor ? 'active' : ''}>{item.label}</button>)}
    </nav>
    <div className="auth-actions">
      <button className="nav-login">登录</button>
      <button className="nav-register" onClick={() => setPage('cart')}>购物车 {cartCount > 0 ? `· ${cartCount}` : ''}</button>
    </div>
  </header>;
}

function Wave({ count = 72 }) {
  const bars = useMemo(() => Array.from({ length: count }, (_, i) => Math.round(18 + Math.abs(Math.sin(i * 0.61)) * 48 + (i % 5) * 2)), [count]);
  return <div className="wave" aria-hidden>{bars.map((h, i) => <i key={i} style={{ height: `${h}%`, opacity: 0.38 + (i % 7) * 0.07 }} />)}</div>;
}

function Panel({ children, className = '' }) { return <section className={`panel ${className}`}>{children}</section>; }
function SectionHeader({ kicker, title, desc }) { return <div className="section-title">{kicker && <span>{kicker}</span>}<h1>{title}</h1>{desc && <p>{desc}</p>}</div>; }
function Field({ label, children }) { return <div className="field"><label>{label}</label>{children}</div>; }
function Segment({ values, value, onChange }) { return <div className="segment">{values.map((v) => <button key={v} className={value === v ? 'active' : ''} onClick={() => onChange(v)}>{v}</button>)}</div>; }

function HomePage({ setPage, setStudioTab, themes }) {
  const flow = [
    { icon: '◫', title: '先听 3 分钟', desc: '先试试看合不合耳朵' },
    { icon: '☷', title: '继续生成完整版', desc: '标题、章节、声音一起配好' },
    { icon: '✦', title: '买一个内容包', desc: '单集、系列、脚本都可以' },
    { icon: '◔', title: '想多听就开会员', desc: '追更、长音频、批量生成' },
    { icon: '⌘', title: '顺手看看同款礼盒', desc: '把喜欢的世界带回现实' }
  ];
  const reasons = [
    ['✦', '按你的想法来写', '你写下想看的设定，它会帮你整理成更适合睡前听的故事。'],
    ['☾', '听起来不吵，慢慢放松', '雨声、钢琴、旁白都可以调，不用一直盯着屏幕。'],
    ['◌', '不止一种晚安方式', '想听小说、看星座脑洞，或者只放一点白噪音，都可以。']
  ];
  const appCards = [
    { title: '欢迎页', subtitle: '欢迎来到梦境电台', image: '/assets/hero-window.webp', tone: 'moon' },
    { title: '首页推荐', subtitle: '今晚先从哪种梦境开始', image: '/assets/theme-rain-bookstore.webp', tone: 'story' },
    { title: '生成页', subtitle: '选择情绪、主题、声线和时长', image: '/assets/bg-zodiac-scene.png', tone: 'zodiac' },
    { title: '播放页', subtitle: '沉浸睡眠模式与晚安播放器', image: '/assets/bg-story-scene.png', tone: 'sleep' }
  ];
  return <main className="page home-page refined-home">
    <Panel className="home-hero refined-hero">
      <img className="home-bg" src="/assets/hero-window.webp" alt="月夜窗景" />
      <div className="home-shade" />
      <div className="hero-copy refined-copy">
        <span className="hero-kicker">专属于你的睡前内容小店</span>
        <h1>把你的睡前幻想，<br />写成今晚的晚安故事 ✦</h1>
        <p>写下一个脑洞，梦境电台会把它变成适合睡前听的故事、音频或星座脚本。喜欢这个世界，再慢慢解锁完整系列、会员或同主题礼盒。</p>
        <div className="hero-actions"><button className="primary" onClick={() => setPage('studio')}>开始做我的晚安内容</button><button className="secondary" onClick={() => setPage('store')}>看看内容小店</button></div>
        <div className="trust-strip">
          <span className="trust-pill">把脑洞写进去</span>
          <span className="trust-pill">看看我的星座庇护所</span>
          <span className="trust-pill">喜欢再慢慢解锁</span>
        </div>
      </div>
      <div className="hero-card refined-card glass-card">
        <small>正在把你的设定写成故事</small>
        <h3 className="hero-card-title">末世重生：<br />她靠空间异能养活整座安全屋</h3>
        <p>末世 · 大女主 · 空间异能 · 囤货建家</p>
        <Wave count={30} />
        <span className="generate-progress">生成中 · 28%</span>
      </div>
      <img className="hero-headphones" src="/assets/headphones.webp" alt="月光耳机" />
    </Panel>

    <section className="flow-strip refined-flow">
      {flow.map((item, idx) => <div key={item.title} className="flow-step refined-step">
        <div className="flow-icon">{item.icon}</div>
        <div className="flow-copy"><h3>{item.title}</h3><p>{item.desc}</p></div>
        {idx < flow.length - 1 && <span className="flow-arrow">→</span>}
      </div>)}
    </section>

    <section className="home-section theme-section">
      <div className="home-section-head">
        <h2>今晚大家在听什么</h2>
        <button onClick={() => setPage('studio')}>查看更多 ›</button>
      </div>
      <div className="theme-grid-home">
        {themes.slice(0, 5).map((t) => <button key={t.id} className="theme-card-home" onClick={() => { if (t.tab) setStudioTab(t.tab); setPage(t.target || 'sleep'); }}>
          <img src={t.image} alt="" />
          <div className="theme-card-overlay"><h3>{t.title}</h3><p>{t.desc}</p><span className="play-mini">▶</span></div>
        </button>)}
      </div>
    </section>


    <section className="home-section store-entry-home">
      <div className="home-section-head">
        <h2>内容小店</h2>
        <button onClick={() => setPage('store')}>进店看看 ›</button>
      </div>
      <div className="store-entry-panel panel">
        <div className="store-entry-copy">
          <span className="pill gold">Digital Content Store</span>
          <h3>先听一小段，喜欢再买完整版</h3>
          <p>不想马上开会员也没关系。你可以先买一个 4.9–12.9 元的小内容包，听完再决定要不要追更。</p>
          <div className="store-price-strip">
            <span>雨夜故事包 ¥6.9</span>
            <span>星座脚本包 ¥9.9</span>
            <span>末世小说 10 集 ¥12.9</span>
          </div>
        </div>
        <div className="store-entry-products">
          {digitalProducts.slice(0, 3).map((p) => <button key={p.id} className={`store-entry-card ${p.scene}`} onClick={() => setPage('store')}>
            <img src={p.cover} alt="" />
            <div><b>{p.title}</b><span>¥ {p.price}</span></div>
          </button>)}
        </div>
      </div>
    </section>

    <section className="home-section app-preview-home" id="app-showcase">
      <div className="home-section-head">
        <h2>移动端体验</h2>
        <button onClick={() => setPage('sleep')}>查看沉浸播放 ›</button>
      </div>
      <div className="app-preview-layout">
        <div className="app-preview-copy">
          <span className="pill gold">Dream Radio App</span>
          <h3>移动端延续同一套夜间视觉</h3>
          <p>展示欢迎页、生成页和沉浸播放页，说明网站与 App 是同一套产品体验。</p>
          <div className="app-preview-actions">
            <button className="primary" onClick={() => setPage('studio')}>体验生成流程</button>
            <button className="secondary" onClick={() => setPage('gift')}>查看礼盒联动</button>
          </div>
        </div>
        <div className="phone-preview-grid">
          {appCards.map((card) => <article className={`phone-preview ${card.tone}`} key={card.title}>
            <div className="phone-preview-status"><span>9:41</span><span>◐ ◐ ◐</span></div>
            <div className="phone-preview-screen">
              <img src={card.image} alt="" />
              <div className="phone-preview-overlay" />
              <div className="phone-preview-content">
                <small>{card.title}</small>
                <h4>{card.subtitle}</h4>
                <Wave count={24} />
              </div>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="home-section reason-section">
      <h2>为什么睡前适合用它</h2>
      <div className="reason-grid">
        {reasons.map(([icon, title, desc]) => <div className="reason-card" key={title}><div className="reason-icon">{icon}</div><div><h3>{title}</h3><p>{desc}</p></div></div>)}
      </div>
    </section>

    <section className="home-cta-bar panel">
      <div className="cta-copy">
        <h2>今晚，就从一个小脑洞开始</h2>
        <p>先生成一段试听。喜欢这个世界，再买完整内容包、开会员，或者看看同主题礼盒。</p>
      </div>
      <div className="cta-actions">
        <button className="primary" onClick={() => setPage('studio')}>开始做我的晚安内容</button>
        <button className="secondary" onClick={() => setPage('store')}>买一个内容包</button>
      </div>
    </section>

    <footer className="site-footer">
      <div className="footer-brand"><span className="brand-mark">☾</span><div><b>梦境电台</b><small>DREAM RADIO</small></div></div>
      <div className="footer-links"><a>关于我们</a><a>帮助中心</a><a>服务条款</a><a>隐私政策</a><a>联系我们</a><a>加入我们</a></div>
      <div className="footer-meta">© 2024 梦境电台 Dream Radio. All Rights Reserved.</div>
    </footer>
  </main>;
}

function StudioPage({ tab, setTab, form, setForm, generate, setPage }) {
  const scene = inferSceneByTab(tab);
  const sceneMeta = sceneBackgrounds[scene];
  return <main className={`page themed-page scene-page scene-${scene}`}>
    <SceneBackdrop scene={scene} />
    <div className="scene-content">
      <SectionHeader kicker={`02 创作中心 · ${sceneMeta.label}`} title="今晚想把哪种幻想做成晚安内容" desc="不同内容类型会进入不同的梦境场景：末世废墟、星座星穹、温柔雨夜和月光白噪音。" />
      <div className="studio-tabs">
        <button className={tab === 'choose' ? 'active' : ''} onClick={() => setTab('choose')}>先选类型</button>
        {contentTypes.map((item) => <button key={item.tab} className={tab === item.tab ? 'active' : ''} onClick={() => setTab(item.tab)}>{item.key}</button>)}
      </div>
      {tab === 'choose' && <ContentChooser setTab={setTab} />}
      {tab === 'apocalypse' && <ApocalypseDesigner form={form} setForm={setForm} generate={generate} />}
      {tab === 'zodiac' && <ZodiacDesigner form={form} setForm={setForm} generate={generate} />}
      {tab === 'story' && <StoryDesigner form={form} setForm={setForm} generate={generate} />}
      {tab === 'soundscape' && <SoundscapeDesigner form={form} setForm={setForm} generate={generate} setPage={setPage} />}
    </div>
  </main>;
}

function ContentChooser({ setTab }) {
  return <div className="choose-grid">
    {contentTypes.map((type) => { const cfg = getConfigByTab(type.tab); return <button key={type.key} className={`content-card ${cfg.accent}`} onClick={() => setTab(type.tab)}>
      <img src={type.cover} alt="" />
      <div><label>{cfg.badge}</label><h2>{type.key}</h2><p>{type.desc}</p><span>{cfg.buttonLabel} →</span></div>
    </button>; })}
  </div>;
}

function ApocalypseDesigner({ form, setForm, generate }) {
  return <div className="form-layout">
    <Panel className="form-panel">
      <Field label="主角设定"><Segment values={['大女主', '群像生存', '经营囤货']} value={form.storyMode} onChange={(v) => setForm({ storyMode: v })} /></Field>
      <Field label="感情线"><Segment values={['无 CP', '有 CP']} value={form.cpMode} onChange={(v) => setForm({ cpMode: v })} /></Field>
      <Field label="能力设定"><Segment values={['空间异能', '治愈系异能', '植物操控', '预知梦境', '时间回溯']} value={form.power} onChange={(v) => setForm({ power: v })} /></Field>
      <Field label="故事味道"><Segment values={['热血', '治愈', '睡前温和版', '成长']} value={form.tone} onChange={(v) => setForm({ tone: v })} /></Field>
      <Field label="长度"><Segment values={['短篇', '中篇', '长篇']} value={form.length} onChange={(v) => setForm({ length: v })} /></Field>
      <div className="friendly-hint">不用写得很完整，像发弹幕一样写设定就行。</div><div className="friendly-hint">写一句今晚想听的故事，我们帮你整理成更完整的版本。</div><Field label="你想看的脑洞"><textarea className="setting-input" value={form.customSetting} onChange={(e) => setForm({ customSetting: e.target.value })} placeholder="例如：女主重生回末世前三天，觉醒空间异能，开始囤货建安全屋。前男友后来带着白月光来求收留，但她这次不心软。" /></Field>
      <div className="two-field-grid">
        <Field label="一定要有"><input className="text-input" value={form.mustHave} onChange={(e) => setForm({ mustHave: e.target.value })} placeholder="空间仓库、囤货、打脸、收留孩子" /></Field>
        <Field label="尽量不要"><input className="text-input" value={form.avoidElements} onChange={(e) => setForm({ avoidElements: e.target.value })} placeholder="血腥、惊吓、虐女主" /></Field>
      </div>
      <Field label="爽感程度"><Segment values={['睡前温和版', '有点狗血', '爽文拉满']} value={form.dramaLevel} onChange={(v) => setForm({ dramaLevel: v })} /></Field>
      <button className="primary wide tone-apocalypse" onClick={() => generate('末世小说', form.customSetting || '末日地下花园')}>按这个脑洞写完整故事</button>
    </Panel>
    <Panel className="preview-panel accent-card apocalypse">
      <img src="/assets/theme-underground-garden.webp" alt="" />
      <div className="preview-copy"><label>{contentConfigs.apocalypse.badge}</label><h2>{contentConfigs.apocalypse.previewTitle}</h2><p>{contentConfigs.apocalypse.previewDesc}</p><p className="fine-print">{contentConfigs.apocalypse.previewFine}</p></div>
    </Panel>
  </div>;
}

function ZodiacDesigner({ form, setForm, generate }) {
  return <div className="zodiac-layout">
    <Panel className="zodiac-panel">
      <Field label="视频主题"><Segment values={['末日庇护所', '极寒避难屋', '洪水海上基地', '专属梦境房间']} value={form.zodiacScene} onChange={(v) => setForm({ zodiacScene: v })} /></Field>
      <Field label="星座氛围"><div className="zodiac-icons">{['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'].map((z) => <button key={z} className={form.zodiacSign === z ? 'active' : ''} onClick={() => setForm({ zodiacSign: z })}>{z}</button>)}</div></Field>
      <Field label="想要什么成品"><Segment values={['口播文案', '分镜脚本', '视频标题', '封面文案']} value={form.videoOutput} onChange={(v) => setForm({ videoOutput: v })} /></Field>
      <button className="primary wide tone-zodiac" onClick={() => generate('十二星座视频', '星座梦境管理局')}>{contentConfigs.zodiac.buttonLabel}</button>
    </Panel>
    <Panel className="script-preview accent-card zodiac">
      <label>{contentConfigs.zodiac.badge}</label><h2>视频可以这样拍</h2><ol><li><b>开头怎么抓人</b><span>如果末世突然来临，你的星座会住进哪一种庇护所？</span></li><li><b>星座怎么分组</b><span>火象、土象、风象、水象分别进入不同安全屋。</span></li><li><b>画面怎么展开</b><span>慢镜头、月光、低饱和蓝紫色、柔和旁白。</span></li></ol>
    </Panel>
  </div>;
}

function StoryDesigner({ form, setForm, generate }) {
  return <div className="form-layout">
    <Panel className="form-panel">
      <Field label="故事发生地"><Segment values={['雨夜书店', '猫咪旅馆', '深夜便利店', '海边小镇来信']} value={form.theme} onChange={(v) => setForm({ theme: v })} /></Field>
      <Field label="今晚的状态"><Segment values={['焦虑', '疲惫', '委屈', '孤独', '脑子停不下来']} value={form.mood} onChange={(v) => setForm({ mood: v })} /></Field>
      <Field label="想听的声音"><Segment values={voices} value={form.voice} onChange={(v) => setForm({ voice: v })} /></Field>
      <Field label="多久后停"><Segment values={timers.map((t) => `${t} 分`)} value={`${form.endAfter} 分`} onChange={(v) => setForm({ endAfter: Number(v.replace(' 分', '')) })} /></Field>
      <Field label="你想看的脑洞"><textarea className="setting-input" value={form.customSetting} onChange={(e) => setForm({ customSetting: e.target.value })} placeholder="例如：雨夜书店快打烊了，店里有一只会安慰人的猫。女主今晚很焦虑，老板给她讲一个慢慢放松下来的故事。" /></Field>
      <div className="two-field-grid">
        <Field label="一定要有"><input className="text-input" value={form.mustHave} onChange={(e) => setForm({ mustHave: e.target.value })} placeholder="雨声、猫、暖灯、书页" /></Field>
        <Field label="尽量不要"><input className="text-input" value={form.avoidElements} onChange={(e) => setForm({ avoidElements: e.target.value })} placeholder="惊吓、反转、争吵" /></Field>
      </div>
      <button className="primary wide tone-story" onClick={() => generate('睡前故事', form.customSetting || form.theme || '雨夜书店')}>按这个脑洞写完整故事</button>
    </Panel>
    <Panel className="preview-panel compact-preview accent-card story"><img src="/assets/theme-rain-bookstore.webp" alt="" /><div className="preview-copy"><label>{contentConfigs.story.badge}</label><h2>{contentConfigs.story.previewTitle}</h2><p>{contentConfigs.story.previewDesc}</p><p className="fine-print">{contentConfigs.story.previewFine}</p></div></Panel>
  </div>;
}

function SoundscapeDesigner({ form, setForm, generate, setPage }) {
  return <div className="audio-layout">
    <Panel className="sound-list">
      <div className="tabs"><button className="active">背景音乐</button><button onClick={() => setPage('sleep')}>去播放页</button></div>
      {musicOptions.map((m, i) => <button key={m} className={`sound-row ${form.backgroundMusic === m ? 'selected' : ''}`} onClick={() => setForm({ backgroundMusic: m })}><span>▶</span><b>{m}</b><em>{['03:45','03:50','04:21','03:30','04:12','03:58','04:08'][i]}</em><i>▥</i></button>)}
      <div className="mini-player soundscape-player"><img src="/assets/theme-cat-hotel.webp" alt="" /><div><label>{contentConfigs.soundscape.badge}</label><b>{form.backgroundMusic}</b></div><span>01:24 / 03:50</span><button>Ⅱ</button><button>♡</button></div>
    </Panel>
    <Panel className="audio-control">
      <Field label="环境音效"><Segment values={bgs} value={form.background} onChange={(v) => setForm({ background: v })} /></Field>
      <Field label="多久后停"><Segment values={timers.map((t) => `${t} 分`)} value={`${form.endAfter} 分`} onChange={(v) => setForm({ endAfter: Number(v.replace(' 分', '')) })} /></Field>
      <div className="volume"><span>背景音量</span><input type="range" min="0" max="100" value={form.musicVolume} onChange={(e) => setForm({ musicVolume: Number(e.target.value) })} /><b>{form.musicVolume}%</b></div>
      <button className="primary wide tone-soundscape" onClick={() => generate('白噪音声景', '月光白噪音电台')}>{contentConfigs.soundscape.buttonLabel}</button>
    </Panel>
  </div>;
}

function ResultPage({ track, form, setPage, gifts, addToCart }) {
  const gift = gifts.find((g) => (track?.theme || '').includes(g.match)) || gifts[2];
  const chapters = track?.chapters || [];
  const scene = inferSceneByTrack(track);
  const sceneMeta = sceneBackgrounds[scene];
  const cfg = getConfigByTrack(track);
  const matchedPack = digitalProducts.find((p) => p.scene === cfg.scene) || digitalProducts[0];
  return <main className={`page themed-page scene-page scene-${scene}`}>
    <SceneBackdrop scene={scene} />
    <div className="scene-content">
      <SectionHeader kicker={`03 生成结果 · ${sceneMeta.label}`} title={`${cfg.label}写好了，先看一眼再播放`} desc="先看故事、章节和推荐理由。觉得合口味，再播放、买完整版，或者看看同主题礼盒。" />
      <div className="result-layout">
        <Panel className="result-main">
          <div className={`result-head ${cfg.accent}`}><img src={track?.cover || cfg.cover} alt="" /><div><span className={`pill ${cfg.accent}`}>{cfg.badge}</span><h2>{track?.title}</h2><p>{track?.subtitle}</p></div></div>
          <div className={`result-summary ${cfg.accent}`}><h3>为什么这样写</h3><p>{track?.userSetting ? `我按你的设定「${track.userSetting}」继续生成完整版，并保留 ${track.mustHave || '核心情节'}，规避 ${track.avoidElements || '高刺激元素'}。` : cfg.resultReason}</p></div>
          <div className="chapter-grid">{chapters.map((c) => <div className="chapter" key={c.no}><b>{c.no}</b><span>{c.name}</span><em>{c.time}</em></div>)}</div>
          {track?.fullStory && <div className={`full-story-card ${cfg.accent}`}><div className="full-story-head"><h3>完整内容预览</h3><span>{track.userSetting ? '按你的设定写的' : '已生成'}</span></div><pre>{track.fullStory}</pre></div>}
          <blockquote>“{cfg.quote}”</blockquote>
          <div className="result-actions"><button className={`primary tone-${cfg.accent}`} onClick={() => setPage('sleep')}>{scene === 'zodiac' ? '查看播放 / 分镜' : '去播放'}</button><button className={`secondary tone-${cfg.accent}`} onClick={() => { addToCart(matchedPack); setPage('cart'); }}>买完整版 ¥{matchedPack.price}</button><button className={`secondary tone-${cfg.accent}`} onClick={() => setPage('member')}>{scene === 'zodiac' ? '解锁更多脚本' : '继续追更'}</button></div>
        </Panel>
        <Panel className={`commerce-panel ${cfg.accent}`}><span className={`pill gold ${cfg.accent}`}>顺手推荐</span><h3>这个世界的同款礼盒</h3><img src={gift.image} alt="" /><h2>{gift.title}</h2><p>{gift.desc}</p><b>¥ {gift.price}</b><button className={`tone-${cfg.accent}`} onClick={() => { addToCart({ id: gift.id, type: '礼盒', title: gift.title, price: gift.price, image: gift.image, desc: gift.desc }); setPage('cart'); }}>加入购物车</button><button onClick={() => setPage('gift')}>看看礼盒</button></Panel>
      </div>
    </div>
  </main>;
}

function SleepPage({ track, form, setForm, setPage, immersive, setImmersive }) {
  const current = track || { title: '末世重生：她靠空间异能养活整座安全屋', subtitle: '末世 · 大女主 · 空间异能 · 囤货建家', cover: '/assets/theme-underground-garden.webp', progress: '02:34', total: '28:45', chapters: [{ no: '01', name: '进入地下花园', time: '09:21' },{ no: '02', name: '安全屋初建', time: '09:48' },{ no: '03', name: '她在月光下种第一株花', time: '09:36' }] };
  const scene = inferSceneByTrack(track || { contentType: '末世小说' });
  const sceneMeta = sceneBackgrounds[scene];
  const cfg = getConfigByTrack(track || { contentType: '末世小说' });
  if (immersive) return <main className={`immersive-page ${cfg.accent}`}><img src={current.cover} alt="" /><div className="immersive-shade" /><button className="exit-immersive" onClick={() => setImmersive(false)}>退出沉浸模式</button><section className={`immersive-player ${cfg.accent}`}><span className={`pill ${cfg.accent}`}>{cfg.badge}</span><h1>{current.title}</h1><p>{current.subtitle}</p><Wave count={94} /><div className="time"><span>{current.progress}</span><span>{current.total}</span></div><button className="pause">Ⅱ</button><small>{form.backgroundMusic} · {form.endAfter} 分钟后淡出 · 音量 {form.musicVolume}%</small></section></main>;
  return <main className={`page themed-page scene-page scene-${scene}`}>
    <SceneBackdrop scene={scene} />
    <div className="scene-content">
    <SectionHeader kicker={`04 睡前播放 · ${sceneMeta.label}`} title="为这一晚保留更少干扰" desc="生成结束以后，页面只保留播放、沉浸模式和少量必要信息，让注意力真正从白天慢慢退出。" />
    <Panel className="player-redesign">
      <div className={`player-topline ${cfg.accent}`}><div><h1>{cfg.sleepTitle} <span>{cfg.badge}</span></h1><p>{cfg.sleepHint}</p></div><span>☾ 已按你的偏好调好 ···</span></div>
      <div className="player-main-grid"><img className="cover" src={current.cover} alt="" /><div className="track-info"><h2>{current.title}</h2><p>{current.subtitle}</p><div className={`chips ${cfg.accent}`}><span>♪ {form.backgroundMusic}</span><span>⏱ {form.endAfter} 分钟后淡出</span><span>{cfg.chips[0]}</span></div><Wave count={78} /><div className="time"><span>{current.progress}</span><span>{current.total}</span></div></div><div className="controls"><button>↤</button><button className="pause">Ⅱ</button><button>↦</button><button>♡</button><button>↓</button><button>…</button></div></div>
      <div className="player-detail-grid">
        <div className={`detail-card ${cfg.accent}`}><h3>{cfg.detailTitle}</h3><img src={current.cover} alt="" /><p>{current.userSetting ? `用户设定：${current.userSetting}` : cfg.detailText.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br /></React.Fragment>)}</p><blockquote>{cfg.quote}</blockquote></div>
        <div className={`detail-card highlight ${cfg.accent}`}><h3>{scene === 'zodiac' ? '输出模式' : '播放模式'}</h3><div className="mode-list"><span>背景音乐：{form.backgroundMusic}</span><span>定时关闭：{form.endAfter} 分钟后</span><span>{scene === 'zodiac' ? '输出重点：分镜与口播' : `背景音量：${form.musicVolume}%`}</span></div><button className={`tone-${cfg.accent}`} onClick={() => setImmersive(true)}>{scene === 'zodiac' ? '进入沉浸预览模式' : '进入安静播放'}</button><button onClick={() => setPage('studio')} className="ghost-btn">重新写一个</button></div>
        <div className={`detail-card ${cfg.accent}`}><h3>{cfg.companionTitle}</h3>{current.chapters.map((c) => <div className={`chapter ${cfg.accent}`} key={c.no}><b>{c.no}</b><span>{c.name}</span><em>{c.time}</em></div>)}<button className={`tone-${cfg.accent}`} onClick={() => setPage('result')}>{scene === 'zodiac' ? '查看脚本结果' : '回去看全文'}</button></div>
      </div>
    </Panel>
    </div>
  </main>;
}

function MemberPage({ setPage, track, addToCart }) {
  const cfg = getConfigByTrack(track || { contentType: '末世小说' });
  const plans = {
    apocalypse: {
      title: '末世连续剧会员',
      price: '¥ 128 / 年',
      desc: '解锁安全屋系列长音频、能力设定库与连续剧追更。',
      perks: ['90 分钟长音频', '安全屋系列追更', '能力设定库', '睡前温和版剧情模式'],
      trigger: '当前内容：末日地下花园，推荐开通连续剧追更'
    },
    zodiac: {
      title: '星座视频创作会员',
      price: '¥ 168 / 年',
      desc: '解锁十二星座分镜导出、封面标题库与高清视频脚本。',
      perks: ['分镜脚本导出', '星座封面标题库', '1080P 视频脚本', '批量生成 12 星座'],
      trigger: '当前内容：星座梦境管理局，推荐解锁分镜导出'
    },
    story: {
      title: '晚安故事会员',
      price: '¥ 98 / 年',
      desc: '解锁更多声线、雨夜书店系列与睡前情绪适配报告。',
      perks: ['高级温柔声线', '雨夜书店追更', '情绪适配报告', '无广告晚安模式'],
      trigger: '当前内容：雨夜书店，推荐开通故事追更'
    },
    soundscape: {
      title: '白噪音声景会员',
      price: '¥ 88 / 年',
      desc: '解锁高品质环境音、混音比例保存与整夜循环淡出。',
      perks: ['高品质白噪音', '混音比例保存', '整夜循环淡出', '低干扰播放模式'],
      trigger: '当前内容：白噪音声景，推荐解锁高级声景'
    }
  };
  const plan = plans[cfg.accent] || plans.story;
  const memberItem = memberProducts[cfg.accent] || memberProducts.story;
  return <main className={`page themed-page scene-page scene-${cfg.scene} member-themed`}>
    <SceneBackdrop scene={cfg.scene} />
    <div className="scene-content">
      <SectionHeader kicker={`05 会员 · ${cfg.label}`} title="当用户想继续这个世界时，再触发升级" desc="会员页不单独讲权益清单，而是直接承接当前内容类型，让用户理解为什么现在要为追更、长音频或导出能力付费。" />
      <div className="member-grid member-flow-grid">
        <Panel className={`profile membership-panel ${cfg.accent}`}>
          <div className="user-row"><div className="avatar-large">小</div><div><h2>梦里的旅人</h2><p>ID 12346789</p></div></div>
          <div className={`vip-card contextual-vip ${cfg.accent}`}>
            <span>{cfg.badge}</span>
            <h3>{plan.title}</h3>
            <p>{plan.desc}</p>
            <button onClick={() => setPage('studio')}>继续定制</button>
          </div>
          <div className="member-trigger"><b>为什么现在推荐</b><p>{plan.trigger}</p></div>
        </Panel>
        <Panel className={`pricing-card ${cfg.accent}`}>
          <h3>{plan.title}</h3>
          <b>{plan.price}</b>
          <p>{plan.desc}</p>
          <ul>{plan.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul>
          <button className={`primary wide tone-${cfg.accent}`} onClick={() => { addToCart(memberItem); setPage('cart'); }}>加入购物车</button>
        </Panel>
        <Panel className={`member-menu ${cfg.accent}`}>
          <h3>和当前内容有关</h3>
          <button onClick={() => setPage('result')}>回去看全文 <span>›</span></button>
          <button onClick={() => setPage('sleep')}>去播放 <span>›</span></button>
          <button onClick={() => setPage('gift')}>匹配主题礼盒 <span>›</span></button>
          <button onClick={() => setPage('studio')}>重新写一个内容 <span>›</span></button>
        </Panel>
      </div>
    </div>
  </main>;
}

function GiftPage({ gifts, setPage, track, addToCart }) {
  const cfg = getConfigByTrack(track || { contentType: '末世小说' });
  const giftThemes = {
    apocalypse: { title: '安全感末世礼盒', desc: '以地下花园、安全屋和荧光植物为核心，适合末世小说听后转化。', hero: '/assets/gift-deepsea.webp' },
    zodiac: { title: '星海入梦礼盒', desc: '星座卡牌、月光贴纸与十二星座视频兑换码，适合星座梦境内容转化。', hero: '/assets/gift-starsea.webp' },
    story: { title: '雨夜书店晚安礼盒', desc: '香薰、眼罩、雨夜书店音频包和睡前记录本，适合温柔睡前故事。', hero: '/assets/gift-moonfairy.webp' },
    soundscape: { title: '深海白噪音礼盒', desc: '声景兑换码、小夜灯与低干扰睡前记录卡，适合白噪音用户。', hero: '/assets/gift-deepsea.webp' }
  };
  const themedGift = giftThemes[cfg.accent] || giftThemes.story;
  return <main className={`page themed-page scene-page scene-${cfg.scene} gift-themed`}>
    <SceneBackdrop scene={cfg.scene} />
    <div className="scene-content">
      <SectionHeader kicker={`06 礼盒 · ${cfg.label}`} title="当内容成立以后，礼盒才自然成立" desc="礼盒不是额外插入的商品位，而是沿着当前世界观延伸出来的实体化陪伴，因此更像内容电商，而不是硬卖货。" />
      <Panel className={`gift-hero ${cfg.accent}`}>
        <div className="gift-hero-copy">
          <span className={`pill ${cfg.accent}`}>{cfg.badge}</span>
          <h2>{themedGift.title}</h2>
          <p>{themedGift.desc}</p>
          <button className={`primary tone-${cfg.accent}`} onClick={() => { addToCart({ id: `gift-${cfg.accent}`, type: '礼盒', title: themedGift.title, price: cfg.accent === 'zodiac' ? 129 : cfg.accent === 'story' ? 169 : 199, image: themedGift.hero, desc: themedGift.desc }); setPage('cart'); }}>加入购物车</button>
        </div>
        <img src={themedGift.hero} alt="" />
      </Panel>
      <div className="gift-grid-page differentiated-gifts">
        {gifts.map((g, idx) => <Panel key={g.id} className={`gift-big ${idx === 2 && cfg.accent === 'apocalypse' ? 'featured' : ''} ${idx === 0 && cfg.accent === 'zodiac' ? 'featured' : ''} ${idx === 1 && cfg.accent === 'story' ? 'featured' : ''}`}>
          <img src={g.image} alt="" />
          <div><h2>{g.title}</h2><p>{g.desc || '主题内容兑换码、睡前记录本、香薰、贴纸与限定周边。'}</p><small>适配内容：{g.match}</small><b>¥ {g.price}</b><button className={`tone-${cfg.accent}`} onClick={() => { addToCart({ id: g.id, type: '礼盒', title: g.title, price: g.price, image: g.image, desc: g.desc }); setPage('cart'); }}>加入购物车</button></div>
        </Panel>)}
      </div>
    </div>
  </main>;
}


function StorePage({ setPage, addToCart }) {
  const promos = [
    ['新人会员优惠', '新用户首月 9.9 元，可以多生成几次，也能试高级声线。'],
    ['限时小内容包', '《末世重生》前 3 集免费，喜欢再解锁后面的 7 集。'],
    ['礼盒券', '连续听 3 晚雨夜书店，就送一张 20 元礼盒券。'],
    ['睡前打卡', '连续 7 晚使用，送一次高级声线体验。'],
    ['分享给朋友', '把你的梦境标题分享给朋友，朋友试听后，两个人都能多生成一次。']
  ];
  return <main className="page ecommerce-page store-page">
    <SectionHeader kicker="05 内容商店" title="梦境内容小店" desc="这里卖的是可直接听、可继续追、也能拿去做视频的内容包。价格不高，适合先买一个试试。" />
    <section className="store-hero panel">
      <div><span className="pill gold">专属于你的睡前内容小店</span><h2>先试听 3 分钟，喜欢再买完整版</h2><p>很多人不会一上来就开会员，也不一定立刻买礼盒。所以先放几个低价内容包，让用户用很小的成本试一试。</p></div>
      <button className="primary" onClick={() => setPage('studio')}>先生成一段试听</button>
    </section>
    <div className="product-grid">
      {digitalProducts.map((p) => { const cfg = contentConfigs[p.scene] || contentConfigs.story; return <Panel className={`product-card ${cfg.accent}`} key={p.id}>
        <img src={p.cover} alt="" />
        <div className="product-body"><span className={`pill ${cfg.accent}`}>{p.badge}</span><h3>{p.title}</h3><p>{p.desc}</p><div className="product-benefits">{p.benefits.map((b) => <em key={b}>{b}</em>)}</div><div className="price-row"><b>¥ {p.price}</b><del>¥ {p.oldPrice}</del></div><button className={`primary wide tone-${cfg.accent}`} onClick={() => addToCart(p)}>加入购物车</button></div>
      </Panel>; })}
    </div>
    <section className="promo-grid">{promos.map(([title, desc]) => <div className="promo-card" key={title}><b>{title}</b><p>{desc}</p></div>)}</section>
  </main>;
}

function CartPage({ cart, setCart, setPage }) {
  const [coupon, setCoupon] = useState('sleep20');
  const [paid, setPaid] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon === 'sleep20' && subtotal >= 20 ? 20 : coupon === 'new9' ? Math.min(9.9, subtotal * 0.25) : 0;
  const total = Math.max(0, subtotal - discount);
  function updateQty(id, delta) {
    setCart((prev) => prev.flatMap((item) => {
      if (item.id !== id) return [item];
      const next = item.quantity + delta;
      return next <= 0 ? [] : [{ ...item, quantity: next }];
    }));
  }
  if (paid) return <main className="page ecommerce-page"><Panel className="pay-success"><span className="success-icon">✓</span><h1>支付成功</h1><p>订单号 DR-{Date.now().toString().slice(-8)} 已生成。内容兑换码和会员权益已经发放，礼盒订单进入模拟发货流程。</p><div className="success-assets"><span>内容兑换码：DREAM-2026</span><span>会员权益：已开通</span><span>礼盒物流：待发货</span></div><button className="primary" onClick={() => { setCart([]); setPaid(false); setPage('dashboard'); }}>看看经营数据</button></Panel></main>;
  return <main className="page ecommerce-page">
    <SectionHeader kicker="08 购物车 / 结算" title="下单流程演示" desc="这里演示从加入购物车到支付成功的完整流程。课堂展示用的是确认支付，不会真的扣款。" />
    <div className="cart-layout"><Panel className="cart-list">
      {cart.length === 0 ? <div className="empty-cart"><h2>购物车里还没有东西</h2><p>可以先去内容小店买一个故事包，也可以在礼盒页加入一个主题礼盒。</p><button className="primary" onClick={() => setPage('store')}>去内容小店</button></div> : cart.map((item) => <div className="cart-row" key={item.id}><img src={item.cover} alt="" /><div><span>{item.type}</span><h3>{item.title}</h3><p>{item.desc}</p></div><div className="qty"><button onClick={() => updateQty(item.id, -1)}>-</button><b>{item.quantity}</b><button onClick={() => updateQty(item.id, 1)}>+</button></div><strong>¥ {(item.price * item.quantity).toFixed(1)}</strong></div>)}
    </Panel><Panel className="checkout-card"><h2>确认订单</h2><label>可用优惠</label><div className="coupon-row"><button className={coupon === 'sleep20' ? 'active' : ''} onClick={() => setCoupon('sleep20')}>满 20 减 20</button><button className={coupon === 'new9' ? 'active' : ''} onClick={() => setCoupon('new9')}>新人 9.9 优惠</button></div><div className="checkout-line"><span>小计</span><b>¥ {subtotal.toFixed(1)}</b></div><div className="checkout-line"><span>已优惠</span><b>- ¥ {discount.toFixed(1)}</b></div><div className="checkout-total"><span>还需支付</span><b>¥ {total.toFixed(1)}</b></div><button className="primary wide" disabled={cart.length === 0} onClick={() => setPaid(true)}>确认支付</button><p className="checkout-note">这是课堂演示用的确认支付，只展示流程，不会产生真实扣款。</p></Panel></div>
  </main>;
}

function DashboardPage({ track, setPage }) {
  const cfg = getConfigByTrack(track || { contentType: '末世小说' });
  const metrics = [['DAU','12,480','+18.6%'],['次日留存率','42.8%','+6.2%'],['7 日留存率','26.5%','+4.1%'],['平均收听时长','23.7 min','+11.4%'],['生成转播放率','71.2%','+8.9%'],['免费转付费率','9.6%','+2.3%'],['内容包购买率','6.8%','+1.9%'],['礼盒点击率','4.2%','+1.1%'],['客单价','¥ 36.7','+5.4%'],['复购率','18.3%','+3.6%']];
  const profile = [['偏好内容', cfg.label],['偏好声线','温柔女声 / 广播电台'],['常用时长','30 分钟后淡出'],['常听时间','23:00–01:00'],['睡前情绪','焦虑 / 疲惫 / 脑子停不下来'],['付费行为','买过内容包 / 收藏过礼盒']];
  return <main className={`page themed-page scene-page scene-${cfg.scene} dashboard-page`}><SceneBackdrop scene={cfg.scene} /><div className="scene-content"><SectionHeader kicker="09 经营数据看板" title="用数据看看这门生意能不能跑起来" desc="从首页访问、免费生成，到买一个内容包、开会员、买礼盒和复购分享，核心指标都放在这里。" /><section className="closed-loop panel"><span>访问首页</span><i>→</i><span>免费生成</span><i>→</i><span>播放试听</span><i>→</i><span>买一个内容包</span><i>→</i><span>想多听就开会员</span><i>→</i><span>购买礼盒</span><i>→</i><span>复购 / 分享</span></section><div className="dashboard-layout"><Panel className="metric-grid">{metrics.map(([name, value, change]) => <div className="metric-card" key={name}><span>{name}</span><b>{value}</b><em>{change}</em></div>)}</Panel><Panel className="profile-panel"><h2>用户偏好和推荐逻辑</h2>{profile.map(([k, v]) => <div className="profile-row" key={k}><span>{k}</span><b>{v}</b></div>)}<blockquote>你最近连续 3 晚收听“末世安全屋”系列，推荐解锁《空间异能篇》完整 10 集包；你常选择 30 分钟后淡出，推荐开启自动睡眠模式。</blockquote><button className={`primary wide tone-${cfg.accent}`} onClick={() => setPage('store')}>查看推荐内容包</button></Panel></div></div></main>;
}


function App() {
  useEffect(() => {
    const handlePointerMove = (event) => {
      const button = event.target.closest?.('button');
      if (!button) return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      button.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const [page, setPage] = useState('home');
  const [studioTab, setStudioTab] = useState('choose');
  const [themes, setThemes] = useState(fallbackThemes);
  const [gifts, setGifts] = useState(fallbackGifts);
  const [immersive, setImmersive] = useState(false);
  const [track, setTrack] = useState(null);
  const [cart, setCart] = useState([]);
  const [form, setFormBase] = useState({
    storyMode: '大女主', cpMode: '无 CP', power: '空间异能', tone: '睡前温和版', length: '中篇',
    zodiacScene: '末日庇护所', zodiacSign: '双鱼座', videoOutput: '分镜脚本', theme: '雨夜书店', mood: '焦虑', voice: '温柔女声',
    background: '雨声', backgroundMusic: '空灵钢琴', endAfter: 30, musicVolume: 60,
    customSetting: '', mustHave: '', avoidElements: '', dramaLevel: '有点狗血', pov: '第三人称', endingStyle: '留悬念'
  });
  const setForm = (patch) => setFormBase((prev) => ({ ...prev, ...patch }));
  const addToCart = (item) => {
    const cartItem = toCartItem(item);
    setCart((prev) => {
      const existing = prev.find((p) => p.id === cartItem.id);
      if (existing) return prev.map((p) => p.id === cartItem.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, cartItem];
    });
  };

  useEffect(() => {
    fetch(`${API}/api/themes`).then((r) => r.json()).then((data) => setThemes(data.map((t) => ({...t, target: t.id === 'underground-garden' || t.id === 'zodiac-office' ? 'studio' : 'sleep', tab: t.id === 'underground-garden' ? 'apocalypse' : t.id === 'zodiac-office' ? 'zodiac' : undefined })))).catch(() => {});
    fetch(`${API}/api/gifts`).then((r) => r.json()).then((data) => setGifts(data.map((g, i) => ({ ...g, match: ['星座梦境管理局','雨夜书店','末日地下花园'][i] || g.title, desc: fallbackGifts[i]?.desc })))).catch(() => {});
  }, []);

  async function generate(contentType, theme) {
    const payload = { ...form, contentType, theme, duration: form.endAfter };
    const localTrack = buildFallbackTrack(contentType, theme, form);
    try {
      const res = await fetch(`${API}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      setTrack({ ...localTrack, ...data, fullStory: data.fullStory || localTrack.fullStory, userSetting: localTrack.userSetting });
    } catch {
      setTrack(localTrack);
    }
    setPage('result');
  }

  return <div className={`app-shell ${immersive ? 'immersive-shell' : ''}`}>{!immersive && <TopNav page={page} setPage={setPage} setStudioTab={setStudioTab} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />}
    {page === 'home' && <HomePage setPage={setPage} setStudioTab={setStudioTab} themes={themes} />}
    {page === 'studio' && <StudioPage tab={studioTab} setTab={setStudioTab} form={form} setForm={setForm} generate={generate} setPage={setPage} />}
    {page === 'result' && <ResultPage track={track} form={form} setPage={setPage} gifts={gifts} addToCart={addToCart} />}
    {page === 'sleep' && <SleepPage track={track} form={form} setForm={setForm} setPage={setPage} immersive={immersive} setImmersive={setImmersive} />}
    {page === 'store' && <StorePage setPage={setPage} addToCart={addToCart} />}
    {page === 'cart' && <CartPage cart={cart} setCart={setCart} setPage={setPage} />}
    {page === 'dashboard' && <DashboardPage track={track} setPage={setPage} />}
    {page === 'member' && <MemberPage setPage={setPage} track={track} addToCart={addToCart} />}
    {page === 'gift' && <GiftPage gifts={gifts} setPage={setPage} track={track} addToCart={addToCart} />}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
