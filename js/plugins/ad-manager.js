var AdManager = {
    getAdsPanel: function getAdsPanel(_this) {
        var adPanelHtml = React.createElement(
            "div",
            { className: "top-advert", style: { display: _this.state.advertDisplay } },
            React.createElement("script", { async: true, src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" }),
            React.createElement("ins", { className: "adsbygoogle",
                style: { display: "block" },
                "data-ad-client": "ca-pub-1544479934967926",
                "data-ad-slot": "8358995967",
                "data-ad-format": "auto",
                "data-full-width-responsive": "true" }),
            React.createElement(
                "script",
                null,
                "(adsbygoogle = window.adsbygoogle || []).push(",
                ");"
            )
        );
        //console.log(adPanelHtml);
        return adPanelHtml;
    },
    canShowAdvert: function canShowAdvert(_this) {
        var advertIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var userPlan = _this.state.userPlan;

        if (advertIndex >= userPlan) {
            // this users will have adverts shown
            _this.setState({ advertDisplay: 'block' });
        } else {
            _this.setState({ advertDisplay: 'none' });
        }
    }
};