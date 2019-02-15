$(document).ready(function(e) {


  // CREATING NEW USER
  var createNewUser = function(user) {
    addUserDropdown(user);
    addUserButton(user);
    var userValueObj = {
      records: {'wins': 0, 'losses': 0, 'pushes': 0},
      picks: [],
      results: []
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


  // WHEN USER SUBMITS PICK
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

  var nonEditResultForm = function(result) {
    return (
      `<p>${result}</p>`
    )
  }

  // SHOW USER PICKS ON PAGE WHEN SHOW BUTTON IS PRESSED
  var showUserPicks = function(user) {
    var picksList = JSON.parse(localStorage.getItem(user)).picks
    var resultsList = JSON.parse(localStorage.getItem(user)).results
    // HTML element
    var picksListUl = $('.user-picks-container').find('.picks-list');
    picksListUl[0].innerHTML = '';

    if (picksList.length === 0) {
      picksListUl.append(`<p>no picks made yet</p>`);
    } else {
      for (var i = 0; i < picksList.length; i++) {
        // IF USER HASN"T SUBMITTED RESULT FOR PICK YET
        if (resultsList[i] === undefined) {
          picksListUl.append(`<p>${picksList[i]}</p>`)
          picksListUl.append(winLossForm(user, i));
        }
        // IF USER PREVIOUSLY SUBMITTED RESULT, JUST SHOW RESULT
          else {

          picksListUl.append(`<p>${picksList[i]}</p>`)
          picksListUl.append(nonEditResultForm(resultsList[i]));
        }
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
        // IF NO SELECTION IS MADE ON SUBMIT BUTTON
        if (result === undefined) {
          alert('PLEASE SELECT RESULT')
          return;
        }
        handleResultSubmission(user, result, formNumber);
    } // WHEN USER CLICKS EDIT RESULT BUTTON
      else if (e.target.className.split(' ').includes('game-result-edit-button')) {
        var editButtonClassNameArray = e.target.className.split(' ');
        var user = editButtonClassNameArray[0];
        var formNumber = editButtonClassNameArray[editButtonClassNameArray.length - 1]
        var result = $(`input[name=pickResult-${formNumber}]:checked`, '.result-form').val();
        removePreviousRecordTally(user, result, formNumber);
        reshowResultButtons(user, formNumber);
        deleteResultEditButton(user, formNumber);
      }
  });

  var handleResultSubmission = function(user, result, formNumber) {
    tallyLocalRecord(user, result, formNumber);
    showPickResult(user, result, formNumber);
    hideResultButtons(user, formNumber)
    updateStandingsTable();
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
    // resultFORM 'result' MUST be wins, losses, or pushes
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
      'wins': 'WIN',
      'losses': 'LOSS',
      'pushes': 'PUSH'
    }
    // FORMNUMBER IS LITERAL, HERE WE SUBTRACT 1 BECAUSE IT'S INDEXING
    userObjValue.results[formNumber - 1] = `result: ${resultKey[result]}`
    localStorage.setItem(user, JSON.stringify(userObjValue));
  };


  var removePreviousRecordTally = function(user, result, formNumber) {
    var userObjValue = JSON.parse(localStorage.getItem(user));
    // UPDATE RECORDS IN LOCALSTORAGE
    userObjValue.records[result] -= 1;
    localStorage.setItem(user, JSON.stringify(userObjValue));
  }

  var updateStandingsTable = function() {
    // REMOVE EVERYTHING EXCEPT TOP ROW STANDINGS
    $(`.top-row-standings`).siblings().remove();
    createStandingsTable();
  }

  var createStandingsTable = function() {
    addLocalStorageUsersToStandings();
    addUserDataToStandings();
  }

  var userTableRow = function(user) {
    return (
      `<tr class=${user}-row>
        <td class=${user}-name>${user}</td>
      </tr>`
    )
  };

  var addUserDataRow = function(user, wins, losses, pushes) {
    // ADD W-L-P DATA COLUMN
    $(`.${user}-row`).append(`<td class=${user}-wins-loss-push-record>${wins} - ${losses} - ${pushes}</td>`)
    // ADD WIN% DATA COLUMN
    var winRate = ((wins / (wins + losses)) * 100).toFixed(2);
    // ACCOUNT FOR EMPTY RECORD
    if (wins + losses === 0) { winRate = 0 };
    $(`.${user}-row`).append(`<td class=${user}-winRate>${winRate}%</td>`)
  }

  var addLocalStorageUsersToStandings = function() {
    for (var i = 0; i < localStorage.length; i++) {
      $(`.standings-table`).append(userTableRow(localStorage.key(i)))
    }
  };

  var addUserDataToStandings = function() {
    for (var i = 0; i < localStorage.length; i++) {
      var user = localStorage.key(i)
      var userRecordsData = JSON.parse(localStorage.getItem(localStorage.key(i))).records;
      var userWins = userRecordsData.wins;
      var userLosses = userRecordsData.losses;
      var userPushes = userRecordsData.pushes;
      addUserDataRow(user, userWins, userLosses, userPushes);
    }
  }

  createStandingsTable();


});
