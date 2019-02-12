# hrext07-project

## 2019 NFL Picks 52.38%

Description - Sports Wagering industry in the US is increasingly becoming more popular and accepted. Sports franchise valuations may double in the next few years when it becomes legalized. I want to make it easy for users and their friends to keep track of their records against each other throughout a NFL Football Season. They will be able to transparently see who is the best at predicting football results, let the trash talk begin!

### Key Object(s) (nouns)
- Basic data keeping:
  * Keep records for users: Wins - Losses - Pushes, % 
  * Example: 15-12-3, 55.56%
  
### Key Roles (users)
- Each user will be their own player in this game

### Use Case
-  User selects Username 
-  Each week, each player enters their own record into 3 inputs: Wins, Losses, Pushes

### Use Case - inputs and outputs
- Inputs: 3 dropdown menus for Wins, Losses, Pushes
  * User selects a number for each one
- Outputs: After user submits inputs, an output of their Week Record and Season Record will display
  * Other users' Week Records and Season Records will display
  
### Basic Requirements
- Where to store data?
  * localstorage: key = username, value, object with player record
- How to capture data? 
  * Dropdown menu for wins/losses/pushes
  * Dropdown menu of usernames
  * Submit Button
- How to modify data? (update action)
  * user is only allowed to edit this week's record
- How to view data? 
  * Data is displayed on homepage
 
### Advanced Requirements
- Not Sure, is this application too simple?
