const axios = require('axios');


const data = {
     startDate1 : '2021-05-02',
     endDate1 : '2024-08-10',
     startDate2 : '2021-05-02',
     endDate2 : '2024-08-10',
}

// Send POST request to your API endpoint
axios.post('http://localhost:3000/api/data', data)
  .then(response => {
    console.log('Response from client side:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });