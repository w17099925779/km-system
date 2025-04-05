class KeySystem {
    constructor() {
        this.storageKey = 'kmSystem';
        this.keys = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }
    
    generate(num = 1) {
        const newKeys = Array.from({ length: num }, () => {
            const key = 'KM-' + crypto.getRandomValues(new Uint32Array(2)).join('-');
            return { key, used: false };
        });
        
        this.keys.push(...newKeys);
        this.save();
        return newKeys;
    }
    
    validate(inputKey) {
        const target = this.keys.find(k => k.key === inputKey && !k.used);
        if (target) {
            target.used = true;
            this.save();
            return true;
        }
        return false;
    }
    
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.keys));
    }
}

const keySystem = new KeySystem();

// 初始化事件
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('apkFile').addEventListener('change', e => {
        document.getElementById('fileName').textContent = e.target.files[0]?.name || '';
    });
    updateKeyList();
});

function generate() {
    const num = parseInt(document.getElementById('keyNum').value) || 5;
    keySystem.generate(num);
    updateKeyList();
    alert(`成功生成 ${num} 个卡密！`);
}

async function startInject() {
    const file = document.getElementById('apkFile').files[0];
    if (!file) return alert('请先选择APK文件');
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '注入中...';
    
    // 模拟注入过程
    await new Promise(r => setTimeout(r, 1500));
    
    // 触发下载
    const a = document.createElement('a');
    a.href = 'fake.apk';
    a.download = `protected_${file.name}`;
    a.click();
    
    btn.disabled = false;
    btn.textContent = '开始注入';
}

function updateKeyList() {
    const box = document.getElementById('keyBox');
    box.innerHTML = keySystem.keys.map(k => `
        <div class="key-item">
            <span>${k.key}</span>
            <span style="color: ${k.used ? '#f00' : '#0a0'}">${k.used ? '已使用' : '未使用'}</span>
        </div>
    `).join('');
}