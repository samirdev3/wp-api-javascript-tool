const   queryString = window.location.search,
        urlParams = new URLSearchParams(queryString),
        getPostID = urlParams.get('id'),
        getSite = urlParams.get('site'),
        webURL = getSite+"/wp-json/wp/v2/posts/"+getPostID+"/";

        
runWebApiFetchScript(webURL, 'article');

/** WP Rest API Fetch **/
function runWebApiFetchScript(fullURL, searchType){
    fetch(fullURL)
    .then((response) => response.json())
    .then(function (output) {

        if(searchType === 'article'){
            document.querySelector('.post_id span').innerHTML = output.id;
            const newURL = getSite+"/wp-json/wp/v2/media/"+output.featured_media+"/";
            runWebApiFetchScript(newURL, 'media');
            const fullArticle = '<article><h1 id="title">'+output.title.rendered+'</h1><div id="featured_image"></div>'+output.content.rendered+'</article>';
            return [document.querySelector('#output_wrapper').innerHTML = fullArticle,triggerAfterContent()];
            
        }

        if(searchType === 'media'){
            return document.getElementById('featured_image').innerHTML = "<img src="+output.guid.rendered+" />";
        }

    })
    .catch(function (error) {
        notificationPop('Error during fetch: ' + error.message);
    });
}

/** After Content Load **/
function triggerAfterContent(){
    document.querySelector('.img_count span').innerHTML = document.querySelectorAll('img').length;
}

/** Notification Popup **/
function notificationPop(txt){
    popup.innerHTML = txt;
    popup.classList.add('active');
    setTimeout(function(){
        popup.innerHTML = '';
        popup.classList.remove('active');
        window.location.reload();
    },2500);
}