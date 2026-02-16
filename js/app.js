// Hilfskarten Anwendung
class HelpCardsApp {
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
            container.innerHTML = '<div class="empty-state">Keine Hilfskarten in dieser Kategorie</div>';
            return;
        }
        
        container.innerHTML = filteredCards.map(card => this.createCardHTML(card)).join('');
        this.setupCardListeners();
    }
    
    // Einzelne Karte HTML erstellen
    createCardHTML(card) {
        const sectionsHTML = card.sections.map(section => `
            <div class="info-section">
                <h3>${this.escapeHtml(section.title)}</h3>
                <p>${this.escapeHtml(section.text)}</p>
            </div>
        `).join('');
        
        return `
            <div class="card-container" data-id="${card.id}">
                <div class="card">
                    <div class="card-face card-front">
                        <button class="delete-btn" data-id="${card.id}">×</button>
                        <span class="card-category">${this.escapeHtml(card.category)}</span>
                        <img src="${card.imageUrl}" 
                             alt="${this.escapeHtml(card.title)}" 
                             class="card-image"
                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2224%22%3EKein Bild%3C/text%3E%3C/svg%3E'">
                        <div class="card-title">${this.escapeHtml(card.title)}</div>
                    </div>
                    <div class="card-face card-back">
                        ${sectionsHTML}
                    </div>
                </div>
            </div>
        `;
    }
    
    // XSS Schutz
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Event Listeners für Karten
    setupCardListeners() {
        // Flip-Funktionalität
        document.querySelectorAll('.card-container').forEach(container => {
            container.addEventListener('click', (e) => {
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
        if (confirm('Möchtest du diese Hilfskarte wirklich löschen?')) {
            this.cards = this.cards.filter(card => card.id !== id);
            CardsStorage.save(this.cards);
            this.renderFilterButtons();
            this.renderCards();
        }
    }
    
    // Neue Karte hinzufügen
    addCard(cardData) {
        const newCard = {
            id: this.nextId++,
            title: cardData.title,
            imageUrl: cardData.imageUrl,
            category: cardData.category,
            sections: cardData.sections
        };
        
        this.cards.push(newCard);
        CardsStorage.save(this.cards);
        this.renderFilterButtons();
        this.renderCards();
    }
    
    // Event Listeners einrichten
    setupEventListeners() {
        const modal = document.getElementById('cardModal');
        const addBtn = document.getElementById('addCardBtn');
        const closeBtn = document.querySelector('.close');
        const form = document.getElementById('cardForm');
        const imageFile = document.getElementById('imageFile');
        
        // Modal öffnen
        addBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        
        // Modal schließen
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            form.reset();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                form.reset();
            }
        });
        
        // Bild-Upload Handler
        imageFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('imageUrl').value = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Formular absenden
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const cardData = {
                title: document.getElementById('title').value.trim(),
                imageUrl: document.getElementById('imageUrl').value.trim() || 
                         'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23667eea%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22white%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2224%22%3EHilfskarte%3C/text%3E%3C/svg%3E',
                category: document.getElementById('category').value.trim(),
                sections: [
                    {
                        title: document.getElementById('section1Title').value.trim(),
                        text: document.getElementById('section1Text').value.trim()
                    },
                    {
                        title: document.getElementById('section2Title').value.trim(),
                        text: document.getElementById('section2Text').value.trim()
                    },
                    {
                        title: document.getElementById('section3Title').value.trim(),
                        text: document.getElementById('section3Text').value.trim()
                    }
                ]
            };
            
            // Validierung
            if (cardData.title && cardData.category && 
                cardData.sections.every(s => s.title && s.text)) {
                this.addCard(cardData);
                modal.style.display = 'none';
                form.reset();
            } else {
                alert('Bitte fülle alle Felder aus!');
            }
        });
    }
}

// App starten
document.addEventListener('DOMContentLoaded', () => {
    new HelpCardsApp();
});
