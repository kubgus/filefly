var socket = io();

socket.on("stc-id", id => {
    let p = document.getElementById("socket-id");
    p.innerText = id;
});

const search = () => {
    socket.emit("cts-req-files", requestId.value);
    console.log("Requested files");
}

requestButton.addEventListener("click", e => {
    search();
});

let downloads = 0;
socket.on("stc-req-files", socketId => {
    socket.emit("cts-res-files", socketId, files);

    downloads++;
    console.log("Responded with files");
});

socket.on("stc-res-files", res => {
    console.log(res);
    for (const filename in res) {
        files[filename] = res[filename];
        const file = loadFile(filename);
        saveFile(file);
    }
});

const idFromUrl = () => {
    var url = window.location.pathname;
    var urlId = url.split('/')[1];
    if (urlId) { document.getElementById("idElem").value = urlId; search(); }
}
idFromUrl();