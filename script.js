let activeObra = null;
let downloadCount = 0;
let userName = null;
let userReason = null;

function toggleDocuments(currentId, otherId) {
    if (activeObra && activeObra !== currentId) {
        return; // Bloqueia a seleção da outra obra se uma já estiver ativa
    }

    const container = document.getElementById(currentId);
    const otherContainer = document.getElementById(otherId);

    const currentHeader = container.previousElementSibling;
    const otherHeader = otherContainer.previousElementSibling;

    if (container.style.opacity === '1') {
        container.style.opacity = '0.5';
        container.style.pointerEvents = 'none';
        activeObra = null;
        downloadCount = 0;
        userName = null;
        userReason = null;
        currentHeader.classList.remove('selected');
    } else {
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
        otherContainer.style.opacity = '0.5';
        otherContainer.style.pointerEvents = 'none';
        activeObra = currentId;
        currentHeader.classList.add('selected');
        otherHeader.classList.remove('selected');
    }
}

function showDownloadForm(documentId, documentUrl) {
    if (downloadCount >= 5) {
        alert('Você já atingiu o limite de 5 downloads para esta obra.');
        return;
    }

    document.getElementById('document-id').value = documentId;
    document.getElementById('document-url').value = documentUrl;

    if (userName && userReason) {
        sendDownloadRequest(userName, userReason, documentId, documentUrl);
    } else {
        document.getElementById('download-form').style.display = 'block';
    }
}

function closeDownloadForm() {
    document.getElementById('download-form').style.display = 'none';
}

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    userName = document.getElementById('name').value;
    userReason = document.getElementById('reason').value;
    const documentId = document.getElementById('document-id').value;
    const documentUrl = document.getElementById('document-url').value;
    sendDownloadRequest(userName, userReason, documentId, documentUrl);
});

function sendDownloadRequest(name, reason, documentId, documentUrl) {
    fetch('https://formspree.io/f/xldrdalb', {
        method: 'POST',
        body: JSON.stringify({ name: name, reason: reason, documentId: documentId }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert('Sua solicitação foi enviada com sucesso!');
            window.open(documentUrl, '_blank'); // Abre o link de download em uma nova aba
            closeDownloadForm();
            downloadCount++;
        } else {
            alert('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.');
        }
    });
}
