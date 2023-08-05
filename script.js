let articles = []; // 將 articles 陣列定義在全局範圍內

fetch('300_tang_poems.txt')
    .then(response => response.text())
    .then(textContent => {
        const articlesArray = textContent.split('\n\n');
        articles = articlesArray.map(article => {
            const articleLines = article.split('\n');
            const title = articleLines[0].replace('詩名:', '');
            const author = articleLines[1].replace('作者:', '');
            const form = articleLines[2].replace('詩體:', '');
            const content = articleLines.slice(3).join('\n').replace('詩文:', '');
            const wordCount = countWords(content);
            return { title, author, form, content, wordCount };
        });
        articles.sort((a, b) => a.wordCount - b.wordCount);

        showAllPoems();
    })



// 搜尋詩集的函式
function searchPoems() {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
    const poemContainer = document.getElementById('poem-container');
    poemContainer.innerHTML = ''; // 清空詩集容器

    articles.forEach((poem, index) => {
        if (poem.content.toLowerCase().includes(searchTerm)) {
            const highlightedContent = poem.content.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);

            const poemDiv = document.createElement('div');
            poemDiv.innerHTML = `<div class="poem-info">
                <p>${poem.title}</p>
                <p>字數：${poem.wordCount}</p>
            </div>
            <div class="poem-info">
            <p>作者：${poem.author}</p>
            <p>${poem.form}</p>
            </div>
            <p>${highlightedContent}</p>`;

            poemContainer.appendChild(poemDiv);
            poemContainer.appendChild(document.createElement('hr'));
        }
    });

    removeLastSeparator(poemContainer);
}

function countWords(str) {
    // 使用中文正規表達式匹配中文詞彙，並將字串轉換為詞彙陣列
    const chineseWords = str.match(/[\u4e00-\u9fa5]+/g);
    const chineseWordCount = chineseWords ? chineseWords.join('').length : 0;

    // 使用英文正規表達式匹配英文單詞，並將字串轉換為單詞陣列
    const englishWords = str.match(/\b\w+\b/g);
    const englishWordCount = englishWords ? englishWords.join('').length : 0;

    // 總字數為中文詞彙數 + 英文單詞數
    return chineseWordCount + englishWordCount;
}

function removeLastSeparator(container) {
    const separators = container.getElementsByTagName('hr');
    if (separators.length > 0) {
        separators[separators.length - 1].remove();
    }
}

let selectedWordCount = null; // 用來記錄選取的字數篩選條件

// 篩選詩詞功能
function filterByWordCount(wordCount) {
    const poemContainer = document.getElementById('poem-container');
    poemContainer.innerHTML = ''; // 清空詩集容器

    // 取消其他按鈕的選取狀態
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });

    // 定義函式用於生成詩詞的 HTML 字符串
    function getPoemHTML(poem) {
        return `<div class="poem-info">
            <p>${poem.title}</p>
            <p>字數：${poem.wordCount}</p>
            </div>
            <div class="poem-info">
            <p>作者：${poem.author}</p>
            <p>${poem.form}</p>
            </div>
            <p>${poem.content}</p>`;
    }

    if (selectedWordCount !== wordCount) {
        // 只有當選取的字數篩選條件不同於已選取的時候，才進行篩選
        selectedWordCount = wordCount;

        // 根據選取的字數篩選詩詞並顯示
        // 根據選取的字數篩選詩詞並顯示
        if (wordCount === 60) {
            articles.filter(poem => poem.wordCount >= wordCount).forEach(poem => {
                const poemDiv = document.createElement('div');
                poemDiv.innerHTML = getPoemHTML(poem);

                poemContainer.appendChild(poemDiv);
                poemContainer.appendChild(document.createElement('hr'));
            });
        } else {
            articles.filter(poem => poem.wordCount === wordCount).forEach(poem => {
                const poemDiv = document.createElement('div');
                poemDiv.innerHTML = getPoemHTML(poem);

                poemContainer.appendChild(poemDiv);
                poemContainer.appendChild(document.createElement('hr'));
            });
        }

        removeLastSeparator(poemContainer);

        // 加入選取樣式
        const selectedButton = document.querySelector(`.filter-buttons button[data-word-count="${wordCount}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
    } else {
        // 若已經選取的按鈕再次點擊，則取消選取狀態並清空篩選
        selectedWordCount = null;
        showAllPoems();
    }
}

function showAllPoems() {
    const poemContainer = document.getElementById('poem-container');
    articles.forEach((poem, index) => {
        const poemDiv = document.createElement('div');
        poemDiv.innerHTML = `<div class="poem-info">
                                 <p>${poem.title}</p>
                                 <p>字數：${poem.wordCount}</p>
                                 </div>
                                 <div class="poem-info">
                                 <p>作者：${poem.author}</p>
                                 <p>${poem.form}</p>
                                 </div>
                                 <p>${poem.content}</p>`;

        poemContainer.appendChild(poemDiv);
        poemContainer.appendChild(document.createElement('hr'));

        // Collect all word counts from articles
        const allWordCounts = articles.map(poem => poem.wordCount);

        // Get unique word counts
        const uniqueWordCounts = [...new Set(allWordCounts)];

        // Sort the unique word counts in ascending order
        uniqueWordCounts.sort((a, b) => a - b);

        // Display the unique word counts on the webpage
        const wordCountInfo = document.getElementById('word-count-info');
        wordCountInfo.textContent = `Unique Word Counts: ${uniqueWordCounts.join(', ')}`;
    });
    removeLastSeparator(poemContainer);
}

// 滾動事件處理函式
function handleScroll() {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;

    if (scrollY > prevScrollPos) {
        // 向下滾動，隱藏 header
        header.classList.add('hidden');
    } else {
        // 向上滾動，顯示 header
        header.classList.remove('hidden');
    }

    prevScrollPos = scrollY;
}

let prevScrollPos = 0;
window.addEventListener('scroll', handleScroll);