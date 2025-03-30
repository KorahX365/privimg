document.getElementById("create-post-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", document.getElementById("text").value);
    formData.append("file", document.getElementById("file").files[0]);

    fetch("/create", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(`Post creado. Link: ${data.link}`);
        document.getElementById("post-link").value = data.link;
    })
    .catch(error => console.error('Error al crear el post:', error));
});

document.getElementById("view-post").addEventListener("click", function () {
    const link = document.getElementById("post-link").value;
    const postId = link.split("/").pop();

    fetch(`/post/${postId}`)
        .then(response => response.json())
        .then(data => {
            const postContent = document.getElementById("post-content");
            postContent.innerHTML = data.text || '';
            if (data.image) {
                postContent.innerHTML += `<img src="${data.image}" alt="Imagen del post">`;
            }
            document.getElementById("post-view").style.display = "block";
        })
        .catch(error => alert("No se puede ver este post o ya fue visto"));
});
