
(() => {

    const axios = require('axios').default

    var indicesUrl = "{{ site.baseUrl }}{{ site.path.indices }}"
    var pagesUrl = "{{ site.baseUrl }}{{ site.path.pages }}"
    var pageExtension = "{{ site.extension.page }}"
    
    const url = new URL(location.href)
    
    window.addEventListener('load', () => {
        if(url.pathname == '/search.html') displaySearchResult()
        else {
            axios.get(location.href).catch(() => redirectToSourceSite())
        }
    })
    
    const redirectToSourceSite = () => {
        var baseUrl = '{{ site.source.url }}{{ site.path.pages }}/'
        var url = new URL(location.href)
        var pathName = url.pathname.split('/')
        var pageName = pathName[pathName.length - 1]
        if(pageName.endsWith('.html')) pageName = pageName.substring(0, pageName.length - 5)
        location.href = baseUrl + pageName
    }
    
    const displaySearchResult = () => {
        var gotoResult = document.querySelector('#goto-result')
        var searchResult = document.querySelector('#search-result')
        var searchString = decodeURIComponent(url.searchParams.get('search') || '')
        axios.get(pageUrl(searchString)).then(() => {
            gotoResult.innerHTML = '<h2>文書名 一致: <a href="' + url + '">' + searchString + '</a><h2>'
        })
        search(searchString, function(data) {
            var word = data.word
            for(entry of data.pages) {
                var title = entry.title
                var url = pageUrl(title)
                var surrounding = entry.surrounding
    
                var index = surrounding.indexOf(word)
                surrounding =
                        surrounding.substring(0, index)
                        + '<span class="bold">'
                        + word
                        + '</span>'
                        + surrounding.substring(index + word.length)
                
                var div = document.createElement('div')
                div.classList.add('result-entry')
                div.innerHTML =
                        '<h3 class="title">'
                        + '<a href="' + url + '">'
                        + title + '</a></h3>'
                        + '<p class="surrounding">'
                        + surrounding + '</p>'
                searchResult.appendChild(div)
            }
        })
    }
    
    const search = async (searchString) => {
        return JSON.parse(await axios.get(indicesUrl + '/' + searchString + '.json').data)
    }
    
    const pageUrl = (title) => pagesUrl + '/' + title.replace(/ /g, '_') + pageExtension    

})()