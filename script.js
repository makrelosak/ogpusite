  let myCashEarningsChart; 
  let globalData = [];
  let globalToGPU = 0;
  // CASH EARNINGS -  TOTAL TOGPU CHART creation
  function createEmptyChart() {
      const ctx = document.getElementById('myChart-cashearnings').getContext('2d');
    
      myCashEarningsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [], 
          datasets: [{
            label: 'Total ToGPU Earnings',
            data: [], 
            borderColor: '#00b894',
            backgroundColor: 'rgba(0, 184, 147, 0.13)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'DATE'
              },
            }
            ,
            y: {
              title: {
                display: true,
                text: 'Total Earnings'
              }
            }
          }
        }
    });
  }

  // FETCH API TOTAL EARNINGS
  function fetchDataEarnings() {
      fetch('https://flask-api-project-x879.onrender.com/api/total_togpu')
        .then(response => response.json())
        .then(data => {
    
          if (!Array.isArray(data)) {
            console.error('Not valid:', data);
            return;
          }
    
          globalData = data; // SAVE API CALL DATA TO GLOBAL
          updateTotalToGpuText(globalData); 
          updateChartEarnings(globalData);
        })
        .catch(error => console.error('Erorr getting data', error));
    }
    function fetchDataAllUsers() {
      fetch('https://flask-api-project-x879.onrender.com/get_all_users')
        .then(response => response.json())
        .then(data => {
          if (!Array.isArray(data) || data.length === 0) {
            console.error('Neplatná odpověď:', data);
            return;
          }
          const totalUsers = data[0];
          document.getElementById('total-providerz').textContent = totalUsers
        })
        .catch(error => console.error('Chyba při načítání dat:', error));
    }
    



  function updateTotalToGpuText(data) {
    const lastEarning = data[data.length - 1]; 
    const total_togpu = lastEarning.total_earnings ? parseFloat(lastEarning.total_earnings).toFixed(4) : 'No data'; 

    document.getElementById('total_togpu').textContent = total_togpu || 'No data';
    globalToGPU = total_togpu
  }
    
    // UPDATE CHART
  function updateChartEarnings(data) {
    // LAST 10 VALUES
    const last10 = data.slice(-10);
    // DATA FOR CHART + FORMATTING DATE
    const timestamps = last10.map(entry => formatDate(entry.time));
    const earnings = last10.map(entry => parseFloat(entry.total_earnings) || 0); 

    if (myCashEarningsChart) {
      myCashEarningsChart.data.labels = timestamps;
      myCashEarningsChart.data.datasets[0].data = earnings;
      myCashEarningsChart.update();
    } else {
      console.error('No Chart!!');
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('cs-CZ', {imeZone: 'Europe/Prague', hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('cs-CZ', { month: '2-digit', day: '2-digit' });
    return `${dateString} ${time}`;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('cs-CZ', {imeZone: 'Europe/Prague', hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('cs-CZ', { month: '2-digit', day: '2-digit' });
    return `${dateString}`;
  }

  // FUNCTION TO UPDATE TOTAL EARNINGS TEXT


  //BUTTON TO LOAD WALLET DATA
  function FetchIndividualUser(){
  document.getElementById('getDataBtn').addEventListener('click', function() {
      const walletAddress = document.getElementById('walletAddress').value;
      if (walletAddress) {
        
          fetch(`https://flask-api-project-x879.onrender.com/api/user?address=${walletAddress}`)
              .then(response => {
                  console.log('Odpověď serveru:', response);
                  return response.json();
              })
              .then(data => {
                  console.log('Data obdržena:', data);
                  document.getElementById('earnings').textContent = data.earnings || 'Not found';
                  document.getElementById('time').textContent = data.time || 'Not found';
                  document.getElementById('cashEarnings-ogpu').textContent = (data.earnings*100000/globalToGPU).toFixed(4)

                  //const lastEarning = data[data.length - 1]; 
                  //const total_togpu = lastEarning.total_earnings ? parseFloat(lastEarning.total_earnings).toFixed(4) : 'No data'; 
              })
              .catch(error => {
                  console.error('Error loading:', error);
              });
      } else {
          alert('Please input your wallet address');
      }
  });


  }




  async function getOgpuPrice() {
          const response = await fetch('https://flask-api-project-x879.onrender.com/get_ogpu_price');
          const data = await response.json();
          
          if (data.price) {
              globaloGPUData = data.price
              document.getElementById('ogpu-price').innerText =data.price + " $"
          } else  {
              document.getElementById('ogpu-price').innerText = 'N/A';
          }
  }




  function toggleAnswer(questionElement) {
    const answer = questionElement.nextElementSibling;
    
    if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
    } else {
        answer.style.display = 'none';
    }
  }




  function createBarChart() {        
    const ctx = document.getElementById('bar-gpustats').getContext('2d');
    myGPUChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Amount',
                data: [],
                backgroundColor: '#00b894',
                borderColor: 'rgba(0, 184, 147, 0.13)',
                borderWidth: 1
            }]
        },
        options: {
          responsive: false,
          scales: {
              x: {
                  type: 'category',  
                  ticks: {
                      font: {
                          size: window.innerWidth < 768 ? 10 : 14 
                      },color: 'white' ,
                      maxRotation: 90,
                      minRotation: 90
                  },
                  title: {
                  }
              },
              y: {
                  ticks: {
                      font: {
                          size: window.innerWidth < 768 ? 10 : 14
                      }
                  },
                  title: {
                    display: true,
                    text: 'TOP 20 (AMOUNT) OF GPUs',
                    font: {
                      size: 16,
                      weight: 'bold'
                    }}
              }
          }
      }
    });
  }

function createDonutChart() {        
    const ctx = document.getElementById('donut-gpustats').getContext('2d');
    myDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                label: 'GPU types',
                data: [],
                backgroundColor: [
                  'rgba(116, 185, 56, 1)',
                   'rgba(153, 102, 255, 0.8)',   
                    'rgba(255, 255, 255, 0.8)',   
                   'rgba(255, 99, 132, 0.8)'  
                ],
                hoverBackgroundColor: ['rgba(99, 255, 132, 0.8)'
                    , 'rgba(158, 90, 173, 1)'
                    , 
                    'rgb(255, 255, 255)', 
                    'rgba(237, 28, 36, 1)'  
                ],
                borderColor: 'rgba(0, 0, 0, 0.2)', 
                borderWidth: 2,
                hoverOffset: 8 
            }]
        },
        options: {
            responsive: true, 
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ddd',    
                        font: {
                            size: 14
                        }
                    }
                },title: {
                  display: true,
                  text: 'GPU Brand Distribution in oGPU Network',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }}
                
            }
        }
    });
}




function run()
{
  getOgpuPrice();
  if (window.location.pathname.endsWith('cashearnings.html')) {
    createEmptyChart(); 
    fetchDataEarnings(); 
    FetchIndividualUser()

  }
  if(window.location.pathname.endsWith('gpu.html')){
    createBarChart();
    createDonutChart();
    FetchDataGPU();
    FetchDataGPUManufacturer()
    fetchDataAllUsers();

  }
}



  // CALL FOR FETCHING DATA + CHART
  window.onload = function() 
  {
      run()
  };
  /*GPUSTATS SITE */ 

