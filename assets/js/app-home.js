let     webURL = setCatName = '';
const   getWebsite = document.querySelector('#website'),
        getType = document.querySelector('#select_type'),
        getWebCat = document.querySelector('#web_cat'),
        getTotalList = document.querySelector('#total_list'),
        btnByCat = document.querySelector('#by_cat'),
        getPostID = document.querySelector('#post_id'),
        btnById = document.querySelector('#by_id'),
        popup = document.querySelector('#popup');

/** Step 1 **/
getType.addEventListener('change',function(){
    if(getWebsite.value === ''){
        getType.value = 0;
        notificationPop('Invalid Website URL');
        return;
    }else{
        if(getType.value === 'cat'){
            searchByCategories(getWebsite.value);
            getWebCat.classList.remove('hidden');
            btnByCat.classList.remove('hidden');
            getTotalList.classList.remove('hidden');
            getPostID.classList.add('hidden');
            btnById.classList.add('hidden');
        }
        if(getType.value === 'ids'){
            getPostID.classList.remove('hidden');
            btnById.classList.remove('hidden');
            getWebCat.classList.add('hidden');
            getTotalList.classList.add('hidden');
            btnByCat.classList.add('hidden');
        }
    }
});
/** Category button **/
btnByCat.addEventListener('click',function(){
    (getTotalList.value != '') ? getTotalList.value : getTotalList.value = 25;
    webURL = `${getWebsite.value}/wp-json/wp/v2/posts?per_page=${getTotalList.value}&categories=${getWebCat.value}`;
    runWebApiFetchScript(webURL, 'lists');
    setCatName = getWebCat.options[getWebCat.selectedIndex].text;
    if(setCatName != ''){
        const head = document.getElementById('category_title');
        head.innerHTML = setCatName;
        head.classList.remove('hidden');
    }
});
/** Post ID button **/
btnById.addEventListener('click',function(){
    newWindowPopup(`article.html?site=${getWebsite.value}&id=${getPostID.value}`);
});

/** by category function **/
function searchByCategories(url){
    const generateURL = `${url}/wp-json/wp/v2/categories?per_page=50`;
    runWebApiFetchScript(generateURL, 'category');
}

/** WP Rest API Fetch **/
function runWebApiFetchScript(fullURL, searchType){
    fetch(fullURL)
    .then((response) => response.json())
    .then(function (output) {
        
        document.querySelector('#output_wrapper').innerHTML = "";

        if(searchType === 'category'){
            document.querySelector('#web_cat').innerHTML = "";
            return output.map(function(result){
                document.querySelector('#web_cat').innerHTML += `<option value="${result.id}">${result.name}</option>`;
            });
        }
        
        if(searchType === 'lists'){
            return output.map(function(result){
                const wrapper = document.querySelector('#output_wrapper');
                wrapper.innerHTML += `<div class="article_list"><a href="article.html?site=${getWebsite.value}&id=${result.id}" target="_blank">${result.title.rendered}</a></div>`;
                articleLinkPop();
            });
        }


    })
    .catch(function (error) {
        notificationPop(`Error during fetch: ${error.message}`);
    });
}

/** Article list link **/
function articleLinkPop(){
const getArticleList = document.querySelectorAll('.article_list a');
for(let $i=0;$i<getArticleList.length;$i++){
    getArticleList[$i].onclick=function(event){
        event.preventDefault();
        newWindowPopup(getArticleList[$i].getAttribute('href'));
    };
}
}

/** Window Open **/
function newWindowPopup(getPopURL){
    const   winW = screen.width,
            winH = screen.height;
    window.open(getPopURL, '_blank',`toolbar=yes,scrollbars=yes,resizable=yes,top=${winH},left=${winW/2 - 310},width=620,height=${winH}`);
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