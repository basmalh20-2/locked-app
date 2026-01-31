const fileInput = document.getElementById('fileInput');
const preview = document.getElementById("preview");
const savedName = localStorage.getItem("savedName");
const savedPassword = localStorage.getItem("savedPassword");

if (!savedName || !savedPassword) {
    if (window.location.pathname.includes("secret.html")) {
        window.location.href = "index.html";
    }
}

let db;
const request = indexedDB.open("MyFilesDB", 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;

    if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "name" });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    displayFiles();
};

function saveFile(fileInput) {
    if (!db) return;

    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.put({ name: fileInput.name, fileInput });
}

fileInput.addEventListener("change", () => {
    const hide = fileInput.files[0];
    if (!hide) return;

    saveFile(hide);
    renderFile(hide);
});

function renderFile(file) {
    const url = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = url;
        preview.appendChild(img);

        img.onload = () => URL.revokeObjectURL(url);

    } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.style.width = "100%";
        preview.appendChild(video);

        video.onloadeddata = () => URL.revokeObjectURL(url);

    } else if (file.type === "application/pdf") {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.width = "100%";
        iframe.style.height = "500px";
        preview.appendChild(iframe);

        iframe.onload = () => URL.revokeObjectURL(url);

    } else {
        const p = document.createElement("p");
        p.innerText = `File: ${file.name}`;
        p.style.color = "white";
        preview.appendChild(p);

        URL.revokeObjectURL(url);
    }
}


function displayFiles() {
    preview.innerHTML = "";

    const transaction = db.transaction("files", "readonly");
    const store = transaction.objectStore("files");
    const request = store.getAll();

    request.onsuccess = (e) => {
        const files = e.target.result;
        files.forEach(f => {
            renderFile(f.fileInput);
        });
    };
}

function clearFiles() {
    if (!db) return;

    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    const request = store.clear();

}
