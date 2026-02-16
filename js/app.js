// Hilfskarten Anwendung
class HelpCardsApp {
    constructor() {
        this.cards = CardsStorage.load();
        this.currentFilter = 'Alle';
        this.nextId = Math.max(...this.cards.map(c => c.id), 0) + 1;
        this.editingCardId = null;

        this.init();
    }

    init() {
        this.renderFilterButtons();
        this.renderCards();
        this.setupEventListeners();
    }

    // Alle Kategorien ermitteln (ohne "Alle")
    getCategories() {
        const categories = [...new Set(this.cards.map(card => card.category))];
        return ['Alle', ...categories.sort()];
    }
    
    // Nur die echten Kategorien (ohne "Alle")
    getRealCategories() {
        const categories = [...new Set(this.cards.map(card => card.category))];
        return categories.sort();
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
                        <button class="delete-btn" title="Löschen">×</button>
                        <button class="edit-btn" title="Bearbeiten">✎</button>
                        <span class="card-category">${this.escapeHtml(card.category)}</span>
                        <img src="${this.escapeHtml(card.imageUrl)}" 
                             alt="${this.escapeHtml(card.title)}" 
                             class="card-image"
                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2218%22%3EBild nicht verfügbar%3C/text%3E%3C/svg%3E'">
                        <div class="card-title">${this.escapeHtml(card.title)}</div>
                    </div>
                    <div class="card-face card-back">
                        ${sectionsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // Event Listeners für Karten
    setupCardListeners() {
        // Karten umdrehen
        document.querySelectorAll('.card-container').forEach(container => {
            container.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn') && !e.target.closest('.edit-btn')) {
                    container.querySelector('.card').classList.toggle('flipped');
                }
            });
        });

        // Löschen
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const container = e.target.closest('.card-container');
                const id = parseInt(container.dataset.id);
                
