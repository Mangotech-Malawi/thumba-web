import { snippets } from "./snippets.js";

// Function to open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SnippetDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("snippets")) {
                db.createObjectStore("snippets", { keyPath: "name" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error opening DB");
    });
}

// Function to save a snippet
export async function saveSnippet(name, content) {
    const db = await openDB();
    const tx = db.transaction("snippets", "readwrite");
    const store = tx.objectStore("snippets");
    store.put({ name, content });
    return tx.complete;
}

// Function to load a snippet
export async function loadSnippet(name) {
    const db = await openDB();
    const tx = db.transaction("snippets", "readonly");
    const store = tx.objectStore("snippets");

    return new Promise((resolve) => {
        const request = store.get(name);
        request.onsuccess = () => resolve(request.result ? request.result.content : null);
        request.onerror = () => resolve(null);
    });
}

// Function to load all snippets
export async function loadAllSnippets() {
    const db = await openDB();
    const tx = db.transaction("snippets", "readonly");
    const store = tx.objectStore("snippets");

    return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve([]);
    });
}

async function initSnippets() {
    for (const [name, content] of Object.entries(snippets)) {
        let existingSnippet = await loadSnippet(name);
        if (!existingSnippet) {
            console.log(`Saving ${name} to DB...`);
            await saveSnippet(name, content);
        }
    }
}

// Initialize all snippets on page load
initSnippets();



