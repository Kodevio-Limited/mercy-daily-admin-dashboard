const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(dirPath);
    });
}

function titleCase(str) {
    if (!str) return '';
    const parts = str.split('.');
    const last = parts[parts.length - 1];
    const words = last.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    return words;
}

function processFile(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Remove imports
    content = content.replace(/import\s*\{\s*useTranslation\s*\}\s*from\s*['"]react-i18next['"];?\s*\n?/g, '');
    content = content.replace(/import\s*['"]@\/lib\/i18n['"];?\s*\n?/g, '');
    
    // 2. Remove hooks
    content = content.replace(/const\s*\{\s*t\s*\}\s*=\s*useTranslation\(\);?\s*\n?/g, '');

    // 3. Replace t('key', 'Fallback') or t("key", "Fallback")
    content = content.replace(/t\(\s*['"](.*?)['"]\s*,\s*(['"](.*?)['"])\s*\)/g, (match, key, fullFallbackStr) => {
        return fullFallbackStr;
    });

    // 4. Replace t('key', { defaultValue: 'Fallback' })
    content = content.replace(/t\(\s*['"](.*?)['"]\s*,\s*\{\s*defaultValue:\s*(['"](.*?)['"])\s*\}\s*\)/g, (match, key, fullFallbackStr) => {
        return fullFallbackStr;
    });

    // 5. Replace t('key') with title-cased key
    content = content.replace(/t\(\s*['"](.*?)['"]\s*\)/g, (match, key) => {
        return `'${titleCase(key)}'`;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

const srcDir = path.join(__dirname, 'src');
walkDir(srcDir, processFile);
console.log('Done processing files.');
