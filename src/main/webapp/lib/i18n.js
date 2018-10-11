(function(window, undefined) {
    var i18n = {
        /* The loaded JSON message store will be set on this object */
        msgStore: {},
        persistMsgStore: function(data) {
            this.msgStore = data;
/*
            if(window.localStorage) {
                localStorage.setItem("msgStore", JSON.stringify(data));
                this.msgStore = data;
            } else {
                this.msgStore = data;
            }
*/
        },
        setLanguage: function(lang) {
            $.ajax({
                url: this.contextPath + "/locale/" + lang.toLowerCase() + ".json",
                dataType: "json",
                cache: false,
				async: false,
                success: function(data) {
                    i18n.persistMsgStore(data);
                },
                error: function(error) {
                    $.getJSON(this.contextPath + "/locale/en.json", function(data) {
                        i18n.persistMsgStore(data);
                    });
                }
            });
        },
        getMessage: function(key) {
            return this.msgStore[key];
        },
        initMsgStore: function(options) {
            var lang = "en";
            this.contextPath = (options.contextPath)?options.contextPath:"";            
			if(options.language) {
				lang = options.language;
				i18n.setLanguage(lang);
			} else {
				$.ajax({
					url: options.dataUrl,
					cache: false,
					async: false,
					success: function(data) {                    
						lang = options.supportLocale ? data : data.substring(0, 2);
						i18n.setLanguage(lang);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						lang = options.supportLocale ? lang : lang.substring(0, 2);
						i18n.setLanguage(lang);
					}
				});
			}
        },
        userSelected: function(lang) {
            this.setLanguage(lang);
        },
        init: function(options) {
            this.initMsgStore(options);
/*
            var localMsgStore = "";

            if(!!window.localStorage) {

                localMsgStore = localStorage.getItem("msgStore");
                
                if(localMsgStore !== null) {
                    this.msgStore = JSON.parse(localMsgStore);
                } else {
                    this.initMsgStore(options);
                }
            } else {
                this.initMsgStore(options);
            }
*/
        }
    };

    /* Expose i18n to the global object */
    window.i18n = i18n;

})(window);
