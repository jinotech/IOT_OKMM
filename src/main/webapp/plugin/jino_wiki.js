/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

function WIKI_TEST(){
    var my_bot = new Luasog("http://wiki.modulestudy.com/api.php");
    //console.log(my_bot);
    
    var callback = function(success, result){
        if (!success) {
            //console.log(result.info);
        }
        else {
            //console.log(result.content);
        }
        
        //stop();
    };
    
    my_bot.get({
        page: "대문"
    }, callback);


}

