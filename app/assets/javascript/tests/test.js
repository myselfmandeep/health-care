document.addEventListener("DOMContentLoaded", function(event) {
  // let count = 0;
  // async function api_1(params) {
  //   // Return an array of promises for 100 requests
  //   const requests = [];
  //   for (let i = 0; i < 100; i++) {
  //     count++;
  //     const request = fetch(`/api/v1/hello_world?count=${count}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         console.log(`${params} =`, data);
  //       })
  //       .catch(err => console.error(`${params} request failed`, err));
      
  //     requests.push(request); // Push each fetch request to the array
  //   }
  //   return Promise.all(requests); // Wait until all requests are complete
  // }

  // const array = Array.from({ length: 10 }, (_, index) => api_1("API".concat(`${index}`)));

  // // Run 6 sets of 100 requests in parallel
  // Promise.all(array).then(() => {
  //   console.log("All API requests completed!");
  // });

  async function sendMassRequests() {
    const numberOfRequests = 100000; // Adjust based on what you want to test
    let count = 0;
    const url = "/api/v1/hello_world?req=${count}";
    
    for (let i = 0; i < numberOfRequests; i++) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(`Response from request ${i + 1}:`, data);
        })
        .catch(error => {
          console.error(`Request ${i + 1} failed`, error);
        });
    }
  }
  
  sendMassRequests();
  
})