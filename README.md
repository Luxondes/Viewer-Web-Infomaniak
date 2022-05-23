## Viewer Web 3D

Ce dépot contient l'avancée des travaux concernant le Viewer Web 3D.

Il se déroule dans le cadre de mon stage de fin de Licence Informatique à l'Université de Lille, dans l'entreprise Luxondes.

---

Il existe deux moyen de visualiser ces derniers :

- Se rendre à l'adresse suivante : https://viewer-luxondes.com

- Cloner ce dépot et lancer le projet en serveur local :

  - Pour cloner le dépot, se placer dans un terminal et utiliser la commande suivante à l'endroit souhaité :

    ```bash
    $ git clone https://github.com/Luxondes/Viewer-Web-Infomaniak.git
    ```

  - Pour lancer le serveur, utiliser la commande suivante à la racine du projet :

    ```bash
    $ npm run start
    ```

  - Pour une utilisation demandant des modifications de code, il est possible d'utiliser la commande suivante :

    ```bash
    $ npm run startDev
    ```

    Elle utilise Nodemon, ce qui permet le reboot du serveur local à chaque modification d'un fichier du projet.

  * Le rendu est visualisable à l'adresse http://localhost:3000 dans votre navigateur.

    (P.s. Les navigateurs firefox et safari ne sont visiblement pas à jour quant aux technologies que nous utilisons, il est donc préférable en attendant d'utiliser pour exemple Chrome, Opera ou Edge.)
