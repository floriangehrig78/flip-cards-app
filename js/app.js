// Hauptanwendung
class FlipCardsApp {
    constructor() {
        this.cards = CardsStorage.load();
        this.currentFilter = 'Alle';
        this.nextId = Math.max(...this.cards.map(c => c.id), 0) + 1;
        
        this.init();
    }
    
    init() {
        this.renderFilterButtons();
        this.renderCards();
        this.setupEventListeners();
    }
    
    // Alle Kategorien ermitteln
    getCategories() {
        const categories = [...new Set(this.cards.map(card => card.category))];
        return ['Alle', ...categories.sort()];
    }
    
    // Filter-Buttons rendern
    renderFilterButtons() {
        const container = document.getElementById('filterButtons');
        const categories = this.getCategories();
        
        container.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat === this.currentFilter ? 'active' : ''}" 
                    data-category="${cat}">
                ${cat}
            </button>
        `).join('');
        
        // Event Listeners für Filter
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.category;
                this.renderFilterButtons();
                this.renderCards();
            });
        });
    }
    
    // Karten filtern
    getFilteredCards() {
        if (this.currentFilter === 'Alle') {
            return this.cards;
        }
        return this.cards.filter(card => card.category === this.currentFilter);
    }
    
    // Karten rendern
    renderCards() {
        const container = document.getElementById('cardsGrid');
        const filteredCards = this.getFilteredCards();
        
        if (filteredCards.length === 0) {
            container.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Keine Karten in dieser Kategorie</p>';
            return;
        }
        
        container.innerHTML = filteredCards.map(card => `
            <div class="card-container" data-id="${card.id}">
                <div class="card">
                    <div class="card-face card-front">
                        <button class="delete-btn" data-id="${card.id}">×</button>
                        <span class="card-category">${card.category}</span>
                        <div>${card.front}</div>
                    </div>
                    <div class="card-face card-back">
                        <div>${card.back}</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Event Listeners für Karten
        this.setupCardListeners();
    }
    
    // Event Listeners für Karten
    setupCardListeners() {
        // Flip-Funktionalität
        document.querySelectorAll('.card-container').forEach(container => {
            container.addEventListener('click', (e) => {
                // Nicht flippen, wenn Delete-Button geklickt wurde
                if (e.target.classList.contains('delete-btn')) {
                    return;
                }
                const card = container.querySelector('.card');
                card.classList.toggle('flipped');
            });
        });
        
        // Delete-Buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.target.dataset.id);
                this.deleteCard(id);
            });
        });
    }
    
    // Karte löschen
    deleteCard(id) {
        if (confirm('Möchtest du diese Karte wirklich löschen?')) {
            this.cards = this.cards.filter(card => card.id !== id);
            CardsStorage.save(this.cards);
            this.renderFilterButtons(); // Kategorien könnten sich geändert haben
            this.renderCards();
        }
    }
    
    // Neue Karte hinzufügen
    addCard(front, back, category) {
        const newCard = {
            id: this.nextId++,
            front: front,
            back: back,
            category: category
        };
        
        this.cards.push(newCard);
        CardsStorage.save(this.cards);
        this.renderFilterButtons(); // Neue Kategorie könnte hinzugefügt worden sein
        this.renderCards();
    }
    
    // Event Listeners einrichten
    setupEventListeners() {
        const modal = document.getElementById('cardModal');
        const addBtn = document.getElementById('addCardBtn');
        const closeBtn = document.querySelector('.close');
        const form = document.getElementById('cardForm');
        
        // Modal öffnen
        addBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        
        // Modal schließen
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            form.reset();
        });
        
        // Modal schließen beim Klick außerhalb
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                form.reset();
            }
        });
        
        // Formular absenden
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const front = document.getElementById('frontText').value.trim();
            const back = document.getElementById('backText').value.trim();
            const category = document.getElementById('category').value.trim();
            
            if (front && back && category) {
                this.addCard(front, back, category);
                modal.style.display = 'none';
                form.reset();
            }
        });
    }
}

// App starten, wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new FlipCardsApp();
});
