const URL = 'http://celestia-rpc.openbitlab.com/api';

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

function postData(url = '', data = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => { return response.json() });
}

function getData(url = '') {
    return fetchWithTimeout(url, {
     	 timeout: 3000
    }).then((response) => response.json());
}

function encodeDataToHex(data) {
  return Array.from(data)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitSpinner = document.getElementById("spinnerSubmit");
  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  const submitText = document.getElementById("submitMessage");
  submitSpinner.classList.remove("hide");
  submitText.classList.add("hide");
  const namespaceId = event.target.elements['namespace-id'].value;
  const data = event.target.elements['data'].value;

  const response = await postData(`${URL}/submit_pfb`, {
    namespace_id: namespaceId,
    data: data,
    gas_limit: 80000,
    fee: 2000,
  });

  if (Object.hasOwn(response, 'height')) {
    const blockheight = response.height;
    var myModal = new bootstrap.Modal(document.getElementById("modalSuccess"), {});
  	const modalText = document.getElementById('modal-success');
  	modalText.textContent = `Your tx has been inserted on block ${blockheight}!`;
    myModal.show();
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("modalFail"), {});
    myModal.show();
  }
  submitSpinner.classList.add("hide");
  submitText.classList.remove("hide");
  submitButton.disabled = false;
});

const retrieveForm = document.getElementById('retrieve-form');
retrieveForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const retrieveSpinner = document.getElementById("spinnerRetrieve");
  const retrieveButton = document.getElementById("retrieveButton");
  retrieveButton.disabled = true;
  const retrieveText = document.getElementById("retrieveMessage");
  retrieveSpinner.classList.remove("hide");
  retrieveText.classList.add("hide");
  const namespaceId = event.target.elements['retrieve-namespace-id'].value;
  const blockheight = event.target.elements['blockheight'].value;

  try {
    const urlGetBlob = `${URL}/namespaced_shares/${namespaceId}/height/${blockheight}`
	  const result = await getData(urlGetBlob);
    const urlGetTime = `${URL}/header/${blockheight}`
	  const resultTime = await getData(urlGetTime);

    const decodeButtonElement = document.getElementById('decodeButton');
    decodeButtonElement.classList.remove('hide');
  	const resultElement = document.getElementById('result');
  	const resultTimeElement = document.getElementById('inserted-time');
  	resultElement.textContent = result["shares"][0];
  	const date = new Date(resultTime["header"]["time"]);
    resultTimeElement.textContent = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

    const cardDiv = document.getElementById('card-result');
    cardDiv.classList.remove("invisible");
  } catch {
    var myModal = new bootstrap.Modal(document.getElementById("modalFail"), {});
    myModal.show();
  }
  retrieveSpinner.classList.add("hide");
  retrieveText.classList.remove("hide");
  retrieveButton.disabled = false;
});

function closeModalFail() {
  var myModalEl = document.getElementById('modalFail');
  var modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

function closeModalSuccess() {
  var myModalEl = document.getElementById('modalSuccess');
  var modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

function showEncodeButton() {
  const buttonEncodeElement = document.getElementById('button-encode');
  buttonEncodeElement.classList.remove('hide');
}

function hexEncodeData() {
  const dataElement = document.getElementById('data');
  dataElement.value = encodeDataToHex(dataElement.value);
  const buttonEncodeElement = document.getElementById('button-encode');
  buttonEncodeElement.classList.add('hide');
}

function getRandomNamespaceId() { 
  let id = "";
  for(let i = 0; i < 16; i++) {
    id += Math.floor(Math.random() * 15).toString(16);
  }
  const idElement = document.getElementById('namespace-id');
  idElement.value = id;
}

function decodeBlob() {
  try {
    const resultElement = document.getElementById('result');
    resultElement.textContent = atob(resultElement.textContent.split("AAAA")[1]).replace(/^./, "");
    const decodeButtonElement = document.getElementById('decodeButton');
    decodeButtonElement.classList.add('hide');
  } catch {
    console.log("Not a valid base64 string!")
  }
}

window.onload = async function() {
  const urlGetBalance = `${URL}/balance`
  const resultBalance = await getData(urlGetBalance);
  const balanceElement = document.getElementById('balance');
  balanceElement.textContent = (parseInt(resultBalance["amount"]) * 10 ** -6).toFixed(3);
};