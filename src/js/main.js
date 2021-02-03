
(() => {

    const axios = require('axios').default

    const indicesUrl = "{{ site.baseUrl }}{{ site.path.indices }}"
    const pagesUrl = "{{ site.baseUrl }}{{ site.path.pages }}"
    const pageExtension = "{{ site.extension.page }}"
    
    const url = new URL(location.href)
    
    window.addEventListener('load', () => {
        if(url.pathname == '/search.html') displaySearchResult()
        else {
            axios.get(location.href).catch(() => redirectToSourceSite())
        }
    })
    
    const redirectToSourceSite = () => {
        const baseUrl = '{{ site.source.url }}{{ site.path.pages }}/'
        const url = new URL(location.href)
        const pathName = url.pathname.split('/')
        const pageName = pathName[pathName.length - 1]
        if(pageName.endsWith('.html')) pageName = pageName.substring(0, pageName.length - 5)
        location.href = baseUrl + pageName
    }
    
    const displaySearchResult = async () => {
        const gotoResult = document.querySelector('#goto-result')
        const searchResult = document.querySelector('#search-result')
        const searchString = decodeURIComponent(url.searchParams.get('search') || '')
        try {
            const pageUrl = getPageUrl(searchString)
            const {data} = await axios.get(pageUrl)
            if(data) gotoResult.innerHTML = '<h2>文書名 一致: <a href="' + pageUrl + '">' + searchString + '</a><h2>'
        } catch(e) {
        }
        const data = await search(searchString)
        if(!data) {
            if(gotoResult.innerHTML != '') gotoResult.innerHTML = '結果가 없습니다.'
            return
        }
        const word = data.word
        for(entry of data.pages) {
            const title = entry.title
            const url = getPageUrl(title)
            const surrounding = entry.surrounding

            const index = surrounding.indexOf(word)
            surrounding =
                    surrounding.substring(0, index)
                    + '<span class="bold">'
                    + word
                    + '</span>'
                    + surrounding.substring(index + word.length)
            
            const div = document.createElement('div')
            div.classList.add('result-entry')
            div.innerHTML =
                    '<h3 class="title">'
                    + '<a href="' + url + '">'
                    + title + '</a></h3>'
                    + '<p class="surrounding">'
                    + surrounding + '</p>'
            searchResult.appendChild(div)
        }
    }
    
    const search = async (searchString) => {
        return (await axios.get(indicesUrl + '/' + searchString + '.json')).data
    }
    
    const getPageUrl = (title) => pagesUrl + '/' + title.replace(/ /g, '_') + pageExtension    

})()