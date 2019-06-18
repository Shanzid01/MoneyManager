# MoneyManager

Full-stack web application for recording and monitoring daily finances.<br/>
**Web app: [https://moneymanager.gq/app](https://moneymanager.gq/app)**<br/>
**Android app: [https://play.google.com/store/apps/details?id=com.shanzid.moneymanager](https://play.google.com/store/apps/details?id=com.shanzid.moneymanager)**

<image src="screen.png" />

**Built with**
 - Firebase Cloud functions for server-side processing (using NodeJS)
 - Firestore for database
 - ReactJS for the front-end (hosted on firebase)
 - Firebase Authentication for user management
(tldr; Full-stack app with FERN stack)


 **Project folder structure**
 - 'client' folder contains all front-end code (built with create-react-app)
    - 'client/src/components' contains all "dumb" components
    - 'client/src/containers' contains all the primary screens
    - 'client/src/styles' contains all css styling
    - 'client/src/helpers' contains some basic Javascript code to help with some generic functions
    - 'client/src/keys' has to contain **your own** project configurations (obtained from firebase project console)
    - 'client/build' contains compiled code (`npm run build`)
    - index.js contains all routing configurations <br/>
    <i>Everything else is boilerplate code.</i>
 - 'functions' folder contains Firebase Cloud Functions code
    - entry point at 'index.js'
    - '/routes/api/exchanges.js' contains all the core server-side process and authentication
    - '/keys' folder has to contain firebase-admin SDK private key (firebase project console-->project settings-->service accounts)
 - 'android' folder contains relevant code for the one (and only) activity in the project (i.e. MainActivity)
    - MainActivity contains a WebView which loads the [web app url](https://moneymanager.gq/app)

## Author

* **Shanzid Shaiham** - *Initial work* - [Shanzid](https://shanzid.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

**NOTE**:
You must add your own firebase project configurations in the keys folders (in both '/client' and '/functions') to successfully deploy this project in your own environment.
