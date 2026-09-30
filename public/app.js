const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const selectedFilesContainer = document.getElementById('selectedFiles');
const actionArea = document.getElementById('actionArea');
const sanitizeBtn = document.getElementById('sanitizeBtn');
const results = document.getElementById('results');
const processedFilesContainer = document.getElementById('processedFiles');
const limitText = document.getElementById('limitText');
const statusText = document.getElementById('status');

const SUPPORTED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);
const MAX_FILES = 20;

let selectedFiles = [];
let resultObjectUrls = [];
let maxUploadMb = 3;

async function loadConfig() {
    try {
        const response = await fetch('/api/config', { cache: 'no-store' });
        if (!response.ok) return;

        const config = await response.json();
        if (Number.isFinite(config.maxUploadMb) && config.maxUploadMb > 0) {
            maxUploadMb = config.maxUploadMb;
        }

        const context = config.hosted ? 'no live preview' : 'localmente';
        limitText.textContent =
            `JPG, PNG, WebP ou GIF • até ${maxUploadMb} MB por arquivo ${context} • máximo de ${MAX_FILES} arquivos`;
    } catch {
        limitText.textContent =
            `JPG, PNG, WebP ou GIF • até ${maxUploadMb} MB por arquivo • máximo de ${MAX_FILES} arquivos`;
    }
}

function formatMb(bytes) {
    return (bytes / 1024 / 1024).toFixed(2);
}

function clearResultUrls() {
    resultObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    resultObjectUrls = [];
}

function resetResults() {
    clearResultUrls();
    processedFilesContainer.replaceChildren();
    results.classList.add('hidden');
}

function validateFiles(files) {
    const candidates = Array.from(files);

    if (candidates.length > MAX_FILES) {
        throw new Error(`Selecione no máximo ${MAX_FILES} arquivos por vez.`);
    }

    const maxBytes = maxUploadMb * 1024 * 1024;

    for (const file of candidates) {
        if (!SUPPORTED_TYPES.has(file.type)) {
            throw new Error(`${file.name}: formato não suportado.`);
        }

        if (file.size > maxBytes) {
            throw new Error(
                `${file.name}: ${formatMb(file.size)} MB excede o limite atual de ${maxUploadMb} MB.`
            );
        }
    }

    return candidates;
}

function handleFiles(files) {
    try {
        const validFiles = validateFiles(files);
        if (validFiles.length === 0) return;

        selectedFiles = validFiles;
        renderFileList();
        resetResults();
        fileList.classList.remove('hidden');
        actionArea.classList.remove('hidden');
        statusText.textContent = '';
    } catch (error) {
        alert(error instanceof Error ? error.message : 'Não foi possível selecionar os arquivos.');
    }
}

function renderFileList() {
    selectedFilesContainer.replaceChildren();

    selectedFiles.forEach((file) => {
        const row = document.createElement('div');
        row.className = 'py-3 flex justify-between items-center gap-4';

        const name = document.createElement('span');
        name.className = 'text-sm font-medium text-slate-700 truncate max-w-xs';
        name.textContent = file.name;
        name.title = file.name;

        const size = document.createElement('span');
        size.className = 'text-xs text-slate-400 shrink-0';
        size.textContent = `${formatMb(file.size)} MB`;

        row.append(name, size);
        selectedFilesContainer.append(row);
    });
}

async function getErrorMessage(response) {
    try {
        const data = await response.json();
        if (data && typeof data.error === 'string') return data.error;
    } catch {
        // Ignore malformed/non-JSON error responses.
    }

    return `Falha HTTP ${response.status}.`;
}

async function sanitizeFile(file) {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const response = await fetch('/api/sanitize', {
        method: 'POST',
        body: formData,
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.blob();
}

function renderResults(processed, failures) {
    clearResultUrls();
    processedFilesContainer.replaceChildren();

    processed.forEach(({ file, blob }) => {
        const url = URL.createObjectURL(blob);
        resultObjectUrls.push(url);

        const row = document.createElement('div');
        row.className = 'py-4 flex justify-between items-center gap-4';

        const info = document.createElement('div');

        const name = document.createElement('p');
        name.className = 'text-sm font-medium text-slate-800 break-all';
        name.textContent = file.name;

        const message = document.createElement('p');
        message.className = 'text-xs text-green-600 font-medium';
        message.textContent = 'Metadados removidos.';

        info.append(name, message);

        const link = document.createElement('a');
        link.href = url;
        link.download = `sanitized-${file.name}`;
        link.className =
            'bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded transition-colors shrink-0';
        link.textContent = 'Download';

        row.append(info, link);
        processedFilesContainer.append(row);
    });

    failures.forEach(({ file, error }) => {
        const row = document.createElement('div');
        row.className = 'py-4';

        const name = document.createElement('p');
        name.className = 'text-sm font-medium text-slate-800 break-all';
        name.textContent = file.name;

        const message = document.createElement('p');
        message.className = 'text-xs text-red-600 font-medium';
        message.textContent = error;

        row.append(name, message);
        processedFilesContainer.append(row);
    });

    results.classList.remove('hidden');
}

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        fileInput.click();
    }
});

fileInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
    fileInput.value = '';
});

dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('border-blue-500', 'bg-blue-50');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-blue-500', 'bg-blue-50');
});

dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('border-blue-500', 'bg-blue-50');
    handleFiles(event.dataTransfer.files);
});

sanitizeBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) return;

    sanitizeBtn.disabled = true;
    resetResults();

    const processed = [];
    const failures = [];

    for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index];
        statusText.textContent = `Processando ${index + 1} de ${selectedFiles.length}: ${file.name}`;

        try {
            const blob = await sanitizeFile(file);
            processed.push({ file, blob });
        } catch (error) {
            failures.push({
                file,
                error: error instanceof Error ? error.message : 'Falha ao processar imagem.',
            });
        }
    }

    renderResults(processed, failures);
    statusText.textContent =
        failures.length === 0
            ? `Concluído: ${processed.length} arquivo(s) sanitizado(s).`
            : `Concluído com ${failures.length} falha(s).`;

    sanitizeBtn.disabled = false;
});

window.addEventListener('beforeunload', clearResultUrls);

loadConfig();
