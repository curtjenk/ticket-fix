# Ticket Fix

Ticket Fix Me is a maintenance request and tracking system focused on tenants (renters) and brings together the tenant, property owner and independent contractor/handyman. The platform will make reporting issues easier for the tenant.  For the property owner, it can help to increase tenant loyalty, help develop a network of handyman to quickly resolve problems (this is particularly attractive to the small business property owner that does not have a maintenance staff).  Lastly for the contractor, their network is expanded with the potential of increased revenue.

### Authors
- Curtis
- Josh

### Tech

ticketfix uses a number of open source projects to work properly:

* [AngularJS] - MVC framework
* [Bootstrap] - layout, etc.
* [Angular-UI-Bootstrap] - image carousel
* [Angular Messages] - form validation
* [Angular Materials] - for animated tabs/checkbox/radio buttons
* [Angular-UI-Router] - The de-facto solution to flexible routing with nested views
* [Angular-local-storage] - An AngularJS module that gives you access to the browsers local storage
* [Angular-Aria] - Angular's default accessibility by enabling common ARIA attributes
* [Angular-Sanitize] - The ngSanitize module provides functionality to sanitize HTML
* [Angular-Animate] - The ngAnimate module provides support for CSS-based animations & JS based animations
* [Angular-drag-and-drop-lists] - Angular directives that allow you to build sortable lists with the native HTML5 drag & drop API
* [Angular-utils-pagination] - Pagination Directive, easy plug and play to add pagination to your project 
* [Angular-chart] - Reactive, responsive, beautiful charts for AngularJS based on Chart.js
* [Apache] - webserver
* [Node.js] - Server side javascript
* [Express] - 
* [jQuery] - javascript library
* [MySQL] - relational database
* [zippopotam.us] - Get city & state using zip code
* [jwt] - JSON web tokens
* [morgan] -
* [Q] - A library from promises
* [BCrypt] - Encryption
* [FontAwesome] - icons that are svg format used as fonts
* [Fontastic] - Created custom fontastic font

### Installation
  - Requires MySql installation.  
  - NodesJs Configuration parameters are stored in "config.js" located in the routes folder.  Sample contents.

    var Config = {};
    Config.mysql = {};
    Config.mysql.pool = {};
    Config.mysql.pool.connectionLimit = 100;
    Config.mysql.pool.debug = false;
    Config.mysql.host = <your MySql host name>
    Config.mysql.database = <database name>;
    Config.mysql.username = <your username>;
    Config.mysql.password = <your password>;
    Config.secret = <secret string for Json Web Tokens>
    //configuration for you mail server .. below is example only
    Config.smtpConfig =  {
      host: 'smtp.comcast.net',
      port: 587,  
      secure: false, // use SSL
      auth: {
          user: 'xxxxxxxx',
          pass: 'ppppppppppp'
      }
  };

  module.exports = Config;
 
- There are also client side parameters needed.  Create a file called "front-config.js" in the "/assets/js" directory.  Here is a sample configuration;

    //Point ajax calls to the proper nodejs instance
    var Config = {
       //ticketFixMeApi: 'http://ticketfixme.com:4000'
      ticketFixMeApi: 'http://localhost:4000'
      }

- cd to the "back-end" directory
    * run npm install
    * Note: uses port 4000

### Demo

http://www.ticketfix.com

### Todos


### License

MIT


**Free Software, Well Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [PHP]: <http://www.php.net/>
   [MySQL]: <http://mysql.com>
   [Apache]: <http://apache.org>
   [Bootstrap]: <http://twitter.github.com/bootstrap/>
   [AngularJS]: <http://angularjs.org>
   [jQuery]: <http://jquery.com>
   [Angular-UI-Router]: <https://angular-ui.github.io/ui-router/>
   [Angular-UI-Bootstrap]: <https://angular-ui.github.io/bootstrap/>
   [Angular-local-storage]:<https://github.com/grevory/angular-local-storage>
   [Angular-Messages]: <https://docs.angularjs.org/api/ngMessages>
   [Angular-Aria]:https://docs.angularjs.org/guide/accessibility
   [Angular-Sanitize]: <https://docs.angularjs.org/api/ngSanitize>
   [Angular-Animate]: <https://docs.angularjs.org/api/ngAnimate>
   [Angular-drag-and-drop-lists]: <https://github.com/marceljuenemann/angular-drag-and-drop-lists>
   [Angular-utils-pagination]: <https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination>
   [Angular-chart]: <http://jtblin.github.io/angular-chart.js/>
   [Passport]: <http://passportjs.org/>
   [BCrypt]: <https://github.com/ncb000gt/node.bcrypt.js/>
   [zippopotam.us]: <http://www.zippopotam.us/>
   [FontAwesome]: <http://fontawesome.io/>
   [Fontastic]: <http://fontastic.me/>
