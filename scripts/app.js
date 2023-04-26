const URL = 'http://celestia-rpc.openbitlab.com/api';

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 1000 } = options;
  
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
     	 timeout: 1000
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
  const submitButton = document.getElementById("spinnerSubmit");
  const submitText = document.getElementById("submitMessage");
  submitButton.classList.remove("hide");
  submitText.classList.add("hide");
  const namespaceId = event.target.elements['namespace-id'].value;
  const data = encodeDataToHex(event.target.elements['data'].value);

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
  submitButton.classList.add("hide");
  submitText.classList.remove("hide");
});

const retrieveForm = document.getElementById('retrieve-form');
retrieveForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const retrieveButton = document.getElementById("spinnerRetrieve");
  const retrieveText = document.getElementById("retrieveMessage");
  retrieveButton.classList.remove("hide");
  retrieveText.classList.add("hide");
  const namespaceId = event.target.elements['retrieve-namespace-id'].value;
  const blockheight = event.target.elements['blockheight'].value;

  try {
    const urlGetBlob = `${URL}/namespaced_shares/${namespaceId}/height/${blockheight}`
	  const result = await getData(urlGetBlob);
    const urlGetTime = `${URL}/header/${blockheight}`
	  const resultTime = await getData(urlGetTime);

  	const resultElement = document.getElementById('result');
  	const resultTimeElement = document.getElementById('inserted-time');
  	resultElement.textContent = atob(result["shares"][0].split("AAAA")[1]).replace(/^./, "");
  	const date = new Date(resultTime["header"]["time"]);
    resultTimeElement.textContent = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

    const cardDiv = document.getElementById('card-result');
    cardDiv.classList.remove("invisible");
  } catch {
    var myModal = new bootstrap.Modal(document.getElementById("modalFail"), {});
    myModal.show();
  }
  retrieveButton.classList.add("hide");
  retrieveText.classList.remove("hide");
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

window.onload = async function() {
  const urlGetBalance = `${URL}/balance`
  const resultBalance = await getData(urlGetBalance);
  const balanceElement = document.getElementById('balance');
  balanceElement.textContent = (parseInt(resultBalance["amount"]) * 10 ** -6).toFixed(3);
};