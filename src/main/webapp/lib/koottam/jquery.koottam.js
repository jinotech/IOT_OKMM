/* jQuery Plugin Name: Koottam
 * Author Name: Joby Joseph
 * Author Website: www.jobyj.in
 * Copyright 2012, Joby Joseph
 */
(function($) {
    $.fn.koottam = function(options) {
        var element=$(this);
        var settings = $.extend( {
            'id':'jobysblog',
            'service'   : 'facebook',//facebook,twitter,etc
            'method'  : 'custom',//api,custom
            'count' : 0,
            'style'  : 'image_count',//image_count,logo_count,image_logo_count,image_id_count
            'theme' : 'default',
            'count_style' : 'static',
            'size' : 'default',
            'cell_color_style' : '100',
            'icon_url' : '',
            'count_visible' : true
        }, options);
        
        //1. designing basic layout
        element.css({
            'text-decoration':'none',
            'position':'relative'
        });
        element.html('<span class="social-button-style"></span>');
        //setting cell colors
        var cell_color_array=settings.cell_color_style.split('');
        //adding cells
        var cell_count=2;
        if(settings.style!='image_count'&&settings.style!='logo_count')
            cell_count=3;
        if(!settings.count_visible) cell_count--;
        for(var i=1;i<=cell_count;i++)
        {
            if(cell_color_array[i-1]==0)
                element.find('.social-button-style').append('<span class="button cell'+i+'"></span>');
            else
                element.find('.social-button-style').append('<span class="button '+settings.theme+' cell'+i+'"></span>');
        }
        //setting the size
        if(settings.size=='large')
            element.find('.button').addClass('large');
        //setting class for image cell
        //if(settings.style=='image_count')
        if(settings.style.indexOf('image') != -1)
            element.find('.button:first').addClass('img');
        element.find('.button:last').html('0');
        //2. Filling data
        var api_url='';
        var response='';
        var end=0;
        var step=0;
        if(settings.service=='facebook')
        {
            if(settings.style=='image_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
            }
            else if(settings.style=='logo_count')
            {
                element.find('.button:first').html('Facebook');
            }
            else if(settings.style=='image_logo_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
                element.find('.button:nth-child(2)').html('Facebook');
            }
            else if(settings.style=='image_id_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
                element.find('.button:nth-child(2)').html('@'+settings.id);
            }
            if(settings.method=='api')
            {
                api_url='https://graph.facebook.com/'+settings.id;
                $.ajax({
                    url: api_url,
                    dataType: "jsonp",
                    success:function(response){
                        if(settings.count_style=='static')
                            showCount(element,response.likes);
                        else
                        {
                            end=parseInt(response.likes,10);
                            step=Math.round(end/50);
                            countAnimate(element,0,step,end);
                        }
                    }
                });
            }
            else if(settings.method=='custom')
            {
                if(settings.count_style=='static')
                    showCount(element,settings.count);
                else
                {
                    end=parseInt(settings.count,10);
                    step=Math.round(end/50);
                    countAnimate(element,0,step,end);
                }
            }
        }
        else if(settings.service=='twitter')
        {
            if(settings.style=='image_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
            }
            else if(settings.style=='logo_count')
            {
                element.find('.button:first').html('Twitter');
            }
            else if(settings.style=='image_logo_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
                element.find('.button:nth-child(2)').html('Twitter');
            }
            else if(settings.style=='image_id_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
                element.find('.button:nth-child(2)').html('@'+settings.id);
            }
            if(settings.method=='api')
            {
                api_url='https://api.twitter.com/1/users/lookup.json?screen_name='+settings.id;
                $.ajax({
                    url: api_url,
                    dataType: "jsonp",
                    success:function(response){
                        if(settings.count_style=='static')
                            showCount(element,response[0].followers_count);
                        else
                        {
                            var end=parseInt(response[0].followers_count,10);
                            var step=Math.round(end/50);
                            countAnimate(element,0,step,end);
                        }
                    }
                });
            }
            else if(settings.method=='custom')
            {
                if(settings.count_style=='static')
                    showCount(element,settings.count);
                else
                {
                    end=parseInt(settings.count,10);
                    step=Math.round(end/50);
                    countAnimate(element,0,step,end);
                }
            }
        }
        else
        {
            if(settings.style=='image_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
            }
            else if(settings.style=='logo_count')
            {
                element.find('.button:first').html(settings.service);
            }
            else if(settings.style=='image_logo_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
                element.find('.button:nth-child(2)').html(settings.service);
            }
            else if(settings.style=='image_id_count')
            {
                element.find('.button:first').html('<img src="'+settings.icon_url+'"/>');
                element.find('.button:nth-child(2)').html(settings.id);
            }
            if(settings.method=='api')
            {
                alert('API method is not available for this service');

            }
            else if(settings.method=='custom')
            {
                if(settings.count_style=='static'){
                    showCount(element,settings.count);
                }
                else
                {
                    end=parseInt(settings.count,10);
                    step=Math.round(end/50);
                    countAnimate(element,0,step,end);
                }
            }
        }
    }
    //private functions
    //function to show count
    var showCount=function(element,count)
    {
        var display_count='';
        count=parseInt(count,10);
        if(count>1000000)
        {
            count=count/1000000;
            count=count.toFixed(1);
            display_count=count+' M';
        }
        else if(count>1000)
        {
            count=count/1000;
            count=count.toFixed(1);
            display_count=count+' K';
        }
        else
        {
            display_count=count;
        }
        element.find('.button:last').html(display_count);
    }
    var countAnimate=function(element,start,step,end)
    {
        var count=0;
        if(start+step>=end){
            count=end;
            showCount(element,count);
        }
        else
        {
            count=start+step;
            showCount(element,count);
            setTimeout(function(){
                countAnimate(element,start+step,step,end)
            },100);
        }
    }
})(jQuery);
