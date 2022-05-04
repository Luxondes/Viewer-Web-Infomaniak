# web-server

Ce sous-dossier permet de visualiser notre plan imagé, en 3D à l'aide d'un serveur local. Pour le moment le serveur écoute sur le port 3000.

---

- Pour télécharger les fichiers de ce dépot, se palcer dans un terminal et effectuer la commande suivante :

```bash
$ git clone https://github.com/Luxondes/ViewerWeb.git
```

Ensuite, se déplacer dans le dossier `web-werver` concerné.

- Il faudra ensuite installer le framework `express.js` et la librairie `three.js`.

Voici donc la commande pour `express.js` :

```
$ npm run express
```

Et celle pour `three.js` :

```
$ npm run three
```

- Enfin pour démarrer le serveur local, la commande est :

```
$ npm run start
```

- Le rendu est visualisable à l'adresse `localhost:3000` dans votre navigateur.
