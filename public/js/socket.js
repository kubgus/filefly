var socket = io();

let short = "";

socket.on("stc-id", id => {
    console.log(`ID request from server is "${id}"`);
    if (short.length <= 0) setShort(id);
    refresh(short);
});

const setShort = (id) => {
    short = id;
    console.log(`Short set to "${short}"`);
}

const refresh = (short) => {
    socket.emit("cts-refresh", short);

    const h1 = document.getElementById("socket-id");
    h1.innerText = short;

    const a = document.getElementById("socket-link");
    let link = `${window.location.href.split("/")[2]}/${short}`;
    a.innerText = link;
    a.href = `https://${link}`;
}

const customShort = (string) => {
    setShort(string);
    refresh(string);
}

const search = () => {
    const id = requestId.value;

    socket.emit("cts-req-files", id);
    console.log("Requested files");
}

requestButton.addEventListener("click", e => {
    search();
});

let downloads = 0;
socket.on("stc-req-files", socketId => {
    for (const file in files) {
        const val = files[file];
        const batches = val.match(/.{1,8000}/g);
        const len = batches.length;
        console.log(batches);
        for (const i in batches) {
            socket.emit("cts-res-files", socketId, len, file, [i, batches[i]]);
        }
    }

    downloads++;
    console.log("Responded with files");
});

socket.on("stc-res-files", (len, filename, markedBatch) => {
    const index = markedBatch[0];
    const batch = markedBatch[1];
    const progress = Math.round(index / len * 100);

    console.log(`${index}/${len} ||| ${markedBatch}`);

    if (files[filename]) {
        document.getElementById(filename).children[2].innerText = `${progress}%`;

        files[filename].push(batch);

    } else {
        files[filename] = [batch];

        const download = displayDownload(`${filename}`);
        fileArea.appendChild(download);
    };

    if (parseInt(index) + 1 >= len) {
        document.getElementById(filename).remove();

        files[filename] = files[filename].join("");
        const file = loadFile(filename);
        delete files[filename];

        saveFile(file);

    }
});

const idFromUrl = () => {
    var url = window.location.pathname;
    var urlSplit = url.split('/');

    // var customId = urlSplit[2];
    // if (customId) { customId(customId); return; }

    var urlId = urlSplit[1];
    if (urlId) document.getElementById("idElem").value = urlId; search();
}
idFromUrl();