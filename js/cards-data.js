// Hier werden die Kartendaten gespeichert
// Diese Datei macht es einfach, die Daten zu erweitern

const initialCards = [
    {
        id: 1,
        front: "Was ist HTML?",
        back: "HyperText Markup Language - die Struktur von Webseiten",
        category: "Webentwicklung"
    },
    {
        id: 2,
        front: "Was ist CSS?",
        back: "Cascading Style Sheets - für das Design von Webseiten",
        category: "Webentwicklung"
    },
    {
        id: 3,
        front: "Was ist JavaScript?",
        back: "Eine Programmiersprache für interaktive Webseiten",
        category: "Webentwicklung"
    },
    {
        id: 4,
        front: "Hauptstadt von Deutschland?",
        back: "Berlin",
        category: "Geografie"
    },
    {
        id: 5,
        front: "Größter Planet?",
        back: "Jupiter",
        category: "Astronomie"
    }
];

// LocalStorage Management
const CardsStorage = {
    STORAGE_KEY: 'flipCards',
    
    // Karten aus LocalStorage laden
    load() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : initialCards;
    },
    
    // Karten in LocalStorage speichern
    save(cards) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    },
    
    // Zurücksetzen auf Anfangsdaten
    reset() {
        this.save(initialCards);
    }
};
