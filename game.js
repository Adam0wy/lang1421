const sugarRushGame = {
    state: 'start',
    selectedColor: '#f59e0b',
    blowCount: 0,
    maxBlows: 7,
    gameContainer: null,

    finalShapes: [
        { name: '金鱼', url: 'https://cdn.flipermag.com/flipermag/wp-content/uploads/2015/09/flipermag-2019-06-10_09-42-41_647522-900x500.png' },
        { name: '兔子', url: 'https://byfood.b-cdn.net/api/public/assets/8612/Japanese-Candy-Sculpture-Amezaiku-Rabbits?optimizer=image' },
        { name: '龙', url: 'https://www.lateshow.net/wp-content/uploads/2021/09/coverV2-2.jpg' }
    ],

    init() {
        this.gameContainer = document.getElementById('game-container');
        if (!this.gameContainer) return;

        this.addEventListeners();
        this.updateUI();
    },

    setState(newState) {
        this.state = newState;
        this.updateUI();
    },

    updateUI() {
        let content = '';
        switch (this.state) {
            case 'start':
                content = `
                    <p class="mb-6 text-center text-lg">准备好制作你的糖人了吗？</p>
                    <button id="start-game-btn" class="game-button">开始吹糖</button>
                `;
                break;
            case 'color-select':
                content = `
                    <p class="mb-6 text-center text-lg">第一步：选择糖的颜色</p>
                    <div class="flex space-x-4">
                        <div class="color-swatch" data-color="#f59e0b" style="background-color: #f59e0b;"></div>
                        <div class="color-swatch" data-color="#ef4444" style="background-color: #ef4444;"></div>
                        <div class="color-swatch" data-color="#22c55e" style="background-color: #22c55e;"></div>
                        <div class="color-swatch" data-color="#3b82f6" style="background-color: #3b82f6;"></div>
                    </div>
                    <button id="confirm-color-btn" class="game-button mt-8 opacity-50 cursor-not-allowed" disabled>选好了</button>
                `;
                break;
            case 'heating':
                content = `
                    <p class="mb-6 text-center text-lg">第二步：加热和揉捏糖块...</p>
                    <div id="sugar-lump" class="w-24 h-24 rounded-full heating" style="--color: ${this.selectedColor}40; background-color: ${this.selectedColor};"></div>
                `;
                setTimeout(() => this.setState('piping'), 2500);
                break;
            case 'piping':
                content = `
                    <p class="mb-6 text-center text-lg">第三步：将糖块固定在吹管上</p>
                    <div class="flex items-center">
                        <div class="w-40 h-4 bg-gray-300 rounded-l-full"></div>
                        <div class="w-16 h-16 rounded-full" style="background-color: ${this.selectedColor};"></div>
                    </div>
                `;
                setTimeout(() => this.setState('blowing'), 2000);
                break;
            case 'blowing':
                const progress = (this.blowCount / this.maxBlows) * 100;
                content = `
                    <p class="mb-6 text-center text-lg">第四步：吹气塑形！ (${this.blowCount}/${this.maxBlows})</p>
                    <div id="sugar-blob-container" class="relative w-48 h-48 flex items-center justify-center">
                        <div id="sugar-blob" class="w-16 h-16 rounded-full" style="background-color: ${this.selectedColor}; transform: scale(${1 + this.blowCount * 0.3});"></div>
                    </div>
                    <div class="w-full h-4 bg-gray-300 rounded-full mt-4 overflow-hidden">
                        <div class="h-full bg-primary rounded-full transition-all duration-300" style="width: ${progress}%"></div>
                    </div>
                    <button id="blow-btn" class="game-button mt-8">吹气</button>
                `;
                break;
            case 'finished':
                const randomShape = this.finalShapes[Math.floor(Math.random() * this.finalShapes.length)];
                content = `
                    <p class="mb-4 text-center text-2xl font-serif text-primary">完成了！</p>
                    <p class="mb-4 text-center text-lg">你制作了一个【${randomShape.name}】</p>
                    <img src="${randomShape.url}" alt="${randomShape.name}" class="w-48 h-48 object-contain rounded-lg my-4">
                    <button id="restart-game-btn" class="game-button mt-4">再玩一次</button>
                `;
                break;
        }
        this.gameContainer.innerHTML = content;
    },

    handleColorSelect(target) {
        this.selectedColor = target.dataset.color;
        this.gameContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        target.classList.add('selected');
        const confirmBtn = this.gameContainer.querySelector('#confirm-color-btn');
        confirmBtn.disabled = false;
        confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    },

    handleBlow() {
        if (this.blowCount < this.maxBlows) {
            this.blowCount++;
            if (this.blowCount === this.maxBlows) {
                this.setState('finished');
            } else {
                this.updateUI();
            }
        }
    },
    
    restart() {
        this.blowCount = 0;
        this.selectedColor = '#f59e0b';
        this.setState('start');
    },

    addEventListeners() {
        this.gameContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button, .color-swatch');
            if (!target) return;

            if (target.id === 'start-game-btn') {
                this.setState('color-select');
            } else if (target.classList.contains('color-swatch')) {
                this.handleColorSelect(target);
            } else if (target.id === 'confirm-color-btn' && !target.disabled) {
                this.setState('heating');
            } else if (target.id === 'blow-btn') {
                this.handleBlow();
            } else if (target.id === 'restart-game-btn') {
                this.restart();
            }
        });
    }
};

export function initGame() {
    sugarRushGame.init();
}
