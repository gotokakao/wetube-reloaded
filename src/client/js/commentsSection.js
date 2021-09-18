const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtnList = document.querySelectorAll(".deleteCommentBtn");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul")
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = " ❌";
    span2.className = "deleteCommentBtn";
    span2.style.cursor = "pointer";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    
    span2.addEventListener("click", async() => {
        const response = await fetch(`/api/video/${id}/delete-comment`,{
            method : "DELETE",
        });
    
        if(response.status === 201){
            newComment.remove();
        }
    });

    

}



const handleSubmit = async (event) => {
    event.preventDefault();
    const textArea = form.querySelector("textarea");
    const text = textArea.value;
    const videoId = videoContainer.dataset.id;
    if(text === ""){
        return;
    }
    const response= await fetch(`/api/video/${videoId}/comment`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({text}),
    })
    
    textArea.value = "";
    if(response.status === 201){
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
    }
}

const handleDeleteComment = async (event) => {
    const li = event.target.parentElement;
    const {id} = event.target.parentElement.dataset;

    const response = await fetch(`/api/video/${id}/delete-comment`,{
        method : "DELETE",
    });

    if(response.status === 201){
        li.remove();
    }
}

if(form){
    form.addEventListener("submit", handleSubmit);
}

if(deleteBtnList){
    for(let i = 0; i < deleteBtnList.length; i++){
        deleteBtnList[i].addEventListener("click", handleDeleteComment);
    }
}

