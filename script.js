// 语音朗读评分系统 - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 全局变量
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let recordingTime = 0;
    let timerInterval = null;
    let recordedBlob = null;
    
    // 示例练习内容
    const exercises = [
        "Hello world, welcome to our English class. Today we will learn about pronunciation.",
        "The quick brown fox jumps over the lazy dog. She sells seashells by the seashore.",
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        "I scream, you scream, we all scream for ice cream. Peter Piper picked a peck of pickled peppers.",
        "Good morning, good evening, and good night. Practice makes perfect."
    ];
    
    // 引用发音数据
    let pronunciationData = null;
    
    // 动态加载发音数据
    function loadPronunciationData() {
        // 如果是独立文件，这里使用import
        // 在HTML中通过script标签加载
        if (typeof pronunciationData === 'undefined') {
            // 简单版的单词库
            pronunciationData = {
                getWordInfo: function(word) {
                    const wordLib = {
                        "hello": { phonetic: "həˈloʊ", syllables: ["he", "llo"], stress: 2, difficulty: "easy" },
                        "world": { phonetic: "wɜːrld", syllables: ["world"], stress: 1, difficulty: "easy" },
                        "welcome": { phonetic: "ˈwelkəm", syllables: ["wel", "come"], stress: 1, difficulty: "easy" },
                        "english": { phonetic: "ˈɪŋɡlɪʃ", syllables: ["eng", "lish"], stress: 1, difficulty: "medium" },
                        "pronunciation": { phonetic: "prəˌnʌnsiˈeɪʃn", syllables: ["pro", "nun", "ci", "a", "tion"], stress: 4, difficulty: "hard" },
                        "quick": { phonetic: "kwɪk", syllables: ["quick"], stress: 1, difficulty: "easy" },
                        "brown": { phonetic: "braʊn", syllables: ["brown"], stress: 1, difficulty: "easy" },
                        "fox": { phonetic: "fɑːks", syllables: ["fox"], stress: 1, difficulty: "easy" },
                        "jumps": { phonetic: "dʒʌmps", syllables: ["jumps"], stress: 1, difficulty: "easy" },
                        "lazy": { phonetic: "ˈleɪzi", syllables: ["la", "zy"], stress: 1, difficulty: "medium" },
                        "dog": { phonetic: "dɔːɡ", syllables: ["dog"], stress: 1, difficulty: "easy" },
                        "she": { phonetic: "ʃiː", syllables: ["she"], stress: 1, difficulty: "easy" },
                        "sells": { phonetic: "selz", syllables: ["sells"], stress: 1, difficulty: "easy" },
                        "seashells": { phonetic: "ˈsiːʃelz", syllables: ["sea", "shells"], stress: 1, difficulty: "medium" },
                        "seashore": { phonetic: "ˈsiːʃɔːr", syllables: ["sea", "shore"], stress: 1, difficulty: "medium" },
                        "wood": { phonetic: "wʊd", syllables: ["wood"], stress: 1, difficulty: "easy" },
                        "woodchuck": { phonetic: "ˈwʊdtʃʌk", syllables: ["wood", "chuck"], stress: 1, difficulty: "hard" },
                        "could": { phonetic: "kʊd", syllables: ["could"], stress: 1, difficulty: "medium" }
                    };
                    
                    const lowerWord = word.toLowerCase();
                    if (wordLib[lowerWord]) {
                        return {
                            word: word,
                            phonetic: wordLib[lowerWord].phonetic,
                            syllables: wordLib[lowerWord].syllables,
                            stress: wordLib[lowerWord].stress,
                            difficulty: wordLib[lowerWord].difficulty,
                            commonMistakes: [],
                            hasInfo: true
                        };
                    } else {
                        return {
                            word: word,
                            phonetic: "未收录",
                            syllables: [word],
                            stress: 1,
                            difficulty: "unknown",
                            commonMistakes: [],
                            hasInfo: false
                        };
                    }
                },
                
                analyzeText: function(text) {
                    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
                    const analyzedWords = words.map(word => this.getWordInfo(word));
                    
                    const difficultyCount = { easy: 0, medium: 0, hard: 0, unknown: 0 };
                    analyzedWords.forEach(word => {
                        difficultyCount[word.difficulty] = (difficultyCount[word.difficulty] || 0) + 1;
                    });
                    
                    return {
                        wordCount: words.length,
                        uniqueWords: [...new Set(words)],
                        analyzedWords: analyzedWords,
                        difficulty: difficultyCount,
                        estimatedTime: Math.ceil(words.length * 1.5)
                    };
                },
                
                generateRecommendations: function(score, difficulty, specificProblems = []) {
                    const recommendations = [];
                    
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
                    
                    if (difficulty.hard > 0) {
                        recommendations.push(`文中包含${difficulty.hard}个难词，建议单独练习。`);
                    }
                    
                    if (specificProblems.length > 0) {
                        recommendations.push("需要重点注意以下发音：");
                        const uniqueProblems = [];
                        const seen = new Set();
                        specificProblems.forEach(problem => {
                            if (!seen.has(problem.word)) {
                                seen.add(problem.word);
                                uniqueProblems.push(problem);
                            }
                        });
                        
                        uniqueProblems.slice(0, 5).forEach(problem => {
                            recommendations.push(`• ${problem.word}: ${problem.suggestion}`);
                        });
                    }
                    
                    recommendations.push("每天坚持练习，时间比长度更重要");
                    recommendations.push("将录音分享给老师获取专业反馈");
                    
                    return recommendations;
                }
            };
        }
    }

    // DOM 元素
    const tabButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const exerciseText = document.getElementById('exercise-text');
    const playSampleBtn = document.getElementById('play-sample');
    const changeExerciseBtn = document.getElementById('change-exercise');
    const startRecordBtn = document.getElementById('start-record');
    const stopRecordBtn = document.getElementById('stop-record');
    const playRecordBtn = document.getElementById('play-record');
    const analyzeBtn = document.getElementById('analyze-btn');
    const timer = document.getElementById('timer');
    const resultSection = document.getElementById('result-section');
    const problemWordsDiv = document.getElementById('problem-words');
    const suggestionsDiv = document.getElementById('suggestions');
    const checkDictationBtn = document.getElementById('check-dictation');
    const uploadImageBtn = document.getElementById('upload-image');
    const imageInput = document.getElementById('image-input');

    // 1. 标签页切换功能
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 更新活动按钮
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应内容
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            const activeContent = document.getElementById(`${tabId}-tab`);
            if (activeContent) {
                activeContent.classList.add('active');
                activeContent.style.display = 'block';
            }
        });
    });

    // 2. 练习管理功能
    function changeExercise() {
        const randomIndex = Math.floor(Math.random() * exercises.length);
        exerciseText.textContent = exercises[randomIndex];
    }

    changeExerciseBtn.addEventListener('click', changeExercise);

    // 3. 录音功能
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });
            
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                recordedBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(recordedBlob);
                document.getElementById('recorded-audio').src = audioUrl;
                
                // 启用播放和分析按钮
                playRecordBtn.disabled = false;
                analyzeBtn.disabled = false;
                
                // 停止计时器
                clearInterval(timerInterval);
                isRecording = false;
                
                console.log('录音完成，时长:', recordingTime, '秒');
            };
            
            mediaRecorder.start();
            isRecording = true;
            
            // 启用停止按钮，禁用开始按钮
            startRecordBtn.disabled = true;
            stopRecordBtn.disabled = false;
            
            // 开始计时
            recordingTime = 0;
            updateTimer();
            timerInterval = setInterval(() => {
                recordingTime++;
                updateTimer();
            }, 1000);
            
            console.log('开始录音...');
            
        } catch (error) {
            console.error('无法访问麦克风:', error);
            alert('无法访问麦克风，请确保已授予权限。');
            startRecordBtn.disabled = false;
        }
    }

    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            
            // 停止所有轨道
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            startRecordBtn.disabled = false;
            stopRecordBtn.disabled = true;
        }
    }

    function updateTimer() {
        const minutes = Math.floor(recordingTime / 60).toString().padStart(2, '0');
        const seconds = (recordingTime % 60).toString().padStart(2, '0');
        timer.textContent = `${minutes}:${seconds}`;
    }

    // 4. 音频播放功能
    function playRecording() {
        const audio = document.getElementById('recorded-audio');
        if (audio.src) {
            audio.play();
        }
    }

    // 5. 发音分析功能
    function analyzePronunciation() {
        if (!recordedBlob) {
            alert('请先录制一段音频。');
            return;
        }
        
        // 加载发音数据
        loadPronunciationData();
        
        // 模拟分析过程
        showLoading();
        
        // 延迟模拟分析过程
        setTimeout(() => {
            const exerciseTextContent = exerciseText.textContent;
            const textAnalysis = pronunciationData.analyzeText(exerciseTextContent);
            
            // 基于文本难度和个人表现计算分数
            const baseScore = calculateBaseScore(textAnalysis);
            const problems = generateProblems(textAnalysis);
            const recommendations = pronunciationData.generateRecommendations(
                baseScore, 
                textAnalysis.difficulty, 
                problems
            );
            
            displayResults(baseScore, problems, recommendations, textAnalysis);
        }, 2000);
    }
    
    function calculateBaseScore(textAnalysis) {
        // 基于文本难度和个人表现的综合评分
        const { difficulty, wordCount } = textAnalysis;
        
        // 基础分
        let baseScore = 70;
        
        // 难度调整：难词多则分数可能降低
        const hardPercentage = difficulty.hard / wordCount;
        if (hardPercentage > 0.3) {
            baseScore -= 10;
        } else if (hardPercentage > 0.1) {
            baseScore -= 5;
        }
        
        // 随机波动（模拟用户实际表现）
        const randomAdjustment = Math.floor(Math.random() * 20) - 10; // -10 到 +10
        baseScore += randomAdjustment;
        
        // 确保分数在合理范围内
        return Math.max(30, Math.min(98, baseScore));
    }

    function showLoading() {
        problemWordsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在分析发音...</div>';
        suggestionsDiv.innerHTML = '';
        resultSection.style.display = 'block';
        
        // 临时禁用按钮
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
    }

    function generateProblems(textAnalysis) {
        const { analyzedWords, difficulty } = textAnalysis;
        const problems = [];
        
        // 根据单词难度和随机因素选择问题单词
        const allWords = analyzedWords.filter(word => word.hasInfo);
        
        // 优先选择难词
        const hardWords = allWords.filter(word => word.difficulty === "hard");
        const mediumWords = allWords.filter(word => word.difficulty === "medium");
        const easyWords = allWords.filter(word => word.difficulty === "easy");
        
        // 选择问题单词 (最多5个)
        const maxProblems = 5;
        let selectedWords = [];
        
        // 优先添加难词
        if (hardWords.length > 0) {
            const count = Math.min(2, hardWords.length);
            selectedWords.push(...hardWords.slice(0, count));
        }
        
        // 然后添加中等难度的词
        if (selectedWords.length < maxProblems && mediumWords.length > 0) {
            const remaining = maxProblems - selectedWords.length;
            const count = Math.min(remaining, mediumWords.length);
            selectedWords.push(...mediumWords.slice(0, count));
        }
        
        // 最后如果有剩余空间，添加简单词
        if (selectedWords.length < maxProblems && easyWords.length > 0) {
            const remaining = maxProblems - selectedWords.length;
            const count = Math.min(remaining, easyWords.length);
            selectedWords.push(...easyWords.slice(0, count));
        }
        
        // 为每个选择的单词生成具体问题
        selectedWords.forEach(wordInfo => {
            const problem = {
                word: wordInfo.word,
                correctPronunciation: wordInfo.phonetic,
                userPronunciation: "需改进",
                suggestion: generateWordSuggestion(wordInfo)
            };
            
            problems.push(problem);
        });
        
        // 如果没有收集到足够的问题，添加一些通用建议
        if (problems.length < 3) {
            const fallbackWords = ["pronunciation", "intonation", "fluency"];
            fallbackWords.forEach(word => {
                if (!problems.find(p => p.word === word)) {
                    problems.push({
                        word: word,
                        correctPronunciation: "标准发音",
                        userPronunciation: "需练习",
                        suggestion: "提高整体发音准确度"
                    });
                }
            });
        }
        
        return problems;
    }
    
    function generateWordSuggestion(wordInfo) {
        const { word, syllables, stress, difficulty } = wordInfo;
        const suggestions = [];
        
        if (syllables.length > 2) {
            suggestions.push(`这是一个多音节词，注意音节划分：${syllables.join("-")}`);
        }
        
        if (stress > 1) {
            suggestions.push(`重音在第${stress}个音节`);
        }
        
        if (difficulty === "hard") {
            suggestions.push("这是一个难度较高的单词，建议多次重复练习");
        } else if (difficulty === "medium") {
            suggestions.push("注意发音细节，可以录制后与标准发音对比");
        }
        
        return suggestions.length > 0 ? suggestions.join("；") : "注意发音准确性";
    }

    function generateRecommendations(score) {
        const recommendations = [];
        
        if (score < 70) {
            recommendations.push("基础发音需要加强，建议从元音字母发音开始练习。");
            recommendations.push("每天练习15分钟，重点练习重音和语调。");
        } else if (score < 85) {
            recommendations.push("发音整体不错，注意个别单词的重音位置。");
            recommendations.push("多听标准发音，模仿语音语调。");
        } else {
            recommendations.push("发音很棒！继续保持，可以挑战更难的内容。");
            recommendations.push("尝试不同语速的朗读，提高口语流畅度。");
        }
        
        recommendations.push("建议下载录音反复听，对比标准发音。");
        recommendations.push("将练习内容分享给老师或同学，获取更多反馈。");
        
        return recommendations;
    }

    function displayResults(score, problems, recommendations, textAnalysis = null) {
        // 更新分数
        document.getElementById('score-value').textContent = score;
        
        // 更新分数条
        const scoreItems = document.querySelectorAll('.score-item');
        const scores = [
            Math.max(40, Math.min(98, score + Math.floor(Math.random() * 10) - 5)), // 发音准确度
            Math.max(50, Math.min(95, score + Math.floor(Math.random() * 15) - 10)), // 语调流畅度
            Math.max(45, Math.min(95, score + Math.floor(Math.random() * 12) - 8)) // 节奏掌握
        ];
        
        scoreItems.forEach((item, index) => {
            const fill = item.querySelector('.score-fill');
            const number = item.querySelector('.score-number');
            const newScore = scores[index];
            
            // 重置宽度以触发动画
            fill.style.width = '0%';
            fill.offsetHeight; // 强制重绘
            
            setTimeout(() => {
                fill.style.transition = 'width 1.5s ease-in-out';
                fill.style.width = `${newScore}%`;
                number.textContent = `${newScore}%`;
            }, 100 * index);
        });
        
        // 显示问题单词
        problemWordsDiv.innerHTML = '';
        if (problems.length > 0) {
            problems.forEach(problem => {
                const wordDiv = document.createElement('div');
                wordDiv.className = 'word-item';
                wordDiv.title = `点击听标准发音建议`;
                wordDiv.innerHTML = `
                    <strong>${problem.word}</strong>
                    <div class="phonetic">
                        <small>音标: </small>
                        <span class="correct">${problem.correctPronunciation}</span>
                    </div>
                    <div class="suggestion">${problem.suggestion}</div>
                `;
                problemWordsDiv.appendChild(wordDiv);
                
                // 点击播放标准发音（模拟）
                wordDiv.addEventListener('click', function() {
                    playSampleBtn.click();
                    
                    // 显示提示
                    wordDiv.style.background = '#f0f9ff';
                    wordDiv.style.borderColor = '#4a6fa5';
                    setTimeout(() => {
                        wordDiv.style.background = '';
                        wordDiv.style.borderColor = '';
                    }, 1000);
                });
            });
        } else {
            problemWordsDiv.innerHTML = '<div class="no-problems"><i class="fas fa-check-circle"></i> 未发现明显发音问题</div>';
        }
        
        // 显示建议
        suggestionsDiv.innerHTML = '';
        if (recommendations.length > 0) {
            recommendations.forEach(rec => {
                const p = document.createElement('p');
                p.innerHTML = `<i class="fas fa-chevron-right"></i> ${rec}`;
                suggestionsDiv.appendChild(p);
            });
        }
        
        // 添加文本分析信息
        if (textAnalysis) {
            const analysisInfo = document.createElement('div');
            analysisInfo.className = 'analysis-info';
            analysisInfo.innerHTML = `
                <div class="analysis-summary">
                    <span>文本分析: ${textAnalysis.wordCount}个单词 | 
                    难度: ${textAnalysis.difficulty.easy}易/${textAnalysis.difficulty.medium}中/${textAnalysis.difficulty.hard}难 |
                    预计练习时间: ${textAnalysis.estimatedTime}秒</span>
                </div>
            `;
            suggestionsDiv.appendChild(analysisInfo);
        }
        
        // 启用分析按钮
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-chart-line"></i> 分析发音';
        
        // 滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 添加分享功能提示
        setTimeout(() => {
            const shareTip = document.createElement('p');
            shareTip.className = 'share-tip';
            shareTip.innerHTML = `<i class="fas fa-share-alt"></i> 可将评分结果截图分享到微信群`;
            suggestionsDiv.appendChild(shareTip);
        }, 500);
    }

    // 6. 听写批改功能
    function checkDictation() {
        const dictationText = document.getElementById('dictation-text').value.trim();
        const studentText = document.getElementById('student-text').value.trim();
        
        if (!dictationText || !studentText) {
            alert('请填写听写原文和学生答案。');
            return;
        }
        
        // 模拟批改过程
        const dictationWords = dictationText.toLowerCase().split(/[,\s\.]+/).filter(w => w);
        const studentWords = studentText.toLowerCase().split(/[,\s\.]+/).filter(w => w);
        
        let correct = 0;
        let wrong = [];
        
        for (let i = 0; i < Math.min(dictationWords.length, studentWords.length); i++) {
            if (dictationWords[i] === studentWords[i]) {
                correct++;
            } else {
                wrong.push({
                    index: i + 1,
                    correct: dictationWords[i],
                    student: studentWords[i]
                });
            }
        }
        
        const score = Math.round(correct / dictationWords.length * 100);
        displayDictationResult(score, correct, dictationWords.length, wrong);
    }

    function displayDictationResult(score, correct, total, wrongWords) {
        const resultDiv = document.getElementById('dictation-result');
        const correctionDisplay = resultDiv.querySelector('.correction-display');
        
        let html = `
            <div class="score-display">
                <div class="overall-score">
                    <div class="score-circle">
                        <span>${score}</span>
                        <small>分</small>
                    </div>
                    <div class="score-label">听写得分</div>
                </div>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span class="score-title">正确单词</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${score}%"></div>
                        </div>
                        <span class="score-number">${correct}/${total}</span>
                    </div>
                </div>
            </div>
        `;
        
        if (wrongWords.length > 0) {
            html += `
                <div class="word-analysis">
                    <h4>错词纠正</h4>
                    <div class="wrong-words">
            `;
            
            wrongWords.forEach(item => {
                html += `
                    <div class="wrong-item">
                        第${item.index}个单词：
                        <span class="wrong-word">${item.student}</span> → 
                        <span class="correct-word">${item.correct}</span>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // 添加批改建议
        let suggestion = '';
        if (score >= 90) {
            suggestion = '太棒了！继续保持，可以挑战更长的听写内容。';
        } else if (score >= 70) {
            suggestion = '还不错，注意容易拼错的单词，多写多练。';
        } else if (score >= 50) {
            suggestion = '需要加强练习，建议每天练习10分钟听写。';
        } else {
            suggestion = '基础需要加强，建议从简单单词开始练习。';
        }
        
        html += `
            <div class="recommendations">
                <h4><i class="fas fa-lightbulb"></i> 批改建议</h4>
                <div class="suggestions">
                    <p>${suggestion}</p>
                    <p>建议将错词抄写3遍，加深记忆。</p>
                </div>
            </div>
        `;
        
        correctionDisplay.innerHTML = html;
        resultDiv.style.display = 'block';
        
        // 滚动到结果
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // 7. 图片上传功能
    function handleImageUpload() {
        imageInput.click();
    }

    function handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件。');
            return;
        }
        
        // 模拟图片文字识别
        const reader = new FileReader();
        reader.onload = function(e) {
            // 模拟OCR识别的文字
            const studentText = document.getElementById('student-text');
            studentText.value = "识别结果正在处理...";
            
            // 延迟显示"识别结果"
            setTimeout(() => {
                studentText.value = "apple, banana, cat, dog, elephant, flower, garden, house, igloo, jungle";
            }, 1500);
        };
        reader.readAsDataURL(file);
    }

    // 8. 事件监听器绑定
    startRecordBtn.addEventListener('click', startRecording);
    stopRecordBtn.addEventListener('click', stopRecording);
    playRecordBtn.addEventListener('click', playRecording);
    analyzeBtn.addEventListener('click', analyzePronunciation);
    playSampleBtn.addEventListener('click', () => {
        const audio = document.getElementById('sample-audio');
        audio.play();
    });
    checkDictationBtn.addEventListener('click', checkDictation);
    uploadImageBtn.addEventListener('click', handleImageUpload);
    imageInput.addEventListener('change', handleImageSelect);

    // 9. 初始化
    function initialize() {
        console.log('语音朗读评分系统已初始化');
        
        // 初始显示一个练习
        changeExercise();
        
        // 初始化示例单词问题显示
        const demoProblems = [
            { word: "hello", correctPronunciation: "həˈloʊ", suggestion: "注意重音在第二个音节" },
            { word: "pronunciation", correctPronunciation: "prəˌnʌnsiˈeɪʃn", suggestion: "注意音节的划分" }
        ];
        
        demoProblems.forEach(problem => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word-item';
            wordDiv.innerHTML = `
                <strong>${problem.word}</strong>
                <div class="pronunciation">
                    标准: <span class="correct">${problem.correctPronunciation}</span>
                </div>
                <div class="suggestion">${problem.suggestion}</div>
            `;
            problemWordsDiv.appendChild(wordDiv);
        });
        
        // 初始显示一些建议
        const demoRecommendations = [
            "点击红色单词可以听到标准发音",
            "录音后点击'分析发音'查看详细评分",
            "老师可以将本页面链接分享到微信群"
        ];
        
        demoRecommendations.forEach(rec => {
            const p = document.createElement('p');
            p.textContent = rec;
            suggestionsDiv.appendChild(p);
        });
    }

    // 10. 工具函数
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 启动初始化
    initialize();
});