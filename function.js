document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("drop-zone");
    const preview = document.getElementById("preview");

    // 阻止瀏覽器的默認行為（打開文件）
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, e => e.preventDefault());
        document.body.addEventListener(eventName, e => e.preventDefault());
    });

    // 在拖放區添加 "dragover" 樣式
    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add("dragover"));
    });

    // 移除 "dragover" 樣式
    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove("dragover"));
    });

    // 當文件被拖放時觸發
    dropZone.addEventListener("drop", e => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // 處理文件上傳
    function handleFiles(files) {
        [...files].forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    const img = document.createElement("img");
                    img.src = reader.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
				//uploadFile(file);
            } else {
                alert("Only image files are allowed!");
            }
        });
    }
});

function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => console.log("Upload successful:", data))
    .catch(error => console.error("Upload error:", error));
}
