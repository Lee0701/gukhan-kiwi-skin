
(() => {

    const axios = require('axios').default

    const indicesUrl = "{{ site.baseUrl }}{{ site.path.indices }}"
    const pagesUrl = "{{ site.baseUrl }}{{ site.path.pages }}"
    const pageExtension = "{{ site.extension.page }}"
    
    const url = new URL(location.href)
    
    window.addEventListener('load', () => {
        if(url.pathname == '/search.html') {
            displaySearchResult()
        } else {
            axios.get(location.href).catch(() => redirectToSourceSite())
        }
        document.querySelector('#search-form').addEventListener('submit', (event) => {
            const searchString = encodeURIComponent(document.querySelector('#search-input').value)
            // console.log('{{ site.baseUrl }}/search.html?search=' + searchString)
            location.href = '{{ site.baseUrl }}/search.html?search=' + searchString
            event.preventDefault()
            return false
        })
    })
    
    const redirectToSourceSite = () => {
        const baseUrl = '{{ site.source.url }}{{ site.path.pages }}/'
        const url = new URL(location.href)
        const pathName = url.pathname.split('/')
        let pageName = pathName[pathName.length - 1]
        if(pageName.endsWith('.html')) pageName = pageName.substring(0, pageName.length - 5)
        location.href = baseUrl + pageName
    }
    
    const displaySearchResult = async () => {
        const searchInput = document.querySelector('#search-input')
        const gotoResult = document.querySelector('#goto-result')
        const searchResult = document.querySelector('#search-result')
        const searchString = decodeURIComponent(url.searchParams.get('search') || '').toLocaleLowerCase()
        searchInput.value = searchString
        try {
            const pageUrl = getPageUrl(searchString)
            const {data} = await axios.get(pageUrl)
            const h2 = document.createElement('h2')
            h2.innerHTML = `文書名 一致: <a href="${pageUrl}">${searchString}</a>`
            if(data) gotoResult.appendChild(h2)
        } catch(e) {
        }
        const searchWords = searchString.split(/\s+/)
        const searches = await Promise.all(searchWords.map(search))
        const data = searches.reduceRight(reduceSearchResultAnd)
        if(!data) {
            const p = document.createElement('p')
            p.innerHTML = '結果가 없습니다.'
            searchResult.appendChild(p)
            return
        }
        const words = (typeof data.word === 'object') ? data.word : [data.word]
        const pages = data.pages.sort((a, b) => b.count - a.count)
        pages.forEach((entry) => {
            const title = entry.title
            const url = getPageUrl(title)

            const surrounding = words.reduce((acc, word) => {
                const boldened = `<span class="bold">${word}</span>`
                return acc.replaceAll(word, boldened)
            }, entry.surrounding)

            const div = document.createElement('div')
            div.classList.add('result-entry')
            const h3 = `<h3 class="title"><a href="${url}">${title}</a></h3>`
            const p = `<p class="surrounding">${surrounding}</p>`
            div.innerHTML = h3 + p
            searchResult.appendChild(div)
        })
    }

    const reduceSearchResultAnd = (acc, {word, pages}) => {
        const words = []
        if(typeof acc.word === 'object') words.push(...acc.word)
        else if(typeof acc.word === 'string') words.push(acc.word)
        if(typeof word === 'object') words.push(...word)
        else if(typeof word === 'string') words.push(word)
        const anotherPages = acc.pages || []
        const newPages = pages
                .map((page) => [page, anotherPages.find((another) => another.title === page.title)])
                .filter(([_page, another]) => another)
                .map(([page, another]) => ({title: page.title, count: (page.count + another.count) / 2, surrounding: page.surrounding + ' ... ' + another.surrounding}))
        return {word: words, pages: newPages}
    }
    
    const search = async (searchString) => {
        try {
            return (await axios.get(indicesUrl + '/' + searchString + '.json')).data
        } catch(e) {
            return null
        }
    }
    
    const getPageUrl = (title) => pagesUrl + '/' + title.replace(/ /g, '_') + pageExtension    

})()