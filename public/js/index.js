const dropArea = document.getElementById('drop-area');
const fileArea = document.getElementById('file-area');
const requestId = document.getElementById("idElem");
const requestButton = document.getElementById("idElemBtn");

const preventDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
}
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

const highlight = e => dropArea.classList.add('highlight');
const unhighlight = e => dropArea.classList.remove('highlight');
['dragenter', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, highlight, false));
['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, unhighlight, false));


const handleDrop = e => {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
}
dropArea.addEventListener('drop', handleDrop, false);

const handleFiles = files => ([...files]).forEach(saveFile);

const getFileIconClass = file => {
    const type = file.type.split('/')[0]

    switch (type) {
        case 'text':
            return 'fa-font';
        case 'image':
            return 'fa-image';
        case 'video':
            return 'fa-video';
        case 'audio':
            return 'fa-music';
        case 'application':
            if (file.type.includes('pdf')) { return 'fa-file-pdf'; }
            if (file.type.includes('zip')) { return 'fa-file-zipper'; }
            if (file.type.includes('msword')) { return 'fa-file-word'; }
            if (file.type.includes('vnd.ms-powerpoint')) { return 'fa-file-powerpoint'; }
            if (file.type.includes('vnd.ms-excel')) { return 'fa-file-excel'; }
            else { return 'fa-window-restore'; }
        default:
            return 'fa-file';
    }
};

const displayDownload = (filename) => {
    const container = document.createElement('div');
    container.classList.add('file-container');
    container.classList.add('disabled');
    container.id = `${filename}`;

    const icon = document.createElement('i');
    icon.classList.add('file-icon');
    icon.classList.add("fa-solid");
    icon.classList.add("fa-download");

    const name = document.createElement('span');
    name.classList.add('file-name');
    name.textContent = filename;

    const progress = document.createElement('span');
    progress.classList.add('file-progress');
    progress.innerText = '0%';

    container.appendChild(icon);
    container.appendChild(name);
    container.appendChild(progress)

    return container;
}

const displayFile = (file, filename) => {
    const container = document.createElement('div');
    container.classList.add('file-container');

    const icon = document.createElement('i');
    icon.classList.add('file-icon');
    icon.classList.add("fa-solid");
    icon.classList.add(getFileIconClass(file));

    const name = document.createElement('span');
    name.classList.add('file-name');
    name.textContent = file.name;

    container.appendChild(icon);
    container.appendChild(name);

    container.addEventListener("click", e => {
        downloadFile(filename);
    })

    return container;
}

const getEncodedFilename = (filename) => {
    return `${Date.now()}${Math.round(Math.random() * 999999999)}/${filename}`;
}

let files = {};
const saveFile = file => new Promise((resolve, reject) => {
    const filename = getEncodedFilename(file.name);
    fileArea.appendChild(displayFile(file, filename));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        files[filename] = reader.result;
        console.log(`File saved from "${file.name}" as "${filename}"`);
        resolve(filename);
    };
    reader.onerror = error => reject(error);
});

const loadFile = filename => {
    const encodedFile = files[filename];

    if (!encodedFile) { throw new Error(`File "${filename}" not found`); }

    var arr = encodedFile.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    const filenameParsed = filename.split("/")[1];
    console.log(`File loaded from "${filename}" as "${filenameParsed}"`);
    return new File([u8arr], filenameParsed, { type: mime });
};

const downloadFile = name => {
    const file = loadFile(name);
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};