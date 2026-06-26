const postInput = document.getElementById("postInput");
const postBtn = document.getElementById("postBtn");
const feed = document.getElementById("feed");
const counter = document.getElementById("counter");

const usernameInput = document.getElementById("usernameInput");
const saveUserBtn = document.getElementById("saveUserBtn");

// Load username
let username = localStorage.getItem("username") || "";

if (username) {
    usernameInput.value = username;
}

// Load posts
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Save username
saveUserBtn.addEventListener("click", () => {

    const enteredName = usernameInput.value.trim();

    if (enteredName === "") {
        alert("Please enter a username");
        return;
    }

    username = enteredName;

    localStorage.setItem("username", username);

    alert("Username saved successfully!");
});

// Character counter
postInput.addEventListener("input", () => {

    counter.textContent =
        `${postInput.value.length} / 200`;

});

// Post button
postBtn.addEventListener("click", createPost);

function createPost() {

    if (!username) {
        alert("Please save a username first!");
        return;
    }

    const text = postInput.value.trim();

    if (text === "") {
        alert("Please write something before posting!");
        return;
    }

    const post = {
        id: Date.now(),
        username: username,
        content: text,
        likes: 0,
        time: new Date().toLocaleString()
    };

    posts.unshift(post);

    savePosts();

    postInput.value = "";

    counter.textContent = "0 / 200";

    displayPosts();
}

function displayPosts() {

    feed.innerHTML = "";

    if (posts.length === 0) {

        feed.innerHTML = `
            <div class="post-card">
                <p>No posts yet. Create your first post!</p>
            </div>
        `;

        return;
    }

    posts.forEach(post => {

        const card = document.createElement("div");

        card.classList.add("post-card");

        card.innerHTML = `

            <div class="post-header">

                <div class="avatar">
                    ${post.username.charAt(0).toUpperCase()}
                </div>

                <div>

                    <div class="username">
                        ${post.username}
                    </div>

                    <div class="time">
                        ${post.time}
                    </div>

                </div>

            </div>

            <div class="post-content">
                ${post.content}
            </div>

            <div class="post-actions">

                <button
                    class="like-btn"
                    onclick="likePost(${post.id})">

                    ❤️ ${post.likes}

                </button>

                <button
                    class="delete-btn"
                    onclick="deletePost(${post.id})">

                    🗑 Delete

                </button>

            </div>
        `;

        feed.appendChild(card);

    });
}

function likePost(id) {

    posts = posts.map(post => {

        if (post.id === id) {
            post.likes++;
        }

        return post;

    });

    savePosts();

    displayPosts();
}

function deletePost(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this post?");

    if (!confirmDelete) {
        return;
    }

    posts = posts.filter(post => post.id !== id);

    savePosts();

    displayPosts();
}

function savePosts() {

    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );

}

// Load posts when page opens
displayPosts();