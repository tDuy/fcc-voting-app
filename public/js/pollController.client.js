(function() {
   var apiUrl = appUrl + '/api/:id/polls';
   var newpoll = document.querySelector('#new-poll');
   var mypolls = document.querySelector('#my-polls');
   var newpollHTML = `
      <p class="title has-text-centered">New Poll</p>
      <div class="field">
        <label class="label has-text-centered">Name your poll</label>
        <div class="control">
          <input class="input" type="text" name="ques" placeholder="What is your favorite brand?">
        </div>
      </div>

      <div class="field">
        <label class="label has-text-centered">Options</label>
        <div class="control">
          <input class="input" type="text" name="op[]" placeholder="Coke" value="" required="">
        </div>
      </div>

      <div class="field">
        <div class="control">
          <input class="input" type="text" name="op[]" placeholder="Pepsi" value="" required="">
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button class="button" id="addOption">
            More Options
          </button>
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button class="button is-link submit">Submit</button>
        </div>
      </div>
    `;
   var mypollsHTML = ``;

   newpoll.addEventListener('click', function newpollClick(event) {
      event.preventDefault();
      document.getElementById('content').innerHTML = newpollHTML;
      document.getElementById('addOption').addEventListener('click', addOption);
      document.querySelector('.submit').addEventListener('click', onSubmit); 
   });

   document.querySelector('.submit').addEventListener('click', onSubmit);
   
   document.getElementById('addOption').addEventListener('click', addOption);    
    
   mypolls.addEventListener('click', function mypollsClick(event) {
      event.preventDefault();
      document.getElementById('content').innerHTML = mypollsHTML;

      ajaxFunctions.ajaxRequest('GET', apiUrl, 0, showPolls);
   });

//----------------------------------------------
   function onSubmit() {
      var quesVal = document.querySelector('input[name="ques"]').value;
      var str = '';
      document.querySelectorAll('input[name="op[]"]').forEach((input, index) => {
         var val = encodeURIComponent(input.value);
         str += `&op[${index}]=${val}`;
      });
      var queryString = 'ques=' + encodeURIComponent(quesVal) + str;
      ajaxFunctions.ajaxRequest('POST', apiUrl, queryString, addPollComplete);
   }

   function addPollComplete(data) {
      // congrats
      var obj = JSON.parse(data);
      var url = appUrl + '/poll/' + obj['id'];
      content.innerHTML = `
        <div class="has-text-centered">
            <p class="title">Congratulations!</p>
            <p>Your poll has been posted to</p>
            <p><a href="${url}">${url}</a></p>
        </div>
      `;
      
   }

    function showPolls(data) {
      var html = '';
      var pollsArray = JSON.parse(data);

      pollsArray.forEach(poll => {
          var pollUrl = appUrl + '/poll/' + poll['_id'];
          html = `
         <div class="box columns is-vcentered">
         <div class="column is-three-quarters">
             <a href="${pollUrl}">${poll.question}</a>
         </div>
         <div class="column">
             <button data-pollId="${poll['_id']}" class="button is-danger deletePoll">Delete</button>
         </div>
         </div>`;
          document.getElementById('content').innerHTML += html;

      });
      var nodeList = document.querySelectorAll('.deletePoll');
      for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].addEventListener('click', delPoll);
      }

    }

    function delPoll(event) {
      // alert(event.target.dataset.pollid);
      var delurl = apiUrl + '?pollId=' + event.target.dataset.pollid;
      ajaxFunctions.ajaxRequest('DELETE', delurl, 0, function() {
          event.target.removeEventListener('class', delPoll);
          event.target.parentNode.parentNode.remove();
      });
    }
    
    function addOption(event){
      
      var newNode = document.createElement('div');
      newNode.classList.add('field');
      newNode.innerHTML = `<div class="control">
          <input class="input" type="text" name="op[]" placeholder="More Option" value="" required="">
        </div>`;
      document.getElementById('content').insertBefore(newNode, event.target.parentNode.parentNode);
    }
})();