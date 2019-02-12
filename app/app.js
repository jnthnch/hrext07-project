$(document).ready(function(e) {

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

  // show user picks
  $('.user-picks-container').on('click', function(e) {
    var userClicked = e.target.textContent
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

    var winLossPushForm = function(user) {
      <form action="/action_page.php" method="get">
        <input type="checkbox" name="vehicle" value="Bike"> I have a bike<br>
        <input type="checkbox" name="vehicle" value="Car" checked="checked"> I have a car<br>
        <input type="submit" value="Submit">
      </form>
    }

    if (picksListValues.length === 0) {
      picksListUl.append(`<p>no picks made yet</p>`)
    } else {
      for (var i = 0; i < picksListValues.length; i++) {
        picksListUl.append(`<p>${picksListValues[i]}</p>`)
        picksListUl.append(`<input type="checkbox" name="" value="Win">Win`)
        picksListUl.append(`<input type="checkbox" name="" value="Loss">Loss`)
        picksListUl.append(`<input type="checkbox" name="" value="Push">Push`)
        <form action="/action_page.php" method="get">
          <input type="checkbox" name="vehicle" value="Bike"> I have a bike<br>
          <input type="checkbox" name="vehicle" value="Car" checked="checked"> I have a car<br>
          <input type="submit" value="Submit">
          </form>
      }
    }
  });


  var usersArray = Object.keys(localStorage);

  // all player records
  var records = {};
  for (var i = 0; i < usersArray.length; i++) {

  }

  // set up standings board
  for (var i = 0; i < usersArray.length; i++) {
    $('.overall-standings').append(`<div class='${usersArray[i]}-record'>${usersArray[i]}</div>`)
    $(`.${usersArray[i]}-record`).append('<p>0 - 0 - 0</p>')
    $(`.${usersArray[i]}-record`).append('<p>0%</p>')
  }





});
