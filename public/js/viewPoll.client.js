(function(){
  var apiUrl = appUrl + window.location.pathname;
  var poll;
  const pollTitle = document.querySelector('.poll-title');
  const content = document.getElementById('content');


  ajaxFunctions.ajaxRequest('GET', apiUrl + '/getOne', 0, fetchPoll);

    //---------------------------
    function fetchPoll(data){
       poll = JSON.parse(data);
       pollTitle.innerText = poll.question;
       pollTitle.nextSibling.innerText = 'by ' + poll.user_name;
       poll.options.forEach((option, index) => {
         let html = `
         <div class="box">
         <input class="is-checkradio" id="Radio${index}" type="radio" name="option" value="${index}" checked="checked">
         <label for="Radio${index}">${option.answer}</label>
         </div>`;
         content.innerHTML += html;
      });
       content.innerHTML += `<div class="field">
       <button class="button is-primary is-medium btn-vote">Vote</button>
       </div>`;
       document.querySelector('.btn-vote').addEventListener('click', onVote);
    }
    
    function onVote(){
       var chosenInput = document.querySelector('.is-checkradio:checked');
       var url = apiUrl + '/vote';
       var voteid = 'voteid=' + chosenInput.value;

       ajaxFunctions.ajaxRequest('POST', url, voteid, showChart);
    }
    
    function showChart(data){
       var poll = JSON.parse(data);
       var myLabels = [];
       var myData = [];
       poll.options.forEach(option => {
         myLabels.push(option.answer);
         myData.push(option.count);
       });


       var canvas = document.createElement('canvas');
       canvas.id = 'myChart';
       canvas.width = 400;
       canvas.height = 200;

       while (content.firstChild) {
         content.removeChild(content.firstChild);
       }
       content.appendChild(canvas);

       var ctx = canvas.getContext('2d');
       var myChart = new Chart(ctx, {
         type: 'bar',
         data: {
          labels: myLabels,
          datasets: [{
           label: '# of Votes',
           data: myData,
           backgroundColor: [
           'rgba(255, 99, 132, 0.2)',
           'rgba(54, 162, 235, 0.2)',
           'rgba(255, 206, 86, 0.2)',
           'rgba(75, 192, 192, 0.2)',
           'rgba(153, 102, 255, 0.2)',
           'rgba(255, 159, 64, 0.2)'
           ],
           borderColor: [
           'rgba(255,99,132,1)',
           'rgba(54, 162, 235, 1)',
           'rgba(255, 206, 86, 1)',
           'rgba(75, 192, 192, 1)',
           'rgba(153, 102, 255, 1)',
           'rgba(255, 159, 64, 1)'
           ],
           borderWidth: 1
        }]
     },
     options: {
       scales: {
        yAxes: [{
         ticks: {
          beginAtZero:true
       }
    }]
 }
}
});
    }
 })();