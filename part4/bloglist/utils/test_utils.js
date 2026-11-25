const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    let favoriteBlog = { likes: 0 }

    for (const blog of blogs) {
        if (blog.likes > favoriteBlog.likes) {
            favoriteBlog = blog
        }
    }

    return favoriteBlog
}

const mostBlogs = (blogs) => {
    if (blogs.length === 1) {
        return { author: blogs[0].author, blogs: 1 }
    }

    const authorsWithBlogs = []

    for (const blog of blogs) {
        const authBlogFoundIndex = authorsWithBlogs.findIndex(authBlog => authBlog.author === blog.author)
        if (authBlogFoundIndex !== -1) {
            authorsWithBlogs[authBlogFoundIndex].blogs += 1
            continue
        }

        authorsWithBlogs.push({ author: blog.author, blogs: 1 })
    }

    return authorsWithBlogs.sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = (blogs) => {
    if (blogs.length === 1) {
        return { author: blogs[0].author, likes: blogs[0].likes }
    }

    const authorsWithLikes = []
    for (const blog of blogs) {
        const authLikeFoundIndex = authorsWithLikes.findIndex(authLike => authLike.author === blog.author)
        if (authLikeFoundIndex !== -1 ) {
            authorsWithLikes[authLikeFoundIndex].likes += blog.likes
            continue
        }

        authorsWithLikes.push({ author: blog.author, likes: blog.likes })
    }

    return authorsWithLikes.sort((a, b) => b.likes - a.likes)[0]
}

// I skimmed through lodash's documentations but I didn't really find a reason to use it

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}