                if (confirm('Möchtest du diese Hilfskarte wirklich löschen?')) {
                    this.deleteCard(id);
                }
            });
        });

        // Bearbeiten
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const container = e.target.closest('.card-container');
                const id = parseInt(container.dataset.id);
                this.openEditModal(id);
            });
        });
    }

    // Modal zum Bearbeiten öffnen
    openEditModal(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        this.editingCardId = cardId;
        
        // Modal öffnen
        const modal = document.getElementById('cardModal');
        modal.style.display = 'block';
        
        // Titel ändern
        document.querySelector('#cardModal h2').textContent = 'Hilfskarte bearbeiten';
        
        // Kategorie-Feld aktualisieren
        this.renderCategoryField();
        
        // Felder ausfüllen
        document.getElementById('title').value = card.title;
        document.getElementById('imageUrl').value = card.imageUrl;
        
        // Kategorie setzen
        const categorySelect = document.getElementById('categorySelect');
        const categoryInput = document.getElementById('categoryInput');
        if (categorySelect) {
            categorySelect.value = card.category;
        } else if (categoryInput) {
            categoryInput.value = card.category;
        }
        
        // Sections ausfüllen
        card.sections.forEach((section, index) => {
            document.getElementById(`section${index + 1}Title`).value = section.title;
            document.getElementById(`section${index + 1}Text`).value = section.text;
        });
    }

    // Modal zurücksetzen
    resetModal() {
        this.editingCardId = null;
        document.querySelector('#cardModal h2').textContent = 'Neue Hilfskarte erstellen';
        document.getElementById('cardForm').reset();
        this.renderCategoryField();
    }

    // Kategorie-Feld rendern (Dropdown oder Input)
    renderCategoryField() {
        const container = document.getElementById('categoryContainer');
        const existingCategories = this.getRealCategories();
        
        if (existingCategories.length > 0) {
            // Dropdown mit Option für neue Kategorie
            container.innerHTML = `
                <label for="categorySelect">Kategorie:</label>
                <select id="categorySelect" required>
                    <option value="">-- Kategorie wählen --</option>
                    ${existingCategories.map(cat => 
                        `<option value="${this.escapeHtml(cat)}">${this.escapeHtml(cat)}</option>`
                    ).join('')}
                    <option value="__new__">➕ Neue Kategorie erstellen</option>
                </select>
                <div id="newCategoryContainer" style="display: none; margin-top: 10px;">
                    <label for="newCategoryInput">Neue Kategorie:</label>
                    <input type="text" id="newCategoryInput" placeholder="Name der neuen Kategorie">
                </div>
                <small>Wähle eine bestehende Kategorie oder erstelle eine neue</small>
            `;
            
            // Event Listener für Dropdown
            const select = document.getElementById('categorySelect');
            const newCategoryContainer = document.getElementById('newCategoryContainer');
            const newCategoryInput = document.getElementById('newCategoryInput');
            
            select.addEventListener('change', (e) => {
                if (e.target.value === '__new__') {
                    newCategoryContainer.style.display = 'block';
                    newCategoryInput.required = true;
                    select.required = false;
                } else {
                    newCategoryContainer.style.display = 'none';
                    newCategoryInput.required = false;
                    select.required = true;
                }
            });
        } else {
            // Nur Textfeld wenn keine Kategorien vorhanden
            container.innerHTML = `
                <label for="categoryInput">Kategorie:</label>
                <input type="text" id="categoryInput" placeholder="z.B. Guerilla Marketing" required>
                <small>Erstelle deine erste Kategorie</small>
            `;
        }
    }

    // Kategorie-Wert aus Formular holen
    getCategoryValue() {
        const select = document.getElementById('categorySelect');
        const input = document.getElementById('categoryInput');
        const newInput = document.getElementById('newCategoryInput');
        
        if (select) {
            if (select.value === '__new__' && newInput) {
                return newInput.value.trim();
            }
            return select.value;
        } else if (input) {
            return input.value.trim();
        }
        return '';
    }

    // Karte hinzufügen
    addCard(cardData) {
        const newCard = {
            id: this.nextId++,
            ...cardData
        };
        
        this.cards.push(newCard);
        CardsStorage.save(this.cards);
        this.renderFilterButtons();
        this.renderCards();
    }

    // Karte aktualisieren
    updateCard(id, cardData) {
        const index = this.cards.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cards[index] = {
                id: id,
                ...cardData
            };
            CardsStorage.save(this.cards);
            this.renderFilterButtons();
            this.renderCards();
        }
    }

    // Karte löschen
    deleteCard(id) {
        this.cards = this.cards.filter(card => card.id !== id);
        CardsStorage.save(this.cards);
        this.renderFilterButtons();
        this.renderCards();
    }

    // HTML escapen
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Event Listeners setup
    setupEventListeners() {
        const modal = document.getElementById('cardModal');
        const addBtn = document.getElementById('addCardBtn');
        const closeBtn = document.querySelector('.close');
        const form = document.getElementById('cardForm');
        const imageFile = document.getElementById('imageFile');

        // Modal öffnen
        addBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            this.resetModal();
        });

        // Modal schließen
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            this.resetModal();
        });

        // ESC-Taste
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                this.resetModal();
            }
        });

        // Klick außerhalb des Modals
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                this.resetModal();
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

            const category = this.getCategoryValue();
            
            if (!category) {
                alert('Bitte wähle oder erstelle eine Kategorie!');
                return;
            }

            const cardData = {
                title: document.getElementById('title').value.trim(),
                imageUrl: document.getElementById('imageUrl').value.trim() || 
                         'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23667eea%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22white%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2224%22%3EHilfskarte%3C/text%3E%3C/svg%3E',
                category: category,
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
                
                if (this.editingCardId !== null) {
                    this.updateCard(this.editingCardId, cardData);
                } else {
                    this.addCard(cardData);
                }
                
                modal.style.display = 'none';
                this.resetModal();
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
