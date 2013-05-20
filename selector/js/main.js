;(function($){

    var theme_list_open = false;

    $(document).ready(function () {

        function fixHeight () {

            var headerHeight = $("#switcher").height();

            $("#iframe").attr("height", (($(window).height() - 10) - headerHeight) + 'px');

        }

        $(window).resize(function () {

            fixHeight();

        }).resize();

        $(".parent-menu-item").hover( function () {

            var dropdown = $(this).find(".sub-menu");

            if (theme_list_open == true) {

                dropdown.hide();
                theme_list_open = false;

            } else {

                dropdown.show();
                theme_list_open = true;

            }

            return false;

        });

        $("#theme_list ul li a").click(function () {

            var theme_data = $(this).attr("rel").split(",");
            window.location.search = $(this).attr("href");
            $("li.purchase a").attr("href", theme_data[1]);
            $("li.remove_frame a").attr("href", theme_data[0]);
            $("#iframe").attr("src", theme_data[0]);
            $("#theme_list a#theme_select").text($(this).text());
            $(".center ul li ul").hide();
            theme_list_open = false;

            return false;
        });

        /*
         * Theme Options
         */

        var theme_values= [],
            current_theme = getUrlVars()["theme"],
            sessionValues = JSON.parse( sessionStorage.getItem("wpgrade_"+current_theme+"_options") ),
            theme_options = $('#theme_options');

        // Create an array with all values so latter we can toggle through them
        theme_options.find(".theme_option").each(function(i,e){

            var thisName = $(this).data("name");

            theme_values[thisName] = [];
            theme_values[thisName].name = thisName;

            var values = [];
            $(this).find("li.li-item").each(function(j,e){
                values[j] = $(this).data("value");
            });

            theme_values[thisName].values = values;
        });

        theme_options.find('.theme_option').on('click', "li.li-item", function(){

            var iframe_html = $("#iframe").contents().find("html"),
                newclass = $(this).data("value"),
                option = $(this).parents("li.theme_option").data("name");

            if ( sessionValues == undefined ) {
                // fix when the session is empty
                sessionValues = {};
            }

            // remove all the values for this option
            $.each(theme_values[option].values, function(i,e){
                iframe_html.removeClass( e );
            });

            iframe_html.addClass( newclass );
            // set this up in session storage
            sessionValues[option] = newclass;

            JSONsessionValues = JSON.stringify(sessionValues);

            sessionStorage.setItem("wpgrade_"+current_theme+"_options", JSONsessionValues);
        });

        $('iframe#iframe').load(function() {
            var iframe_html = $("#iframe").contents().find("html"),
                values = JSON.parse(sessionStorage.getItem("wpgrade_"+current_theme+"_options"));

            if ( values ) {
                $.each(values, function(i,e){
                    // remove all the values for this option
                    $.each(theme_values[i].values, function(ii,ee){
                        iframe_html.removeClass( ee );
                    });
                    iframe_html.addClass( e );
                });
            }
        });
    });

})(jQuery);

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}