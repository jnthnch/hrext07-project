$(document).ready(function(e) {

  // get list of all users
  var allUsers = [];
  var allUserButtonsCount = $('.user-name')[0].childElementCount - 1;
  var allUserButtons = $('.user-name')[0];
  for (let i = 1; i < allUserButtonsCount + 1; i++) {
    allUsers.push(allUserButtons[i].value);
  }

  // set up all player records
  var allRecords = {};
  for (let i = 0; i < allUsers.length; i++) {
    allRecords[allUsers[i]] = {'wins': 0, "losses": 0, 'pushes': 0}
  }

  // set up standings board
  for (let i = 0; i < allUsers.length; i++) {
    $('.overall-standings').append(`<div class='${allUsers[i]}-record'>${allUsers[i]}</div>`)
    $(`.${allUsers[i]}-record`).append('<p>0 - 0 - 0</p>')
    $(`.${allUsers[i]}-record`).append('<p>0%</p>')
  }


  // submit picks
  $('.submit-pick-button').on('click', function(e) {
    var user = $('.user-name')[0].value;
    var homeTeamPick = $('.home-team-pick').val();
    var awayTeamPick = $('.away-team-pick').val();
    var spreadPick = $('.spread-pick').val();

    // if user has 0 picks, set up object as value
    var picksObj = {};
    var userPicks = JSON.parse(localStorage.getItem(user));
    if (userPicks === null) {
      picksObj[1] = `${awayTeamPick} @ ${homeTeamPick}, pick: ${spreadPick}`;
      localStorage.setItem(user, JSON.stringify(picksObj));
    } else {
      var userPickCount = Object.keys(JSON.parse(localStorage.getItem(user))).length;
      userPicks[userPickCount + 1] = `${awayTeamPick} @ ${homeTeamPick}, pick: ${spreadPick}`;
      localStorage.setItem(user, JSON.stringify(userPicks));
    }

    $('.home-team-pick').val('');
    $('.away-team-pick').val('');
    $('.spread-pick').val('');
  });

  var winLossPushForm = function(user, formNumber) {
    return ( //to have unique RADIO buttons, added ${formNumber + 1}
      `<form class="result-form">
        <div>
          <input type="radio" class="${user}-win-tally"
           name="pickResult-${formNumber + 1}" value="wins">
          <label>Win</label>

          <input type="radio" class="${user}-loss-tally"
           name="pickResult-${formNumber + 1}" value="losses">
          <label>Loss</label>

          <input type="radio" class="${user}-push-tally"
           name="pickResult-${formNumber + 1}" value="pushes">
          <label>Push</label>
        </div>
        <div>
          <button type="button" class="game-result-submit-button">Submit</button>
        </div>
      </form>`
    )
  }

  // show user picks
  $('.user-picks-container').on('click', function(e) {
    var userClicked = e.target.textContent

    // if NAME button was clicked
    if (e.target.name === 'show-pick-button') {
      // set UL of '.picks-list'
      var picksListUl = $('.user-picks-container').find('.picks-list');
      // clear out contents everytime you click user
      picksListUl.empty();

      var picksList = JSON.parse(localStorage.getItem(userClicked))
      // this if statement allows us to avoid TypeError
      var picksListValues;
      if (picksList === null || picksList === undefined) {
        picksListValues = [];
      } else {
        picksListValues = Object.values(JSON.parse(localStorage.getItem(userClicked)));
      }

      if (picksListValues.length === 0) {
        picksListUl.append(`<p>no picks made yet</p>`)
      } else {
        for (var i = 0; i < picksListValues.length; i++) {
          picksListUl.addClass(`${userClicked}`)
          picksListUl.append(`<p>${picksListValues[i]}</p>`)
          picksListUl.append(winLossPushForm(userClicked, i))
        }
      }
      // if SUBMIT button was clicked
    } else if (e.target.className === 'game-result-submit-button') {
      var userSubmitted;
      // var userResult = $('input[name=pickResult]:checked', '.result-form').val()

      // find which user SUBMITTED
      // update user record based on SUBMIT button
      // convert classList from DOMTokenList to Array
      var classList = Array.from($('.picks-list')[0].className.split(' '));
      for (let i = 0; i < allUsers.length; i++) {
        if (classList.includes(allUsers[i])) {
          userSubmitted = allUsers[i];
          // allRecords[userSubmitted][userResult] += 1
        }
      }

      var numberOfUserPicks = Object.values(JSON.parse(localStorage.getItem(userSubmitted))).length;

      // go through each form and find out which RADIO button was selected


    }

  });




});
