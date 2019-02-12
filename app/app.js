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

    console.log(localStorage);
  });

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
    if (picksListValues.length === 0) {
      picksListUl.append(`<p>no picks made yet</p>`)
    } else {
      for (var i = 0; i < picksListValues.length; i++) {
        picksListUl.append(`<p>${picksListValues[i]}</p>`)
      }
    }
  });




});
