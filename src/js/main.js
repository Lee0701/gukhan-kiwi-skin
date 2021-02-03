
var indicesUrl = "{{ site.baseUrl }}{{ site.path.indices }}"
var pagesUrl = "{{ site.baseUrl }}{{ site.path.pages }}"
var pageExtension = "{{ site.extension.page }}"

const url = new URL(location.href)

window.addEventListener('load', () => {
    if(url.pathname == '/search.html') displaySearchResult()
})

const displaySearchResult = () => {
    var gotoResult = document.querySelector('#goto-result');
    var searchResult = document.querySelector('#search-result');
    var searchString = decodeURIComponent(url.searchParams.get('search') || '');
    goto(searchString, function(url) {
        gotoResult.innerHTML = '<h2>文書名 一致: <a href="' + url + '">' + searchString + '</a><h2>';
    })
    search(searchString, function(data) {
        var word = data.word;
        for(entry of data.pages) {
            var title = entry.title
            var url = pageUrl(title);
            var surrounding = entry.surrounding;

            var index = surrounding.indexOf(word);
            surrounding =
                    surrounding.substring(0, index)
                    + '<span class="bold">'
                    + word
                    + '</span>'
                    + surrounding.substring(index + word.length);
            
            var div = document.createElement('div');
            div.classList.add('result-entry')
            div.innerHTML =
                    '<h3 class="title">'
                    + '<a href="' + url + '">'
                    + title + '</a></h3>'
                    + '<p class="surrounding">'
                    + surrounding + '</p>'
            searchResult.appendChild(div);
        }
    });
}

const goto = (searchString, callback) => {
    var url = pageUrl(searchString)
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            callback(url)
        }
    }
    request.open("GET", url)
    request.send(null)
}

const search = (searchString, callback) => {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            var data = JSON.parse(request.responseText)
            callback(data)
        }
    }
    request.open("GET", indicesUrl + '/' + searchString + '.json')
    request.send(null)
}

const pageUrl = (title) => pagesUrl + '/' + title.replace(/ /g, '_') + pageExtension
