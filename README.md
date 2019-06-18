# MoneyManager
Full-stack web application for recording and monitoring daily finances.<br/><br />
**Web app: https://moneymanager.gq/app**<br/>
**Android app: https://play.google.com/store/apps/details?id=com.shanzid.moneymanager**<br />
Homepage: https://moneymanager.gq<br /> <br />
<image src="screen.png" />
<br/>

## Technical overview
Fully responsive design - works with all major browsers and devices.<br/><br/>
**Built with**
 - Firebase Cloud Functions for server-side processing (using NodeJS)
 - Firestore for database
 - ReactJS for the front-end (hosted on Firebase)
 - Firebase Authentication for user management
(tldr; Full-stack app with FERN stack)


 **Project folder structure**
 - 'client' folder contains all front-end code (built with `create-react-app`)
    - '/src/components' contains all "dumb" components
    - '/src/containers' contains all the primary screens
    - '/src/styles' contains all css styling
    - '/src/helpers' contains some basic Javascript code to help with some generic functions
    - '/src/keys' has to contain **your own** project configurations (obtained from firebase project console)
    - '/build' contains compiled code (`npm run build`)
    - index.js contains all routing configurations <br/>
    <i>Everything else is boilerplate code.</i>
 - 'functions' folder contains Firebase Cloud Functions code
    - entry point at 'index.js'
    - '/routes/api/exchanges.js' contains all the core server-side logic and request authentication
    - '/keys' folder has to contain firebase-admin SDK private key (firebase project console-->project settings-->service accounts)
 - 'android' folder contains relevant code for the one (and only) activity in the project (i.e. MainActivity)
    - MainActivity contains a WebView which loads the [web app url](https://moneymanager.gq/app)

**External resources/libraries**
 - [Materialize.css](https://materializecss.com/) for the UI/UX
 - [React ChartJS 2](https://github.com/jerairrest/react-chartjs-2) for data visualization
 - [Google Analytics](https://analytics.google.com/analytics/web/) for app monitoring

## Author

* **[Shanzid Shaiham](https://shanzid.com)** - *Initial work*

## License

This project is licensed under the MIT License.

**NOTE**:
You must add your own firebase project configurations in the keys folders (in both '/client' and '/functions') to successfully deploy this project in your own environment.
