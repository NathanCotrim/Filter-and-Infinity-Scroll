// DOM EL(s)
const postsContainer = document.querySelector('#posts-container')
const loader = document.querySelector('.loader')
const filterInput = document.querySelector('#filter')
const errorMessage = document.querySelector('.error')
const postsContainerChilds = document.querySelector("#posts-container")

// Global Vars
let page = 1
let visiblePosts = []

// Getting API Data
const getPosts = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`)

    return await response.json()
}

// Function to add posts (API Data) into DOM
const addPostsIntoDOM = async () => {
    const posts = await getPosts()
    const postsTemplate = posts.map(({ id, title, body }) => `
    <div class="post">
        <div class="number">${id}</div>
        <div class="post-info">
            <h2 class="post-title">${title}</h2>
            <p class="post-body">${body}</p>
        </div>
    </div>
    `).join('')

    postsContainer.innerHTML += postsTemplate
}

// Get more posts from API
const getNextPosts = () => {
    setTimeout(() => {
        page++
        addPostsIntoDOM()
    }, 300);
}

// Control Loader
const removeLoader = () => {
    setTimeout(() => {
        console.log("oi");
        loader.classList.remove('show')
        getNextPosts()
    }, 1000)
}

const showLoader = () => {
    loader.classList.add('show')
    removeLoader()
}

// Event Listener Scroll
const handleScrollToPageBottom = () => {
    if (postsContainerChilds.children.length < 100) {
        const { clientHeight, scrollHeight, scrollTop } = document.documentElement

        const isPageBottomAlmostReached = scrollTop + clientHeight >= scrollHeight - 1 

        if (isPageBottomAlmostReached){
            showLoader()
        }
    }
}
window.addEventListener('scroll', handleScrollToPageBottom)

// Event Listener Input
const showPostIfMatchInputValue = value => post => {
    const postTitle = post.querySelector('.post-title').textContent.toLowerCase()
    const postBody = post.querySelector('.post-body').textContent.toLowerCase()

    const postContainsInputValue = postTitle.includes(value) || postBody.includes(value)

    if(postContainsInputValue) {
        post.style.display = 'flex'
        visiblePosts.push(post)
        return 
    }

    post.style.display = 'none'
}
const handleInputValue = e => {
    visiblePosts = []

    const inputValue = e.target.value.toLowerCase()
    const posts = document.querySelectorAll('.post')

    posts.forEach(showPostIfMatchInputValue(inputValue))

    if (visiblePosts.length == 0) {
        errorMessage.classList.add('show')
    } else {
        errorMessage.classList.remove('show')
    }
}
filterInput.addEventListener('input', handleInputValue)

// Init App
addPostsIntoDOM()




