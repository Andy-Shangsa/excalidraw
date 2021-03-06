const fs = require("fs");

const THRESSHOLD = 85;

const crowdinMap = {
  "ar-SA": "en-ar",
  "bg-BG": "en-bg",
  "ca-ES": "en-ca",
  "de-DE": "en-de",
  "el-GR": "en-el",
  "es-ES": "en-es",
  "fa-IR": "en-fa",
  "fi-FI": "en-fi",
  "fr-FR": "en-fr",
  "he-IL": "en-he",
  "hi-IN": "en-hi",
  "hu-HU": "en-hu",
  "id-ID": "en-id",
  "it-IT": "en-it",
  "ja-JP": "en-ja",
  "kab-KAB": "en-kab",
  "ko-KR": "en-ko",
  "my-MM": "en-my",
  "nb-NO": "en-nb",
  "nl-NL": "en-nl",
  "nn-NO": "en-nnno",
  "oc-FR": "en-oc",
  "pa-IN": "en-pain",
  "pl-PL": "en-pl",
  "pt-BR": "en-ptbr",
  "pt-PT": "en-pt",
  "ro-RO": "en-ro",
  "ru-RU": "en-ru",
  "sk-SK": "en-sk",
  "sv-SE": "en-sv",
  "tr-TR": "en-tr",
  "uk-UA": "en-uk",
  "zh-CN": "en-zhcn",
  "zh-TW": "en-zhtw",
  "lv-LV": "en-lv",
  "cs-CZ": "en-cs",
  "kk-KZ": "en-kk",
};

const flags = {
  "ar-SA": "ð¸ð¦",
  "bg-BG": "ð§ð¬",
  "ca-ES": "ð³",
  "de-DE": "ð©ðª",
  "el-GR": "ð¬ð·",
  "es-ES": "ðªð¸",
  "fa-IR": "ð®ð·",
  "fi-FI": "ð«ð®",
  "fr-FR": "ð«ð·",
  "he-IL": "ð®ð±",
  "hi-IN": "ð®ð³",
  "hu-HU": "ð­ðº",
  "id-ID": "ð®ð©",
  "it-IT": "ð®ð¹",
  "ja-JP": "ð¯ðµ",
  "kab-KAB": "ð³",
  "ko-KR": "ð°ð·",
  "my-MM": "ð²ð²",
  "nb-NO": "ð³ð´",
  "nl-NL": "ð³ð±",
  "nn-NO": "ð³ð´",
  "oc-FR": "ð³",
  "pa-IN": "ð®ð³",
  "pl-PL": "ðµð±",
  "pt-BR": "ð§ð·",
  "pt-PT": "ðµð¹",
  "ro-RO": "ð·ð´",
  "ru-RU": "ð·ðº",
  "sk-SK": "ð¸ð°",
  "sv-SE": "ð¸ðª",
  "tr-TR": "ð¹ð·",
  "uk-UA": "ðºð¦",
  "zh-CN": "ð¨ð³",
  "zh-TW": "ð¹ð¼",
  "lv-LV": "ð±ð»",
  "cs-CZ": "ð¨ð¿",
  "kk-KZ": "ð°ð¿",
};

const languages = {
  "ar-SA": "Ø§ÙØ¹Ø±Ø¨ÙØ©",
  "bg-BG": "ÐÑÐ»Ð³Ð°ÑÑÐºÐ¸",
  "ca-ES": "CatalÃ ",
  "de-DE": "Deutsch",
  "el-GR": "ÎÎ»Î»Î·Î½Î¹ÎºÎ¬",
  "es-ES": "EspaÃ±ol",
  "fa-IR": "ÙØ§Ø±Ø³Û",
  "fi-FI": "Suomi",
  "fr-FR": "FranÃ§ais",
  "he-IL": "×¢××¨××ª",
  "hi-IN": "à¤¹à¤¿à¤¨à¥à¤¦à¥",
  "hu-HU": "Magyar",
  "id-ID": "Bahasa Indonesia",
  "it-IT": "Italiano",
  "ja-JP": "æ¥æ¬èª",
  "kab-KAB": "Taqbaylit",
  "ko-KR": "íêµ­ì´",
  "my-MM": "Burmese",
  "nb-NO": "Norsk bokmÃ¥l",
  "nl-NL": "Nederlands",
  "nn-NO": "Norsk nynorsk",
  "oc-FR": "Occitan",
  "pa-IN": "à¨ªà©°à¨à¨¾à¨¬à©",
  "pl-PL": "Polski",
  "pt-BR": "PortuguÃªs Brasileiro",
  "pt-PT": "PortuguÃªs",
  "ro-RO": "RomÃ¢nÄ",
  "ru-RU": "Ð ÑÑÑÐºÐ¸Ð¹",
  "sk-SK": "SlovenÄina",
  "sv-SE": "Svenska",
  "tr-TR": "TÃ¼rkÃ§e",
  "uk-UA": "Ð£ÐºÑÐ°ÑÐ½ÑÑÐºÐ°",
  "zh-CN": "ç®ä½ä¸­æ",
  "zh-TW": "ç¹é«ä¸­æ",
  "lv-LV": "LatvieÅ¡u",
  "cs-CZ": "Äesky",
  "kk-KZ": "ÒÐ°Ð·Ð°Ò ÑÑÐ»Ñ",
};

const percentages = fs.readFileSync(
  `${__dirname}/../src/locales/percentages.json`,
);
const rowData = JSON.parse(percentages);

const coverages = Object.entries(rowData)
  .sort(([, a], [, b]) => b - a)
  .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

const boldIf = (text, condition) => (condition ? `**${text}**` : text);

const printHeader = () => {
  let result = "| | Flag | Locale | % |\n";
  result += "| :--: | :--: | -- | :--: |";
  return result;
};

const printRow = (id, locale, coverage) => {
  const isOver = coverage >= THRESSHOLD;
  let result = `| ${isOver ? id : "..."} | `;
  result += `${locale in flags ? flags[locale] : ""} | `;
  const language = locale in languages ? languages[locale] : locale;
  if (locale in crowdinMap && crowdinMap[locale]) {
    result += `[${boldIf(
      language,
      isOver,
    )}](https://crowdin.com/translate/excalidraw/10/${crowdinMap[locale]}) | `;
  } else {
    result += `${boldIf(language, isOver)} | `;
  }
  result += `${coverage === 100 ? "ð¯" : boldIf(coverage, isOver)} |`;
  return result;
};

console.info(
  `Each language must be at least **${THRESSHOLD}%** translated in order to appear on Excalidraw. Join us on [Crowdin](https://crowdin.com/project/excalidraw) and help us translate your own language. **Can't find yours yet?** Open an [issue](https://github.com/excalidraw/excalidraw/issues/new) and we'll add it to the list.`,
);
console.info("\n\r");
console.info(printHeader());
let index = 1;
for (const coverage in coverages) {
  if (coverage === "en") {
    continue;
  }
  console.info(printRow(index, coverage, coverages[coverage]));
  index++;
}
console.info("\n\r");
console.info("\\* Languages in **bold** are going to appear on production.");
