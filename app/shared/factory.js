//factory for managing local storage
var userProfilePrefs = function(data) {
    data = data || {};
    this.email = data.email;
    this.nameFirst = data.nameFirst;
    this.nameLast = data.nameLast;
    this.password = data.password;
    this.city = data.city;
    this.state = data.state;
    this.zip = data.zip;
    this.favFood = data.favFood || []; //array of strings ['s1', 's2']
    this.inventory = data.inventory || []; //array of objects [type inventoryItem]
};

ticketFixApp.factory('localStore', function($window) {
    return {
        set: function(key, value) {
            //use the email address as key
            $window.localStorage.setItem(key, JSON.stringify(value));
            return this;
        },
        get: function(key) {
            return JSON.parse($window.localStorage.getItem(key));
        },
    };
});

ticketFixApp.factory('zipLookup', function($http) {
    return {
        get: function(zip, successFunc, errorFunc) {
            var zipApiUrl = encodeURI("http://api.zippopotam.us/us/" + zip);
            $http.get(zipApiUrl).then(
                function(resp) {
                    console.log(resp);
                    var city = resp.data.places[0]["place name"];
                    var state = resp.data.places[0].state;
                    successFunc({
                        city: city,
                        state: state
                    });
                },
                function(err) {
                    errorFunc(err);
                });
        }
    };
});

//baseUrl + <api_key>/distance.json/<zip_code1>/<zip_code2>/mile
ticketFixApp.factory('zip', function($http) {
    zip = {};

    zip.getDistance = function(zip1, zip2) {
        var zipApiUrl = encodeURI(Config.zipApiBaseUrl + Config.zipApiKey + '/distance.json/' + zip1 + '/' + zip2 + '/mile');
        return $http.get(zipApiUrl);
    };

    return zip;
});

function upFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

ticketFixApp.service('anchorSmoothScroll', function() {

    this.scrollTo = function(eID) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for (var i = startY; i < stopY; i += step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        }
        for (var i = startY; i > stopY; i -= step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            }
            return y;
        }

    };

})
