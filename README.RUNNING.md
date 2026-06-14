Pokretanje cijele app (backend + frontend)

1) U backend direktoriju napravite novu datoteku i nazovite ju ".env", u nju zalijepite:

"PORT=5000
MONGODB_URI=mongodb+srv://bornahrubi:ProgInjzBaza@cluster0.zlggw6c.mongodb.net/
JWT_SECRET=marko_je_smislio_kljuc"

2) U terminalu u glavnom direktoriju "Aura-app-main" pokrenite:

npm run install-all


3) Zatim u istom tom terminalu:

npm install


4) I tada naredba koja pokreće i backend i frontend (isto iz glavnog direktorija u terminalu):

npm run dev

