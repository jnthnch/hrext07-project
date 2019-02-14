$(document).ready(function(e) {

  // // get list of all users
  // var allUsers = [];
  // var allUserButtonsCount = $('.user-name-dropdown')[0].childElementCount - 1;
  // var allUserButtons = $('.user-name-dropdown')[0];
  // for (let i = 1; i < allUserButtonsCount + 1; i++) {
  //   allUsers.push(allUserButtons[i].value);
  // }
  //
  // // set up all player records
  // var allRecords = {};
  // for (let i = 0; i < allUsers.length; i++) {
  //   allRecords[allUsers[i]] = {'wins': 0, "losses": 0, 'pushes': 0}
  // }
  //
  // // SET UP STANDINGS BOARD
  // for (let i = 0; i < allUsers.length; i++) {
  //   $('.overall-standings').append(`<div class='${allUsers[i]}-record'>${allUsers[i]}</div>`)
  //   $(`.${allUsers[i]}-record`).append('<p>0 - 0 - 0</p>')
  //   $(`.${allUsers[i]}-record`).append('<p>0%</p>')
  // }

  // CREATING NEW USER
  var createNewUser = function(user) {
    addUserDropdown(user);
    addUserButton(user);
    var userValueObj = {
      records: {'wins': 0, 'losses': 0, 'pushes': 0},
      picks: []
    };

    if (localStorage.getItem(user) === null) {
      localStorage[user] = JSON.stringify(userValueObj);
    } else {
      console.log('this user already exists');
    }
  };

  // USER DROPDOWN SET UP WHEN PAGE LOADS
  var dropdownSetUp = function() {
    var localStorageUsers = Object.keys(localStorage);
    for (let i = 0; i < localStorageUsers.length; i++) {
      var user = localStorageUsers[i];
      $('.user-name-dropdown').append(`<option value="${user}">${user}</option>`);
    }
  };

  dropdownSetUp();

  // USER BUTTONS SET UP WHEN PAGE LOADS
  var userButtonSetUp = function() {
    var localStorageUsers = Object.keys(localStorage);
    for (let i = 0; i < localStorageUsers.length; i++) {
      var user = localStorageUsers[i];
      $('.user-show-picks-button').append(`<button type="" name="show-pick-button" class="${user}-show-picks-button">${user}</button>`)
    }
  }

  userButtonSetUp();

  var addUserDropdown = function(user) {
    if (localStorage[user] === undefined) {
      $('.user-name-dropdown').append(`<option value="${user}">${user}</option>`);
    }
  };

  var addUserButton = function(user) {
    if (localStorage[user] === undefined) {
      $('.user-show-picks-button').append(`<button type="" name="show-pick-button" class="${user}-show-picks-button">${user}</button>`)
    }
  }

  $('.create-user-button').on('click', function(e) {
    var username = $('.new-username').val();
    if (username === "") {
      alert(`CANNOT LEAVE USERNAME BLANK`)
      return;
    }
    $('.new-username').val('');
    createNewUser(username);
  });

  // RESULT parameter needs to be either 'wins' 'losses' or 'pushes'
  var updateRecordsLocalStorage = function(user, result) {
    var validResults = ['wins', 'losses', 'pushes'];
    if (!validResults.includes(result)) {
      console.log('invalid result parameter');
      return;
    }
    var records = JSON.parse(localStorage.getItem('records'));
    records[user][result] += 1;
    localStorage.setItem('records', JSON.stringify(records));
  };


  var storage =
    {
      'jon': {
        records: {'wins': 0, 'losses': 0, 'pushes': 0},
        picks: {}
      },
      'grant': {
        records: {'wins': 0, 'losses': 0, 'pushes': 0},
        picks: {}
      }
  };

  var handlePickSubmission = function() {
    // HANDLE BLANK INPUTS
    var user = $('.user-name-dropdown').val();
    var homeTeamPick = $('.home-team-pick').val();
    var awayTeamPick = $('.away-team-pick').val();
    var spreadPick = $('.spread-pick').val();
    if (user === null) {
      alert(`PLEASE SELECT EXISTING USER`);
      return;
    } else if (homeTeamPick === "") {
      alert(`CAN'T LEAVE HOME TEAM BLANK`);
      return;
    } else if (awayTeamPick === "") {
      alert(`CAN'T LEAVE AWAY TEAM BLANK`);
      return;
    } else if (spreadPick === "") {
      alert(`CAN'T LEAVE PICK BLANK`);
      return;
    }
    var currentUserObject = JSON.parse(localStorage.getItem(user));
    var currentUserPicksArray = JSON.parse(localStorage.getItem(user)).picks;
    currentUserPicksArray.push(`${awayTeamPick} @ ${homeTeamPick}, pick: ${spreadPick}`)
    currentUserObject.picks = currentUserPicksArray;
    localStorage.setItem(user, JSON.stringify(currentUserObject));
  };

  var clearEntryFields = function() {
    $('.home-team-pick').val('');
    $('.away-team-pick').val('');
    $('.spread-pick').val('');
  };


  // when a user  submits picks
  $('.submit-pick-button').on('click', function(e) {
    handlePickSubmission();
    clearEntryFields();
  });

  var winLossForm = function(user, formNumber) {
    return ( //for unique RADIO buttons, add ${formNumber + 1}
      `<form class="result-form ${formNumber + 1}">
        <div class="radio-buttons-set ${formNumber + 1}">
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
          <button type="button" class="${user} game-result-submit-button ${formNumber + 1}">Submit</button>
        </div>
      </form>`
    )
  };

  // SHOW USER PICKS ON PAGE WHEN SHOW BUTTON IS PRESSED
  var showUserPicks = function(user) {
    var picksList = JSON.parse(localStorage.getItem(user)).picks
    // HTML element
    var picksListUl = $('.user-picks-container').find('.picks-list');
    picksListUl[0].innerHTML = '';

    if (picksList.length === 0) {
      picksListUl.append(`<p>no picks made yet</p>`);
    } else {
      for (var i = 0; i < picksList.length; i++) {
        picksListUl.append(`<p>${picksList[i]}</p>`)
        picksListUl.append(winLossForm(user, i));
      }
    }
  };

  $('.user-picks-container').on('click', function(e) {
    // WHEN USER CLICKS USERNAME BUTTON
    if (e.target.name === 'show-pick-button') {
      var user = e.target.textContent;
      showUserPicks(user);
    } // WHEN USER SUBMITS THEIR GAME RESULT
      else if (e.target.className.split(' ').includes('game-result-submit-button')) {
        var resultButtonClassNameArray = e.target.className.split(' ')
        var user = resultButtonClassNameArray[0];
        var formNumber = resultButtonClassNameArray[resultButtonClassNameArray.length - 1];
        var result = $(`input[name=pickResult-${formNumber}]:checked`, '.result-form').val();
        handleResultSubmission(user, result, formNumber);
    } // WHEN USER CLICKS EDIT RESULT BUTTON
      else if (e.target.className.split(' ').includes('game-result-edit-button')) {
        var editButtonClassNameArray = e.target.className.split(' ');
        var user = editButtonClassNameArray[0];
        var formNumber = editButtonClassNameArray[editButtonClassNameArray.length - 1]
        reshowResultButtons(user, formNumber);
        deleteResultEditButton(user, formNumber);
      }
  });

  var handleResultSubmission = function(user, result, formNumber) {
    tallyLocalRecord(user, result, formNumber);
    showPickResult(user, result, formNumber);
    hideResultButtons(user, formNumber)
  }

  var resultForm = function(user, result, formNumber) {
    var resultKey = {
      'wins': 'result: WIN',
      'losses': 'result: LOSS',
      'pushes': 'result: PUSH'
    }
    return (
      `<form class="${user} post-result-submit-form ${formNumber}">
        <div>
          <header>${resultKey[result]}</header>
        </div>
        <div>
          <button type="button" class="${user} game-result-edit-button ${formNumber}">Edit</button>
        </div>
      </form>`
    )
  };

  var showPickResult = function(user, result, formNumber) {
    $(`.result-form.${formNumber}`).append(resultForm(user, result, formNumber));
  }

  var hideResultButtons = function(user, formNumber) {
    $(`.${user}.game-result-submit-button.${formNumber}`)[0].style.display = "none"
    $(`.radio-buttons-set.${formNumber}`)[0].style.display = "none"
  }

  var reshowResultButtons = function(user, formNumber) {
    $(`.radio-buttons-set.${formNumber}`)[0].style.display = "block"
    $(`.${user}.game-result-submit-button.${formNumber}`)[0].style.display = "block"
  };

  var deleteResultEditButton = function(user, formNumber) {
    $(`.${user}.post-result-submit-form.${formNumber}`).remove();
  };

  var tallyLocalRecord = function(user, result, formNumber) {
    var userObjValue = JSON.parse(localStorage.getItem(user));
    // UPDATE RECORDS IN LOCALSTORAGE
    userObjValue.records[result] += 1;
    localStorage.setItem(user, JSON.stringify(userObjValue));
    // UPDATE PICK WITH RESULT IN LOCALSTORAGE
    var resultKey = {
      'wins': 'result: WIN',
      'losses': 'result: LOSS',
      'pushes': 'result: PUSH'
    }
    userObjValue.picks[formNumber] += `result: ${resultKey[result]}`
    localStorage.setItem(user, JSON.stringify(userObjValue));
  };


  // $('.user-picks-container').on('click', function(e) {
  //   var userClicked = e.target.textContent
  //
  //   // if NAME button was clicked
  //   if (e.target.name === 'show-pick-button') {
  //     showUserPicks(userClicked);
  //     // if SUBMIT button was clicked
  //   } else if (e.target.className === 'game-result-submit-button') {
  //
  //     }
  //
  //     var findUserSubmitResult = function() {
  //       var userSubmitted;
  //       // update user record based on SUBMIT button
  //       // convert classList from DOMTokenList to Array
  //       var classList = Array.from($('.picks-list')[0].className.split(' '));
  //       for (let i = 0; i < allUsers.length; i++) {
  //         if (classList.includes(allUsers[i])) {
  //           userSubmitted = allUsers[i];
  //         }
  //       }
  //       return userSubmitted;
  //     }
  //
  //     var updatePickWithResult = function(result) {
  //
  //     }
  //
  //     var getRadioResult = function(formNumber) {
  //       var userResult = $(`input[name=pickResult-${formNumber + 1}]:checked`, '.result-form').val()
  //       return userResult;
  //     }
  //     // go through each form and find out which RADIO button was selected
  // });




});
