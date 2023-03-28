var socket = io();

socket.on("stc-id", id => {
    const h1 = document.getElementById("socket-id");
    h1.innerText = id;
    const a = document.getElementById("socket-link");
    let link = `${window.location.href.split("/")[2]}/${id}`;
    a.innerText = link;
    a.href = `https://${link}`;

    fileArea.innerHTML = '';
});

const search = () => {
    socket.emit("cts-req-files", requestId.value);
    console.log("Requested files");
}

requestButton.addEventListener("click", e => {
    search();
});

let downloads = 0;
const FINISHSTRING = "#!COMPLETED!#";
socket.on("stc-req-files", socketId => {
    for (const file in files) {
        const val = files[file];
        const batches = val.match(/.{1,8000}/g);
        batches.push(FINISHSTRING);
        console.log(batches);
        for (const i in batches) {
            socket.emit("cts-res-files", socketId, file, [i, batches[i]]);
        }
    }

    downloads++;
    console.log("Responded with files");
});

socket.on("stc-res-files", (filename, markedBatch) => {
    console.log(markedBatch);
    // const index = markedBatch[0];
    const batch = markedBatch[1];
    if (batch == FINISHSTRING) {
        document.getElementById(filename).remove();
        files[filename] = files[filename].join("");
        const file = loadFile(filename);
        delete files[filename];
        saveFile(file);
    } else if (files[filename]) {
        files[filename].push(batch);
    } else {
        files[filename] = [batch];
        const download = displayDownload(filename);
        fileArea.appendChild(download);
    };
});

const idFromUrl = () => {
    var url = window.location.pathname;
    var urlId = url.split('/')[1];
    if (urlId) { document.getElementById("idElem").value = urlId; search(); }
}
idFromUrl();