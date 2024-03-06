# Pidwin Assessment

The Pidwin Fullstack Assessment.
**Screenshot and video included below.**

Additions/changes:
- [backend/src/api/user-wager.js](backend/src/api/user-wager.js) / Backend coinflip logic
- [backend/src/api/user-data.js](backend/src/api/user-data.js) / Fetches last 10 wagers to display on frontend
- [backend/src/models/wagers.js](backend/src/models/wagers.js) / Wagers DB model
- [frontend/.../Home.js](frontend/src/components/Home/Home.js) / Frontend code

Improvements that could be made:
- Tried to add coinflip animation but couldn't get it to work properly
- Ideally when the Bonus hits, it would be a more clear/exciting indicator
- Table could be organized better
- Backend coinflip logic could be less fragile
- Animation so that the game is more engaging

<img width="1309" alt="image" src="https://github.com/Voyager-Two/coinflip-demo/assets/3676208/ea4af7f9-7d94-44dc-b127-b2feb28b2395">


https://github.com/Voyager-Two/coinflip-demo/assets/3676208/dd009427-7a8b-4d39-9b18-0fa2859317ec


## Project setup

Enter each folder:

- backend
- frontend

and run the following command

```bash
npm install
```
---


## Backend

Create a **.env file** and populate the fields.


Now in the backend folder. Run the start
   command
   ```bash
   npm run start
   ```

The backend is now up and running.

---

## Frontend

The frontend is your standard create-react-app, the default ReadME is provided under frontend/readme.md for reference.
