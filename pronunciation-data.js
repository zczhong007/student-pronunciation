// 发音数据与单词库
const pronunciationData = {
    // 常用英语单词发音库
    words: {
        "hello": {
            phonetic: "həˈloʊ",
            syllables: ["he", "llo"],
            stress: 2,
            commonMistakes: ["heh-loh", "hel-lo"],
            difficulty: "easy"
        },
        "world": {
            phonetic: "wɜːrld",
            syllables: ["world"],
            stress: 1,
            commonMistakes: ["worl-d", "warld"],
            difficulty: "easy"
        },
        "welcome": {
            phonetic: "ˈwelkəm",
            syllables: ["wel", "come"],
            stress: 1,
            commonMistakes: ["wel-come", "wel-com"],
            difficulty: "easy"
        },
        "english": {
            phonetic: "ˈɪŋɡlɪʃ",
            syllables: ["eng", "lish"],
            stress: 1,
            commonMistakes: ["en-glish", "eng-lish"],
            difficulty: "medium"
        },
        "pronunciation": {
            phonetic: "prəˌnʌnsiˈeɪʃn",
            syllables: ["pro", "nun", "ci", "a", "tion"],
            stress: 4,
            commonMistakes: ["pro-nun-cee-ay-shun", "pronoun-see-ay-shun"],
            difficulty: "hard"
        },
        "quick": {
            phonetic: "kwɪk",
            syllables: ["quick"],
            stress: 1,
            commonMistakes: ["kwik", "kwick"],
            difficulty: "easy"
        },
        "brown": {
            phonetic: "braʊn",
            syllables: ["brown"],
            stress: 1,
            commonMistakes: ["brow-n", "broon"],
            difficulty: "easy"
        },
        "fox": {
            phonetic: "fɑːks",
            syllables: ["fox"],
            stress: 1,
            commonMistakes: ["foks", "fawks"],
            difficulty: "easy"
        },
        "jumps": {
            phonetic: "dʒʌmps",
            syllables: ["jumps"],
            stress: 1,
            commonMistakes: ["jum-ps", "jump-s"],
            difficulty: "easy"
        },
        "lazy": {
            phonetic: "ˈleɪzi",
            syllables: ["la", "zy"],
            stress: 1,
            commonMistakes: ["lay-zy", "lazy"],
            difficulty: "medium"
        },
        "dog": {
            phonetic: "dɔːɡ",
            syllables: ["dog"],
            stress: 1,
            commonMistakes: ["dawg", "dog-g"],
            difficulty: "easy"
        },
        "she": {
            phonetic: "ʃiː",
            syllables: ["she"],
            stress: 1,
            commonMistakes: ["shi", "shee"],
            difficulty: "easy"
        },
        "sells": {
            phonetic: "selz",
            syllables: ["sells"],
            stress: 1,
            commonMistakes: ["sel-ls", "sels"],
            difficulty: "easy"
        },
        "seashells": {
            phonetic: "ˈsiːʃelz",
            syllables: ["sea", "shells"],
            stress: 1,
            commonMistakes: ["sea-shells", "see-shells"],
            difficulty: "medium"
        },
        "seashore": {
            phonetic: "ˈsiːʃɔːr",
            syllables: ["sea", "shore"],
            stress: 1,
            commonMistakes: ["sea-shore", "see-shore"],
            difficulty: "medium"
        },
        "wood": {
            phonetic: "wʊd",
            syllables: ["wood"],
            stress: 1,
            commonMistakes: ["woo-d", "wud"],
            difficulty: "easy"
        },
        "woodchuck": {
            phonetic: "ˈwʊdtʃʌk",
            syllables: ["wood", "chuck"],
            stress: 1,
            commonMistakes: ["wood-chuck", "wood-shuck"],
            difficulty: "hard"
        },
        "could": {
            phonetic: "kʊd",
            syllables: ["could"],
            stress: 1,
            commonMistakes: ["coo-ld", "culd"],
            difficulty: "medium"
        }
    },

    // 音标与发音规则
    phoneticRules: {
        // 元音发音规则
        vowels: {
            "a": ["æ", "eɪ", "ɑː", "ə", "ɔː"],
            "e": ["iː", "e", "ə"],
            "i": ["aɪ", "ɪ", "iː"],
            "o": ["oʊ", "ɑː", "ɔː", "ə"],
            "u": ["juː", "ʊ", "ʌ"],
            "y": ["aɪ", "ɪ", "iː"]
        },
        
        // 常见辅音组合
        consonantClusters: {
            "th": ["θ", "ð"],
            "ch": ["tʃ"],
            "sh": ["ʃ"],
            "ph": ["f"],
            "wh": ["w", "hw"],
            "ng": ["ŋ"],
            "ck": ["k"]
        }
    },

    // 常见发音问题类型
    commonProblems: [
        {
            type: "vowel_confusion",
            description: "元音发音混淆",
            examples: ["ship/sleep", "bad/bed", "cut/cot"],
            solution: "通过对比发音练习，注意嘴型和舌位"
        },
        {
            type: "consonant_clusters",
            description: "辅音组合困难",
            examples: ["th", "ch", "sh", "ng"],
            solution: "逐音练习，先分开再连读"
        },
        {
            type: "stress_placement",
            description: "重音位置错误",
            examples: ["RECord (n.) vs reCORD (v.)"],
            solution: "使用字典确认重音，标记单词重音位置"
        },
        {
            type: "ending_sounds",
            description: "词尾发音忽略",
            examples: ["-s", "-ed", "-es"],
            solution: "有意识强调词尾发音，录音自查"
        }
    ],

    // 练习建议库
    recommendations: {
        beginner: [
            "从简单的元音字母发音开始练习",
            "每天练习15分钟基础发音",
            "使用镜子观察嘴型变化",
            "跟读简单的单词和短语"
        ],
        intermediate: [
            "重点练习重音和语调",
            "学习使用音标标注单词发音",
            "跟读短文和对话",
            "录音并回听，发现问题"
        ],
        advanced: [
            "练习快速连读和弱读",
            "模仿不同口音的英语",
            "练习绕口令提高口齿清晰度",
            "参加口语交流活动"
        ],
        general: [
            "每天坚持练习，时间比长度更重要",
            "找一个练习伙伴互相纠正",
            "将录音分享给老师获取专业反馈",
            "保持积极心态，进步需要时间"
        ]
    },

    // 获取单词发音信息
    getWordInfo(word) {
        const lowerWord = word.toLowerCase();
        const wordInfo = this.words[lowerWord];
        
        if (wordInfo) {
            return {
                word: word,
                phonetic: wordInfo.phonetic,
                syllables: wordInfo.syllables,
                stress: wordInfo.stress,
                difficulty: wordInfo.difficulty,
                commonMistakes: wordInfo.commonMistakes,
                hasInfo: true
            };
        } else {
            // 猜测发音（简单规则）
            return {
                word: word,
                phonetic: this.guessPhonetic(word),
                syllables: this.guessSyllables(word),
                stress: this.guessStress(word),
                difficulty: this.guessDifficulty(word),
                commonMistakes: [],
                hasInfo: false
            };
        }
    },

    // 猜测单词音标（简化版）
    guessPhonetic(word) {
        if (word.length <= 3) return "简单单词";
        
        const vowels = "aeiou";
        let vowelCount = 0;
        for (let char of word.toLowerCase()) {
            if (vowels.includes(char)) vowelCount++;
        }
        
        if (vowelCount <= 2) return "单/双音节词";
        if (vowelCount <= 4) return "多音节词";
        return "复杂单词";
    },

    // 猜测音节划分
    guessSyllables(word) {
        const syllables = [];
        const lowerWord = word.toLowerCase();
        let currentSyllable = "";
        
        for (let i = 0; i < lowerWord.length; i++) {
            currentSyllable += lowerWord[i];
            const nextChar = i + 1 < lowerWord.length ? lowerWord[i + 1] : "";
            
            // 简单音节划分规则
            if ("aeiou".includes(lowerWord[i]) && !"aeiou".includes(nextChar)) {
                syllables.push(currentSyllable);
                currentSyllable = "";
            }
        }
        
        if (currentSyllable) syllables.push(currentSyllable);
        return syllables.length > 0 ? syllables : [word];
    },

    // 猜测重音位置
    guessStress(word) {
        if (word.length <= 4) return 1;
        
        // 简单规则：双音节词通常在第一个音节
        const syllableCount = this.guessSyllables(word).length;
        if (syllableCount === 2) return 1;
        
        // 多音节词通常在倒数第三个音节
        return Math.max(1, syllableCount - 2);
    },

    // 猜测单词难度
    guessDifficulty(word) {
        const length = word.length;
        const syllableCount = this.guessSyllables(word).length;
        const specialEndings = ["tion", "sion", "ture", "ous", "ing"];
        
        let hasSpecialEnding = false;
        for (let ending of specialEndings) {
            if (word.toLowerCase().endsWith(ending)) {
                hasSpecialEnding = true;
                break;
            }
        }
        
        if (length <= 4 && !hasSpecialEnding) return "easy";
        if (length <= 7 && syllableCount <= 3) return "medium";
        return "hard";
    },
    
    // 查找单词（findWord的别名，用于兼容性）
    findWord(word) {
        return this.getWordInfo(word);
    },

    // 分析文本中的单词
    analyzeText(text) {
        const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
        const analyzedWords = words.map(word => this.getWordInfo(word));
        
        // 统计难度分布
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };
        analyzedWords.forEach(word => {
            difficultyCount[word.difficulty] = (difficultyCount[word.difficulty] || 0) + 1;
        });
        
        return {
            wordCount: words.length,
            uniqueWords: [...new Set(words)],
            analyzedWords: analyzedWords,
            difficulty: difficultyCount,
            estimatedTime: Math.ceil(words.length * 1.5) // 每个单词1.5秒
        };
    },

    // 生成针对性的练习建议
    generateRecommendations(score, difficulty, specificProblems = []) {
        const recommendations = [];
        
        // 根据分数给出总体建议
        if (score < 60) {
            recommendations.push("发音基础需要系统练习，建议从头学习音标。");
            recommendations.push("从简单单词开始，确保每个音都发准确。");
        } else if (score < 75) {
            recommendations.push("基本发音不错，但需要注意细节。");
            recommendations.push("重点练习重音位置和连读。");
        } else if (score < 90) {
            recommendations.push("发音很好，继续提升流利度。");
            recommendations.push("练习不同语速的朗读，提高自然度。");
        } else {
            recommendations.push("发音非常优秀！继续保持。");
            recommendations.push("挑战更复杂的内容，如新闻演讲或诗歌。");
        }
        
        // 根据难度分布给出建议
        if (difficulty.hard > 0) {
            recommendations.push(`文中包含${difficulty.hard}个难词，建议单独练习这些单词。`);
        }
        
        // 添加具体问题的建议
        if (specificProblems.length > 0) {
            recommendations.push("需要重点注意以下发音：");
            specificProblems.forEach(problem => {
                recommendations.push(`• ${problem.word}: ${problem.suggestion}`);
            });
        }
        
        // 添加常规建议
        this.recommendations.general.forEach(rec => {
            recommendations.push(rec);
        });
        
        return recommendations;
    }
};

// 导出数据供主脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pronunciationData;
}