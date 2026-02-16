// Hilfskarten Daten
const initialCards = [
    {
        id: 1,
        title: "Erste Hilfe bei Schnittwunden",
        imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop",
        category: "Erste Hilfe",
        sections: [
            {
                title: "Sofortmaßnahmen",
                text: "Wunde unter fließendem Wasser reinigen. Blutung durch Druck auf die Wunde stoppen. Sterile Kompresse auflegen."
            },
            {
                title: "Was zu beachten ist",
                text: "Nicht in die Wunde fassen. Keine Salben oder Puder verwenden. Bei starker Blutung den Notarzt rufen."
            },
            {
                title: "Nachbehandlung",
                text: "Wunde täglich kontrollieren. Verband regelmäßig wechseln. Bei Rötung oder Schwellung zum Arzt gehen."
            }
        ]
    },
    {
        id: 2,
        title: "Fahrrad-Reparatur: Platten flicken",
        imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
        category: "Fahrrad",
        sections: [
            {
                title: "Benötigtes Werkzeug",
                text: "Reifenheber, Flickzeug mit Kleber, Schmirgelpapier, Luftpumpe. Optional: Eimer mit Wasser zum Loch finden."
            },
            {
                title: "Schritt-für-Schritt",
                text: "Rad ausbauen, Mantel abziehen, Schlauch entnehmen. Loch mit Wasser finden, anrauen, Kleber auftragen, Flicken aufdrücken."
            },
            {
                title: "Zusammenbau",
                text: "Schlauch leicht aufpumpen, in Mantel legen, Mantel auf Felge ziehen. Ventil gerade ausrichten, vollständig aufpumpen."
            }
        ]
    },
    {
        id: 3,
        title: "Zimmerpflanzen richtig gießen",
        imageUrl: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=300&fit=crop",
        category: "Garten & Pflanzen",
        sections: [
            {
                title: "Wasserbedarf erkennen",
                text: "Fingerprobe: 2cm tief in Erde fühlen. Topf anheben - leicht = trocken. Blätter hängen = Wassermangel."
            },
            {
                title: "Richtig gießen",
                text: "Wasser zimmerwarm verwenden. Langsam gießen bis Wasser aus Ablauf kommt. Untersetzer nach 15 Min leeren."
            },
            {
                title: "Häufige Fehler vermeiden",
                text: "Nicht zu häufig gießen. Staunässe vermeiden. Im Winter weniger gießen. Nicht auf Blätter gießen."
            }
        ]
    },
    {
        id: 4,
        title: "Windows Shortcuts",
        imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop",
        category: "Computer",
        sections: [
            {
                title: "Navigation",
                text: "Win+E = Explorer öffnen, Win+D = Desktop anzeigen, Alt+Tab = Fenster wechseln, Win+L = Sperren"
            },
            {
                title: "Textbearbeitung",
                text: "Strg+C = Kopieren, Strg+V = Einfügen, Strg+X = Ausschneiden, Strg+Z = Rückgängig, Strg+F = Suchen"
            },
            {
                title: "System",
                text: "Strg+Shift+Esc = Task-Manager, Win+I = Einstellungen, Win+S = Suche, Alt+F4 = Programm beenden"
            }
        ]
    },
    {
        id: 5,
        title: "Kaffee richtig zubereiten",
        imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop",
        category: "Küche",
        sections: [
            {
                title: "Vorbereitung",
                text: "Frische Bohnen verwenden (max. 4 Wochen nach Röstung). Kurz vor Zubereitung mahlen. 60g Kaffee pro Liter Wasser."
            },
            {
                title: "Wassertemperatur",
                text: "Optimale Temperatur: 92-96°C. Wasser aufkochen und 1 Min abkühlen lassen. Niemals kochendes Wasser verwenden."
            },
            {
                title: "Brühzeit",
                text: "Filterkaffee: 4-6 Min. French Press: 4 Min. Espresso: 25-30 Sek. Sofort nach Brühvorgang servieren."
            }
        ]
    }
];

// LocalStorage Management
const CardsStorage = {
    STORAGE_KEY: 'helpCards',
    
    load() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : initialCards;
    },
    
    save(cards) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    },
    
    reset() {
        this.save(initialCards);
    }
};
