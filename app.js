async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  
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
  console.log(data);
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
    return fetchWithTimeout(url, {
     	 timeout: 6000
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
  const namespaceId = event.target.elements['namespace-id'].value;
  const data = encodeDataToHex(event.target.elements['data'].value);

  const response = await postData('http://celestia-rpc.openbitlab.com:80/api/submit_pfb', {
    namespace_id: namespaceId,
    data: data,
    gas_limit: 80000,
    fee: 2000,
  });

  const blockheight = response.height;
  if (response.status == 200) {
	alert(`Inserted on block ${blockheight}`);
  } else {
	alert("There was an error!");
  }
});

const retrieveForm = document.getElementById('retrieve-form');
retrieveForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const namespaceId = event.target.elements['retrieve-namespace-id'].value;
  const blockheight = event.target.elements['blockheight'].value;

  const url = `http://celestia-rpc.openbitlab.com:80/api/namespaced_shares/${namespaceId}/height/${blockheight}`;
  try {
	const result = await getData(url);

  	const resultElement = document.getElementById('result');
  	resultElement.textContent = JSON.stringify(atob(result["shares"][0].split("AAAA")[1]).replace(/^./, ""), null, 2);
  } catch {
	alert("There was an error!");
  }
});
