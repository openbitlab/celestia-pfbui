function postData(url = '', data = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => { console.log(response); return response.json()});
}

function getData(url = '') {
  return fetch(url).then((response) => response.json());
}

function encodeDataToHex(data) {
  return Array.from(data)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

const submitForm = document.getElementById('submit-form');
submitForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const namespaceId = encodeDataToHex(event.target.elements['namespace-id'].value);
  const data = encodeDataToHex(event.target.elements['data'].value);

  const response = await postData('http://localhost:8000/api/submit_pfb', {
    namespace_id: namespaceId,
    data: data,
    gas_limit: 80000,
    fee: 2000,
  });

  const blockheight = response.height;
  alert(`Inserted on block ${blockheight}`);
});

const retrieveForm = document.getElementById('retrieve-form');
retrieveForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const namespaceId = encodeDataToHex(event.target.elements['retrieve-namespace-id'].value);
  const blockheight = event.target.elements['blockheight'].value;

  const url = `http://localhost:8000/api/namespaced_shares/${namespaceId}/height/${blockheight}`;
  const result = await getData(url);

  const resultElement = document.getElementById('result');
  resultElement.textContent = JSON.stringify(result, null, 2);
});
