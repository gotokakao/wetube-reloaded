const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
    event.preventDefault();
    const textArea = form.querySelector("textarea");
    const text = textArea.value;
    const videoId = videoContainer.dataset.id;
    if(text === ""){
        return;
    }
    fetch(`/api/video/${videoId}/comment`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({text}),
    })
}

if(form){
    form.addEventListener("submit", handleSubmit);
}

